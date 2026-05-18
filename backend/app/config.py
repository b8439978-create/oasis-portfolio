from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://oasis_user:oasis_pass@localhost:5432/oasis_db"
    SECRET_KEY: str = "oasis-super-secret-key-2024-x9k2m7v4"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    UPLOAD_DIR: str = "./uploads"

    class Config:
        env_file = ".env"


settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
