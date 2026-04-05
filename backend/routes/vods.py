from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import VOD
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class VODCreate(BaseModel):
    vod_id: str
    title: str

@router.get("/vods")
def get_vods(db: Session = Depends(get_db)):
    return db.query(VOD).all()

@router.post("/vods")
def add_vod(vod: VODCreate, db: Session = Depends(get_db)):
    db_vod = VOD(vod_id=vod.vod_id, title=vod.title)
    db.add(db_vod)
    db.commit()
    db.refresh(db_vod)
    return db_vod

@router.delete("/vods/{vod_id}")
def delete_vod(vod_id: int, db: Session = Depends(get_db)):
    vod = db.query(VOD).filter(VOD.id == vod_id).first()
    if not vod:
        raise HTTPException(status_code=404, detail="VOD not found")
    db.delete(vod)
    db.commit()
    return {"deleted": vod_id}