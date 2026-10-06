import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth
from ..ai.priority import calculate_ai_priority
from ..services.matching import get_recommended_ngos_for_donation
from ..services.tracking import add_tracking_entry

router = APIRouter(prefix="/donations", tags=["Donations"])


def generate_donation_code(db: Session) -> str:
    year = datetime.now().year
    count = db.query(models.Donation).count() + 1
    rand_suffix = random.randint(100, 999)
    return f"DON-{year}-{count:04d}{rand_suffix % 100:02d}"


@router.post("", response_model=schemas.DonationOut)
def create_donation(
    donation_in: schemas.DonationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not donation_in.food_name.strip():
        raise HTTPException(status_code=400, detail="Food name is required.")
    if donation_in.quantity <= 0:
        raise HTTPException(status_code=400, detail="Enter a valid quantity.")

    # 1. AI Food Priority Analysis
    ai_result = calculate_ai_priority(
        food_type=donation_in.food_type,
        quantity=donation_in.quantity,
        number_of_packets=donation_in.number_of_packets,
        prepared_date=donation_in.prepared_date,
        prepared_time=donation_in.prepared_time,
        available_until=donation_in.available_until
    )

    donation_code = generate_donation_code(db)

    # 2. Create Donation record
    donation = models.Donation(
        donation_code=donation_code,
        donor_id=current_user.id,
        donor_name=current_user.full_name,
        food_name=donation_in.food_name,
        food_type=donation_in.food_type,
        quantity=donation_in.quantity,
        number_of_packets=donation_in.number_of_packets,
        prepared_date=donation_in.prepared_date,
        prepared_time=donation_in.prepared_time,
        available_until=donation_in.available_until,
        food_description=donation_in.food_description,
        pickup_address=donation_in.pickup_address,
        latitude=donation_in.latitude,
        longitude=donation_in.longitude,
        food_image_url=donation_in.food_image_url,
        priority=ai_result["priority"],
        priority_reason=ai_result["priority_reason"],
        priority_recommendation=ai_result["priority_recommendation"],
        priority_score=ai_result["priority_score"],
        status="CREATED"
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)

    # 3. Add initial tracking step
    add_tracking_entry(
        donation=donation,
        new_status="CREATED",
        db=db,
        updated_by=current_user.full_name,
        description=f"Donation posted by {current_user.full_name}. AI assigned {donation.priority} priority.",
        lat=donation.latitude,
        lng=donation.longitude
    )

    # 4. Notify donor
    db.add(models.Notification(
        user_id=current_user.id,
        title="Donation Created Successfully",
        message=f"Donation {donation.donation_code} created! Priority: {donation.priority}.",
        type="SUCCESS",
        link=f"/track/{donation.donation_code}"
    ))

    # Notify all active NGOs about newly available food
    ngos = db.query(models.NGO).filter(models.NGO.is_active == True).all()
    for ngo in ngos:
        if ngo.user_id:
            db.add(models.Notification(
                user_id=ngo.user_id,
                title="New Food Donation Available",
                message=f"{donation.food_name} ({donation.number_of_packets} pkts) is available nearby. Priority: {donation.priority}.",
                type="INFO",
                link="/ngo/available"
            ))
    db.commit()
    db.refresh(donation)

    return donation


@router.get("", response_model=List[schemas.DonationOut])
def get_donations(
    status: Optional[str] = None,
    donor_id: Optional[int] = None,
    ngo_id: Optional[int] = None,
    volunteer_id: Optional[int] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Donation)
    if status:
        query = query.filter(models.Donation.status == status)
    if donor_id:
        query = query.filter(models.Donation.donor_id == donor_id)
    if ngo_id:
        query = query.filter(models.Donation.ngo_id == ngo_id)
    if volunteer_id:
        query = query.filter(models.Donation.volunteer_id == volunteer_id)
    if priority:
        query = query.filter(models.Donation.priority == priority)

    return query.order_by(models.Donation.created_at.desc()).all()


@router.get("/{id}", response_model=schemas.DonationOut)
def get_donation_by_id(id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation


@router.get("/by-code/{code}", response_model=schemas.DonationOut)
def get_donation_by_code(code: str, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.donation_code == code).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation


@router.get("/{id}/recommended-ngos", response_model=List[schemas.RecommendedNGO])
def get_recommended_ngos(id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    recommended = get_recommended_ngos_for_donation(donation, db)
    return recommended


@router.put("/{id}/status", response_model=schemas.DonationOut)
def update_donation_status(
    id: int,
    status_update: schemas.DonationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    donation = db.query(models.Donation).filter(models.Donation.id == id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    new_status = status_update.status.upper()
    donation.status = new_status

    if status_update.ngo_id:
        donation.ngo_id = status_update.ngo_id
    if status_update.volunteer_id:
        donation.volunteer_id = status_update.volunteer_id

    # If current user is NGO accepting donation
    if new_status == "NGO_ACCEPTED" and current_user.role == "NGO":
        ngo = db.query(models.NGO).filter(models.NGO.user_id == current_user.id).first()
        if ngo:
            donation.ngo_id = ngo.id

    # If current user is Volunteer accepting pickup
    if new_status == "VOLUNTEER_ASSIGNED" and current_user.role == "VOLUNTEER":
        volunteer = db.query(models.Volunteer).filter(models.Volunteer.user_id == current_user.id).first()
        if volunteer:
            donation.volunteer_id = volunteer.id

    db.commit()
    db.refresh(donation)

    # Record tracking checkpoint
    desc = status_update.notes or f"Updated status to {new_status} by {current_user.full_name} ({current_user.role})"
    add_tracking_entry(
        donation=donation,
        new_status=new_status,
        db=db,
        updated_by=current_user.full_name,
        description=desc,
        lat=status_update.location_lat or donation.latitude,
        lng=status_update.location_lng or donation.longitude
    )

    db.refresh(donation)
    return donation
