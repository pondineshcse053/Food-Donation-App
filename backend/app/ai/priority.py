from datetime import datetime, time
import math

# Perishability index by food type (scale 0.1 to 1.0)
FOOD_PERISHABILITY = {
    "Cooked Meals": 0.95,
    "Rice": 0.85,
    "Chapati": 0.80,
    "Vegetables": 0.65,
    "Fruits": 0.50,
    "Snacks": 0.30,
    "Other": 0.60
}


def parse_time_or_default(time_str: str) -> datetime:
    """Helper to parse time string like '14:30' or '2:30 PM' or ISO datetime"""
    now = datetime.now()
    if not time_str:
        return now

    try:
        if "T" in time_str or len(time_str) > 10 and "-" in time_str:
            return datetime.fromisoformat(time_str.replace("Z", ""))
        
        # Check standard 24-hr or 12-hr format
        for fmt in ("%H:%M", "%I:%M %p", "%I:%M%p", "%H:%M:%S"):
            try:
                t = datetime.strptime(time_str.strip(), fmt).time()
                return datetime.combine(now.date(), t)
            except ValueError:
                continue
    except Exception:
        pass
    return now


def calculate_ai_priority(
    food_type: str,
    quantity: float,
    number_of_packets: int,
    prepared_date: str,
    prepared_time: str,
    available_until: str
) -> dict:
    """
    AI Decision-Support System: Calculates food urgency, priority level, score, reason, and recommendations.
    Combines Perishability Matrix, Time-to-Expiry, Quantity Hazard, and Urgency Decay.
    """
    perishability = FOOD_PERISHABILITY.get(food_type, 0.65)
    now = datetime.now()

    # Calculate hours since prepared
    prep_dt = parse_time_or_default(prepared_time)
    hours_since_prep = max(0.2, (now - prep_dt).total_seconds() / 3600.0)
    if hours_since_prep > 24:
        # Fallback if prepared date is today
        hours_since_prep = 2.0

    # Calculate remaining usable hours until available_until
    until_dt = parse_time_or_default(available_until)
    hours_remaining = (until_dt - now).total_seconds() / 3600.0
    if hours_remaining <= 0:
        hours_remaining = 0.5  # critically close to expiry

    # Feature engineering for decision score
    # Score 0 to 100
    # Higher score = more urgent
    urgency_factor = max(0.0, 1.0 - (hours_remaining / 6.0))  # higher as hours_remaining shrinks
    elapsed_factor = min(1.0, hours_since_prep / 6.0)         # higher as food gets older
    quantity_factor = min(1.0, number_of_packets / 150.0)    # larger bulk orders need faster logistics

    # Combined composite score
    base_score = (
        (urgency_factor * 45.0) +
        (perishability * 30.0) +
        (elapsed_factor * 15.0) +
        (quantity_factor * 10.0)
    )
    score = min(99.0, max(15.0, round(base_score, 1)))

    # Classification
    if hours_remaining <= 1.5 or score >= 80:
        priority = "URGENT"
        reason = f"Critical expiry window ({round(hours_remaining, 1)} hrs remaining) for highly perishable {food_type}."
        recommendation = "Immediate volunteer dispatch required. Fast-track NGO pickup."
    elif hours_remaining <= 3.5 or score >= 60:
        priority = "HIGH"
        reason = f"{food_type} prepared {round(hours_since_prep, 1)} hours ago with limited shelf-life remaining."
        recommendation = "Arrange pickup within 60-90 minutes to ensure fresh redistribution."
    elif hours_remaining <= 6.0 or score >= 40:
        priority = "MEDIUM"
        reason = f"Normal consumption window available ({round(hours_remaining, 1)} hrs). Stable condition."
        recommendation = "Schedule regular NGO batch pickup within optimal transport window."
    else:
        priority = "LOW"
        reason = f"Ample preservation window (>6 hours) with stable food characteristics."
        recommendation = "Can be queued for standard daily collection route."

    return {
        "priority": priority,
        "priority_score": score,
        "priority_reason": reason,
        "priority_recommendation": recommendation,
        "hours_remaining": round(hours_remaining, 1),
        "hours_since_prep": round(hours_since_prep, 1),
        "perishability_index": perishability
    }
