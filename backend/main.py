from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import vods, timestamps

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://cyclethon-5-vod-timestamps.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vods.router, prefix="/api")
app.include_router(timestamps.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "running"}