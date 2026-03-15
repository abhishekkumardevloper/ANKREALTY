from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.warning("SUPABASE_URL or SUPABASE_KEY is missing. App will fail to connect to the database.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('SECRET_KEY', 'ank-realty-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# Initialize App
app = FastAPI(title="ANK Realty API")

# Setup CORS
cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# --- ROOT HEALTH CHECK FOR RENDER ---
@app.get("/")
def root():
    return {"status": "online", "message": "ANK Realty Supabase API is running", "timestamp": datetime.now(timezone.utc).isoformat()}

# Password helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    res = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    user = res.data[0] if res.data else None
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    role: str = "user"  # user, agent, admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    phone: str
    role: str
    created_at: str

class PropertyCreate(BaseModel):
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
    furnishing: str = "unfurnished"
    amenities: List[str] = []
    images: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    owner_id: str
    owner_name: str
    owner_phone: str
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
    latitude: Optional[float]
    longitude: Optional[float]
    status: str = "pending"
    verified: bool = False
    featured: bool = False
    created_at: str
    views: int = 0

class FavoriteCreate(BaseModel):
    property_id: str

class InquiryCreate(BaseModel):
    property_id: str
    message: str

class AppointmentCreate(BaseModel):
    property_id: str
    date: str
    time: str
    message: Optional[str] = None


# --- Auth Routes ---
@api_router.post("/auth/register")
def register(user_data: UserRegister):
    res = supabase.table("users").select("*").eq("email", user_data.email).limit(1).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "phone": user_data.phone,
        "role": user_data.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    supabase.table("users").insert(user_doc).execute()
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "token": access_token,
        "user": {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "phone": user_data.phone,
            "role": user_data.role
        }
    }

@api_router.post("/auth/login")
def login(credentials: UserLogin):
    res = supabase.table("users").select("*").eq("email", credentials.email).limit(1).execute()
    user = res.data[0] if res.data else None
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    return {
        "token": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "phone": user["phone"],
            "role": user["role"]
        }
    }

@api_router.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "phone": current_user["phone"],
        "role": current_user["role"]
    }

# --- Property Routes ---
@api_router.post("/properties", response_model=Property)
def create_property(property_data: PropertyCreate, current_user: dict = Depends(get_current_user)):
    property_id = str(uuid.uuid4())
    property_doc = {
        "id": property_id,
        "owner_id": current_user["id"],
        "owner_name": current_user["name"],
        "owner_phone": current_user["phone"],
        **property_data.model_dump(),
        "status": "approved" if current_user["role"] == "admin" else "pending",
        "verified": current_user["role"] == "admin",
        "featured": False,
        "views": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    supabase.table("properties").insert(property_doc).execute()
    return Property(**property_doc)

@api_router.get("/properties", response_model=List[Property])
def get_properties(
    category: Optional[str] = None,
    property_type: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bhk: Optional[int] = None,
    furnishing: Optional[str] = None,
    limit: int = 50
):
    query = supabase.table("properties").select("*").eq("status", "approved")
    
    if category:
        query = query.eq("category", category)
    if property_type:
        query = query.eq("property_type", property_type)
    if city:
        query = query.ilike("city", f"%{city}%")
    if min_price is not None:
        query = query.gte("price", min_price)
    if max_price is not None:
        query = query.lte("price", max_price)
    if bhk is not None:
        query = query.eq("bhk", bhk)
    if furnishing:
        query = query.eq("furnishing", furnishing)
    
    res = query.order("created_at", desc=True).limit(limit).execute()
    return res.data

@api_router.get("/properties/featured", response_model=List[Property])
def get_featured_properties():
    res = supabase.table("properties").select("*").eq("status", "approved").eq("featured", True).limit(6).execute()
    properties = res.data
    
    if len(properties) < 6:
        needed = 6 - len(properties)
        res_add = supabase.table("properties").select("*").eq("status", "approved").order("created_at", desc=True).limit(needed).execute()
        properties.extend(res_add.data)
    
    return properties[:6]

@api_router.get("/properties/{property_id}", response_model=Property)
def get_property(property_id: str):
    res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    prop = res.data[0] if res.data else None
    
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    new_views = prop.get("views", 0) + 1
    supabase.table("properties").update({"views": new_views}).eq("id", property_id).execute()
    prop["views"] = new_views
    
    return Property(**prop)

@api_router.put("/properties/{property_id}", response_model=Property)
def update_property(
    property_id: str,
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_user)
):
    res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    prop = res.data[0] if res.data else None
    
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if prop["owner_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = property_data.model_dump()
    supabase.table("properties").update(update_data).eq("id", property_id).execute()
    
    updated_res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    return Property(**updated_res.data[0])

@api_router.delete("/properties/{property_id}")
def delete_property(property_id: str, current_user: dict = Depends(get_current_user)):
    res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
    prop = res.data[0] if res.data else None
    
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if prop["owner_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    supabase.table("properties").delete().eq("id", property_id).execute()
    return {"message": "Property deleted successfully"}

# --- Favorites ---
@api_router.post("/favorites")
def add_favorite(favorite_data: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("favorites").select("*").eq("user_id", current_user["id"]).eq("property_id", favorite_data.property_id).execute()
    
    if existing.data:
        return {"message": "Already in favorites"}
    
    favorite_id = str(uuid.uuid4())
    favorite_doc = {
        "id": favorite_id,
        "user_id": current_user["id"],
        "property_id": favorite_data.property_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    supabase.table("favorites").insert(favorite_doc).execute()
    return {"message": "Added to favorites", "id": favorite_id}

@api_router.get("/favorites")
def get_favorites(current_user: dict = Depends(get_current_user)):
    fav_res = supabase.table("favorites").select("*").eq("user_id", current_user["id"]).execute()
    property_ids = [fav["property_id"] for fav in fav_res.data]
    
    if not property_ids:
        return []
        
    prop_res = supabase.table("properties").select("*").in_("id", property_ids).execute()
    return prop_res.data

@api_router.delete("/favorites/{property_id}")
def remove_favorite(property_id: str, current_user: dict = Depends(get_current_user)):
    res = supabase.table("favorites").delete().eq("user_id", current_user["id"]).eq("property_id", property_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Removed from favorites"}

# --- Inquiries ---
@api_router.post("/inquiries")
def create_inquiry(inquiry_data: InquiryCreate, current_user: dict = Depends(get_current_user)):
    res = supabase.table("properties").select("*").eq("id", inquiry_data.property_id).limit(1).execute()
    prop = res.data[0] if res.data else None
    
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    inquiry_id = str(uuid.uuid4())
    inquiry_doc = {
        "id": inquiry_id,
        "from_user_id": current_user["id"],
        "from_user_name": current_user["name"],
        "to_user_id": prop["owner_id"],
        "property_id": inquiry_data.property_id,
        "message": inquiry_data.message,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    supabase.table("inquiries").insert(inquiry_doc).execute()
    return {"message": "Inquiry sent successfully", "id": inquiry_id}

@api_router.get("/inquiries")
def get_inquiries(current_user: dict = Depends(get_current_user)):
    res = supabase.table("inquiries").select("*").or_(f"from_user_id.eq.{current_user['id']},to_user_id.eq.{current_user['id']}").order("created_at", desc=True).limit(100).execute()
    return res.data

# --- Appointments ---
@api_router.post("/appointments")
def create_appointment(appointment_data: AppointmentCreate, current_user: dict = Depends(get_current_user)):
    res = supabase.table("properties").select("*").eq("id", appointment_data.property_id).limit(1).execute()
    prop = res.data[0] if res.data else None
    
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    appointment_id = str(uuid.uuid4())
    appointment_doc = {
        "id": appointment_id,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        "user_phone": current_user["phone"],
        "property_id": appointment_data.property_id,
        "property_title": prop["title"],
        "date": appointment_data.date,
        "time": appointment_data.time,
        "message": appointment_data.message,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    supabase.table("appointments").insert(appointment_doc).execute()
    return {"message": "Appointment scheduled successfully", "id": appointment_id}

@api_router.get("/appointments")
def get_appointments(current_user: dict = Depends(get_current_user)):
    res = supabase.table("appointments").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).limit(100).execute()
    return res.data

# --- Dashboards ---
@api_router.get("/dashboard/user")
def get_user_dashboard(current_user: dict = Depends(get_current_user)):
    fav_res = supabase.table("favorites").select("*", count="exact").eq("user_id", current_user["id"]).execute()
    app_res = supabase.table("appointments").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).limit(10).execute()
    inq_res = supabase.table("inquiries").select("*").eq("from_user_id", current_user["id"]).order("created_at", desc=True).limit(10).execute()
    
    return {
        "favorites_count": fav_res.count if fav_res.count else 0,
        "appointments": app_res.data,
        "inquiries": inq_res.data
    }

@api_router.get("/dashboard/agent")
def get_agent_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["agent", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    prop_res = supabase.table("properties").select("*").eq("owner_id", current_user["id"]).execute()
    my_properties = prop_res.data
    
    inq_res = supabase.table("inquiries").select("*").eq("to_user_id", current_user["id"]).order("created_at", desc=True).limit(100).execute()
    
    total_views = sum(prop.get("views", 0) for prop in my_properties)
    
    return {
        "total_listings": len(my_properties),
        "total_views": total_views,
        "total_inquiries": len(inq_res.data),
        "properties": my_properties,
        "inquiries": inq_res.data
    }

@api_router.get("/dashboard/admin")
def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_props = supabase.table("properties").select("*", count="exact").execute().count
    pending_props = supabase.table("properties").select("*", count="exact").eq("status", "pending").execute().count
    total_users = supabase.table("users").select("*", count="exact").execute().count
    
    pending_list = supabase.table("properties").select("*").eq("status", "pending").order("created_at", desc=True).limit(50).execute().data
    
    return {
        "total_properties": total_props or 0,
        "pending_properties": pending_props or 0,
        "total_users": total_users or 0,
        "pending_list": pending_list
    }

@api_router.put("/admin/properties/{property_id}/status")
def update_property_status(
    property_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    res = supabase.table("properties").update({"status": status, "verified": status == "approved"}).eq("id", property_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"message": f"Property {status} successfully"}

app.include_router(api_router)
