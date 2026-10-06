from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[schemas.UserOut])
def get_users(
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(["ADMIN"]))
):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role.upper())
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.User.full_name.ilike(search_fmt)) |
            (models.User.email.ilike(search_fmt))
        )
    return query.order_by(models.User.created_at.desc()).all()


@router.get("/{id}", response_model=schemas.UserOut)
def get_user_by_id(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{id}/status")
def toggle_user_status(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(["ADMIN"]))
):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status set to {'active' if user.is_active else 'inactive'}", "is_active": user.is_active}
