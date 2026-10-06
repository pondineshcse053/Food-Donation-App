from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# ==================== User & Auth Schemas ====================
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str = "DONOR"  # DONOR, NGO, VOLUNTEER, ADMIN


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# ==================== NGO Schemas ====================
class NGOBase(BaseModel):
    name: str
    contact_person: str
    phone: str
    email: EmailStr
    address: str
    capacity: int = 100
    food_requirements: str = "Cooked Meals, Rice, Chapati, Vegetables"
    latitude: float = 13.0827
    longitude: float = 80.2707


class NGOCreate(NGOBase):
    user_id: Optional[int] = None


class NGOUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    capacity: Optional[int] = None
    food_requirements: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: Optional[bool] = None


class NGOOut(NGOBase):
    id: int
    user_id: Optional[int] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Volunteer Schemas ====================
class VolunteerBase(BaseModel):
    name: str
    phone: str
    availability: str = "AVAILABLE"  # AVAILABLE, BUSY, OFFLINE
    vehicle_type: str = "Motorcycle/Van"
    latitude: float = 13.0827
    longitude: float = 80.2707


class VolunteerCreate(VolunteerBase):
    user_id: Optional[int] = None


class VolunteerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    availability: Optional[str] = None
    vehicle_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: Optional[bool] = None


class VolunteerOut(VolunteerBase):
    id: int
    user_id: Optional[int] = None
    completed_deliveries: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Tracking Schemas ====================
class TrackingCreate(BaseModel):
    status: str
    status_label: str
    description: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    updated_by: Optional[str] = None


class TrackingOut(BaseModel):
    id: int
    donation_id: int
    status: str
    status_label: str
    description: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    updated_by: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


# ==================== Donation Schemas ====================
class DonationCreate(BaseModel):
    food_name: str
    food_type: str
    quantity: float
    number_of_packets: int
    prepared_date: str
    prepared_time: str
    available_until: str
    food_description: Optional[str] = None
    pickup_address: str
    latitude: float = 13.0827
    longitude: float = 80.2707
    food_image_url: Optional[str] = None


class DonationStatusUpdate(BaseModel):
    status: str
    ngo_id: Optional[int] = None
    volunteer_id: Optional[int] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    notes: Optional[str] = None


class DonationOut(BaseModel):
    id: int
    donation_code: str
    donor_id: int
    donor_name: str
    food_name: str
    food_type: str
    quantity: float
    number_of_packets: int
    prepared_date: str
    prepared_time: str
    available_until: str
    food_description: Optional[str] = None
    pickup_address: str
    latitude: float
    longitude: float
    food_image_url: Optional[str] = None

    priority: str
    priority_reason: Optional[str] = None
    priority_recommendation: Optional[str] = None
    priority_score: float
    status: str

    ngo_id: Optional[int] = None
    volunteer_id: Optional[int] = None
    ngo: Optional[NGOOut] = None
    volunteer: Optional[VolunteerOut] = None
    tracking_steps: List[TrackingOut] = []

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Matching & Recommendation Schemas ====================
class RecommendedNGO(BaseModel):
    ngo_id: int
    ngo_name: str
    contact_person: str
    phone: str
    email: str
    address: str
    latitude: float
    longitude: float
    distance_km: float
    capacity: int
    capacity_score: float
    distance_score: float
    requirement_score: float
    urgency_score: float
    total_match_score: float
    compatibility_reason: str


# ==================== Notification Schemas ====================
class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Impact & Stats Schemas ====================
class StatsSummary(BaseModel):
    total_users: int
    total_donors: int
    total_ngos: int
    total_volunteers: int
    total_donations: int
    active_donations: int
    completed_donations: int
    food_rescued_kg: float
    meals_served: int
    people_benefited: int
    co2_saved_kg: float
