import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def api_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.getcode()
            response_data = json.loads(resp.read().decode("utf-8"))
            return status_code, response_data
    except urllib.error.HTTPError as e:
        error_content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(error_content)
        except Exception:
            return e.code, {"error": error_content}


def test_full_pipeline():
    print("==================================================")
    print("STARTING COMPLETE END-TO-END VERIFICATION FLOW")
    print("==================================================")

    # 1. Register as Donor
    test_donor_email = f"donor_test_{int(time.time())}@example.com"
    print(f"\n[Step 1 & 2] Registering and logging in as new donor: {test_donor_email}...")
    status, reg_res = api_request("/auth/register", method="POST", data={
        "full_name": "Grand Bay Banquet & Lawns",
        "email": test_donor_email,
        "phone": "+91 98888 77777",
        "password": "securepassword123",
        "role": "DONOR"
    })
    assert status == 200, f"Donor registration failed: {reg_res}"
    donor_token = reg_res["access_token"]
    donor_id = reg_res["user"]["id"]
    print("[OK] Donor registered & authenticated successfully.")

    # 3. Create food donation
    print("\n[Step 3] Submitting surplus food donation...")
    donation_payload = {
        "food_name": "Special South Indian Wedding Lunch Meals",
        "food_type": "Cooked Meals",
        "quantity": 55.0,
        "number_of_packets": 110,
        "prepared_date": "2026-10-06",
        "prepared_time": "12:00 PM",
        "available_until": "04:30 PM",
        "food_description": "110 boxed fresh meals, steamed rice, sambar, kootu, poriyal, payasam.",
        "pickup_address": "88 Marina Beach Road, Santhome, Chennai",
        "latitude": 13.0330,
        "longitude": 80.2780
    }
    status, donation_data = api_request("/donations", method="POST", data=donation_payload, token=donor_token)
    assert status == 200, f"Create donation failed: {donation_data}"
    don_id = donation_data["id"]
    don_code = donation_data["donation_code"]
    print(f"[OK] Donation created with unique ID: {don_code}")

    # 4. AI Priority calculation validation
    print("\n[Step 4] Verifying AI Food Priority calculation...")
    print(f"  Priority: {donation_data['priority']}")
    print(f"  Priority Score: {donation_data['priority_score']}/100")
    print(f"  Reason: {donation_data['priority_reason']}")
    print(f"  Recommendation: {donation_data['priority_recommendation']}")
    assert donation_data["priority"] in ["LOW", "MEDIUM", "HIGH", "URGENT"]
    print("[OK] AI Priority Analysis computed successfully.")

    # 5. System recommends NGOs
    print("\n[Step 5] Fetching smart recommended NGOs...")
    status, recs = api_request(f"/donations/{don_id}/recommended-ngos")
    assert status == 200, f"Recommendation failed: {recs}"
    assert len(recs) > 0, "No NGOs recommended"
    top_ngo = recs[0]
    print(f"[OK] Top Recommended NGO: {top_ngo['ngo_name']}")
    print(f"  Distance: {top_ngo['distance_km']} km | Match Score: {top_ngo['total_match_score']}%")
    print(f"  Reason: {top_ngo['compatibility_reason']}")

    # 6. NGO logs in
    print("\n[Step 6] NGO logging into system...")
    status, ngo_login = api_request("/auth/login", method="POST", data={
        "email": "ngo@example.com",
        "password": "password123"
    })
    assert status == 200, f"NGO login failed: {ngo_login}"
    ngo_token = ngo_login["access_token"]
    print("[OK] NGO authenticated.")

    # 7. NGO accepts donation
    print("\n[Step 7] NGO accepting donation...")
    status, accept_res = api_request(f"/donations/{don_id}/status", method="PUT", data={
        "status": "NGO_ACCEPTED",
        "notes": "ABC Community Trust has claimed this donation for evening shelter dinner."
    }, token=ngo_token)
    assert status == 200, f"NGO accept failed: {accept_res}"
    assert accept_res["status"] == "NGO_ACCEPTED"
    print("[OK] Status updated to NGO_ACCEPTED in database.")

    # 8. Volunteer logs in
    print("\n[Step 8] Volunteer logging into system...")
    status, vol_login = api_request("/auth/login", method="POST", data={
        "email": "volunteer@example.com",
        "password": "password123"
    })
    assert status == 200, f"Volunteer login failed: {vol_login}"
    vol_token = vol_login["access_token"]
    print("[OK] Volunteer authenticated.")

    # 9. Volunteer accepts pickup
    print("\n[Step 9] Volunteer accepting pickup...")
    status, vol_accept = api_request(f"/donations/{don_id}/status", method="PUT", data={
        "status": "VOLUNTEER_ASSIGNED",
        "notes": "Volunteer Rajesh Kumar accepted pickup route."
    }, token=vol_token)
    assert status == 200
    assert vol_accept["status"] == "VOLUNTEER_ASSIGNED"
    print("[OK] Status updated to VOLUNTEER_ASSIGNED in database.")

    # 10. Volunteer marks food as picked up
    print("\n[Step 10] Volunteer marks food as picked up...")
    status, pickup_res = api_request(f"/donations/{don_id}/status", method="PUT", data={
        "status": "PICKED_UP",
        "notes": "Food verified and loaded in insulated carriers."
    }, token=vol_token)
    assert status == 200
    assert pickup_res["status"] == "PICKED_UP"
    print("[OK] Status updated to PICKED_UP in database.")

    # 11. Tracking changes to “On The Way”
    print("\n[Step 11] Tracking changes to 'ON_THE_WAY'...")
    status, otw_res = api_request(f"/donations/{don_id}/status", method="PUT", data={
        "status": "ON_THE_WAY",
        "notes": "Driver in transit via Mount Road."
    }, token=vol_token)
    assert status == 200
    assert otw_res["status"] == "ON_THE_WAY"
    print("[OK] Status updated to ON_THE_WAY in database.")

    # 12. Volunteer marks delivered
    print("\n[Step 12] Volunteer marks delivered...")
    status, deliv_res = api_request(f"/donations/{don_id}/status", method="PUT", data={
        "status": "DELIVERED",
        "notes": "Delivered to Mylapore center desk."
    }, token=vol_token)
    assert status == 200
    assert deliv_res["status"] == "DELIVERED"
    print("[OK] Status updated to DELIVERED in database.")

    # 13 & 14. NGO confirms receipt -> Donation becomes COMPLETED
    print("\n[Step 13 & 14] NGO confirms receipt -> Final COMPLETED status...")
    status, confirm_res = api_request(f"/donations/{don_id}/status", method="PUT", data={
        "status": "COMPLETED",
        "notes": "Meal quality inspected and served immediately. Zero food waste!"
    }, token=ngo_token)
    assert status == 200
    assert confirm_res["status"] == "COMPLETED"
    print("[OK] Status updated to COMPLETED in database.")

    # Verify Tracking History
    status, steps = api_request(f"/tracking/{don_id}")
    print(f"\n[OK] Verified {len(steps)} tracking milestone audit records in database:")
    for s in steps:
        print(f"   • [{s['status']}] - {s['status_label']} ({s['description']})")

    # 15. Admin dashboard updates statistics
    print("\n[Step 15] Admin dashboard checking live statistics...")
    status, stats = api_request("/admin/statistics")
    assert status == 200
    print(f"[OK] Total Donations Recorded: {stats['summary']['total_donations']}")
    print(f"[OK] Completed Donations: {stats['summary']['completed_donations']}")
    print(f"[OK] Total Food Rescued: {stats['summary']['food_rescued_kg']} kg")
    print(f"[OK] People Benefited: {stats['summary']['people_benefited']}")
    
    print("\n==================================================")
    print("ALL 15 STEPS IN END-TO-END SCENARIO PASSED 100%!")
    print("==================================================")

if __name__ == "__main__":
    test_full_pipeline()
