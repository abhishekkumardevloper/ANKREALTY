# app.py
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, Form, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import json

# --------------------------------
# Logging
# --------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ank-realty-api")

# --------------------------------
# Load env
# --------------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY", "ank-realty-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))
DEBUG = os.environ.get("DEBUG", "false").lower() in ("1", "true", "yes")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.warning("SUPABASE_URL or SUPABASE_KEY is missing. App will fail to connect until they are provided.")

# --------------------------------
# Create supabase client
# --------------------------------
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
except Exception as e:
    supabase = None
    logger.exception("Failed to create Supabase client: %s", e)

# --------------------------------
# Security helpers
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

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --------------------------------
# FastAPI init + CORS
# --------------------------------
app = FastAPI(title="ANK Realty API")
cors_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

def check_res_or_raise(res: Any, action: str = "database operation"):
    if res is None:
        raise HTTPException(status_code=500, detail=f"Supabase client not initialized for {action}")
    err = getattr(res, "error", None)
    if err:
        logger.error("Supabase error during %s: %s", action, err)
        detail = str(err) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)
    return res

# --------------------------------
# Storage Helper Function
# --------------------------------
async def upload_file_to_supabase(file: UploadFile, folder: str) -> str:
    """Uploads a file to Supabase Storage ('media' bucket) and returns the public URL."""
    if not supabase or not file or not file.filename:
        return ""
    try:
        file_ext = file.filename.split(".")[-1]
        file_name = f"{folder}/{uuid.uuid4()}.{file_ext}"
        contents = await file.read()
        
        res = supabase.storage.from_("media").upload(file_name, contents)
        if getattr(res, "error", None):
            logger.error(f"Storage upload error: {res.error}")
            return ""
        
        # Get Public URL
        public_url = supabase.storage.from_("media").get_public_url(file_name)
        return public_url
    except Exception as e:
        logger.error(f"File upload exception: {e}")
        return ""

# --------------------------------
# Auth Dependency
# --------------------------------
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub") or payload.get("user_id") or payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
    except JWTError as e:
        logger.warning("JWT decode error: %s", str(e))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
    
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
        check_res_or_raise(res, "fetching current user")
        user = res.data[0] if res.data else None
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching current user: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error")

# --------------------------------
# Models
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

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    owner_id: str
    title: str
    description: str
    price: float
    location: str
    city: str
    state: str
    property_type: str
    category: str
    bhk: Optional[int] = None
    area: float
    furnishing: str
    amenities: List[str]
    images: List[str]
    videos: List[str] = []
    brochure: Optional[str] = None
    builder: Optional[str] = None
    rera: Optional[str] = None
    projectStatus: Optional[str] = None
    possession: Optional[str] = None
    status: str = "pending"
    created_at: str

class YoutubeVideoCreate(BaseModel):
    title: str
    videoUrl: str
    description: Optional[str] = None

# ... [Auth Routes identical to your previous ones] ...

# --------------------------------
# Property Routes (Multipart Form)
# --------------------------------
@api_router.post("/properties")
async def create_property(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    location: str = Form(...),
    city: str = Form(...),
    state: str = Form(default=""),
    property_type: str = Form(...),
    category: str = Form(...),
    bhk: Optional[int] = Form(default=None),
    area: float = Form(...),
    furnishing: str = Form(default="unfurnished"),
    amenities: str = Form(default="[]"),
    builder: Optional[str] = Form(default=None),
    rera: Optional[str] = Form(default=None),
    projectStatus: Optional[str] = Form(default="New Launch"),
    possession: Optional[str] = Form(default=None),
    new_images: List[UploadFile] = File(default=[]),
    new_videos: List[UploadFile] = File(default=[]),
    brochure: Optional[UploadFile] = File(default=None),
    current_user: dict = Depends(get_current_user)
):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        property_id = str(uuid.uuid4())
        
        # Parse JSON array strings
        parsed_amenities = json.loads(amenities) if amenities else []
        
        # Upload Files to Supabase Storage
        image_urls = []
        video_urls = []
        brochure_url = None

        for img in new_images:
            if img.filename:
                url = await upload_file_to_supabase(img, "properties/images")
                if url: image_urls.append(url)
                
        for vid in new_videos:
            if vid.filename:
                url = await upload_file_to_supabase(vid, "properties/videos")
                if url: video_urls.append(url)
                
        if brochure and brochure.filename:
            brochure_url = await upload_file_to_supabase(brochure, "properties/brochures")

        property_doc = {
            "id": property_id,
            "owner_id": current_user["id"],
            "owner_name": current_user.get("name"),
            "owner_phone": current_user.get("phone"),
            "title": title,
            "description": description,
            "price": price,
            "location": location,
            "city": city,
            "state": state,
            "property_type": property_type,
            "category": category,
            "bhk": bhk,
            "area": area,
            "furnishing": furnishing,
            "amenities": parsed_amenities,
            "builder": builder,
            "rera": rera,
            "projectStatus": projectStatus,
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
        logger.exception("Error creating property: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/properties")
def get_properties(limit: int = 100):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    res = supabase.table("properties").select("*").order("created_at", desc=True).limit(limit).execute()
    return res.data or []

@api_router.delete("/properties/{property_id}")
def delete_property(property_id: str, current_user: dict = Depends(get_current_user)):
    if supabase is None: raise HTTPException(status_code=500, detail="Database not configured")
    res = supabase.table("properties").delete().eq("id", property_id).execute()
    return {"message": "Property deleted successfully"}

# --------------------------------
# Blog Routes (Multipart Form)
# --------------------------------
@api_router.post("/blogs")
async def create_blog(
    title: str = Form(...),
    excerpt: Optional[str] = Form(default=None),
    content: str = Form(...),
    image: Optional[UploadFile] = File(default=None),
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    image_url = None
    if image and image.filename:
        image_url = await upload_file_to_supabase(image, "blogs/covers")

    blog_doc = {
        "id": str(uuid.uuid4()),
        "title": title,
        "excerpt": excerpt,
        "content": content,
        "imageUrl": image_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    res = supabase.table("blogs").insert(blog_doc).execute()
    check_res_or_raise(res, "inserting blog")
    return blog_doc

@api_router.get("/blogs")
def get_blogs():
    if supabase is None: raise HTTPException(status_code=500)
    res = supabase.table("blogs").select("*").order("created_at", desc=True).execute()
    return res.data or []

# --------------------------------
# YouTube Videos Routes
# --------------------------------
@api_router.post("/youtube-videos")
def create_youtube_video(video: YoutubeVideoCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    video_doc = {
        "id": str(uuid.uuid4()),
        "title": video.title,
        "videoUrl": video.videoUrl,
        "description": video.description,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    res = supabase.table("youtube_videos").insert(video_doc).execute()
    check_res_or_raise(res, "inserting video")
    return video_doc

@api_router.get("/youtube-videos")
def get_youtube_videos():
    if supabase is None: raise HTTPException(status_code=500)
    res = supabase.table("youtube_videos").select("*").order("created_at", desc=True).execute()
    return res.data or []

# --------------------------------
# Dashboards (Existing Logic Retained)
# --------------------------------
@api_router.get("/dashboard/admin")
def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_props = supabase.table("properties").select("*", count="exact").execute()
    pending_props = supabase.table("properties").select("*", count="exact").eq("status", "pending").execute()
    pending_list = supabase.table("properties").select("*").eq("status", "pending").order("created_at", desc=True).limit(50).execute()
    
    return {
        "total_properties": total_props.count or 0,
        "pending_properties": pending_props.count or 0,
        "pending_list": pending_list.data or []
    }

@api_router.put("/admin/properties/{property_id}/status")
def update_property_status(property_id: str, status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    res = supabase.table("properties").update({"status": status, "verified": status == "approved"}).eq("id", property_id).execute()
    check_res_or_raise(res, "updating property status")
    return {"message": f"Property {status} successfully"}

app.include_router(api_router)
