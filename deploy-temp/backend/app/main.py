from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .database import engine, Base
from .config import settings
from .routes import auth, orders, projects, contact, dashboard, upload
from . import admin  # alohida admin panel fayli

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OASIS API",
    description="Premium full-stack development agency backend",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Routes
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(projects.router)
app.include_router(contact.router)
app.include_router(dashboard.router)
app.include_router(upload.router)
app.include_router(admin.router)


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "OASIS API"}
