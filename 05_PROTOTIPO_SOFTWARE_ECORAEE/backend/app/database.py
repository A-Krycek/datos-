import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.config import settings

db_url = settings.DATABASE_URL

# Si se usa postgresql:// en SQLAlchemy 2.0+, normalizar a postgresql+psycopg2:// o postgresql+psycopg://
if db_url.startswith("postgresql://"):
    try:
        import psycopg
        # Si psycopg3 está instalado, usar psycopg
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
    except ImportError:
        # Fallback a psycopg2
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )
    if not db_url.startswith("sqlite"):
        with engine.connect() as conn:
            pass
except Exception as e:
    # Fallback automático a SQLite local para desarrollo si PostgreSQL no está levantado
    print(f"[EcoRAEE Backend] Nota: No se pudo conectar a PostgreSQL ({e}).")
    print("[EcoRAEE Backend] Activando base de datos SQLite local (ecoraee_dev.db) para desarrollo.")
    db_url = "sqlite:///./ecoraee_dev.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Generador de sesiones de base de datos para inyección de dependencias."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
