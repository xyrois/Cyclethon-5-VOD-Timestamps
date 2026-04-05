from database import engine, Base
from models import VOD, Timestamp

# Creates vods.db and the tables
Base.metadata.create_all(bind=engine)
print("Database and tables created!")