# AI-Based Smart Food Donation, Tracking & Redistribution System

An intelligent, full-stack, real-world web application that connects **Food Donors**, **NGOs / Shelters**, **Delivery Volunteers**, and **Government Administrators** to eliminate food waste and safely redistribute surplus meals to people in need.

---

## 🌟 Key Features

1. **Multi-Role Authentication & Access Control**
   - JWT-based authentication with bcrypt password hashing.
   - Dedicated portals for **DONOR**, **NGO**, **VOLUNTEER**, and **ADMIN**.
   - One-click interactive **Demo Switcher** on the frontend for college presentations.

2. **AI Food Priority Engine (Machine Learning & Rules)**
   - Computes shelf-life urgency, Perishability Matrix (Cooked Meals, Rice, Chapati, Vegetables, Fruits, etc.), and preparation elapsed time.
   - Outputs: Priority level (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), Priority Score (0–100), Perishability Reason, and Actionable Dispatch Recommendations.
   - Includes decision-support safety disclaimers.

3. **Smart Multi-Criteria NGO Matching Engine**
   - Mathematical matching score evaluating:
     $$\text{Match Score} = (\text{Distance Score} \times 0.35) + (\text{Capacity Score} \times 0.25) + (\text{Requirement Score} \times 0.25) + (\text{Urgency Score} \times 0.15)$$
   - Uses **Haversine Great-Circle formula** for real-time geographic distance ranking.

4. **Live Interactive Tracking & OpenStreetMap Leaflet Map**
   - Live visual map showing **Donor**, **NGO**, and **Volunteer** with custom-coded color pins.
   - Visual polyline routing connecting collection point to destination shelter.
   - **"Track Volunteer" Simulator button** that interpolates real-time GPS coordinates along the transit path.
   - 7-stage verifiable audit timeline:
     $$\text{Created} \rightarrow \text{NGO Accepted} \rightarrow \text{Volunteer Assigned} \rightarrow \text{Picked Up} \rightarrow \text{On The Way} \rightarrow \text{Delivered} \rightarrow \text{NGO Confirmed}$$

5. **Government & State Administration Dashboard**
   - Interactive KPI cards: Total Users, Donors, NGOs, Volunteers, Food Rescued, People Benefited.
   - 5 Dynamic **Recharts** visualizations:
     1. Monthly Donations Trend
     2. Food Rescued Per Month (kg)
     3. Donations By Food Type Breakdown
     4. NGO Capacity & Distribution Efficiency
     5. Area-Wise Demand & Redistribution Heatmap (Green, Yellow, Red Zones)
   - User governance (Activate/Deactivate accounts).
   - Master donation chain-of-custody audit.

6. **Automated Notification Dispatcher**
   - Real-time in-app notification center with unread badge counter.
   - Automatic triggers when NGOs claim food, volunteers are dispatched, food arrives, and receipts are confirmed.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Vite), JavaScript, Tailwind CSS, React Router v7, Axios, Recharts, Leaflet, React-Leaflet, Lucide Icons |
| **Backend** | Python 3.12+, FastAPI, Uvicorn, Pydantic v2, Python-Jose (JWT), Passlib / Bcrypt |
| **Database** | SQLite, SQLAlchemy 2.0 ORM |
| **AI / ML** | Scikit-learn, NumPy, Pandas, Perishability & Geospatial Algorithms |
| **Maps** | Leaflet, OpenStreetMap Tile Provider |

---

## 📂 Project Directory Structure

```text
food donation app/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI server entrypoint & startup seeder
│   │   ├── database.py          # SQLite engine & SQLAlchemy SessionLocal
│   │   ├── models.py            # Database tables & relationships
│   │   ├── schemas.py           # Pydantic request/response validation schemas
│   │   ├── auth.py              # JWT generation, verification & role guards
│   │   ├── ai/
│   │   │   └── priority.py      # AI Food Priority & Perishability classifier
│   │   ├── services/
│   │   │   ├── matching.py      # Multi-criteria NGO Haversine matching
│   │   │   └── tracking.py      # Timeline checkpoint & notification dispatcher
│   │   ├── routers/
│   │   │   ├── auth.py          # /auth/register, /auth/login, /auth/me
│   │   │   ├── donations.py     # /donations (CRUD, status, recommend)
│   │   │   ├── ngos.py          # /ngos management endpoints
│   │   │   ├── volunteers.py    # /volunteers & logistics assignment
│   │   │   ├── tracking.py      # /tracking steps & live coordinates
│   │   │   ├── notifications.py # /notifications & read status
│   │   │   ├── users.py         # /users admin management
│   │   │   └── admin.py         # /admin statistics & gov analytics
│   │   └── utils/
│   │       └── seed_data.py     # Auto-seeder (5 Donors, 5 NGOs, 8 Volunteers, 20 Donations)
│   └── test_complete_flow.py    # Automated 15-step verification test script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Global responsive navigation with demo switcher
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # User session, JWT storage & demo logins
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero, workflow pipeline & feature sections
│   │   │   ├── LoginPage.jsx    # Auth login with 1-click role logins
│   │   │   ├── RegisterPage.jsx # Multi-role registration form
│   │   │   ├── DonorDashboard.jsx    # Donor analytics & active listings
│   │   │   ├── DonateFoodPage.jsx    # Surplus food submission & AI results
│   │   │   ├── NgoDashboard.jsx      # Available donations & delivery receipt
│   │   │   ├── VolunteerDashboard.jsx # Transit tasks & GPS checkpoint controls
│   │   │   ├── DonationTrackingPage.jsx # Leaflet map & animated route
│   │   │   ├── AdminDashboard.jsx    # Recharts analytics & user management
│   │   │   ├── ImpactDashboard.jsx   # Ecological impact & biomass stats
│   │   │   └── GovernmentDashboard.jsx # Regional hunger hotspots & policy map
│   │   ├── services/
│   │   │   └── api.js           # Axios API service client
│   │   ├── utils/
│   │   │   └── leafletIcons.js  # Color-coded custom pins for Leaflet
│   │   ├── App.jsx              # Main routing & ProtectedRoute wrappers
│   │   └── index.css            # Tailwind directives & Plus Jakarta Sans
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.12+**
- **Node.js 18+** & **npm**

---

### Step 1: Backend Installation & Setup

1. Open a terminal in the project root:
   ```bash
   cd "backend"
   ```

2. Install Python dependencies:
   ```bash
   python -m pip install fastapi uvicorn python-multipart python-jose[cryptography] passlib[bcrypt] bcrypt pydantic numpy pandas scikit-learn
   ```

3. Start the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

   - API Documentation (Swagger UI): **http://127.0.0.1:8000/docs**
   - Health Check: **http://127.0.0.1:8000/**

*Note: On startup, the backend automatically initializes SQLite tables in `backend/app/food_donation.db` and seeds 5 Donors, 5 NGOs, 8 Volunteers, and 20 real donations across different lifecycle statuses.*

---

### Step 2: Frontend Installation & Setup

1. Open a second terminal window:
   ```bash
   cd "frontend"
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

4. Open your browser and navigate to:
   👉 **http://127.0.0.1:5173**

---

## 🔑 Demo Login Credentials

The application is pre-loaded with sample accounts for all 4 roles. You can either use these credentials on the **Login Page** or click the **1-Click Demo Buttons** in the top navigation bar:

| Role | Email Address | Password | Persona / Organization |
|---|---|---|---|
| **DONOR** | `donor@example.com` | `password123` | Anand Grand Banquet & Catering |
| **NGO** | `ngo@example.com` | `password123` | ABC Community Trust |
| **VOLUNTEER** | `volunteer@example.com` | `password123` | Rajesh Kumar (Hero Splendor Bike) |
| **ADMIN** | `admin@example.com` | `admin123` | State Food Commissioner (Civil Authority) |

---

## 🧪 Testing the Complete 15-Step Donation Flow

You can test the entire operational scenario either via the web browser UI or by running the automated test script.

### Option A: Run the Automated CLI Test Script
In the `backend` folder, run:
```bash
python test_complete_flow.py
```
This script executes the complete sequence in under 5 seconds:
1. Registers new food donor
2. Submits a surplus food listing
3. Validates AI Priority calculation
4. Computes smart recommended NGOs
5. Logs in as NGO and claims the donation
6. Logs in as Volunteer and accepts pickup
7. Marks food as "Picked Up"
8. Updates transit status to "On The Way"
9. Marks order as "Delivered"
10. NGO inspects food and clicks "Confirm Receipt"
11. Status changes to "COMPLETED"
12. Admin dashboard verifies updated live statistics

### Option B: Interactive Demonstration in the Browser
1. Visit **http://127.0.0.1:5173**
2. Click **"Demo: Donor"** in the top navigation bar.
3. Click **"Donate Food"**, enter meal details (e.g., 60 packets of Vegetable Rice), and click **"Submit Donation"**.
4. Observe the **AI Food Priority Analysis Card** and **Smart NGO Matching** recommendations.
5. Click **"Demo: NGO"** in the navbar -> go to **Available Donations** and click **"Accept Donation"**.
6. Click **"Demo: Volunteer"** in the navbar -> go to **Available Pickups** and click **"Accept Pickup"**.
7. Click **"Mark as Picked Up"** -> **"Mark as Delivered"**.
8. Click **"Demo: NGO"** in the navbar -> click **"Confirm Receipt"**.
9. Click **"Demo: Admin"** in the navbar -> observe updated Recharts graphs, meals served, and food rescued in kilograms!
10. Click **"Track"** on any donation to open the interactive **Leaflet OpenStreetMap** and click **"Track Volunteer (Simulate Movement)"** to watch simulated live GPS transit.

---

## 🔒 Security & Quality Attributes

- **Authentication**: Stateless JSON Web Tokens (HS256) with role authorization guards.
- **Input Validation**: Strict Pydantic schemas validating email formats, positive quantities, and coordinate boundaries.
- **Data Persistence**: Foreign key constraints linking Users $\rightarrow$ Donations $\rightarrow$ Tracking Checkpoints $\rightarrow$ Notifications.
- **Responsive Design**: Designed with Tailwind CSS for seamless viewing on desktop monitors, laptops, tablets, and smartphones.

---

## 🎓 Academic Project Demonstration Summary
This application solves the real-world humanitarian challenge of urban food loss through autonomous matching, algorithmic urgency scoring, and transparent multi-agency logistics.
