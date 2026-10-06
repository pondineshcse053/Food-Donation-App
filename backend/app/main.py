import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, donations, ngos, volunteers, tracking, notifications, admin
from .utils.seed_data import seed_database

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Based Smart Food Donation, Tracking & Redistribution System",
    description="Intelligent platform connecting Food Donors, NGOs, Volunteers, and Admins to eliminate hunger and reduce food waste.",
    version="2.0.0"
)

# CORS Middleware for React frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(donations.router)
app.include_router(ngos.router)
app.include_router(volunteers.router)
app.include_router(tracking.router)
app.include_router(notifications.router)
app.include_router(admin.router)


@app.on_event("startup")
def on_startup():
    print("Application starting up... Verifying database and seeding demo records...")
    seed_database()
    print("AI Food Donation backend initialized and ready.")


@app.get("/")
def root():
    return {
        "status": "online",
        "system": "AI-Based Smart Food Donation, Tracking & Redistribution System",
        "api_docs": "/docs",
        "timestamp": "2026-10-06"
    }
