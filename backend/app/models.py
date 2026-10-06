from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False, default="DONOR")  # DONOR, NGO, VOLUNTEER, ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    donations = relationship("Donation", back_populates="donor", foreign_keys="Donation.donor_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    ngo_profile = relationship("NGO", back_populates="user", uselist=False)
    volunteer_profile = relationship("Volunteer", back_populates="user", uselist=False)


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False, index=True)
    contact_person = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    capacity = Column(Integer, default=100)  # packets capacity
    food_requirements = Column(String(500), default="Cooked Meals, Rice, Chapati, Vegetables")
    latitude = Column(Float, nullable=False, default=13.0827)
    longitude = Column(Float, nullable=False, default=80.2707)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ngo_profile")
    donations = relationship("Donation", back_populates="ngo")
    requirements = relationship("FoodRequirement", back_populates="ngo", cascade="all, delete-orphan")


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    availability = Column(String(50), default="AVAILABLE")  # AVAILABLE, BUSY, OFFLINE
    vehicle_type = Column(String(100), default="Motorcycle/Van")
    latitude = Column(Float, nullable=False, default=13.0827)
    longitude = Column(Float, nullable=False, default=80.2707)
    completed_deliveries = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="volunteer_profile")
    donations = relationship("Donation", back_populates="volunteer")


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donation_code = Column(String(100), unique=True, index=True, nullable=False)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    donor_name = Column(String(255), nullable=False)

    food_name = Column(String(255), nullable=False)
    food_type = Column(String(100), nullable=False)  # Cooked Meals, Rice, Chapati, Vegetables, Snacks, Fruits, Other
    quantity = Column(Float, nullable=False)  # in kg or units
    number_of_packets = Column(Integer, nullable=False, default=1)
    prepared_date = Column(String(50), nullable=False)
    prepared_time = Column(String(50), nullable=False)
    available_until = Column(String(50), nullable=False)
    food_description = Column(Text, nullable=True)
    pickup_address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False, default=13.0827)
    longitude = Column(Float, nullable=False, default=80.2707)
    food_image_url = Column(String(1000), nullable=True)

    # AI Priority fields
    priority = Column(String(50), default="MEDIUM")  # LOW, MEDIUM, HIGH, URGENT
    priority_reason = Column(String(500), nullable=True)
    priority_recommendation = Column(String(500), nullable=True)
    priority_score = Column(Float, default=50.0)

    # Lifecycle status
    # CREATED -> NGO_ACCEPTED -> VOLUNTEER_ASSIGNED -> PICKED_UP -> ON_THE_WAY -> DELIVERED -> COMPLETED / CANCELLED
    status = Column(String(50), default="CREATED", index=True)

    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    donor = relationship("User", back_populates="donations", foreign_keys=[donor_id])
    ngo = relationship("NGO", back_populates="donations")
    volunteer = relationship("Volunteer", back_populates="donations")
    tracking_steps = relationship("DonationTracking", back_populates="donation", cascade="all, delete-orphan", order_by="DonationTracking.timestamp")


class DonationTracking(Base):
    __tablename__ = "donation_tracking"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=False)
    status = Column(String(50), nullable=False)
    status_label = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    updated_by = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    donation = relationship("Donation", back_populates="tracking_steps")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # INFO, SUCCESS, ALERT, ACTION
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class FoodRequirement(Base):
    __tablename__ = "food_requirements"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    food_type = Column(String(100), nullable=False)
    quantity_needed = Column(Integer, nullable=False)
    urgency_level = Column(String(50), default="NORMAL")
    created_at = Column(DateTime, default=datetime.utcnow)

    ngo = relationship("NGO", back_populates="requirements")


class ImpactStatistic(Base):
    __tablename__ = "impact_statistics"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(50), nullable=False)  # e.g., "Jan 2026"
    food_rescued_kg = Column(Float, default=0.0)
    meals_served = Column(Integer, default=0)
    people_benefited = Column(Integer, default=0)
    donations_completed = Column(Integer, default=0)
    co2_saved_kg = Column(Float, default=0.0)
