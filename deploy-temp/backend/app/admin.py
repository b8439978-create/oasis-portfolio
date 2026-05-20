"""
OASIS Admin Panel — Backend API

Alohida admin fayli. Barcha admin panel API'lari shu yerda.
Frontend: /admin sahifasi orqali ishlaydi.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta
from pydantic import BaseModel

from .database import get_db
from .models.user import User
from .models.order import Order
from .models.project import Project
from .models.message import Message
from .models.testimonial import Testimonial
from .models.pricing import PricingPlan
from .services.auth_service import hash_password, verify_password, create_access_token, decode_access_token
from .config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])

# ─────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: dict

@router.post("/login")
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username, User.is_admin == True).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = create_access_token({"sub": user.username, "id": user.id, "admin": True})
    return AdminToken(
        access_token=token,
        admin={"id": user.id, "username": user.username, "email": user.email}
    )

# ─────────────────────────────────────────────
# DASHBOARD STATS
# ─────────────────────────────────────────────

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    pending = db.query(Order).filter(Order.status == "pending").count()
    in_progress = db.query(Order).filter(Order.status == "in_progress").count()
    completed = db.query(Order).filter(Order.status == "completed").count()
    total_clients = db.query(User).count()
    unread = db.query(Message).filter(Message.is_read == False).count()
    total_messages = db.query(Message).count()

    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_messages = db.query(Message).order_by(Message.created_at.desc()).limit(5).all()

    return {
        "stats": {
            "total_orders": total_orders,
            "pending_orders": pending,
            "in_progress": in_progress,
            "completed": completed,
            "total_clients": total_clients,
            "unread_messages": unread,
            "total_messages": total_messages,
        },
        "recent_orders": [
            {
                "id": o.id,
                "client_name": o.client_name,
                "project_type": o.project_type,
                "status": o.status.value if hasattr(o.status, 'value') else o.status,
                "price": o.price,
                "created_at": str(o.created_at),
            }
            for o in recent_orders
        ],
        "recent_messages": [
            {
                "id": m.id,
                "name": m.name,
                "message": m.message[:100],
                "is_read": m.is_read,
                "created_at": str(m.created_at),
            }
            for m in recent_messages
        ],
    }

# ─────────────────────────────────────────────
# ORDERS MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/orders")
def admin_list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "client_name": o.client_name,
            "client_email": o.client_email,
            "company": o.company,
            "project_type": o.project_type,
            "plan": o.plan,
            "status": o.status.value if hasattr(o.status, 'value') else o.status,
            "price": o.price,
            "created_at": str(o.created_at),
        }
        for o in orders
    ]

@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    return {"message": "Status updated", "status": status}

# ─────────────────────────────────────────────
# PROJECTS MANAGEMENT
# ─────────────────────────────────────────────

class ProjectData(BaseModel):
    title: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[str] = None
    is_featured: bool = False

@router.post("/projects")
def admin_create_project(data: ProjectData, db: Session = Depends(get_db)):
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"message": "Project created", "id": project.id}

@router.get("/projects")
def admin_list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.order_index).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "is_featured": p.is_featured,
            "image_url": p.image_url,
            "created_at": str(p.created_at),
        }
        for p in projects
    ]

@router.delete("/projects/{project_id}")
def admin_delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

# ─────────────────────────────────────────────
# MESSAGES MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/messages")
def admin_list_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).order_by(Message.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "subject": m.subject,
            "message": m.message,
            "is_read": m.is_read,
            "created_at": str(m.created_at),
        }
        for m in messages
    ]

# ─────────────────────────────────────────────
# TESTIMONIALS MANAGEMENT
# ─────────────────────────────────────────────

class TestimonialData(BaseModel):
    name: str
    role: Optional[str] = None
    content: str
    rating: float = 5.0
    is_active: bool = True

@router.get("/testimonials")
def admin_list_testimonials(db: Session = Depends(get_db)):
    testimonials = db.query(Testimonial).all()
    return [
        {
            "id": t.id,
            "name": t.name,
            "role": t.role,
            "content": t.content,
            "rating": t.rating,
            "is_active": t.is_active,
        }
        for t in testimonials
    ]

@router.post("/testimonials")
def admin_create_testimonial(data: TestimonialData, db: Session = Depends(get_db)):
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return {"message": "Testimonial created", "id": testimonial.id}

@router.delete("/testimonials/{testimonial_id}")
def admin_delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()
    return {"message": "Testimonial deleted"}

# ─────────────────────────────────────────────
# PRICING PLANS MANAGEMENT
# ─────────────────────────────────────────────

class PricingData(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    features: Optional[str] = None
    is_popular: bool = False

@router.get("/pricing")
def admin_list_pricing(db: Session = Depends(get_db)):
    plans = db.query(PricingPlan).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "description": p.description,
            "features": p.features,
            "is_popular": p.is_popular,
        }
        for p in plans
    ]

@router.post("/pricing")
def admin_create_pricing(data: PricingData, db: Session = Depends(get_db)):
    plan = PricingPlan(**data.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return {"message": "Pricing plan created", "id": plan.id}

@router.put("/pricing/{plan_id}")
def admin_update_pricing(plan_id: int, data: PricingData, db: Session = Depends(get_db)):
    plan = db.query(PricingPlan).filter(PricingPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    for key, value in data.model_dump().items():
        setattr(plan, key, value)
    db.commit()
    return {"message": "Plan updated"}

@router.delete("/pricing/{plan_id}")
def admin_delete_pricing(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(PricingPlan).filter(PricingPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted"}
