from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # Hash password
    hashed_pwd = auth.get_password_hash(user_in.password)
    user = models.User(
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role.upper(),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically create associated profile depending on role
    if user.role == "NGO":
        ngo = models.NGO(
            user_id=user.id,
            name=user.full_name,
            contact_person=user.full_name,
            phone=user.phone or "1234567890",
            email=user.email,
            address="Community Relief Center, Metro Sector",
            capacity=100,
            food_requirements="Cooked Meals, Rice, Chapati, Vegetables",
            latitude=13.0827,
            longitude=80.2707
        )
        db.add(ngo)
        db.commit()
    elif user.role == "VOLUNTEER":
        volunteer = models.Volunteer(
            user_id=user.id,
            name=user.full_name,
            phone=user.phone or "1234567890",
            availability="AVAILABLE",
            vehicle_type="Motorcycle / Delivery Van",
            latitude=13.0827,
            longitude=80.2707
        )
        db.add(volunteer)
        db.commit()

    # Welcome notification
    db.add(models.Notification(
        user_id=user.id,
        title="Welcome to the Network! 🌱",
        message=f"Welcome {user.full_name}! Your {user.role} account has been activated.",
        type="SUCCESS",
        link="/dashboard"
    ))
    db.commit()

    # Create JWT
    token = auth.create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email.lower()).first()
    if not user or not auth.verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account has been deactivated. Please contact administrator."
        )

    token = auth.create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
