# app.py
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
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
# Create supabase client (may fail later if env missing)
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
    # Use numeric timestamp for compatibility
    to_encode.update({"exp": int(expire.timestamp())})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

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

# --------------------------------
# Helper: check supabase result for errors
# --------------------------------
def check_res_or_raise(res: Any, action: str = "database operation"):
    """
    Supabase responses often have .data and .error (and possibly .status_code).
    Raise HTTPException if res.error is present.
    """
    if res is None:
        raise HTTPException(status_code=500, detail=f"Supabase client not initialized for {action}")
    # supabase-py returns an object with attributes .error and .data (or dict)
    err = getattr(res, "error", None)
    if err:
        logger.error("Supabase error during %s: %s", action, err)
        # In debug mode, return the supabase error message - else a generic error.
        detail = str(err) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)
    return res

# --------------------------------
# Health check (root)
# --------------------------------
@app.get("/")
def root():
    return {"status": "online", "message": "ANK Realty Supabase API is running", "timestamp": datetime.now(timezone.utc).isoformat()}

# --------------------------------
# Startup: validate DB connectivity (best-effort)
# --------------------------------
@app.on_event("startup")
def startup_event():
    if supabase is None:
        logger.error("Supabase client is not initialized. Check SUPABASE_URL and SUPABASE_KEY in env.")
        return
    try:
        # Try a light query to ensure credentials are valid (select nothing heavy)
        res = supabase.table("users").select("id").limit(1).execute()
        if getattr(res, "error", None):
            logger.error("Supabase connectivity check failed: %s", res.error)
        else:
            logger.info("Supabase connectivity OK")
    except Exception as e:
        logger.exception("Exception when checking supabase connectivity: %s", e)

# --------------------------------
# Authentication dependency
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
    # fetch user
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
# Pydantic models
# --------------------------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    role: str = "client"

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(ch.isalpha() for ch in value) or not any(ch.isdigit() for ch in value):
            raise ValueError("Password must include at least one letter and one number")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        digits = ''.join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise ValueError("Phone number must contain at least 10 digits")
        return value.strip()

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized == "user":
            normalized = "client"
        if normalized not in {"client", "agent", "broker", "admin"}:
            raise ValueError("Role must be one of client, agent, broker, or admin")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(ch.isalpha() for ch in value) or not any(ch.isdigit() for ch in value):
            raise ValueError("Password must include at least one letter and one number")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        digits = ''.join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise ValueError("Phone number must contain at least 10 digits")
        return value.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value.strip()) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

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
    amenities: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    @field_validator("title", "description", "location", "city", "state", "property_type", "category", "furnishing")
    @classmethod
    def validate_non_empty_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field is required")
        return normalized

    @field_validator("price", "area")
    @classmethod
    def validate_positive_numbers(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("Value must be greater than 0")
        return value

    @field_validator("bhk")
    @classmethod
    def validate_bhk(cls, value: Optional[int]) -> Optional[int]:
        if value is not None and value < 0:
            raise ValueError("BHK cannot be negative")
        return value

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

# --------------------------------
# Auth routes
# --------------------------------
@api_router.post("/auth/register")
def register(user_data: UserRegister):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        # check existing
        res = supabase.table("users").select("*").eq("email", user_data.email).limit(1).execute()
        check_res_or_raise(res, "checking existing user")
        if res.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        # create
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
        insert_res = supabase.table("users").insert(user_doc).execute()
        check_res_or_raise(insert_res, "inserting user")
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
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during register: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.post("/auth/login")
def login(credentials: UserLogin):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("users").select("*").eq("email", credentials.email).limit(1).execute()
        check_res_or_raise(res, "fetching user for login")
        user = res.data[0] if res.data else None
        if not user or not verify_password(credentials.password, user.get("password", "")):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        access_token = create_access_token(data={"sub": user["id"]})
        return {
            "token": access_token,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user.get("name"),
                "phone": user.get("phone"),
                "role": user.get("role")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during login: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.post("/auth/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("users").select("id,email").eq("email", request.email).limit(1).execute()
        check_res_or_raise(res, "checking forgot-password user")
        return {
            "message": "If an account exists for this email, password reset instructions have been shared.",
            "email": request.email
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during forgot-password: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "phone": current_user["phone"],
        "role": current_user["role"]
    }

# --------------------------------
# Property routes
# --------------------------------
@api_router.post("/properties", response_model=Property)
def create_property(property_data: PropertyCreate, current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        property_id = str(uuid.uuid4())
        # NOTE: model_dump() works with pydantic v2; if using v1 use .dict()
        try:
            payload = property_data.model_dump()
        except Exception:
            payload = property_data.dict()
        property_doc = {
            "id": property_id,
            "owner_id": current_user["id"],
            "owner_name": current_user.get("name"),
            "owner_phone": current_user.get("phone"),
            **payload,
            "status": "approved" if current_user.get("role") == "admin" else "pending",
            "verified": current_user.get("role") == "admin",
            "featured": False,
            "views": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        res = supabase.table("properties").insert(property_doc).execute()
        check_res_or_raise(res, "inserting property")
        return Property(**property_doc)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error creating property: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

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
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
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
        check_res_or_raise(res, "fetching properties")
        return res.data or []
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching properties: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/properties/featured", response_model=List[Property])
def get_featured_properties():
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").select("*").eq("status", "approved").eq("featured", True).limit(6).execute()
        check_res_or_raise(res, "fetching featured properties")
        properties = res.data or []
        if len(properties) < 6:
            needed = 6 - len(properties)
            res_add = supabase.table("properties").select("*").eq("status", "approved").order("created_at", desc=True).limit(needed).execute()
            check_res_or_raise(res_add, "fetching additional properties")
            properties.extend(res_add.data or [])
        return properties[:6]
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching featured properties: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/properties/{property_id}", response_model=Property)
def get_property(property_id: str):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
        check_res_or_raise(res, "fetching property")
        prop = res.data[0] if res.data else None
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        new_views = prop.get("views", 0) + 1
        update_res = supabase.table("properties").update({"views": new_views}).eq("id", property_id).execute()
        check_res_or_raise(update_res, "updating property views")
        prop["views"] = new_views
        return Property(**prop)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error getting property: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.put("/properties/{property_id}", response_model=Property)
def update_property(
    property_id: str,
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_user)
):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
        check_res_or_raise(res, "fetching property for update")
        prop = res.data[0] if res.data else None
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        if prop["owner_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        try:
            update_data = property_data.model_dump()
        except Exception:
            update_data = property_data.dict()
        update_res = supabase.table("properties").update(update_data).eq("id", property_id).execute()
        check_res_or_raise(update_res, "updating property")
        updated_res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
        check_res_or_raise(updated_res, "fetching updated property")
        return Property(**updated_res.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error updating property: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.delete("/properties/{property_id}")
def delete_property(property_id: str, current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").select("*").eq("id", property_id).limit(1).execute()
        check_res_or_raise(res, "fetching property for delete")
        prop = res.data[0] if res.data else None
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        if prop["owner_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        delete_res = supabase.table("properties").delete().eq("id", property_id).execute()
        check_res_or_raise(delete_res, "deleting property")
        return {"message": "Property deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error deleting property: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

# --------------------------------
# Favorites
# --------------------------------
@api_router.post("/favorites")
def add_favorite(favorite_data: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        existing = supabase.table("favorites").select("*").eq("user_id", current_user["id"]).eq("property_id", favorite_data.property_id).execute()
        check_res_or_raise(existing, "checking favorite")
        if existing.data:
            return {"message": "Already in favorites"}
        favorite_id = str(uuid.uuid4())
        favorite_doc = {
            "id": favorite_id,
            "user_id": current_user["id"],
            "property_id": favorite_data.property_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        insert_res = supabase.table("favorites").insert(favorite_doc).execute()
        check_res_or_raise(insert_res, "inserting favorite")
        return {"message": "Added to favorites", "id": favorite_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error adding favorite: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/favorites")
def get_favorites(current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        fav_res = supabase.table("favorites").select("*").eq("user_id", current_user["id"]).execute()
        check_res_or_raise(fav_res, "fetching favorites")
        property_ids = [fav["property_id"] for fav in (fav_res.data or [])]
        if not property_ids:
            return []
        prop_res = supabase.table("properties").select("*").in_("id", property_ids).execute()
        check_res_or_raise(prop_res, "fetching favorite properties")
        return prop_res.data or []
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching favorites: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.delete("/favorites/{property_id}")
def remove_favorite(property_id: str, current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("favorites").delete().eq("user_id", current_user["id"]).eq("property_id", property_id).execute()
        check_res_or_raise(res, "deleting favorite")
        if not (res.data and len(res.data) > 0):
            raise HTTPException(status_code=404, detail="Favorite not found")
        return {"message": "Removed from favorites"}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error removing favorite: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

# --------------------------------
# Inquiries
# --------------------------------
@api_router.post("/inquiries")
def create_inquiry(inquiry_data: InquiryCreate, current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").select("*").eq("id", inquiry_data.property_id).limit(1).execute()
        check_res_or_raise(res, "fetching property for inquiry")
        prop = res.data[0] if res.data else None
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        inquiry_id = str(uuid.uuid4())
        inquiry_doc = {
            "id": inquiry_id,
            "from_user_id": current_user["id"],
            "from_user_name": current_user.get("name"),
            "to_user_id": prop["owner_id"],
            "property_id": inquiry_data.property_id,
            "message": inquiry_data.message,
            "read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        insert_res = supabase.table("inquiries").insert(inquiry_doc).execute()
        check_res_or_raise(insert_res, "inserting inquiry")
        return {"message": "Inquiry sent successfully", "id": inquiry_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error creating inquiry: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/inquiries")
def get_inquiries(current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        # supabase or_ usage: .or_("from_user_id.eq.{id},to_user_id.eq.{id}")
        expr = f"from_user_id.eq.{current_user['id']},to_user_id.eq.{current_user['id']}"
        res = supabase.table("inquiries").select("*").or_(expr).order("created_at", desc=True).limit(100).execute()
        check_res_or_raise(res, "fetching inquiries")
        return res.data or []
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching inquiries: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

# --------------------------------
# Appointments
# --------------------------------
@api_router.post("/appointments")
def create_appointment(appointment_data: AppointmentCreate, current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").select("*").eq("id", appointment_data.property_id).limit(1).execute()
        check_res_or_raise(res, "fetching property for appointment")
        prop = res.data[0] if res.data else None
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        appointment_id = str(uuid.uuid4())
        appointment_doc = {
            "id": appointment_id,
            "user_id": current_user["id"],
            "user_name": current_user.get("name"),
            "user_phone": current_user.get("phone"),
            "property_id": appointment_data.property_id,
            "property_title": prop.get("title"),
            "date": appointment_data.date,
            "time": appointment_data.time,
            "message": appointment_data.message,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        insert_res = supabase.table("appointments").insert(appointment_doc).execute()
        check_res_or_raise(insert_res, "inserting appointment")
        return {"message": "Appointment scheduled successfully", "id": appointment_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error creating appointment: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/appointments")
def get_appointments(current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("appointments").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).limit(100).execute()
        check_res_or_raise(res, "fetching appointments")
        return res.data or []
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching appointments: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

# --------------------------------
# Dashboards
# --------------------------------
@api_router.get("/dashboard/user")
def get_user_dashboard(current_user: dict = Depends(get_current_user)):
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        fav_res = supabase.table("favorites").select("*", count="exact").eq("user_id", current_user["id"]).execute()
        check_res_or_raise(fav_res, "fetching favorites count")
        app_res = supabase.table("appointments").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).limit(10).execute()
        check_res_or_raise(app_res, "fetching appointments")
        inq_res = supabase.table("inquiries").select("*").eq("from_user_id", current_user["id"]).order("created_at", desc=True).limit(10).execute()
        check_res_or_raise(inq_res, "fetching inquiries")
        return {
            "favorites_count": fav_res.count or 0,
            "appointments": app_res.data or [],
            "inquiries": inq_res.data or []
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching user dashboard: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/dashboard/agent")
def get_agent_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["agent", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        prop_res = supabase.table("properties").select("*").eq("owner_id", current_user["id"]).execute()
        check_res_or_raise(prop_res, "fetching agent properties")
        my_properties = prop_res.data or []
        inq_res = supabase.table("inquiries").select("*").eq("to_user_id", current_user["id"]).order("created_at", desc=True).limit(100).execute()
        check_res_or_raise(inq_res, "fetching agent inquiries")
        total_views = sum(prop.get("views", 0) for prop in my_properties)
        return {
            "total_listings": len(my_properties),
            "total_views": total_views,
            "total_inquiries": len(inq_res.data or []),
            "properties": my_properties,
            "inquiries": inq_res.data or []
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching agent dashboard: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.get("/dashboard/admin")
def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        total_props = supabase.table("properties").select("*", count="exact").execute()
        check_res_or_raise(total_props, "counting properties")
        pending_props = supabase.table("properties").select("*", count="exact").eq("status", "pending").execute()
        check_res_or_raise(pending_props, "counting pending properties")
        total_users = supabase.table("users").select("*", count="exact").execute()
        check_res_or_raise(total_users, "counting users")
        pending_list = supabase.table("properties").select("*").eq("status", "pending").order("created_at", desc=True).limit(50).execute()
        check_res_or_raise(pending_list, "fetching pending properties")
        return {
            "total_properties": total_props.count or 0,
            "pending_properties": pending_props.count or 0,
            "total_users": total_users.count or 0,
            "pending_list": pending_list.data or []
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching admin dashboard: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

@api_router.put("/admin/properties/{property_id}/status")
def update_property_status(
    property_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    if supabase is None:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        res = supabase.table("properties").update({"status": status, "verified": status == "approved"}).eq("id", property_id).execute()
        check_res_or_raise(res, "updating property status")
        if not (res.data and len(res.data) > 0):
            raise HTTPException(status_code=404, detail="Property not found")
        return {"message": f"Property {status} successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error updating property status: %s", e)
        detail = str(e) if DEBUG else "Internal server error"
        raise HTTPException(status_code=500, detail=detail)

# include router
app.include_router(api_router)
