from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[str] = None
    is_featured: bool = False
    order_index: int = 0


class ProjectResponse(BaseModel):
    id: int
    title: str
    category: Optional[str]
    description: Optional[str]
    image_url: Optional[str]
    video_url: Optional[str]
    demo_url: Optional[str]
    github_url: Optional[str]
    technologies: Optional[str]
    is_featured: bool
    order_index: int
    created_at: datetime

    class Config:
        from_attributes = True
