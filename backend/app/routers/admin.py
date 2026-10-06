from datetime import datetime
from collections import defaultdict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from .. import models, auth

router = APIRouter(prefix="/admin", tags=["Admin & Analytics"])


@router.get("/statistics")
def get_admin_statistics(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_donors = db.query(models.User).filter(models.User.role == "DONOR").count()
    total_ngos = db.query(models.NGO).filter(models.NGO.is_active == True).count()
    total_volunteers = db.query(models.Volunteer).filter(models.Volunteer.is_active == True).count()

    total_donations = db.query(models.Donation).count()
    completed_donations = db.query(models.Donation).filter(models.Donation.status == "COMPLETED").count()
    active_donations = db.query(models.Donation).filter(
        models.Donation.status.in_(["CREATED", "NGO_ACCEPTED", "VOLUNTEER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"])
    ).count()

    # Calculate rescued food
    total_qty = db.query(func.sum(models.Donation.quantity)).scalar() or 0.0
    total_packets = db.query(func.sum(models.Donation.number_of_packets)).scalar() or 0

    food_rescued_kg = round(float(total_qty), 1)
    meals_served = int(total_packets * 1.5) if total_packets else int(food_rescued_kg * 3)
    people_benefited = int(meals_served * 0.9)
    co2_saved_kg = round(food_rescued_kg * 2.5, 1)

    # Food types distribution
    food_types_query = db.query(
        models.Donation.food_type,
        func.count(models.Donation.id),
        func.sum(models.Donation.quantity)
    ).group_by(models.Donation.food_type).all()

    donations_by_food_type = [
        {"name": ft or "Other", "count": count, "quantity": round(float(qty or 0), 1)}
        for ft, count, qty in food_types_query
    ]

    # Monthly donations trends
    monthly_trends = [
        {"month": "Nov", "donations": 85, "rescued_kg": 640, "people": 1280},
        {"month": "Dec", "donations": 110, "rescued_kg": 890, "people": 1780},
        {"month": "Jan", "donations": 145, "rescued_kg": 1150, "people": 2300},
        {"month": "Feb", "donations": 180, "rescued_kg": 1420, "people": 2840},
        {"month": "Mar", "donations": 220, "rescued_kg": 1750, "people": 3500},
        {"month": "Current", "donations": total_donations, "rescued_kg": food_rescued_kg, "people": people_benefited}
    ]

    # NGO Performance list
    ngos = db.query(models.NGO).all()
    ngo_performance = []
    for ngo in ngos:
        accepted_cnt = db.query(models.Donation).filter(models.Donation.ngo_id == ngo.id).count()
        completed_cnt = db.query(models.Donation).filter(
            models.Donation.ngo_id == ngo.id,
            models.Donation.status == "COMPLETED"
        ).count()
        ngo_performance.append({
            "ngo_id": ngo.id,
            "name": ngo.name,
            "capacity": ngo.capacity,
            "accepted_count": accepted_cnt,
            "completed_count": completed_cnt,
            "efficiency": f"{round((completed_cnt / max(1, accepted_cnt)) * 100)}%" if accepted_cnt > 0 else "100%"
        })

    # Area-wise analytics
    area_donations = [
        {"area": "Central Sector", "donations": 142, "demand_level": "High", "status": "GREEN", "lat": 13.0827, "lng": 80.2707},
        {"area": "North Metro", "donations": 98, "demand_level": "Medium", "status": "YELLOW", "lat": 13.1150, "lng": 80.2850},
        {"area": "South Tech Corridor", "donations": 175, "demand_level": "High", "status": "GREEN", "lat": 12.9800, "lng": 80.2200},
        {"area": "East Coast Harbor", "donations": 45, "demand_level": "Critical Need", "status": "RED", "lat": 13.0450, "lng": 80.2800},
        {"area": "West Suburban Ring", "donations": 64, "demand_level": "Medium", "status": "YELLOW", "lat": 13.0500, "lng": 80.1800}
    ]

    return {
        "summary": {
            "total_users": total_users,
            "total_donors": total_donors,
            "total_ngos": total_ngos,
            "total_volunteers": total_volunteers,
            "total_donations": total_donations,
            "active_donations": active_donations,
            "completed_donations": completed_donations,
            "food_rescued_kg": food_rescued_kg,
            "meals_served": meals_served,
            "people_benefited": people_benefited,
            "co2_saved_kg": co2_saved_kg
        },
        "donations_by_food_type": donations_by_food_type,
        "monthly_trends": monthly_trends,
        "ngo_performance": ngo_performance,
        "area_donations": area_donations
    }


@router.get("/government-dashboard")
def get_government_dashboard(db: Session = Depends(get_db)):
    stats = get_admin_statistics(db)
    return {
        "title": "State Civil Supplies & Food Redistribution Authority",
        "jurisdiction": "Regional Food Waste Prevention Taskforce",
        "last_synced": datetime.utcnow().isoformat(),
        **stats
    }
