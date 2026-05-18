from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


class MessageResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
