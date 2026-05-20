from fastapi import APIRouter, UploadFile, File
import os
import shutil
from ..config import settings

router = APIRouter(prefix="/api/upload", tags=["Upload"])


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": file_path}
