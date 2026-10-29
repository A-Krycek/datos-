import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoRAEE Cloud API"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Base de Datos (PostgreSQL o SQLite Fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://ecoraee_admin:EcoRAEE_Password_2026@localhost:5432/ecoraee_db"
    )

    # JWT Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ecoraee-super-secret-key-change-in-production-2026-uide")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # AWS S3 Settings
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "ecoraee-evidencias-storage")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
