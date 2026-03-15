from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
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

# Load environment variables (Useful for local dev, Render will use its own dashboard variables)
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Safely get DB credentials
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'ank_realty_db')

if not mongo_url:
    logger.warning("MONGO_URL environment variable is not set. The app will fail to connect to the database.")

# MongoDB connection
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('SECRET_KEY', 'ank-realty-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# Initialize App
app = FastAPI(title="ANK Realty API")

# Setup CORS (Must be done before adding routes)
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
async def root():
    return {"status": "online", "message": "ANK Realty API is running", "timestamp": datetime.now(timezone.utc).isoformat()}

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

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
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
    property_type: str  # apartment, villa, house, commercial
    category: str  # buy, sell, rent
    bhk: Optional[int] = None
    area: float  # in sqft
    furnishing: str = "unfurnished"  # furnished, semi-furnished, unfurnished
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
    status: str = "pending"  # pending, approved, rejected
    verified: bool = False
    featured: bool = False
    created_at: str
    views: int = 0

class FavoriteCreate(BaseModel):
    property_id: str

class Favorite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    property_id: str
    created_at: str

class InquiryCreate(BaseModel):
    property_id: str
    message: str

class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    from_user_id: str
    from_user_name: str
    to_user_id: str
    property_id: str
    message: str
    created_at: str
    read: bool = False

class AppointmentCreate(BaseModel):
    property_id: str
    date: str
    time: str
    message: Optional[str] = None

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_name: str
    user_phone: str
    property_id: str
    property_title: str
    date: str
    time: str
    message: Optional[str]
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: str

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
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
    
    await db.users.insert_one(user_doc)
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
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
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
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "phone": current_user["phone"],
        "role": current_user["role"]
    }

# Property Routes
@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate, current_user: dict = Depends(get_current_user)):
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
    
    await db.properties.insert_one(property_doc)
    return Property(**property_doc)

@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    category: Optional[str] = None,
    property_type: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bhk: Optional[int] = None,
    furnishing: Optional[str] = None,
    limit: int = 50
):
    query = {"status": "approved"}
    
    if category:
        query["category"] = category
    if property_type:
        query["property_type"] = property_type
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if min_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$gte"] = min_price
    if max_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$lte"] = max_price
    if bhk is not None:
        query["bhk"] = bhk
    if furnishing:
        query["furnishing"] = furnishing
    
    properties = await db.properties.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return properties

@api_router.get("/properties/featured", response_model=List[Property])
async def get_featured_properties():
    properties = await db.properties.find(
        {"status": "approved", "featured": True},
        {"_id": 0}
    ).limit(6).to_list(6)
    
    if len(properties) < 6:
        additional = await db.properties.find(
            {"status": "approved"},
            {"_id": 0}
        ).sort("created_at", -1).limit(6 - len(properties)).to_list(6 - len(properties))
        properties.extend(additional)
    
    return properties

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    property_doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    
    await db.properties.update_one({"id": property_id}, {"$inc": {"views": 1}})
    property_doc["views"] = property_doc.get("views", 0) + 1
    
    return Property(**property_doc)

@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(
    property_id: str,
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_user)
):
    property_doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_doc["owner_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = property_data.model_dump()
    await db.properties.update_one({"id": property_id}, {"$set": update_data})
    
    updated_property = await db.properties.find_one({"id": property_id}, {"_id": 0})
    return Property(**updated_property)

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str, current_user: dict = Depends(get_current_user)):
    property_doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_doc["owner_id"] != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.properties.delete_one({"id": property_id})
    return {"message": "Property deleted successfully"}

# Favorites
@api_router.post("/favorites")
async def add_favorite(favorite_data: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.favorites.find_one({
        "user_id": current_user["id"],
        "property_id": favorite_data.property_id
    })
    
    if existing:
        return {"message": "Already in favorites"}
    
    favorite_id = str(uuid.uuid4())
    favorite_doc = {
        "id": favorite_id,
        "user_id": current_user["id"],
        "property_id": favorite_data.property_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.favorites.insert_one(favorite_doc)
    return {"message": "Added to favorites", "id": favorite_id}

@api_router.get("/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    
    property_ids = [fav["property_id"] for fav in favorites]
    properties = await db.properties.find({"id": {"$in": property_ids}}, {"_id": 0}).to_list(100)
    
    return properties

@api_router.delete("/favorites/{property_id}")
async def remove_favorite(property_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.favorites.delete_one({
        "user_id": current_user["id"],
        "property_id": property_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"message": "Removed from favorites"}

# Inquiries
@api_router.post("/inquiries")
async def create_inquiry(inquiry_data: InquiryCreate, current_user: dict = Depends(get_current_user)):
    property_doc = await db.properties.find_one({"id": inquiry_data.property_id}, {"_id": 0})
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    
    inquiry_id = str(uuid.uuid4())
    inquiry_doc = {
        "id": inquiry_id,
        "from_user_id": current_user["id"],
        "from_user_name": current_user["name"],
        "to_user_id": property_doc["owner_id"],
        "property_id": inquiry_data.property_id,
        "message": inquiry_data.message,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.inquiries.insert_one(inquiry_doc)
    return {"message": "Inquiry sent successfully", "id": inquiry_id}

@api_router.get("/inquiries")
async def get_inquiries(current_user: dict = Depends(get_current_user)):
    inquiries = await db.inquiries.find({
        "$or": [
            {"from_user_id": current_user["id"]},
            {"to_user_id": current_user["id"]}
        ]
    }, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    return inquiries

# Appointments
@api_router.post("/appointments")
async def create_appointment(appointment_data: AppointmentCreate, current_user: dict = Depends(get_current_user)):
    property_doc = await db.properties.find_one({"id": appointment_data.property_id}, {"_id": 0})
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    
    appointment_id = str(uuid.uuid4())
    appointment_doc = {
        "id": appointment_id,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        "user_phone": current_user["phone"],
        "property_id": appointment_data.property_id,
        "property_title": property_doc["title"],
        "date": appointment_data.date,
        "time": appointment_data.time,
        "message": appointment_data.message,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.appointments.insert_one(appointment_doc)
    return {"message": "Appointment scheduled successfully", "id": appointment_id}

@api_router.get("/appointments")
async def get_appointments(current_user: dict = Depends(get_current_user)):
    appointments = await db.appointments.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return appointments

# Dashboard
@api_router.get("/dashboard/user")
async def get_user_dashboard(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    appointments = await db.appointments.find({"user_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).limit(10).to_list(10)
    inquiries = await db.inquiries.find({"from_user_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).limit(10).to_list(10)
    
    return {
        "favorites_count": len(favorites),
        "appointments": appointments,
        "inquiries": inquiries
    }

@api_router.get("/dashboard/agent")
async def get_agent_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["agent", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    my_properties = await db.properties.find({"owner_id": current_user["id"]}, {"_id": 0}).to_list(100)
    
    property_ids = [prop["id"] for prop in my_properties]
    inquiries = await db.inquiries.find({"to_user_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    total_views = sum(prop.get("views", 0) for prop in my_properties)
    
    return {
        "total_listings": len(my_properties),
        "total_views": total_views,
        "total_inquiries": len(inquiries),
        "properties": my_properties,
        "inquiries": inquiries
    }

@api_router.get("/dashboard/admin")
async def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_properties = await db.properties.count_documents({})
    pending_properties = await db.properties.count_documents({"status": "pending"})
    total_users = await db.users.count_documents({})
    
    pending_list = await db.properties.find({"status": "pending"}, {"_id": 0}).sort("created_at", -1).to_list(50)
    
    return {
        "total_properties": total_properties,
        "pending_properties": pending_properties,
        "total_users": total_users,
        "pending_list": pending_list
    }

@api_router.put("/admin/properties/{property_id}/status")
async def update_property_status(
    property_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.properties.update_one(
        {"id": property_id},
        {"$set": {"status": status, "verified": status == "approved"}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"message": f"Property {status} successfully"}

app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
