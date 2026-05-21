import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.project import Project
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/projects", tags=["Projects"])


def _project_to_camel(p):
    files_raw = p.files or "[]"
    try:
        files = json.loads(files_raw) if isinstance(files_raw, str) else files_raw
    except (json.JSONDecodeError, TypeError):
        files = []
    tech_list = [t.strip() for t in (p.technologies or "").split(",") if t.strip()]
    return {
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "tech": tech_list,
        "liveUrl": p.demo_url,
        "githubUrl": p.github_url,
        "image": p.image_url,
        "date": p.date or str(p.created_at.year) if p.created_at else "",
        "files": files,
        "is_featured": p.is_featured,
    }


@router.get("/")
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.order_index).all()
    return [_project_to_camel(p) for p in projects]


@router.get("/featured")
def featured_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.is_featured == True).order_by(Project.order_index).all()
    return [_project_to_camel(p) for p in projects]
