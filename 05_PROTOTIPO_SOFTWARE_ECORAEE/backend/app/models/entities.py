from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, BigInteger, String, Boolean, Numeric, 
    DateTime, Date, Text, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

# ==============================================================================
# SECCIÓN 1: PERSONAS, ROLES Y AUTENTICACIÓN
# ==============================================================================

class Persona(Base):
    __tablename__ = "persona"
    id_persona = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    correo = Column(String(120), unique=True, nullable=False, index=True)
    telefono = Column(String(20))
    direccion = Column(String(200))
    fecha_registro = Column(DateTime(timezone=True), default=datetime.utcnow)
    activo = Column(Boolean, default=True)

class RolSistema(Base):
    __tablename__ = "rol_sistema"
    id_rol_sistema = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(60), unique=True, nullable=False)
    descripcion = Column(String(255))

class Empleado(Base):
    __tablename__ = "empleado"
    id_empleado = Column(BigInteger, primary_key=True, autoincrement=True)
    id_persona = Column(BigInteger, ForeignKey("persona.id_persona"), unique=True, nullable=False)
    codigo_empleado = Column(String(30), unique=True, nullable=False)
    correo_institucional = Column(String(120), unique=True, nullable=False)
    cargo = Column(String(80), nullable=False)
    fecha_ingreso = Column(Date, default=date.today)
    activo = Column(Boolean, default=True)

class Usuario(Base):
    __tablename__ = "usuario"
    id_usuario = Column(BigInteger, primary_key=True, autoincrement=True)
    id_empleado = Column(BigInteger, ForeignKey("empleado.id_empleado"), unique=True, nullable=False)
    id_rol_sistema = Column(Integer, ForeignKey("rol_sistema.id_rol_sistema"), nullable=False)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    activo = Column(Boolean, default=True)
    ultimo_acceso = Column(DateTime(timezone=True))
    fecha_creacion = Column(DateTime(timezone=True), default=datetime.utcnow)

    rol = relationship("RolSistema")
    empleado = relationship("Empleado")

# ==============================================================================
# SECCIÓN 2: CATÁLOGOS BASE
# ==============================================================================

class CategoriaDispositivo(Base):
    __tablename__ = "categoria_dispositivo"
    id_categoria = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(80), unique=True, nullable=False)
    descripcion = Column(String(255))

class Marca(Base):
    __tablename__ = "marca"
    id_marca = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), unique=True, nullable=False)

class ModeloDispositivo(Base):
    __tablename__ = "modelo_dispositivo"
    id_modelo = Column(Integer, primary_key=True, autoincrement=True)
    id_marca = Column(Integer, ForeignKey("marca.id_marca"), nullable=False)
    id_categoria = Column(Integer, ForeignKey("categoria_dispositivo.id_categoria"), nullable=False)
    nombre = Column(String(100), nullable=False)

    marca = relationship("Marca")
    categoria = relationship("CategoriaDispositivo")

class CondicionDispositivo(Base):
    __tablename__ = "condicion_dispositivo"
    id_condicion = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(60), unique=True, nullable=False)

class EstadoDispositivo(Base):
    __tablename__ = "estado_dispositivo"
    id_estado = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(60), unique=True, nullable=False)
    es_terminal = Column(Boolean, default=False)

class ClasificacionTecnica(Base):
    __tablename__ = "clasificacion_tecnica"
    id_clasificacion = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(60), unique=True, nullable=False)
    permite_donacion = Column(Boolean, default=False)

# ==============================================================================
# SECCIÓN 3: DISPOSITIVOS Y TRAZABILIDAD (RN-01)
# ==============================================================================

class Lote(Base):
    __tablename__ = "lote"
    id_lote = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo_lote = Column(String(40), unique=True, nullable=False, index=True)
    id_generador = Column(BigInteger, ForeignKey("persona.id_persona"), nullable=False)
    fecha_registro = Column(DateTime(timezone=True), default=datetime.utcnow)
    cantidad_declarada = Column(Integer, nullable=False)
    peso_declarado_kg = Column(Numeric(10, 2))
    observaciones = Column(Text)

class Dispositivo(Base):
    __tablename__ = "dispositivo"
    id_dispositivo = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    codigo_qr = Column(String(64), unique=True, nullable=False, index=True)
    numero_serie = Column(String(100), index=True)
    id_modelo = Column(Integer, ForeignKey("modelo_dispositivo.id_modelo"), nullable=False)
    id_lote = Column(BigInteger, ForeignKey("lote.id_lote"))
    id_condicion = Column(Integer, ForeignKey("condicion_dispositivo.id_condicion"), nullable=False)
    peso_kg = Column(Numeric(8, 2), nullable=False)
    fecha_registro = Column(DateTime(timezone=True), default=datetime.utcnow)
    observaciones = Column(Text)

    modelo = relationship("ModeloDispositivo")
    condicion = relationship("CondicionDispositivo")
    lote = relationship("Lote")
    historial = relationship("HistorialEstado", back_populates="dispositivo", order_by="HistorialEstado.numero_secuencia")

class HistorialEstado(Base):
    __tablename__ = "historial_estado"
    id_dispositivo = Column(BigInteger, ForeignKey("dispositivo.id_dispositivo", ondelete="CASCADE"), primary_key=True)
    numero_secuencia = Column(Integer, primary_key=True)
    id_estado = Column(Integer, ForeignKey("estado_dispositivo.id_estado"), nullable=False)
    id_usuario = Column(BigInteger, ForeignKey("usuario.id_usuario"), nullable=False)
    fecha_inicio = Column(DateTime(timezone=True), default=datetime.utcnow)
    fecha_fin = Column(DateTime(timezone=True))
    observacion = Column(Text)

    dispositivo = relationship("Dispositivo", back_populates="historial")
    estado = relationship("EstadoDispositivo")
    usuario = relationship("Usuario")

# ==============================================================================
# SECCIÓN 4: CENTROS DE ACOPIO E INVENTARIO
# ==============================================================================

class CentroAcopio(Base):
    __tablename__ = "centro_acopio"
    id_centro = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo_centro = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String(200), nullable=False)
    capacidad_max_unidades = Column(Integer, nullable=False)
    capacidad_max_kg = Column(Numeric(10, 2), nullable=False)
    activo = Column(Boolean, default=True)

class Inventario(Base):
    __tablename__ = "inventario"
    id_inventario = Column(BigInteger, primary_key=True, autoincrement=True)
    id_centro = Column(BigInteger, ForeignKey("centro_acopio.id_centro"), nullable=False)
    id_dispositivo = Column(BigInteger, ForeignKey("dispositivo.id_dispositivo"), unique=True, nullable=False)
    fecha_ingreso = Column(DateTime(timezone=True), default=datetime.utcnow)

    centro = relationship("CentroAcopio")
    dispositivo = relationship("Dispositivo")

# ==============================================================================
# SECCIÓN 5: RED LOGÍSTICA MATEMÁTICA (ARISTA_RED Y NODO_RED)
# ==============================================================================

class NodoRed(Base):
    __tablename__ = "nodo_red"
    id_nodo = Column(Integer, primary_key=True, autoincrement=True)
    id_centro = Column(BigInteger, ForeignKey("centro_acopio.id_centro"), unique=True)
    codigo_nodo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    tipo_nodo = Column(String(20), nullable=False) # FUENTE, INTERMEDIO, SUMIDERO
    capacidad_procesamiento_kg = Column(Numeric(10, 2), default=1000.00)
    activo = Column(Boolean, default=True)

class AristaRed(Base):
    __tablename__ = "arista_red"
    id_arista = Column(Integer, primary_key=True, autoincrement=True)
    id_nodo_origen = Column(Integer, ForeignKey("nodo_red.id_nodo"), nullable=False)
    id_nodo_destino = Column(Integer, ForeignKey("nodo_red.id_nodo"), nullable=False)
    capacidad_max_kg = Column(Numeric(10, 2), nullable=False)
    costo_transporte_usd = Column(Numeric(8, 2), default=0.0)
    activa = Column(Boolean, default=True)

    nodo_origen = relationship("NodoRed", foreign_keys=[id_nodo_origen])
    nodo_destino = relationship("NodoRed", foreign_keys=[id_nodo_destino])
