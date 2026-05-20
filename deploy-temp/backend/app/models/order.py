from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Enum
from sqlalchemy.sql import func
from ..database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100), nullable=False)
    client_email = Column(String(100), nullable=False)
    company = Column(String(100))
    project_type = Column(String(50), nullable=False)
    plan = Column(String(50))
    description = Column(Text, nullable=False)
    budget = Column(String(50))
    timeline = Column(String(100))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    file_url = Column(String(500))
    price = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
