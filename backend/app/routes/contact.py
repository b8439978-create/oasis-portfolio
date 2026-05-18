from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.message import Message
from ..schemas.message import MessageCreate, MessageResponse

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.get("/", response_model=list[MessageResponse])
def list_messages(db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.desc()).all()


@router.post("/", response_model=MessageResponse)
def send_message(data: MessageCreate, db: Session = Depends(get_db)):
    message = Message(**data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.put("/{message_id}/read")
def mark_as_read(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        return {"error": "Message not found"}
    message.is_read = True
    db.commit()
    return {"message": "Marked as read"}
