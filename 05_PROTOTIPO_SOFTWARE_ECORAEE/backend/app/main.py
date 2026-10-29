import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Asegurar que el path raíz del proyecto esté en sys.path para importaciones
root_path = Path(__file__).resolve().parent.parent.parent
if str(root_path) not in sys.path:
    sys.path.insert(0, str(root_path))

from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.routers import auth, devices, network

# Inicialización de tablas en la base de datos
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[EcoRAEE Backend] Advertencia al conectar/crear tablas en BD: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "API REST de EcoRAEE Cloud para la Gestión, Trazabilidad y Optimización "
        "de Residuos Electrónicos (UIDE / ASU - Quinto Semestre).\n\n"
        "**Funcionalidades Principales:**\n"
        "- Autenticación y Control de Acceso por Roles (RBAC - CP-01)\n"
        "- Registro de Dispositivos y Trazabilidad Inmutable (RN-01, CP-02, CP-03, CP-14)\n"
        "- Optimización de Red Logística con Algoritmo Edmonds-Karp (RF-MD-04, CP-07, CP-08, CP-09)\n"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS para el Frontend SPA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción se restringe al dominio/S3 del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(devices.router, prefix=settings.API_V1_STR)
app.include_router(network.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Sistema"])
def root():
    return {
        "sistema": "EcoRAEE Cloud API",
        "version": "1.0.0",
        "estado": "OPERATIVO",
        "documentacion": "/docs",
        "entorno": settings.ENVIRONMENT
    }

@app.get("/health", tags=["Sistema"])
def health_check():
    """Endpoint de comprobación de salud para el balanceador ALB de AWS (RNF-02)."""
    return {"status": "healthy"}
