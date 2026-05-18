from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.order import Order
from ..models.message import Message
from ..models.user import User

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    in_progress = db.query(Order).filter(Order.status == "in_progress").count()
    completed = db.query(Order).filter(Order.status == "completed").count()
    total_clients = db.query(User).count()
    unread_messages = db.query(Message).filter(Message.is_read == False).count()
    total_messages = db.query(Message).count()

    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "in_progress_orders": in_progress,
        "completed_orders": completed,
        "total_clients": total_clients,
        "unread_messages": unread_messages,
        "total_messages": total_messages,
    }
