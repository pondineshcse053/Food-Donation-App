from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth
from ..services.tracking import add_tracking_entry

router = APIRouter(prefix="/tracking", tags=["Tracking"])


@router.get("/{donation_id}", response_model=List[schemas.TrackingOut])
def get_donation_tracking(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    steps = db.query(models.DonationTracking).filter(
        models.DonationTracking.donation_id == donation_id
    ).order_by(models.DonationTracking.timestamp.asc()).all()
    return steps


@router.put("/{donation_id}", response_model=schemas.DonationOut)
def update_tracking_status(
    donation_id: int,
    status_update: schemas.DonationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    new_status = status_update.status.upper()
    donation.status = new_status

    if status_update.volunteer_id:
        donation.volunteer_id = status_update.volunteer_id
    if status_update.ngo_id:
        donation.ngo_id = status_update.ngo_id

    db.commit()
    db.refresh(donation)

    desc = status_update.notes or f"Status shifted to {new_status} by {current_user.full_name}"
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


@router.get("/{donation_id}/map-data")
def get_map_data(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    donor_loc = {
        "title": f"Donor: {donation.donor_name}",
        "address": donation.pickup_address,
        "lat": donation.latitude,
        "lng": donation.longitude,
        "type": "DONOR"
    }

    ngo_loc = None
    if donation.ngo:
        ngo_loc = {
            "title": f"NGO: {donation.ngo.name}",
            "address": donation.ngo.address,
            "lat": donation.ngo.latitude,
            "lng": donation.ngo.longitude,
            "type": "NGO"
        }
    else:
        # Default target if NGO not yet confirmed
        ngo_loc = {
            "title": "Redistribution Hub (Pending assignment)",
            "address": "Community Food Bank, Center",
            "lat": donation.latitude + 0.025,
            "lng": donation.longitude + 0.020,
            "type": "NGO"
        }

    volunteer_loc = None
    if donation.volunteer:
        volunteer_loc = {
            "title": f"Volunteer: {donation.volunteer.name}",
            "vehicle": donation.volunteer.vehicle_type,
            "lat": donation.volunteer.latitude,
            "lng": donation.volunteer.longitude,
            "type": "VOLUNTEER"
        }
    else:
        volunteer_loc = {
            "title": "Volunteer Dispatch Point",
            "vehicle": "Delivery Vehicle",
            "lat": donation.latitude - 0.012,
            "lng": donation.longitude + 0.008,
            "type": "VOLUNTEER"
        }

    return {
        "donation_id": donation.id,
        "donation_code": donation.donation_code,
        "status": donation.status,
        "donor": donor_loc,
        "ngo": ngo_loc,
        "volunteer": volunteer_loc
    }
