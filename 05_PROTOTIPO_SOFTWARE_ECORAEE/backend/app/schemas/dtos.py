from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id_usuario: int
    username: str
    role: str
    activo: bool

    class Config:
        from_attributes = True

# --- Dispositivo Schemas ---
class DispositivoCreate(BaseModel):
    codigo_qr: str = Field(..., example="QR-UIDA-PC-999")
    numero_serie: Optional[str] = Field(None, example="SN-DELL-9921")
    id_modelo: int = Field(..., example=1)
    id_lote: Optional[int] = Field(None, example=1)
    id_condicion: int = Field(..., example=1)
    peso_kg: float = Field(..., gt=0, example=8.5)
    observaciones: Optional[str] = None
    id_centro_inicial: int = Field(..., example=1)

class HistorialEstadoItem(BaseModel):
    numero_secuencia: int
    id_estado: int
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None
    observacion: Optional[str] = None

    class Config:
        from_attributes = True

class DispositivoResponse(BaseModel):
    id_dispositivo: int
    codigo_qr: str
    numero_serie: Optional[str]
    id_modelo: int
    id_condicion: int
    peso_kg: float
    fecha_registro: datetime
    observaciones: Optional[str]
    historial: List[HistorialEstadoItem] = []

    class Config:
        from_attributes = True

class CambioEstadoRequest(BaseModel):
    id_estado_nuevo: int = Field(..., example=3)
    observacion: str = Field(..., example="Evaluación técnica completada exitosamente")

# --- Red Logística / Edmonds-Karp Schemas ---
class AristaInfo(BaseModel):
    origen: str
    destino: str
    capacidad_kg: float
    flujo_asignado_kg: float
    saturada: bool

class NetworkOptimizationResponse(BaseModel):
    escenario: str
    flujo_maximo_total_kg: float
    corte_minimo_capacidad_kg: float
    particion_s_fuente: List[str]
    particion_t_sumidero: List[str]
    aristas_criticas_cuello_botella: List[str]
    detalle_aristas: List[AristaInfo]
    mensaje_decision: str
