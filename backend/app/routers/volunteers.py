from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth
from ..services.tracking import add_tracking_entry

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])


class AssignVolunteerIn(BaseModel):
    donation_id: int
    volunteer_id: int


@router.get("", response_model=List[schemas.VolunteerOut])
def get_volunteers(
    availability: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Volunteer)
    if availability:
        query = query.filter(models.Volunteer.availability == availability)
    if is_active is not None:
        query = query.filter(models.Volunteer.is_active == is_active)
    return query.all()


@router.get("/{id}", response_model=schemas.VolunteerOut)
def get_volunteer(id: int, db: Session = Depends(get_db)):
    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return volunteer


@router.put("/{id}", response_model=schemas.VolunteerOut)
def update_volunteer(
    id: int,
    vol_update: schemas.VolunteerUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    update_data = vol_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(volunteer, field, val)

    db.commit()
    db.refresh(volunteer)
    return volunteer


@router.post("/assign")
def assign_volunteer(
    assign_in: AssignVolunteerIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    donation = db.query(models.Donation).filter(models.Donation.id == assign_in.donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == assign_in.volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    donation.volunteer_id = volunteer.id
    donation.status = "VOLUNTEER_ASSIGNED"
    db.commit()
    db.refresh(donation)

    add_tracking_entry(
        donation=donation,
        new_status="VOLUNTEER_ASSIGNED",
        db=db,
        updated_by=current_user.full_name,
        description=f"Volunteer {volunteer.name} assigned for transit logistics",
        lat=volunteer.latitude,
        lng=volunteer.longitude
    )

    return {"message": "Volunteer assigned successfully", "donation_code": donation.donation_code}
