import os
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Timestamp
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_admin(x_admin_key: str = Header(default=None)):
    if x_admin_key != os.environ.get("ADMIN_KEY"):
        raise HTTPException(status_code=403, detail="Forbidden")

class TimestampCreate(BaseModel):
    vod_id: int
    label: str
    time_seconds: int

@router.get("/timestamps/{vod_id}")
def get_timestamps(vod_id: int, db: Session = Depends(get_db)):
    return db.query(Timestamp).filter(Timestamp.vod_id == vod_id).order_by(Timestamp.time_seconds).all()

@router.post("/timestamps", dependencies=[Depends(verify_admin)])
def add_timestamp(ts: TimestampCreate, db: Session = Depends(get_db)):
    db_ts = Timestamp(vod_id=ts.vod_id, label=ts.label, time_seconds=ts.time_seconds)
    db.add(db_ts)
    db.commit()
    db.refresh(db_ts)
    return db_ts

@router.delete("/timestamps/{timestamp_id}", dependencies=[Depends(verify_admin)])
def delete_timestamp(timestamp_id: int, db: Session = Depends(get_db)):
    ts = db.query(Timestamp).filter(Timestamp.id == timestamp_id).first()
    if not ts:
        raise HTTPException(status_code=404, detail="Timestamp not found")
    db.delete(ts)
    db.commit()
    return {"deleted": timestamp_id}