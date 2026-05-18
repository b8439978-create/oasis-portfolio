from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OrderCreate(BaseModel):
    client_name: str
    client_email: str
    company: Optional[str] = None
    project_type: str
    plan: Optional[str] = None
    description: str
    budget: Optional[str] = None
    timeline: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    price: Optional[float] = None
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    client_name: str
    client_email: str
    company: Optional[str]
    project_type: str
    plan: Optional[str]
    description: str
    budget: Optional[str]
    timeline: Optional[str]
    status: str
    file_url: Optional[str]
    price: Optional[float]
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
