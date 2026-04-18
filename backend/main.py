from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, Form, UploadFile, Request
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
from datetime import datetime, timezone

# --------------------------------
# 1. Logging & Environment
# --------------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("ank-realty-api")

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
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
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the Supabase Auth JWT natively and fetches the user's public profile.
    This natively supports Supabase's new ECC (P-256) keys.
    """
    token = credentials.credentials
    
    # 1. Let the Supabase client verify the token automatically
    try:
        auth_response = supabase.auth.get_user(token)
        if not auth_response or not getattr(auth_response, 'user', None):
            raise HTTPException(status_code=401, detail="Invalid token structure")
        user_id = auth_response.user.id
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    
    # 2. Fetch the custom profile data from our public.users table
    res = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    user = res.data[0] if res.data and res.data else None
    
    # 3. THE FIX: If the database trigger is running slow or RLS blocked it, 
    # DO NOT crash. Gracefully fallback to the raw Auth data so the user stays logged in!
    if not user:
        user_meta = auth_response.user.user_metadata or {}
        return {
            "id": user_id,
            "email": auth_response.user.email,
            "name": user_meta.get("name", "Google User"),
            "phone": user_meta.get("phone", ""),
            "role": user_meta.get("role", "client"),
        }
    
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

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class YoutubeVideoCreate(BaseModel):
    title: str
    videoUrl: str
    description: Optional[str] = None

class InquiryCreate(BaseModel):
    property_id: str
    message: str

class FavoriteCreate(BaseModel):
    property_id: str

class ContactCreate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: str
    phone: str
    message: Optional[str] = None
    interest: Optional[str] = None
    
    name: Optional[str] = None
    company: Optional[str] = None
    requirements: Optional[str] = None

# --------------------------------
# ROUTES: Authentication
# --------------------------------
@api_router.post("/auth/register")
def register(user_data: UserRegister):
    try:
        res = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "name": user_data.name,
                    "phone": user_data.phone,
                    "role": user_data.role
                }
            }
        })
        
        if not res.session:
            return {"message": "Registration successful. Please check your email to verify your account."}
            
        return {
            "token": res.session.access_token, 
            "user": res.user.user_metadata
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/auth/login")
def login(credentials: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        profile_res = supabase.table("users").select("*").eq("id", res.user.id).limit(1).execute()
        user_profile = profile_res.data[0] if profile_res.data else res.user.user_metadata
        
        return {
            "token": res.session.access_token, 
            "user": user_profile
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")

@api_router.post("/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    try:
        # Supabase natively handles sending the secure reset email
        supabase.auth.reset_password_email(req.email)
        # Return generic success to prevent email enumeration
        return {"message": "If that email is registered, a password reset link has been sent."}
    except Exception as e:
        logger.error(f"Error sending reset email: {str(e)}")
        return {"message": "If that email is registered, a password reset link has been sent."}

@api_router.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --------------------------------
# ROUTES: Users CRM (Admin Only)
# --------------------------------
@api_router.get("/users")
def get_all_users(current_user: dict = Depends(get_current_user)):
    """Fetches all registered users for the Admin CRM Page."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    # Assuming you have a trigger that copies auth.users to public.users
    res = supabase.table("users").select("*").order("created_at", desc=True).execute()
    return res.data or []

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
    
    total_views = sum(p.get("views", 0) for p in properties)

    if current_user.get("role") == "admin":
        inq_res = supabase.table("inquiries").select("*").order("created_at", desc=True).execute()
    else:
        expr = f"from_user_id.eq.{current_user['id']},to_user_id.eq.{current_user['id']}"
        inq_res = supabase.table("inquiries").select("*").or_(expr).order("created_at", desc=True).execute()
    
    inquiries = inq_res.data or []
    
    return {
        "total_listings": len(properties),
        "total_views": total_views,
        "total_inquiries": len(inquiries),
        "properties": properties,
        "inquiries": inquiries
    }

# --------------------------------
# ROUTES: Public Contact Forms (General Website Leads)
# --------------------------------
@api_router.post("/contacts")
def submit_contact_form(contact: ContactCreate):
    """Handles public contact forms and saves them as Leads in the CRM."""
    full_name = contact.name
    if not full_name:
        full_name = f"{contact.firstName or ''} {contact.lastName or ''}".strip()
    
    msg_body = contact.message or contact.requirements or "No additional message."
    
    source = "Contact Form"
    if contact.company:
        source = f"Corporate Lead ({contact.company})"
    elif contact.interest:
        source = f"Interested in: {contact.interest}"

    formatted_message = f"[Source: {source}] | Email: {contact.email} | Message: {msg_body}"

    doc = {
        "id": str(uuid.uuid4()),
        "from_user_id": None, 
        "from_user_name": full_name or "Web Visitor",
        "phone": contact.phone,
        "to_user_id": None,
        "property_id": None,
        "message": formatted_message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    res = supabase.table("inquiries").insert(doc).execute()
    check_res_or_raise(res, "submitting contact form")
    return {"message": "Inquiry submitted successfully"}

# --------------------------------
# ROUTES: Properties
# --------------------------------
@api_router.post("/properties")
async def create_property(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    try:
        form_data = await request.form()
        
        title = form_data.get("title", "")
        description = form_data.get("description", "")
        price = form_data.get("price", "0")
        location = form_data.get("location", "")
        city = form_data.get("city", "")
        state = form_data.get("state", "")
        property_type = form_data.get("property_type", "apartment")
        category = form_data.get("category", "buy")
        area = form_data.get("area", "0")
        bhk = form_data.get("bhk", "0")
        bathrooms = form_data.get("bathrooms", "0")
        furnishing = form_data.get("furnishing", "unfurnished")
        amenities = form_data.get("amenities", "[]")
        builder = form_data.get("builder", "")
        rera = form_data.get("rera", "")
        project_status = form_data.get("projectStatus", "New Launch")
        possession = form_data.get("possession", "")
        youtube_link = form_data.get("youtube_link", "")

        parsed_price = float(price) if isinstance(price, str) and price.strip() else 0.0
        parsed_area = float(area) if isinstance(area, str) and area.strip() else 0.0
        parsed_bhk = int(bhk) if isinstance(bhk, str) and bhk.strip() else 0
        parsed_bathrooms = int(bathrooms) if isinstance(bathrooms, str) and bathrooms.strip() else 0
        
        try:
            parsed_amenities = json.loads(amenities)
        except:
            parsed_amenities = []

        image_urls = []
        for img in form_data.getlist("new_images"):
            if hasattr(img, "filename") and img.filename:
                url = await upload_file_to_supabase(img, "properties/images")
                if url: image_urls.append(url)
                
        video_urls = []
        for vid in form_data.getlist("new_videos"):
            if hasattr(vid, "filename") and vid.filename:
                url = await upload_file_to_supabase(vid, "properties/videos")
                if url: video_urls.append(url)
                
        brochure = form_data.get("brochure")
        brochure_url = None
        if brochure and hasattr(brochure, "filename") and brochure.filename:
            brochure_url = await upload_file_to_supabase(brochure, "properties/brochures")

        property_doc = {
            "id": str(uuid.uuid4()),
            "owner_id": current_user["id"],
            "owner_name": current_user.get("name"),
            "owner_phone": current_user.get("phone"),
            "title": str(title),
            "description": str(description),
            "price": parsed_price,
            "location": str(location),
            "city": str(city),
            "state": str(state),
            "property_type": str(property_type),
            "category": str(category),
            "area": parsed_area,
            "bhk": parsed_bhk,
            "bathrooms": parsed_bathrooms,
            "furnishing": str(furnishing),
            "amenities": parsed_amenities,
            "builder": str(builder),
            "rera": str(rera),
            "project_status": str(project_status),
            "possession": str(possession),
            "youtube_link": str(youtube_link) if youtube_link else None,
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
        logger.exception("Error creating property:")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/properties/{property_id}")
async def update_property(
    property_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    if not res.data: 
        raise HTTPException(status_code=404, detail="Property not found")
    
    existing_prop = res.data[0]
    
    if existing_prop["owner_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this property")
        
    form_data = await request.form()
    update_data = {}
    
    if "title" in form_data: update_data["title"] = str(form_data.get("title", ""))
    if "description" in form_data: update_data["description"] = str(form_data.get("description", ""))
    if "location" in form_data: update_data["location"] = str(form_data.get("location", ""))
    if "city" in form_data: update_data["city"] = str(form_data.get("city", ""))
    if "state" in form_data: update_data["state"] = str(form_data.get("state", ""))
    if "property_type" in form_data: update_data["property_type"] = str(form_data.get("property_type", ""))
    if "category" in form_data: update_data["category"] = str(form_data.get("category", ""))
    if "furnishing" in form_data: update_data["furnishing"] = str(form_data.get("furnishing", ""))
    if "builder" in form_data: update_data["builder"] = str(form_data.get("builder", ""))
    if "rera" in form_data: update_data["rera"] = str(form_data.get("rera", ""))
    if "projectStatus" in form_data: update_data["project_status"] = str(form_data.get("projectStatus", ""))
    if "possession" in form_data: update_data["possession"] = str(form_data.get("possession", ""))
    if "youtube_link" in form_data: update_data["youtube_link"] = str(form_data.get("youtube_link", ""))

    if "price" in form_data:
        p = form_data.get("price")
        update_data["price"] = float(p) if isinstance(p, str) and p.strip() else 0.0
        
    if "area" in form_data:
        a = form_data.get("area")
        update_data["area"] = float(a) if isinstance(a, str) and a.strip() else 0.0
        
    if "bhk" in form_data:
        b = form_data.get("bhk")
        update_data["bhk"] = int(b) if isinstance(b, str) and b.strip() else 0
        
    if "bathrooms" in form_data:
        bth = form_data.get("bathrooms")
        update_data["bathrooms"] = int(bth) if isinstance(bth, str) and bth.strip() else 0
    
    if "amenities" in form_data:
        try:
            update_data["amenities"] = json.loads(form_data.get("amenities"))
        except:
            pass

    ex_img = form_data.get("existing_images")
    try:
        image_urls = json.loads(ex_img) if ex_img else existing_prop.get("images", [])
    except:
        image_urls = existing_prop.get("images", [])
        
    for img in form_data.getlist("new_images"):
        if hasattr(img, "filename") and img.filename:
            url = await upload_file_to_supabase(img, "properties/images")
            if url: image_urls.append(url)
    update_data["images"] = image_urls
    
    video_urls = existing_prop.get("videos", [])
    for vid in form_data.getlist("new_videos"):
        if hasattr(vid, "filename") and vid.filename:
            url = await upload_file_to_supabase(vid, "properties/videos")
            if url: video_urls.append(url)
    if video_urls:
        update_data["videos"] = video_urls
        
    brochure = form_data.get("brochure")
    if brochure and hasattr(brochure, "filename") and brochure.filename:
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
# ROUTES: Inquiries / Leads (Authenticated CRM Data)
# --------------------------------
@api_router.post("/inquiries")
def create_inquiry(inq: InquiryCreate, current_user: dict = Depends(get_current_user)):
    """Handles property-specific leads from logged-in users."""
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
    """This route serves as your Lead CRM. Admin sees all leads, agents see their own."""
    if current_user.get("role") == "admin":
        res = supabase.table("inquiries").select("*").order("created_at", desc=True).execute()
    else:
        expr = f"from_user_id.eq.{current_user['id']},to_user_id.eq.{current_user['id']}"
        res = supabase.table("inquiries").select("*").or_(expr).order("created_at", desc=True).execute()
    return res.data or []

# --------------------------------
# ROUTES: Favorites
# --------------------------------
@api_router.post("/favorites")
def add_favorite(fav: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    # Check if already favorited
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

@api_router.get("/favorites")
def get_favorites(current_user: dict = Depends(get_current_user)):
    """
    CRITICAL FIX for User Dashboard:
    By adding 'properties(*)', Supabase automatically performs a SQL JOIN.
    This ensures the frontend receives the full property details (images, price, title)
    instead of just the favorite ID.
    """
    res = supabase.table("favorites").select("*, properties(*)").eq("user_id", current_user["id"]).order("created_at", desc=True).execute()
    return res.data or []

@api_router.delete("/favorites/{favorite_id}")
def delete_favorite(favorite_id: str, current_user: dict = Depends(get_current_user)):
    """Allows users to remove a property from their dashboard."""
    # Ensure they own the favorite record before deleting
    res = supabase.table("favorites").delete().eq("id", favorite_id).eq("user_id", current_user["id"]).execute()
    
    # If no data was returned/affected, it might mean they tried to delete by property_id instead of favorite_id.
    # Fallback to check by property_id just in case the frontend sends that.
    if not getattr(res, 'data', None) and not getattr(res, 'count', 0):
       supabase.table("favorites").delete().eq("property_id", favorite_id).eq("user_id", current_user["id"]).execute()
       
    return {"message": "Removed from favorites"}

app.include_router(api_router)
