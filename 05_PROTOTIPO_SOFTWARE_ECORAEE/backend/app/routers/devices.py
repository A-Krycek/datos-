from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.entities import (
    Dispositivo, HistorialEstado, Inventario, EstadoDispositivo
)
from backend.app.schemas.dtos import (
    DispositivoCreate, DispositivoResponse, CambioEstadoRequest
)
from backend.app.security import get_current_user, RoleChecker

router = APIRouter(prefix="/devices", tags=["Gestión de Dispositivos y Trazabilidad"])

@router.post("", response_model=DispositivoResponse, status_code=status.HTTP_201_CREATED)
def registrar_dispositivo(
    device_in: DispositivoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(RoleChecker(["ROL_ADMIN", "ROL_OPERADOR"]))
):
    """
    Registra un nuevo dispositivo con código QR único y lo asigna a inventario (CP-02 / RN-01).
    Solo permitido para Operadores o Administradores.
    """
    # 1. Verificar si el QR ya existe (CP-02)
    existente = db.query(Dispositivo).filter(Dispositivo.codigo_qr == device_in.codigo_qr).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"ERROR CP-02: Ya existe un dispositivo registrado con el código QR '{device_in.codigo_qr}'."
        )

    # 2. Crear dispositivo
    nuevo_disp = Dispositivo(
        codigo_qr=device_in.codigo_qr,
        numero_serie=device_in.numero_serie,
        id_modelo=device_in.id_modelo,
        id_lote=device_in.id_lote,
        id_condicion=device_in.id_condicion,
        peso_kg=device_in.peso_kg,
        observaciones=device_in.observaciones
    )
    db.add(nuevo_disp)
    db.flush() # Obtener id_dispositivo

    # 3. Asignar al inventario del centro inicial (RN-06)
    inventario_inicial = Inventario(
        id_centro=device_in.id_centro_inicial,
        id_dispositivo=nuevo_disp.id_dispositivo
    )
    db.add(inventario_inicial)

    # 4. Registrar estado inicial en el Historial (RN-01: Estado 1 = REGISTRADO)
    primer_historial = HistorialEstado(
        id_dispositivo=nuevo_disp.id_dispositivo,
        numero_secuencia=1,
        id_estado=1, # REGISTRADO
        id_usuario=current_user["user_id"],
        observacion="Ingreso inicial registrado en recepción"
    )
    db.add(primer_historial)

    db.commit()
    db.refresh(nuevo_disp)
    return nuevo_disp

@router.get("/{codigo_qr}", response_model=DispositivoResponse)
def consultar_trazabilidad_dispositivo(
    codigo_qr: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Consulta la trazabilidad ininterrumpida de un dispositivo por su QR (CP-14 / RN-01).
    Retorna todo el historial ordenado por secuencia temporal.
    """
    disp = db.query(Dispositivo).filter(Dispositivo.codigo_qr == codigo_qr).first()
    if not disp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún dispositivo con el código QR '{codigo_qr}'."
        )
    return disp

@router.post("/{codigo_qr}/transition-state", response_model=DispositivoResponse)
def cambiar_estado_dispositivo(
    codigo_qr: str,
    transicion: CambioEstadoRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(RoleChecker(["ROL_ADMIN", "ROL_TECNICO", "ROL_LOGISTICA"]))
):
    """
    Registra una transición de estado en el ciclo de vida del equipo (CP-03 / RN-01 / RN-02).
    Cierra la vigencia del estado previo e incrementa la secuencia atómicamente.
    """
    disp = db.query(Dispositivo).filter(Dispositivo.codigo_qr == codigo_qr).first()
    if not disp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dispositivo '{codigo_qr}' no encontrado."
        )

    # Obtener el último estado registrado
    ultimo_hist = (
        db.query(HistorialEstado)
        .filter(HistorialEstado.id_dispositivo == disp.id_dispositivo)
        .order_by(HistorialEstado.numero_secuencia.desc())
        .first()
    )

    nueva_secuencia = (ultimo_hist.numero_secuencia + 1) if ultimo_hist else 1

    # Regla: Cerrar fecha_fin del anterior
    if ultimo_hist and not ultimo_hist.fecha_fin:
        ultimo_hist.fecha_fin = datetime.utcnow()

    # Insertar nuevo estado inmutable
    nuevo_hist = HistorialEstado(
        id_dispositivo=disp.id_dispositivo,
        numero_secuencia=nueva_secuencia,
        id_estado=transicion.id_estado_nuevo,
        id_usuario=current_user["user_id"],
        observacion=transicion.observacion
    )
    db.add(nuevo_hist)
    db.commit()
    db.refresh(disp)
    return disp

@router.get("", response_model=List[DispositivoResponse])
def listar_dispositivos(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Lista dispositivos registrados con paginación."""
    return db.query(Dispositivo).offset(offset).limit(limit).all()
