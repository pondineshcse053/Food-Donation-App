from datetime import datetime
from sqlalchemy.orm import Session
from .. import models


STATUS_MAPPING = {
    "CREATED": ("Donation Created", "Food donation listing posted by donor"),
    "NGO_ACCEPTED": ("NGO Accepted", "Designated NGO has accepted the food donation"),
    "VOLUNTEER_ASSIGNED": ("Volunteer Assigned", "Volunteer assigned for pickup and transit"),
    "PICKED_UP": ("Food Picked Up", "Volunteer has collected the food packages from donor"),
    "ON_THE_WAY": ("On The Way", "Food is in transit to the redistribution center"),
    "DELIVERED": ("Delivered", "Volunteer reached destination and handed over packages"),
    "COMPLETED": ("NGO Confirmed", "NGO confirmed receipt and quality. Donation fulfilled."),
    "CANCELLED": ("Cancelled", "Donation was cancelled")
}


def add_tracking_entry(
    donation: models.Donation,
    new_status: str,
    db: Session,
    updated_by: str = "System",
    description: str = None,
    lat: float = None,
    lng: float = None
):
    """
    Appends a new tracking checkpoint and dispatches contextual notifications.
    """
    label, default_desc = STATUS_MAPPING.get(new_status, (new_status.replace("_", " ").title(), "Status updated"))
    desc = description or default_desc

    tracking_step = models.DonationTracking(
        donation_id=donation.id,
        status=new_status,
        status_label=label,
        description=desc,
        location_lat=lat or donation.latitude,
        location_lng=lng or donation.longitude,
        updated_by=updated_by,
        timestamp=datetime.utcnow()
    )
    db.add(tracking_step)

    # Dispatches Notifications
    if new_status == "NGO_ACCEPTED" and donation.ngo:
        db.add(models.Notification(
            user_id=donation.donor_id,
            title="Donation Accepted",
            message=f"Your donation {donation.donation_code} ({donation.food_name}) has been accepted by {donation.ngo.name}.",
            type="SUCCESS",
            link=f"/track/{donation.donation_code}"
        ))
    elif new_status == "VOLUNTEER_ASSIGNED" and donation.volunteer:
        # Notify Volunteer
        if donation.volunteer.user_id:
            db.add(models.Notification(
                user_id=donation.volunteer.user_id,
                title="New Pickup Assigned",
                message=f"Pickup assigned for {donation.donation_code} ({donation.food_name}) from {donation.pickup_address}.",
                type="ACTION",
                link=f"/track/{donation.donation_code}"
            ))
        # Notify Donor
        db.add(models.Notification(
            user_id=donation.donor_id,
            title="Volunteer Assigned",
            message=f"Volunteer {donation.volunteer.name} assigned to pick up donation {donation.donation_code}.",
            type="INFO",
            link=f"/track/{donation.donation_code}"
        ))
    elif new_status == "PICKED_UP":
        if donation.ngo and donation.ngo.user_id:
            db.add(models.Notification(
                user_id=donation.ngo.user_id,
                title="Food Picked Up",
                message=f"Donation {donation.donation_code} is picked up and en route to your facility.",
                type="INFO",
                link=f"/track/{donation.donation_code}"
            ))
    elif new_status == "DELIVERED":
        if donation.ngo and donation.ngo.user_id:
            db.add(models.Notification(
                user_id=donation.ngo.user_id,
                title="Food Delivery Arrived",
                message=f"Donation {donation.donation_code} has arrived at your shelter. Please confirm receipt.",
                type="ALERT",
                link=f"/ngo/verify/{donation.id}"
            ))
    elif new_status == "COMPLETED":
        # Increment volunteer completed deliveries
        if donation.volunteer:
            donation.volunteer.completed_deliveries = (donation.volunteer.completed_deliveries or 0) + 1
        
        # Notify Donor
        db.add(models.Notification(
            user_id=donation.donor_id,
            title="Donation Completed! 🎉",
            message=f"Your generous donation {donation.donation_code} ({donation.food_name}) was successfully received and served. Thank you for rescuing food!",
            type="SUCCESS",
            link=f"/track/{donation.donation_code}"
        ))

    db.commit()
    db.refresh(donation)
    return donation
