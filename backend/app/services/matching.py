import math
from typing import List
from sqlalchemy.orm import Session
from .. import models, schemas


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees) -> Returns kilometers.
    """
    # Earth radius in kilometers
    R = 6371.0

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    distance = R * c
    return round(distance, 2)


def get_recommended_ngos_for_donation(donation: models.Donation, db: Session) -> List[schemas.RecommendedNGO]:
    """
    Smart Multi-Criteria NGO Matching Algorithm:
    Evaluates Distance, Food Requirement Match, Real-time Capacity, and Urgency Boost.
    """
    ngos = db.query(models.NGO).filter(models.NGO.is_active == True).all()
    results = []

    donor_lat = donation.latitude or 13.0827
    donor_lng = donation.longitude or 80.2707
    food_type_lower = (donation.food_type or "").lower()
    donation_packets = donation.number_of_packets or int(donation.quantity or 10)

    for ngo in ngos:
        # 1. Geographic Distance
        dist_km = calculate_haversine_distance(donor_lat, donor_lng, ngo.latitude, ngo.longitude)

        # Distance Score: closer is significantly higher (max 100)
        # 0 km -> 100, 5 km -> 70, 15 km -> 25
        distance_score = max(5.0, 100.0 * math.exp(-dist_km / 7.5))

        # 2. Capacity Score (max 100)
        # Ideal if NGO capacity is adequate for this batch
        ngo_cap = ngo.capacity or 80
        if ngo_cap >= donation_packets:
            # Capacity fits well
            ratio = min(1.5, ngo_cap / max(1, donation_packets))
            capacity_score = min(100.0, 80.0 + (10.0 * ratio))
        else:
            # Under capacity
            deficit_ratio = ngo_cap / max(1, donation_packets)
            capacity_score = max(20.0, 80.0 * deficit_ratio)

        # 3. Requirement Match Score (max 100)
        ngo_reqs = (ngo.food_requirements or "").lower()
        if food_type_lower in ngo_reqs or "any" in ngo_reqs or "all" in ngo_reqs:
            requirement_score = 95.0
        elif any(req.strip() in food_type_lower for req in ngo_reqs.split(",")):
            requirement_score = 85.0
        else:
            requirement_score = 55.0

        # 4. Urgency Factor Score (max 100)
        priority = (donation.priority or "MEDIUM").upper()
        if priority == "URGENT":
            # For urgent food, distance is penalized more heavily if far
            urgency_score = 100.0 if dist_km < 4.0 else (75.0 if dist_km < 8.0 else 40.0)
        elif priority == "HIGH":
            urgency_score = 90.0 if dist_km < 6.0 else 60.0
        elif priority == "MEDIUM":
            urgency_score = 75.0
        else:
            urgency_score = 70.0

        # Weighted Total Score:
        # Distance (35%), Requirement (25%), Capacity (25%), Urgency (15%)
        total_score = round(
            (distance_score * 0.35) +
            (capacity_score * 0.25) +
            (requirement_score * 0.25) +
            (urgency_score * 0.15),
            1
        )

        # Determine human-readable reason
        reasons = []
        if dist_km <= 3.0:
            reasons.append(f"Nearby facility ({dist_km} km)")
        elif dist_km <= 7.0:
            reasons.append(f"Within service radius ({dist_km} km)")
        
        if ngo_cap >= donation_packets:
            reasons.append(f"Capacity available ({ngo_cap} pkts)")
        
        if food_type_lower in ngo_reqs:
            reasons.append(f"Matches demand for {donation.food_type}")

        reason_str = ", ".join(reasons) if reasons else f"Redistribution facility {dist_km} km away"

        results.append(schemas.RecommendedNGO(
            ngo_id=ngo.id,
            ngo_name=ngo.name,
            contact_person=ngo.contact_person,
            phone=ngo.phone,
            email=ngo.email,
            address=ngo.address,
            latitude=ngo.latitude,
            longitude=ngo.longitude,
            distance_km=dist_km,
            capacity=ngo.capacity,
            capacity_score=round(capacity_score, 1),
            distance_score=round(distance_score, 1),
            requirement_score=round(requirement_score, 1),
            urgency_score=round(urgency_score, 1),
            total_match_score=total_score,
            compatibility_reason=reason_str
        ))

    # Sort descending by total_match_score
    results.sort(key=lambda item: item.total_match_score, reverse=True)
    return results
