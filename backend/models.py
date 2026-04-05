from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class VOD(Base):
    __tablename__ = "vods"
    id = Column(Integer, primary_key=True, index=True)
    vod_id = Column(String, nullable=False)  # Twitch VOD ID
    title = Column(String, nullable=True)

class Timestamp(Base):
    __tablename__ = "timestamps"
    id = Column(Integer, primary_key=True, index=True)
    vod_id = Column(Integer, ForeignKey("vods.id"))
    label = Column(String, nullable=False)
    time_seconds = Column(Integer, nullable=False)