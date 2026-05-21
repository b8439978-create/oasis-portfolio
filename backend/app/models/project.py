from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100))
    description = Column(Text)
    image_url = Column(String(500))
    video_url = Column(String(500))
    demo_url = Column(String(500))
    github_url = Column(String(500))
    technologies = Column(Text)
    is_featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    date = Column(String(100))
    files = Column(Text)
