from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/ngos", tags=["NGOs"])


@router.get("", response_model=List[schemas.NGOOut])
def get_ngos(is_active: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.NGO)
    if is_active is not None:
        query = query.filter(models.NGO.is_active == is_active)
    return query.all()


@router.get("/{id}", response_model=schemas.NGOOut)
def get_ngo(id: int, db: Session = Depends(get_db)):
    ngo = db.query(models.NGO).filter(models.NGO.id == id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo


@router.post("", response_model=schemas.NGOOut)
def create_ngo(
    ngo_in: schemas.NGOCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    ngo = models.NGO(**ngo_in.model_dump())
    db.add(ngo)
    db.commit()
    db.refresh(ngo)
    return ngo


@router.put("/{id}", response_model=schemas.NGOOut)
def update_ngo(
    id: int,
    ngo_update: schemas.NGOUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    ngo = db.query(models.NGO).filter(models.NGO.id == id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    update_data = ngo_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(ngo, field, val)

    db.commit()
    db.refresh(ngo)
    return ngo


@router.delete("/{id}")
def delete_ngo(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(["ADMIN"]))
):
    ngo = db.query(models.NGO).filter(models.NGO.id == id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    ngo.is_active = False
    db.commit()
    return {"message": "NGO deactivated successfully"}
