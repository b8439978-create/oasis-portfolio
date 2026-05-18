from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import os
import shutil
from ..database import get_db
from ..models.order import Order, OrderStatus
from ..schemas.order import OrderCreate, OrderUpdate, OrderResponse
from ..config import settings

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("/", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.post("/", response_model=OrderResponse)
def create_order(
    client_name: str = Form(...),
    client_email: str = Form(...),
    company: Optional[str] = Form(None),
    project_type: str = Form(...),
    plan: Optional[str] = Form(None),
    description: str = Form(...),
    budget: Optional[str] = Form(None),
    timeline: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    file_url = None
    if file:
        file_path = os.path.join(settings.UPLOAD_DIR, f"order_{file.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_url = file_path

    order = Order(
        client_name=client_name,
        client_email=client_email,
        company=company,
        project_type=project_type,
        plan=plan,
        description=description,
        budget=budget,
        timeline=timeline,
        file_url=file_url,
        status=OrderStatus.PENDING,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(order_id: int, update: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(order, key, value)

    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}
