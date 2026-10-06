from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from ..database import SessionLocal, engine, Base
from .. import models
from ..auth import get_password_hash
from ..ai.priority import calculate_ai_priority
from ..services.matching import calculate_haversine_distance
from ..services.tracking import add_tracking_entry


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(models.User).count() > 0:
        print("Database already contains data, skipping seed.")
        db.close()
        return

    print("Seeding database with comprehensive demo dataset...")

    # Default password for all demo accounts: 'password123'
    hashed_pwd = get_password_hash("password123")
    admin_pwd = get_password_hash("admin123")

    # 1. Admin Account
    admin_user = models.User(
        email="admin@example.com",
        hashed_password=admin_pwd,
        full_name="State Food Commissioner (Admin)",
        phone="+91 98765 00001",
        role="ADMIN",
        is_active=True
    )
    db.add(admin_user)

    # 2. Donors (5 Donors)
    donors_data = [
        {"name": "Anand Grand Banquet & Catering", "email": "donor@example.com", "phone": "+91 98401 11001", "addr": "12 Grand Avenue, T. Nagar, Chennai", "lat": 13.0418, "lng": 80.2341},
        {"name": "Royal Palace Wedding Hall", "email": "royalpalace@example.com", "phone": "+91 98401 11002", "addr": "45 Sterling Road, Nungambakkam, Chennai", "lat": 13.0610, "lng": 80.2405},
        {"name": "Spice Route Corporate Canteen", "email": "spiceroute@example.com", "phone": "+91 98401 11003", "addr": "DLF Cyber City, Mount Poonamallee Rd, Chennai", "lat": 13.0189, "lng": 80.1652},
        {"name": "Fresh Greens Supermarket & Deli", "email": "freshgreens@example.com", "phone": "+91 98401 11004", "addr": "88 Anna Nagar 2nd Avenue, Chennai", "lat": 13.0850, "lng": 80.2101},
        {"name": "Sunrise Bakery & Confectionery", "email": "sunrisebakery@example.com", "phone": "+91 98401 11005", "addr": "19 Besant Avenue, Adyar, Chennai", "lat": 13.0012, "lng": 80.2565},
    ]

    donor_users = []
    for d in donors_data:
        u = models.User(
            email=d["email"],
            hashed_password=hashed_pwd,
            full_name=d["name"],
            phone=d["phone"],
            role="DONOR",
            is_active=True
        )
        db.add(u)
        donor_users.append((u, d))
    db.commit()

    # 3. NGOs (5 NGOs)
    ngos_data = [
        {
            "name": "ABC Community Trust",
            "contact": "Kavitha Raman",
            "email": "ngo@example.com",
            "phone": "+91 94440 22001",
            "addr": "24 Karaneeswarar Pagoda St, Mylapore, Chennai",
            "cap": 120,
            "reqs": "Cooked Meals, Rice, Chapati, Vegetables",
            "lat": 13.0335,
            "lng": 80.2676
        },
        {
            "name": "XYZ Shelter & Relief Home",
            "contact": "Arun Prakash",
            "email": "xyzshelter@example.com",
            "phone": "+91 94440 22002",
            "addr": "71 New Avadi Road, Kilpauk, Chennai",
            "cap": 80,
            "reqs": "Meals, Chapati, Fruits, Vegetables",
            "lat": 13.0812,
            "lng": 80.2394
        },
        {
            "name": "Annapoorna Food Aid Mission",
            "contact": "Sister Mary Teresa",
            "email": "annapoorna@example.com",
            "phone": "+91 94440 22003",
            "addr": "15 Cathedral Garden Rd, Royapettah, Chennai",
            "cap": 150,
            "reqs": "Vegetable Rice, Meals, Chapati, Snacks",
            "lat": 13.0520,
            "lng": 80.2550
        },
        {
            "name": "Karunai Illam Orphanage & Care",
            "contact": "Dr. Senthil Nathan",
            "email": "karunai@example.com",
            "phone": "+91 94440 22004",
            "addr": "33 Gandhi Road, Velachery, Chennai",
            "cap": 90,
            "reqs": "Cooked Meals, Rice, Fruits, Milk/Snacks",
            "lat": 12.9815,
            "lng": 80.2180
        },
        {
            "name": "Seva Bharati Hunger Relief Hub",
            "contact": "Deepak Sharma",
            "email": "sevabharati@example.com",
            "phone": "+91 94440 22005",
            "addr": "52 Jawaharlal Nehru Rd, Koyambedu, Chennai",
            "cap": 200,
            "reqs": "Rice, Chapati, Vegetables, Meals, Other",
            "lat": 13.0710,
            "lng": 80.1945
        }
    ]

    ngo_models = []
    for ng in ngos_data:
        u = models.User(
            email=ng["email"],
            hashed_password=hashed_pwd,
            full_name=ng["name"],
            phone=ng["phone"],
            role="NGO",
            is_active=True
        )
        db.add(u)
        db.flush()

        ngo_obj = models.NGO(
            user_id=u.id,
            name=ng["name"],
            contact_person=ng["contact"],
            phone=ng["phone"],
            email=ng["email"],
            address=ng["addr"],
            capacity=ng["cap"],
            food_requirements=ng["reqs"],
            latitude=ng["lat"],
            longitude=ng["lng"],
            is_active=True
        )
        db.add(ngo_obj)
        db.flush()
        ngo_models.append(ngo_obj)
    db.commit()

    # 4. Volunteers (8 Volunteers)
    volunteers_data = [
        {"name": "Rajesh Kumar", "email": "volunteer@example.com", "phone": "+91 97910 33001", "vehicle": "Hero Splendor (Bike)", "lat": 13.0450, "lng": 80.2380, "avail": "AVAILABLE"},
        {"name": "Sneha Murugan", "email": "sneha.v@example.com", "phone": "+91 97910 33002", "vehicle": "Maruti Eeco Cargo Van", "lat": 13.0630, "lng": 80.2450, "avail": "AVAILABLE"},
        {"name": "Vignesh Sundaram", "email": "vignesh.s@example.com", "phone": "+91 97910 33003", "vehicle": "Honda Activa Scooter", "lat": 13.0800, "lng": 80.2150, "avail": "AVAILABLE"},
        {"name": "Pooja Venkat", "email": "pooja.v@example.com", "phone": "+91 97910 33004", "vehicle": "Tata Ace Mini Truck", "lat": 13.0150, "lng": 80.2000, "avail": "BUSY"},
        {"name": "Karthik Raja", "email": "karthik.r@example.com", "phone": "+91 97910 33005", "vehicle": "Bajaj Pulsar (Bike)", "lat": 13.0300, "lng": 80.2600, "avail": "AVAILABLE"},
        {"name": "Meera Krishnan", "email": "meera.k@example.com", "phone": "+91 97910 33006", "vehicle": "Mahindra Bolero Maxi", "lat": 13.0900, "lng": 80.2200, "avail": "AVAILABLE"},
        {"name": "Abdul Rahim", "email": "abdul.r@example.com", "phone": "+91 97910 33007", "vehicle": "TVS Jupiter Scooter", "lat": 12.9850, "lng": 80.2250, "avail": "AVAILABLE"},
        {"name": "Divya Balaji", "email": "divya.b@example.com", "phone": "+91 97910 33008", "vehicle": "Suzuki Access 125", "lat": 13.0750, "lng": 80.1900, "avail": "AVAILABLE"}
    ]

    volunteer_models = []
    for vol in volunteers_data:
        u = models.User(
            email=vol["email"],
            hashed_password=hashed_pwd,
            full_name=vol["name"],
            phone=vol["phone"],
            role="VOLUNTEER",
            is_active=True
        )
        db.add(u)
        db.flush()

        v_obj = models.Volunteer(
            user_id=u.id,
            name=vol["name"],
            phone=vol["phone"],
            availability=vol["avail"],
            vehicle_type=vol["vehicle"],
            latitude=vol["lat"],
            longitude=vol["lng"],
            completed_deliveries=random.randint(5, 42),
            is_active=True
        )
        db.add(v_obj)
        db.flush()
        volunteer_models.append(v_obj)
    db.commit()

    # 5. Donations (20 Donations across multiple lifecycles)
    foods = [
        {"name": "Vegetable Biryani with Raitha", "type": "Rice", "qty": 45, "pkts": 90, "desc": "Freshly prepared aromatic basmati rice with mixed vegetables and mint raitha."},
        {"name": "South Indian Full Meals (Sambar, Rasam, Poriyal, Rice)", "type": "Cooked Meals", "qty": 60, "pkts": 120, "desc": "Complete hot meals packed in eco-friendly meal trays from lunch banquet."},
        {"name": "Soft Wheat Chapati with Paneer Gravy", "type": "Chapati", "qty": 30, "pkts": 80, "desc": "Freshly made hot phulkas wrapped in foil with cottage cheese butter masala."},
        {"name": "Lemon Rice with Roasted Peanuts & Potato Fry", "type": "Rice", "qty": 25, "pkts": 50, "desc": "Tangy mustard tempered lemon rice with crispy spiced potato sides."},
        {"name": "Assorted Fresh Fruits (Apples, Bananas, Oranges)", "type": "Fruits", "qty": 40, "pkts": 60, "desc": "Boxed fresh seasonal whole fruits in pristine hygienic packaging."},
        {"name": "Evening Snacks (Samosas, Veg Cutlets, Tea Cakes)", "type": "Snacks", "qty": 20, "pkts": 75, "desc": "Crispy baked snacks and vegetarian tea patties from corporate seminar."},
        {"name": "Steamed Idli with Sambar and Coconut Chutney", "type": "Cooked Meals", "qty": 35, "pkts": 70, "desc": "Soft steamed idlis accompanied by drumstick sambar."},
        {"name": "Mixed Vegetable Pulao with Dal Tadka", "type": "Rice", "qty": 50, "pkts": 100, "desc": "Nutritious cumin rice with yellow lentil curry."},
        {"name": "Stuffed Paratha with Pickle and Curd", "type": "Chapati", "qty": 25, "pkts": 50, "desc": "Aloo and gobi stuffed whole wheat flatbreads with fresh yogurt."},
        {"name": "Fresh Garden Salad & Sautéed Greens", "type": "Vegetables", "qty": 18, "pkts": 35, "desc": "Crisp diced cucumbers, tomatoes, carrots and steamed green peas."}
    ]

    statuses = [
        "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED",
        "COMPLETED", "COMPLETED", "COMPLETED", "DELIVERED", "ON_THE_WAY",
        "PICKED_UP", "VOLUNTEER_ASSIGNED", "NGO_ACCEPTED", "CREATED", "CREATED",
        "CREATED", "COMPLETED", "COMPLETED", "ON_THE_WAY", "NGO_ACCEPTED"
    ]

    for idx, status in enumerate(statuses):
        donor_user, donor_info = donor_users[idx % len(donor_users)]
        food_sample = foods[idx % len(foods)]
        code = f"DON-2026-00{101 + idx}"

        # Calculate AI priority
        ai_p = calculate_ai_priority(
            food_type=food_sample["type"],
            quantity=food_sample["qty"],
            number_of_packets=food_sample["pkts"],
            prepared_date=(datetime.now() - timedelta(hours=random.randint(1, 4))).strftime("%Y-%m-%d"),
            prepared_time="11:30 AM",
            available_until=(datetime.now() + timedelta(hours=random.randint(2, 6))).strftime("%I:%M %p")
        )

        assigned_ngo = ngo_models[idx % len(ngo_models)] if status != "CREATED" else None
        assigned_vol = volunteer_models[idx % len(volunteer_models)] if status in [
            "VOLUNTEER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED", "COMPLETED"
        ] else None

        donation = models.Donation(
            donation_code=code,
            donor_id=donor_user.id,
            donor_name=donor_user.full_name,
            food_name=food_sample["name"],
            food_type=food_sample["type"],
            quantity=food_sample["qty"],
            number_of_packets=food_sample["pkts"],
            prepared_date=(datetime.now() - timedelta(hours=2)).strftime("%Y-%m-%d"),
            prepared_time="11:30 AM",
            available_until=(datetime.now() + timedelta(hours=4)).strftime("%02d:00 PM" % random.randint(4, 9)),
            food_description=food_sample["desc"],
            pickup_address=donor_info["addr"],
            latitude=donor_info["lat"],
            longitude=donor_info["lng"],
            food_image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            priority=ai_p["priority"],
            priority_reason=ai_p["priority_reason"],
            priority_recommendation=ai_p["priority_recommendation"],
            priority_score=ai_p["priority_score"],
            status=status,
            ngo_id=assigned_ngo.id if assigned_ngo else None,
            volunteer_id=assigned_vol.id if assigned_vol else None,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 5), hours=random.randint(1, 8))
        )
        db.add(donation)
        db.flush()

        # Add tracking history according to current status
        flow = ["CREATED", "NGO_ACCEPTED", "VOLUNTEER_ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED", "COMPLETED"]
        idx_target = flow.index(status) if status in flow else 0

        for step_i in range(idx_target + 1):
            st = flow[step_i]
            add_tracking_entry(
                donation=donation,
                new_status=st,
                db=db,
                updated_by="System Logistics",
                description=f"Milestone: {st.replace('_', ' ').title()}",
                lat=donation.latitude,
                lng=donation.longitude
            )

    db.commit()

    # 6. Seed notifications for demo users
    db.add(models.Notification(
        user_id=donor_users[0][0].id,
        title="Donation Delivered & Confirmed",
        message="Your donation DON-2026-00101 was successfully served at ABC Community Trust. 90 people benefited!",
        type="SUCCESS",
        link="/track/DON-2026-00101"
    ))
    db.add(models.Notification(
        user_id=ngo_models[0].user_id,
        title="Surplus Food Available Nearby",
        message="New donation DON-2026-00114 (Mixed Veg Pulao, 100 packets) posted 2.1 km away.",
        type="INFO",
        link="/ngo/available"
    ))
    db.add(models.Notification(
        user_id=volunteer_models[0].user_id,
        title="Pickup Assignment Ready",
        message="Active route DON-2026-00110 assigned for pickup at DLF Cyber City.",
        type="ACTION",
        link="/volunteer/pickups"
    ))
    db.commit()
    db.close()
    print("Database seeding completed successfully with 5 Donors, 5 NGOs, 8 Volunteers, and 20 Donations!")


if __name__ == "__main__":
    seed_database()
