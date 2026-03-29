# app.py
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, Form, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
import uuid
import json
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

# --------------------------------
# 1. Logging & Environment
# --------------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("ank-realty-api")

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY", "ank-realty-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))
DEBUG = os.environ.get("DEBUG", "false").lower() in ("1", "true", "yes")

# --------------------------------
# 2. Supabase Initialization
# --------------------------------
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
except Exception as e:
    supabase = None
    logger.exception("Failed to create Supabase client: %s", e)

def check_res_or_raise(res: Any, action: str = "database operation"):
    if res is None:
        raise HTTPException(status_code=500, detail=f"Supabase not configured for {action}")
    err = getattr(res, "error", None)
    if err:
        logger.error("Supabase error during %s: %s", action, err)
        raise HTTPException(status_code=500, detail=str(err) if DEBUG else "Internal server error")
    return res

# --------------------------------
# 3. Security & Authentication
# --------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub") or payload.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    
    res = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    check_res_or_raise(res, "fetching current user")
    user = res.data[0] if res.data else None
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --------------------------------
# 4. Storage Helper
# --------------------------------
async def upload_file_to_supabase(file: UploadFile, folder: str) -> str:
    if not supabase or not file or not file.filename: return ""
    try:
        file_ext = file.filename.split(".")[-1]
        file_name = f"{folder}/{uuid.uuid4()}.{file_ext}"
        contents = await file.read()
        res = supabase.storage.from_("media").upload(file_name, contents)
        if getattr(res, "error", None): return ""
        return supabase.storage.from_("media").get_public_url(file_name)
    except Exception:
        return ""

# --------------------------------
# 5. FastAPI App & CORS
# --------------------------------
app = FastAPI(title="ANK Realty API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter(prefix="/api")

# --------------------------------
# Models for JSON Data
# --------------------------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    role: str = "client"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class YoutubeVideoCreate(BaseModel):
    title: str
    videoUrl: str
    description: Optional[str] = None

class InquiryCreate(BaseModel):
    property_id: str
    message: str

class FavoriteCreate(BaseModel):
    property_id: str

# --------------------------------
# ROUTES: Authentication
# --------------------------------
@api_router.post("/auth/register")
def register(user_data: UserRegister):
    res = supabase.table("users").select("id").eq("email", user_data.email).limit(1).execute()
    if res.data: raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email.lower(),
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "phone": user_data.phone,
        "role": user_data.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("users").insert(user_doc).execute()
    return {"token": create_access_token({"sub": user_id}), "user": user_doc}

@api_router.post("/auth/login")
def login(credentials: UserLogin):
    res = supabase.table("users").select("*").eq("email", credentials.email.lower()).limit(1).execute()
    user = res.data[0] if res.data else None
    
    if not user or not verify_password(credentials.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return {"token": create_access_token({"sub": user["id"]}), "user": user}

@api_router.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --------------------------------
# ROUTES: Dashboard (Admin & Agent)
# --------------------------------
@api_router.get("/dashboard/admin")
def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin": raise HTTPException(status_code=403, detail="Admin only")
    
    total_props = supabase.table("properties").select("id", count="exact").execute()
    pending_props = supabase.table("properties").select("id", count="exact").eq("status", "pending").execute()
    pending_list = supabase.table("properties").select("*").eq("status", "pending").order("created_at", desc=True).limit(50).execute()
    
    return {
        "total_properties": total_props.count or 0,
        "pending_properties": pending_props.count or 0,
        "pending_list": pending_list.data or []
    }

@api_router.get("/dashboard/agent")
def get_agent_dashboard(current_user: dict = Depends(get_current_user)):
    prop_res = supabase.table("properties").select("*").eq("owner_id", current_user["id"]).execute()
    properties = prop_res.data or []
    
    expr = f"from_user_id.eq.{current_user['id']},to_user_id.eq.{current_user['id']}"
    inq_res = supabase.table("inquiries").select("*").or_(expr).execute()
    inquiries = inq_res.data or []
    
    total_views = sum(p.get("views", 0) for p in properties)
    
    return {
        "total_listings": len(properties),
        "total_views": total_views,
        "total_inquiries": len(inquiries),
        "properties": properties,
        "inquiries": inquiries
    }

# --------------------------------
# ROUTES: Properties
# --------------------------------
@api_router.post("/properties")
async def create_property(
    title: str = Form(...),
    description: str = Form(...),
    price: str = Form(default="0"),
    location: str = Form(...),
    city: str = Form(...),
    state: str = Form(default=""),
    property_type: str = Form(...),
    category: str = Form(...),
    area: str = Form(default="0"),
    bhk: str = Form(default="0"),
    bathrooms: str = Form(default="0"),
    furnishing: str = Form(default="unfurnished"),
    amenities: str = Form(default="[]"),
    builder: str = Form(default=""),
    rera: str = Form(default=""),
    projectStatus: str = Form(default="New Launch"),
    possession: str = Form(default=""),
    new_images: List[UploadFile] = File(default=[]),
    new_videos: List[UploadFile] = File(default=[]),
    brochure: Optional[UploadFile] = File(default=None),
    current_user: dict = Depends(get_current_user)
):
    try:
        parsed_price = float(price) if price.strip() else 0.0
        parsed_area = float(area) if area.strip() else 0.0
        parsed_bhk = int(bhk) if bhk.strip() else 0
        parsed_bathrooms = int(bathrooms) if bathrooms.strip() else 0
        
        try:
            parsed_amenities = json.loads(amenities)
        except:
            parsed_amenities = []

        # Process Media Uploads
        image_urls = []
        for img in new_images:
            if img.filename:
                url = await upload_file_to_supabase(img, "properties/images")
                if url: image_urls.append(url)
                
        video_urls = []
        for vid in new_videos:
            if vid.filename:
                url = await upload_file_to_supabase(vid, "properties/videos")
                if url: video_urls.append(url)
                
        brochure_url = None
        if brochure and brochure.filename:
            brochure_url = await upload_file_to_supabase(brochure, "properties/brochures")

        property_doc = {
            "id": str(uuid.uuid4()),
            "owner_id": current_user["id"],
            "owner_name": current_user.get("name"),
            "owner_phone": current_user.get("phone"),
            "title": title,
            "description": description,
            "price": parsed_price,
            "location": location,
            "city": city,
            "state": state,
            "property_type": property_type,
            "category": category,
            "area": parsed_area,
            "bhk": parsed_bhk,
            "bathrooms": parsed_bathrooms,
            "furnishing": furnishing,
            "amenities": parsed_amenities,
            "builder": builder,
            "rera": rera,
            "project_status": projectStatus,
            "possession": possession,
            "images": image_urls,
            "videos": video_urls,
            "brochure": brochure_url,
            "status": "approved" if current_user.get("role") == "admin" else "pending",
            "verified": current_user.get("role") == "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        res = supabase.table("properties").insert(property_doc).execute()
        check_res_or_raise(res, "inserting property")
        return property_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/properties/{property_id}")
async def update_property(
    property_id: str,
    title: str = Form(None),
    description: str = Form(None),
    price: str = Form(None),
    location: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    property_type: str = Form(None),
    category: str = Form(None),
    area: str = Form(None),
    bhk: str = Form(None),
    bathrooms: str = Form(None),
    furnishing: str = Form(None),
    amenities: str = Form(None),
    builder: str = Form(None),
    rera: str = Form(None),
    projectStatus: str = Form(None),
    possession: str = Form(None),
    existing_images: str = Form(default="[]"),
    new_images: List[UploadFile] = File(default=[]),
    new_videos: List[UploadFile] = File(default=[]),
    brochure: Optional[UploadFile] = File(default=None),
    current_user: dict = Depends(get_current_user)
):
    res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    if not res.data: 
        raise HTTPException(status_code=404, detail="Property not found")
    
    existing_prop = res.data[0]
    
    if existing_prop["owner_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this property")
        
    update_data = {}
    if title is not None: update_data["title"] = title
    if description is not None: update_data["description"] = description
    if price is not None: update_data["price"] = float(price) if str(price).strip() else 0.0
    if location is not None: update_data["location"] = location
    if city is not None: update_data["city"] = city
    if state is not None: update_data["state"] = state
    if property_type is not None: update_data["property_type"] = property_type
    if category is not None: update_data["category"] = category
    if area is not None: update_data["area"] = float(area) if str(area).strip() else 0.0
    if bhk is not None: update_data["bhk"] = int(bhk) if str(bhk).strip() else 0
    if bathrooms is not None: update_data["bathrooms"] = int(bathrooms) if str(bathrooms).strip() else 0
    if furnishing is not None: update_data["furnishing"] = furnishing
    if builder is not None: update_data["builder"] = builder
    if rera is not None: update_data["rera"] = rera
    if projectStatus is not None: update_data["project_status"] = projectStatus
    if possession is not None: update_data["possession"] = possession
    
    if amenities is not None:
        try:
            update_data["amenities"] = json.loads(amenities)
        except:
            pass

    # Handle Images
    try:
        image_urls = json.loads(existing_images)
    except:
        image_urls = existing_prop.get("images", [])
        
    for img in new_images:
        if img.filename:
            url = await upload_file_to_supabase(img, "properties/images")
            if url: image_urls.append(url)
    update_data["images"] = image_urls
    
    # Handle Videos (Append to existing if any)
    video_urls = existing_prop.get("videos", [])
    for vid in new_videos:
        if vid.filename:
            url = await upload_file_to_supabase(vid, "properties/videos")
            if url: video_urls.append(url)
    if video_urls:
        update_data["videos"] = video_urls
        
    # Handle PDF Brochure (Override if new one is provided)
    if brochure and brochure.filename:
        brochure_url = await upload_file_to_supabase(brochure, "properties/brochures")
        if brochure_url:
            update_data["brochure"] = brochure_url
    
    updated_res = supabase.table("properties").update(update_data).eq("id", property_id).execute()
    return updated_res.data[0]

@api_router.get("/properties")
def get_properties(category: Optional[str] = None, property_type: Optional[str] = None, limit: int = 100):
    query = supabase.table("properties").select("*").order("created_at", desc=True).limit(limit)
    if category: query = query.eq("category", category)
    if property_type: query = query.eq("property_type", property_type)
    res = query.execute()
    return res.data or []

@api_router.get("/properties/{property_id}")
def get_property(property_id: str):
    res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    if not res.data: raise HTTPException(status_code=404, detail="Property not found")
    
    views = res.data[0].get("views", 0) + 1
    supabase.table("properties").update({"views": views}).eq("id", property_id).execute()
    res.data[0]["views"] = views
    return res.data[0]

@api_router.delete("/properties/{property_id}")
def delete_property(property_id: str, current_user: dict = Depends(get_current_user)):
    res = supabase.table("properties").select("owner_id").eq("id", property_id).execute()
    if not res.data: raise HTTPException(status_code=404)
    if res.data[0]["owner_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    supabase.table("properties").delete().eq("id", property_id).execute()
    return {"message": "Deleted"}

@api_router.put("/admin/properties/{property_id}/status")
def update_property_status(property_id: str, status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin": raise HTTPException(status_code=403)
    supabase.table("properties").update({"status": status, "verified": status == "approved"}).eq("id", property_id).execute()
    return {"message": f"Property {status}"}

# --------------------------------
# ROUTES: Blogs
# --------------------------------
@api_router.post("/blogs")
async def create_blog(
    title: str = Form(...),
    excerpt: str = Form(default=""),
    content: str = Form(...),
    image: Optional[UploadFile] = File(default=None),
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "admin": raise HTTPException(status_code=403, detail="Admin only")
    
    image_url = None
    if image and image.filename:
        image_url = await upload_file_to_supabase(image, "blogs")

    blog_doc = {
        "id": str(uuid.uuid4()),
        "title": title,
        "excerpt": excerpt,
        "content": content,
        "imageUrl": image_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("blogs").insert(blog_doc).execute()
    return blog_doc

@api_router.get("/blogs")
def get_blogs():
    res = supabase.table("blogs").select("*").order("created_at", desc=True).execute()
    return res.data or []

@api_router.delete("/blogs/{blog_id}")
def delete_blog(blog_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin": raise HTTPException(status_code=403)
    supabase.table("blogs").delete().eq("id", blog_id).execute()
    return {"message": "Deleted"}

# --------------------------------
# ROUTES: YouTube Videos
# --------------------------------
@api_router.post("/youtube-videos")
def create_youtube_video(video: YoutubeVideoCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin": raise HTTPException(status_code=403)
    video_doc = {
        "id": str(uuid.uuid4()),
        "title": video.title,
        "videoUrl": video.videoUrl,
        "description": video.description,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("youtube_videos").insert(video_doc).execute()
    return video_doc

@api_router.get("/youtube-videos")
def get_youtube_videos():
    res = supabase.table("youtube_videos").select("*").order("created_at", desc=True).execute()
    return res.data or []

@api_router.delete("/youtube-videos/{video_id}")
def delete_youtube_video(video_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin": raise HTTPException(status_code=403)
    supabase.table("youtube_videos").delete().eq("id", video_id).execute()
    return {"message": "Deleted"}

# --------------------------------
# ROUTES: Inquiries / Leads
# --------------------------------
@api_router.post("/inquiries")
def create_inquiry(inq: InquiryCreate, current_user: dict = Depends(get_current_user)):
    prop_res = supabase.table("properties").select("owner_id").eq("id", inq.property_id).limit(1).execute()
    if not prop_res.data: raise HTTPException(status_code=404, detail="Property not found")
    
    doc = {
        "id": str(uuid.uuid4()),
        "from_user_id": current_user["id"],
        "from_user_name": current_user.get("name"),
        "phone": current_user.get("phone"),
        "to_user_id": prop_res.data[0]["owner_id"],
        "property_id": inq.property_id,
        "message": inq.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("inquiries").insert(doc).execute()
    return {"message": "Inquiry sent"}

@api_router.get("/inquiries")
def get_inquiries(current_user: dict = Depends(get_current_user)):
    expr = f"from_user_id.eq.{current_user['id']},to_user_id.eq.{current_user['id']}"
    res = supabase.table("inquiries").select("*").or_(expr).order("created_at", desc=True).execute()
    return res.data or []

# --------------------------------
# ROUTES: Favorites
# --------------------------------
@api_router.post("/favorites")
def add_favorite(fav: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    exist = supabase.table("favorites").select("id").eq("user_id", current_user["id"]).eq("property_id", fav.property_id).execute()
    if exist.data: return {"message": "Already favorited"}
    
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "property_id": fav.property_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("favorites").insert(doc).execute()
    return {"message": "Added to favorites"}

app.include_router(api_router)
