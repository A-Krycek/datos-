from typing import Optional, List, Dict, Any
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

class DispositivoUpdate(BaseModel):
    numero_serie: Optional[str] = None
    id_modelo: Optional[int] = None
    id_condicion: Optional[int] = None
    peso_kg: Optional[float] = Field(None, gt=0)
    observaciones: Optional[str] = None
    id_centro: Optional[int] = None

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

# --- Lotes y Centros ---
class LoteCreate(BaseModel):
    codigo_lote: str = Field(..., example="LOT-2026-004")
    id_generador: int = Field(default=1)
    cantidad_declarada: int = Field(..., gt=0, example=10)
    peso_declarado_kg: Optional[float] = Field(None, gt=0, example=85.0)
    observaciones: Optional[str] = None

class LoteResponse(BaseModel):
    id_lote: int
    codigo_lote: str
    id_generador: int
    cantidad_declarada: int
    peso_declarado_kg: Optional[float] = None
    observaciones: Optional[str] = None
    fecha_registro: datetime

    class Config:
        from_attributes = True

class CentroResponse(BaseModel):
    id_centro: int
    codigo_centro: str
    nombre: str
    direccion: str
    capacidad_max_unidades: int
    capacidad_max_kg: float
    activo: bool

    class Config:
        from_attributes = True

# --- Evaluaciones y Destino Final ---
class EvaluacionCreate(BaseModel):
    codigo_qr: str
    id_clasificacion: int = Field(..., ge=1, le=4)
    diagnostico_funcional: str
    diagnostico_estetico: str
    aprobado_reutilizacion: bool

class DestinoFinalCreate(BaseModel):
    codigo_qr: str
    id_tipo_destino: int
    entidad_receptora: str
    certificado_numero: str
    observaciones: Optional[str] = None

# --- Movimientos ---
class MovimientoCreate(BaseModel):
    id_centro_origen: int
    id_centro_destino: int
    codigos_qr: List[str]
    transportista: str
    observaciones: Optional[str] = None

# --- Dashboard Stats ---
class StatsDashboardResponse(BaseModel):
    total_dispositivos: int
    total_kg: float
    tasa_reutilizacion_pct: float
    tasa_reciclaje_pct: float
    capacidad_red_semanal_kg: float
    distribucion_estados: Dict[str, int]
    distribucion_categorias: Dict[str, int]

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
