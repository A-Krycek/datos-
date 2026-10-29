-- ============================================================================
-- PROYECTO INTEGRADOR - QUINTO SEMESTRE 2026
-- ASIGNATURA: SISTEMAS DE GESTIÓN DE BASES DE DATOS (05-SIN-A)
-- UNIVERSIDAD INTERNACIONAL DEL ECUADOR (UIDE) / ARIZONA STATE UNIVERSITY
-- INTEGRANTES: Daniel Fernando Pazmiño Mera, Matias Nicolas Herrera Cueva, Ihair Geordano Llamuca López
-- DOCENTE: Ing. María del Carmen Salazar Torres, Mgtr.
-- MOTOR: MICROSOFT SQL SERVER (T-SQL)
-- ARCHIVO: 01_DDL.sql
-- DESCRIPCIÓN: CREACIÓN DE BASE DE DATOS Y TABLAS NORMALIZADAS (3FN/BCNF)
--              CON PK, FK, UNIQUE (AK), NOT NULL, CHECK Y DEFAULT.
-- ============================================================================

-- 1. CREACIÓN DE LA BASE DE DATOS
IF DB_ID('BD_ECORAEE_CLOUD') IS NOT NULL
BEGIN
    ALTER DATABASE BD_ECORAEE_CLOUD SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BD_ECORAEE_CLOUD;
END;
GO

CREATE DATABASE BD_ECORAEE_CLOUD;
GO

USE BD_ECORAEE_CLOUD;
GO

-- ============================================================================
-- SECCIÓN 1: CATÁLOGOS BASE Y PARAMÉTRICAS DEL SISTEMA
-- ============================================================================

-- 1.1. Rol de Actores en la Economía Circular
CREATE TABLE ROL_ACTOR (
    id_rol_actor INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_ROL_ACTOR PRIMARY KEY CLUSTERED (id_rol_actor),
    CONSTRAINT UQ_ROL_ACTOR_codigo UNIQUE (codigo),
    CONSTRAINT UQ_ROL_ACTOR_nombre UNIQUE (nombre)
);
GO

-- 1.2. Rol de Sistema para Autenticación y Autorización (RBAC)
CREATE TABLE ROL_SISTEMA (
    id_rol_sistema INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_ROL_SISTEMA PRIMARY KEY CLUSTERED (id_rol_sistema),
    CONSTRAINT UQ_ROL_SISTEMA_codigo UNIQUE (codigo),
    CONSTRAINT UQ_ROL_SISTEMA_nombre UNIQUE (nombre)
);
GO

-- 1.3. Tipo de Centro Logístico
CREATE TABLE TIPO_CENTRO (
    id_tipo_centro INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_TIPO_CENTRO PRIMARY KEY CLUSTERED (id_tipo_centro),
    CONSTRAINT UQ_TIPO_CENTRO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_TIPO_CENTRO_nombre UNIQUE (nombre)
);
GO

-- 1.4. Categorías de Residuos Electrónicos (RAEE)
CREATE TABLE CATEGORIA_DISPOSITIVO (
    id_categoria INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_CATEGORIA_DISPOSITIVO PRIMARY KEY CLUSTERED (id_categoria),
    CONSTRAINT UQ_CATEGORIA_DISPOSITIVO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_CATEGORIA_DISPOSITIVO_nombre UNIQUE (nombre)
);
GO

-- 1.5. Marcas de Hardware
CREATE TABLE MARCA (
    id_marca INT IDENTITY(1,1) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    CONSTRAINT PK_MARCA PRIMARY KEY CLUSTERED (id_marca),
    CONSTRAINT UQ_MARCA_nombre UNIQUE (nombre)
);
GO

-- 1.6. Modelos de Dispositivos (Elimina dependencia transitiva en DISPOSITIVO)
CREATE TABLE MODELO_DISPOSITIVO (
    id_modelo INT IDENTITY(1,1) NOT NULL,
    id_marca INT NOT NULL,
    id_categoria INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT PK_MODELO_DISPOSITIVO PRIMARY KEY CLUSTERED (id_modelo),
    CONSTRAINT FK_MODELO_MARCA FOREIGN KEY (id_marca) 
        REFERENCES MARCA(id_marca),
    CONSTRAINT FK_MODELO_CATEGORIA FOREIGN KEY (id_categoria) 
        REFERENCES CATEGORIA_DISPOSITIVO(id_categoria),
    CONSTRAINT UQ_MODELO_marca_nombre UNIQUE (id_marca, nombre)
);
GO

-- 1.7. Condición Física Inicial del Dispositivo al Ingreso
CREATE TABLE CONDICION_DISPOSITIVO (
    id_condicion INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_CONDICION_DISPOSITIVO PRIMARY KEY CLUSTERED (id_condicion),
    CONSTRAINT UQ_CONDICION_DISPOSITIVO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_CONDICION_DISPOSITIVO_nombre UNIQUE (nombre)
);
GO

-- 1.8. Estados del Ciclo de Vida del RAEE (Trazabilidad)
CREATE TABLE ESTADO_DISPOSITIVO (
    id_estado INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NULL,
    es_terminal BIT NOT NULL CONSTRAINT DF_ESTADO_es_terminal DEFAULT (0),
    CONSTRAINT PK_ESTADO_DISPOSITIVO PRIMARY KEY CLUSTERED (id_estado),
    CONSTRAINT UQ_ESTADO_DISPOSITIVO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_ESTADO_DISPOSITIVO_nombre UNIQUE (nombre)
);
GO

-- 1.9. Clasificación Técnica de Diagnóstico (RN-04)
CREATE TABLE CLASIFICACION_TECNICA (
    id_clasificacion INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    permite_donacion BIT NOT NULL CONSTRAINT DF_CLASIF_permite_donacion DEFAULT (0),
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_CLASIFICACION_TECNICA PRIMARY KEY CLUSTERED (id_clasificacion),
    CONSTRAINT UQ_CLASIFICACION_TECNICA_codigo UNIQUE (codigo),
    CONSTRAINT UQ_CLASIFICACION_TECNICA_nombre UNIQUE (nombre)
);
GO

-- 1.10. Tipos de Trabajos de Taller / Reparación
CREATE TABLE TIPO_TRABAJO (
    id_tipo_trabajo INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_TIPO_TRABAJO PRIMARY KEY CLUSTERED (id_tipo_trabajo),
    CONSTRAINT UQ_TIPO_TRABAJO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_TIPO_TRABAJO_nombre UNIQUE (nombre)
);
GO

-- 1.11. Estados de Órdenes de Trabajo
CREATE TABLE ESTADO_ORDEN (
    id_estado_orden INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    CONSTRAINT PK_ESTADO_ORDEN PRIMARY KEY CLUSTERED (id_estado_orden),
    CONSTRAINT UQ_ESTADO_ORDEN_codigo UNIQUE (codigo),
    CONSTRAINT UQ_ESTADO_ORDEN_nombre UNIQUE (nombre)
);
GO

-- 1.12. Estados de Movimientos de Transporte
CREATE TABLE ESTADO_MOVIMIENTO (
    id_estado_movimiento INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    CONSTRAINT PK_ESTADO_MOVIMIENTO PRIMARY KEY CLUSTERED (id_estado_movimiento),
    CONSTRAINT UQ_ESTADO_MOVIMIENTO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_ESTADO_MOVIMIENTO_nombre UNIQUE (nombre)
);
GO

-- 1.13. Tipos de Destino Final
CREATE TABLE TIPO_DESTINO (
    id_tipo_destino INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    es_social BIT NOT NULL CONSTRAINT DF_TIPO_DESTINO_es_social DEFAULT (0),
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_TIPO_DESTINO PRIMARY KEY CLUSTERED (id_tipo_destino),
    CONSTRAINT UQ_TIPO_DESTINO_codigo UNIQUE (codigo),
    CONSTRAINT UQ_TIPO_DESTINO_nombre UNIQUE (nombre)
);
GO

-- 1.14. Tipos de Evidencia Digital en Amazon S3
CREATE TABLE TIPO_EVIDENCIA (
    id_tipo_evidencia INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_TIPO_EVIDENCIA PRIMARY KEY CLUSTERED (id_tipo_evidencia),
    CONSTRAINT UQ_TIPO_EVIDENCIA_codigo UNIQUE (codigo),
    CONSTRAINT UQ_TIPO_EVIDENCIA_nombre UNIQUE (nombre)
);
GO

-- 1.15. Tipos de Componentes Electrónicos
CREATE TABLE TIPO_COMPONENTE (
    id_tipo_componente INT IDENTITY(1,1) NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_TIPO_COMPONENTE PRIMARY KEY CLUSTERED (id_tipo_componente),
    CONSTRAINT UQ_TIPO_COMPONENTE_codigo UNIQUE (codigo),
    CONSTRAINT UQ_TIPO_COMPONENTE_nombre UNIQUE (nombre)
);
GO

-- ============================================================================
-- SECCIÓN 2: PERSONAS, SUBTIPOS, EMPLEADOS Y USUARIOS
-- ============================================================================

-- 2.1. Supertipo PERSONA
CREATE TABLE PERSONA (
    id_persona BIGINT IDENTITY(1,1) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    telefono VARCHAR(20) NULL,
    direccion VARCHAR(200) NULL,
    fecha_registro DATETIME2 NOT NULL CONSTRAINT DF_PERSONA_fecha_registro DEFAULT (SYSDATETIME()),
    activo BIT NOT NULL CONSTRAINT DF_PERSONA_activo DEFAULT (1),
    CONSTRAINT PK_PERSONA PRIMARY KEY CLUSTERED (id_persona),
    CONSTRAINT UQ_PERSONA_correo UNIQUE (correo),
    CONSTRAINT CK_PERSONA_correo CHECK (correo LIKE '%_@__%.__%')
);
GO

-- 2.2. Subtipo 1:1 - PERSONA_NATURAL
CREATE TABLE PERSONA_NATURAL (
    id_persona BIGINT NOT NULL,
    tipo_identificacion VARCHAR(20) NOT NULL CONSTRAINT DF_PN_tipo_id DEFAULT ('CEDULA'),
    numero_identificacion VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    CONSTRAINT PK_PERSONA_NATURAL PRIMARY KEY CLUSTERED (id_persona),
    CONSTRAINT FK_PN_PERSONA FOREIGN KEY (id_persona) 
        REFERENCES PERSONA(id_persona) ON DELETE CASCADE,
    CONSTRAINT UQ_PN_identificacion UNIQUE (numero_identificacion),
    CONSTRAINT CK_PN_tipo_id CHECK (tipo_identificacion IN ('CEDULA', 'PASAPORTE', 'RUC_NATURAL'))
);
GO

-- 2.3. Subtipo 1:1 - PERSONA_JURIDICA
CREATE TABLE PERSONA_JURIDICA (
    id_persona BIGINT NOT NULL,
    ruc VARCHAR(20) NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    nombre_comercial VARCHAR(150) NULL,
    CONSTRAINT PK_PERSONA_JURIDICA PRIMARY KEY CLUSTERED (id_persona),
    CONSTRAINT FK_PJ_PERSONA FOREIGN KEY (id_persona) 
        REFERENCES PERSONA(id_persona) ON DELETE CASCADE,
    CONSTRAINT UQ_PJ_ruc UNIQUE (ruc)
);
GO

-- 2.4. Tabla Intermedia M:N - PERSONA_ROL
CREATE TABLE PERSONA_ROL (
    id_persona BIGINT NOT NULL,
    id_rol_actor INT NOT NULL,
    fecha_asignacion DATETIME2 NOT NULL CONSTRAINT DF_PR_fecha DEFAULT (SYSDATETIME()),
    CONSTRAINT PK_PERSONA_ROL PRIMARY KEY CLUSTERED (id_persona, id_rol_actor),
    CONSTRAINT FK_PR_PERSONA FOREIGN KEY (id_persona) 
        REFERENCES PERSONA(id_persona) ON DELETE CASCADE,
    CONSTRAINT FK_PR_ROL FOREIGN KEY (id_rol_actor) 
        REFERENCES ROL_ACTOR(id_rol_actor)
);
GO

-- 2.5. EMPLEADO (Personal institucional del programa)
CREATE TABLE EMPLEADO (
    id_empleado BIGINT IDENTITY(1,1) NOT NULL,
    id_persona BIGINT NOT NULL,
    codigo_empleado VARCHAR(30) NOT NULL,
    correo_institucional VARCHAR(120) NOT NULL,
    cargo VARCHAR(80) NOT NULL,
    fecha_ingreso DATE NOT NULL CONSTRAINT DF_EMP_fecha_ingreso DEFAULT (CAST(SYSDATETIME() AS DATE)),
    activo BIT NOT NULL CONSTRAINT DF_EMP_activo DEFAULT (1),
    CONSTRAINT PK_EMPLEADO PRIMARY KEY CLUSTERED (id_empleado),
    CONSTRAINT FK_EMP_PERSONA FOREIGN KEY (id_persona) 
        REFERENCES PERSONA(id_persona),
    CONSTRAINT UQ_EMP_id_persona UNIQUE (id_persona),
    CONSTRAINT UQ_EMP_codigo UNIQUE (codigo_empleado),
    CONSTRAINT UQ_EMP_correo_inst UNIQUE (correo_institucional),
    CONSTRAINT CK_EMP_correo_inst CHECK (correo_institucional LIKE '%@uide.edu.ec' OR correo_institucional LIKE '%@uida.edu.ec')
);
GO

-- 2.6. USUARIO (Cuentas del sistema asociadas a empleados)
CREATE TABLE USUARIO (
    id_usuario BIGINT IDENTITY(1,1) NOT NULL,
    id_empleado BIGINT NOT NULL,
    id_rol_sistema INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BIT NOT NULL CONSTRAINT DF_USUARIO_activo DEFAULT (1),
    ultimo_acceso DATETIME2 NULL,
    fecha_creacion DATETIME2 NOT NULL CONSTRAINT DF_USUARIO_creacion DEFAULT (SYSDATETIME()),
    CONSTRAINT PK_USUARIO PRIMARY KEY CLUSTERED (id_usuario),
    CONSTRAINT FK_USUARIO_EMPLEADO FOREIGN KEY (id_empleado) 
        REFERENCES EMPLEADO(id_empleado) ON DELETE CASCADE,
    CONSTRAINT FK_USUARIO_ROL_SISTEMA FOREIGN KEY (id_rol_sistema) 
        REFERENCES ROL_SISTEMA(id_rol_sistema),
    CONSTRAINT UQ_USUARIO_id_empleado UNIQUE (id_empleado),
    CONSTRAINT UQ_USUARIO_username UNIQUE (username)
);
GO

-- ============================================================================
-- SECCIÓN 3: CENTROS DE ACOPIO, UBICACIONES E INFRAESTRUCTURA
-- ============================================================================

-- 3.1. CENTRO_ACOPIO
CREATE TABLE CENTRO_ACOPIO (
    id_centro BIGINT IDENTITY(1,1) NOT NULL,
    id_tipo_centro INT NOT NULL,
    codigo_centro VARCHAR(30) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    capacidad_max_unidades INT NOT NULL,
    capacidad_max_kg DECIMAL(10,2) NOT NULL,
    activo BIT NOT NULL CONSTRAINT DF_CENTRO_activo DEFAULT (1),
    CONSTRAINT PK_CENTRO_ACOPIO PRIMARY KEY CLUSTERED (id_centro),
    CONSTRAINT FK_CENTRO_TIPO FOREIGN KEY (id_tipo_centro) 
        REFERENCES TIPO_CENTRO(id_tipo_centro),
    CONSTRAINT UQ_CENTRO_codigo UNIQUE (codigo_centro),
    CONSTRAINT CK_CENTRO_cap_unidades CHECK (capacidad_max_unidades > 0),
    CONSTRAINT CK_CENTRO_cap_kg CHECK (capacidad_max_kg > 0)
);
GO

-- 3.2. UBICACION (Estantes y bodegas internas)
CREATE TABLE UBICACION (
    id_ubicacion BIGINT IDENTITY(1,1) NOT NULL,
    id_centro BIGINT NOT NULL,
    codigo_ubicacion VARCHAR(40) NOT NULL,
    pasillo VARCHAR(20) NULL,
    estante VARCHAR(20) NULL,
    nivel VARCHAR(20) NULL,
    descripcion VARCHAR(150) NULL,
    CONSTRAINT PK_UBICACION PRIMARY KEY CLUSTERED (id_ubicacion),
    CONSTRAINT FK_UBICACION_CENTRO FOREIGN KEY (id_centro) 
        REFERENCES CENTRO_ACOPIO(id_centro) ON DELETE CASCADE,
    CONSTRAINT UQ_UBICACION_centro_codigo UNIQUE (id_centro, codigo_ubicacion)
);
GO

-- ============================================================================
-- SECCIÓN 4: SOLICITUDES, LOTES Y DISPOSITIVOS (CON SUBTIPOS)
-- ============================================================================

-- 4.1. SOLICITUD_RECOLECCION
CREATE TABLE SOLICITUD_RECOLECCION (
    id_solicitud BIGINT IDENTITY(1,1) NOT NULL,
    id_generador BIGINT NOT NULL,
    codigo_solicitud VARCHAR(40) NOT NULL,
    fecha_solicitud DATETIME2 NOT NULL CONSTRAINT DF_SOL_fecha DEFAULT (SYSDATETIME()),
    estado_solicitud VARCHAR(30) NOT NULL CONSTRAINT DF_SOL_estado DEFAULT ('PENDIENTE'),
    direccion_recoleccion VARCHAR(200) NULL,
    observaciones VARCHAR(MAX) NULL,
    CONSTRAINT PK_SOLICITUD_RECOLECCION PRIMARY KEY CLUSTERED (id_solicitud),
    CONSTRAINT FK_SOL_GENERADOR FOREIGN KEY (id_generador) 
        REFERENCES PERSONA(id_persona),
    CONSTRAINT UQ_SOL_codigo UNIQUE (codigo_solicitud),
    CONSTRAINT CK_SOL_estado CHECK (estado_solicitud IN ('PENDIENTE', 'APROBADA', 'EN_CAMINO', 'COMPLETADA', 'CANCELADA'))
);
GO

-- 4.2. LOTE
CREATE TABLE LOTE (
    id_lote BIGINT IDENTITY(1,1) NOT NULL,
    codigo_lote VARCHAR(40) NOT NULL,
    id_generador BIGINT NOT NULL,
    id_solicitud BIGINT NULL,
    fecha_registro DATETIME2 NOT NULL CONSTRAINT DF_LOTE_fecha DEFAULT (SYSDATETIME()),
    cantidad_declarada INT NOT NULL,
    peso_declarado_kg DECIMAL(10,2) NULL,
    observaciones VARCHAR(MAX) NULL,
    CONSTRAINT PK_LOTE PRIMARY KEY CLUSTERED (id_lote),
    CONSTRAINT FK_LOTE_GENERADOR FOREIGN KEY (id_generador) 
        REFERENCES PERSONA(id_persona),
    CONSTRAINT FK_LOTE_SOLICITUD FOREIGN KEY (id_solicitud) 
        REFERENCES SOLICITUD_RECOLECCION(id_solicitud),
    CONSTRAINT UQ_LOTE_codigo UNIQUE (codigo_lote),
    CONSTRAINT CK_LOTE_cantidad CHECK (cantidad_declarada > 0),
    CONSTRAINT CK_LOTE_peso CHECK (peso_declarado_kg IS NULL OR peso_declarado_kg > 0)
);
GO

-- 4.3. Entidad Central: DISPOSITIVO (RN-01)
CREATE TABLE DISPOSITIVO (
    id_dispositivo BIGINT IDENTITY(1,1) NOT NULL,
    codigo_qr VARCHAR(64) NOT NULL,
    numero_serie VARCHAR(100) NULL,
    id_modelo INT NOT NULL,
    id_lote BIGINT NULL,
    id_condicion INT NOT NULL,
    peso_kg DECIMAL(8,2) NOT NULL,
    fecha_registro DATETIME2 NOT NULL CONSTRAINT DF_DISPOSITIVO_fecha DEFAULT (SYSDATETIME()),
    observaciones VARCHAR(MAX) NULL,
    CONSTRAINT PK_DISPOSITIVO PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_DISPOSITIVO_MODELO FOREIGN KEY (id_modelo) 
        REFERENCES MODELO_DISPOSITIVO(id_modelo),
    CONSTRAINT FK_DISPOSITIVO_LOTE FOREIGN KEY (id_lote) 
        REFERENCES LOTE(id_lote),
    CONSTRAINT FK_DISPOSITIVO_CONDICION FOREIGN KEY (id_condicion) 
        REFERENCES CONDICION_DISPOSITIVO(id_condicion),
    CONSTRAINT UQ_DISPOSITIVO_qr UNIQUE (codigo_qr),
    CONSTRAINT CK_DISPOSITIVO_peso CHECK (peso_kg > 0)
);
GO

-- Índice único filtrado para admitir números de serie nulos sin violar unicidad
CREATE UNIQUE NONCLUSTERED INDEX UQ_DISPOSITIVO_serie 
ON DISPOSITIVO(numero_serie) 
WHERE numero_serie IS NOT NULL AND numero_serie <> '';
GO

-- 4.4. Subtipo 1:1 - COMPUTADORA
CREATE TABLE COMPUTADORA (
    id_dispositivo BIGINT NOT NULL,
    procesador VARCHAR(80) NOT NULL,
    ram_total_gb INT NOT NULL,
    almacenamiento_total_gb INT NOT NULL,
    formato VARCHAR(30) NOT NULL CONSTRAINT DF_COMP_formato DEFAULT ('LAPTOP'),
    CONSTRAINT PK_COMPUTADORA PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_COMP_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_COMP_ram CHECK (ram_total_gb > 0),
    CONSTRAINT CK_COMP_storage CHECK (almacenamiento_total_gb > 0)
);
GO

-- 4.5. Subtipo 1:1 - MONITOR
CREATE TABLE MONITOR (
    id_dispositivo BIGINT NOT NULL,
    pulgadas DECIMAL(4,1) NOT NULL,
    resolucion VARCHAR(30) NOT NULL,
    tipo_panel VARCHAR(30) NULL,
    CONSTRAINT PK_MONITOR PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_MON_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_MON_pulgadas CHECK (pulgadas > 0)
);
GO

-- 4.6. Subtipo 1:1 - TABLET
CREATE TABLE TABLET (
    id_dispositivo BIGINT NOT NULL,
    imei VARCHAR(20) NULL,
    almacenamiento_gb INT NOT NULL,
    sistema_operativo VARCHAR(40) NOT NULL,
    CONSTRAINT PK_TABLET PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_TAB_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_TAB_storage CHECK (almacenamiento_gb > 0)
);
GO
CREATE UNIQUE NONCLUSTERED INDEX UQ_TABLET_imei ON TABLET(imei) WHERE imei IS NOT NULL AND imei <> '';
GO

-- 4.7. Subtipo 1:1 - TELEFONO
CREATE TABLE TELEFONO (
    id_dispositivo BIGINT NOT NULL,
    imei VARCHAR(20) NULL,
    almacenamiento_gb INT NOT NULL,
    sistema_operativo VARCHAR(40) NOT NULL,
    CONSTRAINT PK_TELEFONO PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_TEL_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_TEL_storage CHECK (almacenamiento_gb > 0)
);
GO
CREATE UNIQUE NONCLUSTERED INDEX UQ_TELEFONO_imei ON TELEFONO(imei) WHERE imei IS NOT NULL AND imei <> '';
GO

-- 4.8. Subtipo 1:1 - ROUTER
CREATE TABLE ROUTER (
    id_dispositivo BIGINT NOT NULL,
    numero_puertos INT NOT NULL,
    estandar_wifi VARCHAR(40) NULL,
    velocidad_maxima_mbps INT NULL,
    CONSTRAINT PK_ROUTER PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_ROU_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_ROU_puertos CHECK (numero_puertos >= 0)
);
GO

-- 4.9. Subtipo 1:1 - OTROS_DISPOSITIVOS
CREATE TABLE OTROS_DISPOSITIVOS (
    id_dispositivo BIGINT NOT NULL,
    descripcion_tecnica VARCHAR(MAX) NOT NULL,
    voltaje_operacion VARCHAR(30) NULL,
    CONSTRAINT PK_OTROS_DISPOSITIVOS PRIMARY KEY CLUSTERED (id_dispositivo),
    CONSTRAINT FK_OTR_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE
);
GO

-- 4.10. COMPONENTE (Extracción y canibalización)
CREATE TABLE COMPONENTE (
    id_componente BIGINT IDENTITY(1,1) NOT NULL,
    id_dispositivo_origen BIGINT NULL,
    id_dispositivo_actual BIGINT NULL,
    id_tipo_componente INT NOT NULL,
    marca VARCHAR(80) NULL,
    modelo VARCHAR(80) NULL,
    numero_serie VARCHAR(100) NULL,
    capacidad VARCHAR(50) NULL,
    fecha_registro DATETIME2 NOT NULL CONSTRAINT DF_COMPONENTE_fecha DEFAULT (SYSDATETIME()),
    fecha_extraccion DATETIME2 NULL,
    estado VARCHAR(30) NOT NULL CONSTRAINT DF_COMPONENTE_estado DEFAULT ('DISPONIBLE'),
    CONSTRAINT PK_COMPONENTE PRIMARY KEY CLUSTERED (id_componente),
    CONSTRAINT FK_COMPONENTE_ORIGEN FOREIGN KEY (id_dispositivo_origen) 
        REFERENCES DISPOSITIVO(id_dispositivo),
    CONSTRAINT FK_COMPONENTE_ACTUAL FOREIGN KEY (id_dispositivo_actual) 
        REFERENCES DISPOSITIVO(id_dispositivo),
    CONSTRAINT FK_COMPONENTE_TIPO FOREIGN KEY (id_tipo_componente) 
        REFERENCES TIPO_COMPONENTE(id_tipo_componente),
    CONSTRAINT CK_COMPONENTE_estado CHECK (estado IN ('DISPONIBLE', 'INSTALADO', 'DEFECTUOSO', 'RECICLADO'))
);
GO

-- ============================================================================
-- SECCIÓN 5: ENTIDADES DÉBILES, INVENTARIO Y TRAZABILIDAD (RN-01, RN-06)
-- ============================================================================

-- 5.1. ENTIDAD DÉBIL 1: HISTORIAL_ESTADO
-- PK Compuesta: {id_dispositivo (FK Fuerte), numero_secuencia (Clave Parcial)}
CREATE TABLE HISTORIAL_ESTADO (
    id_dispositivo BIGINT NOT NULL,
    numero_secuencia INT NOT NULL,
    id_estado INT NOT NULL,
    id_usuario BIGINT NOT NULL,
    fecha_inicio DATETIME2 NOT NULL CONSTRAINT DF_HIST_inicio DEFAULT (SYSDATETIME()),
    fecha_fin DATETIME2 NULL,
    observacion VARCHAR(MAX) NULL,
    CONSTRAINT PK_HISTORIAL_ESTADO PRIMARY KEY CLUSTERED (id_dispositivo, numero_secuencia),
    CONSTRAINT FK_HIST_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT FK_HIST_ESTADO FOREIGN KEY (id_estado) 
        REFERENCES ESTADO_DISPOSITIVO(id_estado),
    CONSTRAINT FK_HIST_USUARIO FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario),
    CONSTRAINT CK_HIST_secuencia CHECK (numero_secuencia > 0)
);
GO

-- 5.2. INVENTARIO (Ubicación física actual del equipo en centros)
CREATE TABLE INVENTARIO (
    id_inventario BIGINT IDENTITY(1,1) NOT NULL,
    id_centro BIGINT NOT NULL,
    id_ubicacion BIGINT NULL,
    id_dispositivo BIGINT NOT NULL,
    fecha_ingreso DATETIME2 NOT NULL CONSTRAINT DF_INV_ingreso DEFAULT (SYSDATETIME()),
    CONSTRAINT PK_INVENTARIO PRIMARY KEY CLUSTERED (id_inventario),
    CONSTRAINT FK_INV_CENTRO FOREIGN KEY (id_centro) 
        REFERENCES CENTRO_ACOPIO(id_centro),
    CONSTRAINT FK_INV_UBICACION FOREIGN KEY (id_ubicacion) 
        REFERENCES UBICACION(id_ubicacion),
    CONSTRAINT FK_INV_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT UQ_INVENTARIO_dispositivo UNIQUE (id_dispositivo) -- Principio de exclusión atómica
);
GO

-- ============================================================================
-- SECCIÓN 6: EVALUACIÓN TÉCNICA, ORDENES DE TRABAJO Y TRATAMIENTOS
-- ============================================================================

-- 6.1. EVALUACION_TECNICA (RN-02)
CREATE TABLE EVALUACION_TECNICA (
    id_evaluacion BIGINT IDENTITY(1,1) NOT NULL,
    id_dispositivo BIGINT NOT NULL,
    id_tecnico BIGINT NOT NULL,
    id_clasificacion INT NOT NULL,
    diagnostico_funcional VARCHAR(MAX) NOT NULL,
    diagnostico_estetico VARCHAR(MAX) NULL,
    fecha_evaluacion DATETIME2 NOT NULL CONSTRAINT DF_EVAL_fecha DEFAULT (SYSDATETIME()),
    aprobado_reutilizacion BIT NOT NULL CONSTRAINT DF_EVAL_reut DEFAULT (0),
    CONSTRAINT PK_EVALUACION_TECNICA PRIMARY KEY CLUSTERED (id_evaluacion),
    CONSTRAINT FK_EVAL_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT FK_EVAL_TECNICO FOREIGN KEY (id_tecnico) 
        REFERENCES EMPLEADO(id_empleado),
    CONSTRAINT FK_EVAL_CLASIFICACION FOREIGN KEY (id_clasificacion) 
        REFERENCES CLASIFICACION_TECNICA(id_clasificacion)
);
GO

-- 6.2. ORDEN_TRABAJO
CREATE TABLE ORDEN_TRABAJO (
    id_orden BIGINT IDENTITY(1,1) NOT NULL,
    codigo_orden VARCHAR(40) NOT NULL,
    id_dispositivo BIGINT NOT NULL,
    id_responsable BIGINT NOT NULL,
    id_tipo_trabajo INT NOT NULL,
    id_estado_orden INT NOT NULL,
    fecha_apertura DATETIME2 NOT NULL CONSTRAINT DF_OT_apertura DEFAULT (SYSDATETIME()),
    fecha_cierre DATETIME2 NULL,
    descripcion VARCHAR(MAX) NOT NULL,
    resultado VARCHAR(MAX) NULL,
    CONSTRAINT PK_ORDEN_TRABAJO PRIMARY KEY CLUSTERED (id_orden),
    CONSTRAINT FK_OT_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo),
    CONSTRAINT FK_OT_RESPONSABLE FOREIGN KEY (id_responsable) 
        REFERENCES EMPLEADO(id_empleado),
    CONSTRAINT FK_OT_TIPO FOREIGN KEY (id_tipo_trabajo) 
        REFERENCES TIPO_TRABAJO(id_tipo_trabajo),
    CONSTRAINT FK_OT_ESTADO FOREIGN KEY (id_estado_orden) 
        REFERENCES ESTADO_ORDEN(id_estado_orden),
    CONSTRAINT UQ_OT_codigo UNIQUE (codigo_orden)
);
GO

-- 6.3. TRATAMIENTO
CREATE TABLE TRATAMIENTO (
    id_tratamiento BIGINT IDENTITY(1,1) NOT NULL,
    id_orden BIGINT NOT NULL,
    tipo_tratamiento VARCHAR(80) NOT NULL,
    costo_estimado DECIMAL(10,2) NOT NULL CONSTRAINT DF_TRAT_costo_est DEFAULT (0.00),
    costo_real DECIMAL(10,2) NULL,
    fecha_tratamiento DATETIME2 NOT NULL CONSTRAINT DF_TRAT_fecha DEFAULT (SYSDATETIME()),
    observaciones VARCHAR(MAX) NULL,
    CONSTRAINT PK_TRATAMIENTO PRIMARY KEY CLUSTERED (id_tratamiento),
    CONSTRAINT FK_TRAT_ORDEN FOREIGN KEY (id_orden) 
        REFERENCES ORDEN_TRABAJO(id_orden) ON DELETE CASCADE,
    CONSTRAINT CK_TRAT_costo_est CHECK (costo_estimado >= 0)
);
GO

-- ============================================================================
-- SECCIÓN 7: MOVIMIENTOS LOGÍSTICOS Y DESTINO FINAL
-- ============================================================================

-- 7.1. Cabecera de Transferencia: MOVIMIENTO
CREATE TABLE MOVIMIENTO (
    id_movimiento BIGINT IDENTITY(1,1) NOT NULL,
    codigo_movimiento VARCHAR(40) NOT NULL,
    id_centro_origen BIGINT NOT NULL,
    id_centro_destino BIGINT NOT NULL,
    id_responsable BIGINT NOT NULL,
    id_estado_movimiento INT NOT NULL,
    fecha_salida DATETIME2 NOT NULL CONSTRAINT DF_MOV_salida DEFAULT (SYSDATETIME()),
    fecha_llegada DATETIME2 NULL,
    observaciones VARCHAR(MAX) NULL,
    CONSTRAINT PK_MOVIMIENTO PRIMARY KEY CLUSTERED (id_movimiento),
    CONSTRAINT FK_MOV_ORIGEN FOREIGN KEY (id_centro_origen) 
        REFERENCES CENTRO_ACOPIO(id_centro),
    CONSTRAINT FK_MOV_DESTINO FOREIGN KEY (id_centro_destino) 
        REFERENCES CENTRO_ACOPIO(id_centro),
    CONSTRAINT FK_MOV_RESPONSABLE FOREIGN KEY (id_responsable) 
        REFERENCES EMPLEADO(id_empleado),
    CONSTRAINT FK_MOV_ESTADO FOREIGN KEY (id_estado_movimiento) 
        REFERENCES ESTADO_MOVIMIENTO(id_estado_movimiento),
    CONSTRAINT UQ_MOV_codigo UNIQUE (codigo_movimiento),
    CONSTRAINT CK_MOV_centros_distintos CHECK (id_centro_origen <> id_centro_destino)
);
GO

-- 7.2. ENTIDAD DÉBIL 2: DETALLE_MOVIMIENTO (RN-03 / Corrección Docente 19/Oct)
-- PK Compuesta: {id_movimiento (FK Fuerte), numero_linea (Clave Parcial)}
CREATE TABLE DETALLE_MOVIMIENTO (
    id_movimiento BIGINT NOT NULL,
    numero_linea INT NOT NULL, -- Clave Parcial (Discriminador de la entidad débil)
    id_dispositivo BIGINT NOT NULL,
    peso_kg_transferido DECIMAL(8,2) NOT NULL,
    CONSTRAINT PK_DETALLE_MOVIMIENTO PRIMARY KEY CLUSTERED (id_movimiento, numero_linea),
    CONSTRAINT FK_DM_MOVIMIENTO FOREIGN KEY (id_movimiento) 
        REFERENCES MOVIMIENTO(id_movimiento) ON DELETE CASCADE,
    CONSTRAINT FK_DM_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo),
    CONSTRAINT UQ_DM_mov_dispositivo UNIQUE (id_movimiento, id_dispositivo),
    CONSTRAINT CK_DM_linea CHECK (numero_linea > 0),
    CONSTRAINT CK_DM_peso CHECK (peso_kg_transferido > 0)
);
GO

-- 7.3. DESTINO_FINAL (Cierre formal de trazabilidad - RN-08)
CREATE TABLE DESTINO_FINAL (
    id_destino_final BIGINT IDENTITY(1,1) NOT NULL,
    id_dispositivo BIGINT NOT NULL,
    id_tipo_destino INT NOT NULL,
    id_receptor BIGINT NOT NULL,
    fecha_confirmacion DATE NOT NULL,
    certificado_numero VARCHAR(60) NULL,
    observaciones VARCHAR(MAX) NULL,
    CONSTRAINT PK_DESTINO_FINAL PRIMARY KEY CLUSTERED (id_destino_final),
    CONSTRAINT FK_DF_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo),
    CONSTRAINT FK_DF_TIPO_DESTINO FOREIGN KEY (id_tipo_destino) 
        REFERENCES TIPO_DESTINO(id_tipo_destino),
    CONSTRAINT FK_DF_RECEPTOR FOREIGN KEY (id_receptor) 
        REFERENCES PERSONA(id_persona),
    CONSTRAINT UQ_DF_dispositivo UNIQUE (id_dispositivo) -- Un solo destino final por equipo
);
GO

-- ============================================================================
-- SECCIÓN 8: EVIDENCIAS DIGITALES EN AMAZON S3 (RN-07)
-- ============================================================================

CREATE TABLE EVIDENCIA (
    id_evidencia BIGINT IDENTITY(1,1) NOT NULL,
    id_tipo_evidencia INT NOT NULL,
    id_dispositivo BIGINT NULL,
    id_movimiento BIGINT NULL,
    id_usuario BIGINT NOT NULL,
    ubicacion_archivo VARCHAR(500) NOT NULL, -- s3://ecoraee-evidencias-storage/...
    nombre_archivo_original VARCHAR(255) NOT NULL,
    formato_mime VARCHAR(60) NOT NULL CONSTRAINT DF_EVID_mime DEFAULT ('image/jpeg'),
    peso_bytes BIGINT NOT NULL,
    hash_sha256 VARCHAR(64) NULL,
    fecha_subida DATETIME2 NOT NULL CONSTRAINT DF_EVID_fecha DEFAULT (SYSDATETIME()),
    descripcion VARCHAR(MAX) NULL,
    CONSTRAINT PK_EVIDENCIA PRIMARY KEY CLUSTERED (id_evidencia),
    CONSTRAINT FK_EVID_TIPO FOREIGN KEY (id_tipo_evidencia) 
        REFERENCES TIPO_EVIDENCIA(id_tipo_evidencia),
    CONSTRAINT FK_EVID_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT FK_EVID_MOVIMIENTO FOREIGN KEY (id_movimiento) 
        REFERENCES MOVIMIENTO(id_movimiento),
    CONSTRAINT FK_EVID_USUARIO FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario),
    CONSTRAINT CK_EVID_ubicacion CHECK (ubicacion_archivo LIKE 's3://ecoraee-evidencias-storage/%'),
    CONSTRAINT CK_EVID_asociacion CHECK (id_dispositivo IS NOT NULL OR id_movimiento IS NOT NULL)
);
GO

-- ============================================================================
-- SECCIÓN 9: ARTICULACIÓN MATEMÁTICA - RED DE FLUJO (EDMONDS-KARP)
-- ============================================================================

-- 9.1. NODO_RED
CREATE TABLE NODO_RED (
    id_nodo INT IDENTITY(1,1) NOT NULL,
    id_centro BIGINT NULL,
    codigo_nodo VARCHAR(30) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo_nodo VARCHAR(20) NOT NULL, -- 'FUENTE', 'INTERMEDIO', 'SUMIDERO'
    capacidad_procesamiento_kg DECIMAL(10,2) NOT NULL CONSTRAINT DF_NODO_cap DEFAULT (1000.00),
    activo BIT NOT NULL CONSTRAINT DF_NODO_activo DEFAULT (1),
    CONSTRAINT PK_NODO_RED PRIMARY KEY CLUSTERED (id_nodo),
    CONSTRAINT FK_NODO_CENTRO FOREIGN KEY (id_centro) 
        REFERENCES CENTRO_ACOPIO(id_centro),
    CONSTRAINT UQ_NODO_codigo UNIQUE (codigo_nodo),
    CONSTRAINT UQ_NODO_centro UNIQUE (id_centro),
    CONSTRAINT CK_NODO_tipo CHECK (tipo_nodo IN ('FUENTE', 'INTERMEDIO', 'SUMIDERO')),
    CONSTRAINT CK_NODO_capacidad CHECK (capacidad_procesamiento_kg > 0)
);
GO

-- 9.2. ARISTA_RED
CREATE TABLE ARISTA_RED (
    id_arista INT IDENTITY(1,1) NOT NULL,
    id_nodo_origen INT NOT NULL,
    id_nodo_destino INT NOT NULL,
    capacidad_max_kg DECIMAL(10,2) NOT NULL,
    costo_transporte_usd DECIMAL(8,2) NOT NULL CONSTRAINT DF_ARISTA_costo DEFAULT (0.00),
    tiempo_horas DECIMAL(5,2) NOT NULL CONSTRAINT DF_ARISTA_tiempo DEFAULT (1.00),
    activa BIT NOT NULL CONSTRAINT DF_ARISTA_activa DEFAULT (1),
    CONSTRAINT PK_ARISTA_RED PRIMARY KEY CLUSTERED (id_arista),
    CONSTRAINT FK_ARISTA_ORIGEN FOREIGN KEY (id_nodo_origen) 
        REFERENCES NODO_RED(id_nodo),
    CONSTRAINT FK_ARISTA_DESTINO FOREIGN KEY (id_nodo_destino) 
        REFERENCES NODO_RED(id_nodo),
    CONSTRAINT UQ_ARISTA_origen_destino UNIQUE (id_nodo_origen, id_nodo_destino),
    CONSTRAINT CK_ARISTA_distintos CHECK (id_nodo_origen <> id_nodo_destino),
    CONSTRAINT CK_ARISTA_capacidad CHECK (capacidad_max_kg > 0)
);
GO

-- 9.3. ESCENARIO_RED
CREATE TABLE ESCENARIO_RED (
    id_escenario INT IDENTITY(1,1) NOT NULL,
    codigo_escenario VARCHAR(40) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(MAX) NULL,
    fecha_creacion DATETIME2 NOT NULL CONSTRAINT DF_ESC_fecha DEFAULT (SYSDATETIME()),
    CONSTRAINT PK_ESCENARIO_RED PRIMARY KEY CLUSTERED (id_escenario),
    CONSTRAINT UQ_ESC_codigo UNIQUE (codigo_escenario)
);
GO

-- 9.4. Tabla Intermedia M:N - ESCENARIO_ARISTA
CREATE TABLE ESCENARIO_ARISTA (
    id_escenario INT NOT NULL,
    id_arista INT NOT NULL,
    capacidad_modificada_kg DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_ESCENARIO_ARISTA PRIMARY KEY CLUSTERED (id_escenario, id_arista),
    CONSTRAINT FK_EA_ESCENARIO FOREIGN KEY (id_escenario) 
        REFERENCES ESCENARIO_RED(id_escenario) ON DELETE CASCADE,
    CONSTRAINT FK_EA_ARISTA FOREIGN KEY (id_arista) 
        REFERENCES ARISTA_RED(id_arista) ON DELETE CASCADE,
    CONSTRAINT CK_EA_capacidad CHECK (capacidad_modificada_kg >= 0)
);
GO

-- 9.5. RESULTADO_FLUJO
CREATE TABLE RESULTADO_FLUJO (
    id_resultado BIGINT IDENTITY(1,1) NOT NULL,
    id_escenario INT NOT NULL,
    nodo_fuente_codigo VARCHAR(30) NOT NULL,
    nodo_sumidero_codigo VARCHAR(30) NOT NULL,
    flujo_maximo_total_kg DECIMAL(10,2) NOT NULL,
    tiempo_computo_ms DECIMAL(8,2) NOT NULL,
    fecha_ejecucion DATETIME2 NOT NULL CONSTRAINT DF_RF_fecha DEFAULT (SYSDATETIME()),
    CONSTRAINT PK_RESULTADO_FLUJO PRIMARY KEY CLUSTERED (id_resultado),
    CONSTRAINT FK_RF_ESCENARIO FOREIGN KEY (id_escenario) 
        REFERENCES ESCENARIO_RED(id_escenario) ON DELETE CASCADE
);
GO

-- 9.6. Tabla Intermedia M:N - RESULTADO_ARISTA
CREATE TABLE RESULTADO_ARISTA (
    id_resultado BIGINT NOT NULL,
    id_arista INT NOT NULL,
    flujo_asignado_kg DECIMAL(10,2) NOT NULL,
    arista_saturada BIT NOT NULL CONSTRAINT DF_RA_saturada DEFAULT (0),
    CONSTRAINT PK_RESULTADO_ARISTA PRIMARY KEY CLUSTERED (id_resultado, id_arista),
    CONSTRAINT FK_RA_RESULTADO FOREIGN KEY (id_resultado) 
        REFERENCES RESULTADO_FLUJO(id_resultado) ON DELETE CASCADE,
    CONSTRAINT FK_RA_ARISTA FOREIGN KEY (id_arista) 
        REFERENCES ARISTA_RED(id_arista)
);
GO

-- ============================================================================
-- SECCIÓN 10: GOBERNANZA, AUDITORÍA Y OBSERVABILIDAD
-- ============================================================================

-- 10.1. AUDITORIA (Registro inmutable de cambios en el sistema)
CREATE TABLE AUDITORIA (
    id_auditoria BIGINT IDENTITY(1,1) NOT NULL,
    id_usuario BIGINT NULL,
    entidad_afectada VARCHAR(80) NOT NULL,
    identificador_registro VARCHAR(100) NOT NULL,
    operacion VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    datos_previos VARCHAR(MAX) NULL,
    datos_nuevos VARCHAR(MAX) NULL,
    direccion_ip VARCHAR(45) NULL,
    fecha_hora DATETIME2 NOT NULL CONSTRAINT DF_AUD_fecha DEFAULT (SYSDATETIME()),
    CONSTRAINT PK_AUDITORIA PRIMARY KEY CLUSTERED (id_auditoria),
    CONSTRAINT FK_AUD_USUARIO FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario),
    CONSTRAINT CK_AUD_operacion CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE'))
);
GO

-- 10.2. ALERTA (Notificaciones de capacidad y excepciones)
CREATE TABLE ALERTA (
    id_alerta BIGINT IDENTITY(1,1) NOT NULL,
    id_centro BIGINT NULL,
    tipo_alerta VARCHAR(50) NOT NULL,
    nivel_severidad VARCHAR(20) NOT NULL CONSTRAINT DF_ALERTA_nivel DEFAULT ('INFO'),
    mensaje VARCHAR(MAX) NOT NULL,
    resuelta BIT NOT NULL CONSTRAINT DF_ALERTA_resuelta DEFAULT (0),
    fecha_creacion DATETIME2 NOT NULL CONSTRAINT DF_ALERTA_fecha DEFAULT (SYSDATETIME()),
    fecha_resolucion DATETIME2 NULL,
    CONSTRAINT PK_ALERTA PRIMARY KEY CLUSTERED (id_alerta),
    CONSTRAINT FK_ALERTA_CENTRO FOREIGN KEY (id_centro) 
        REFERENCES CENTRO_ACOPIO(id_centro),
    CONSTRAINT CK_ALERTA_nivel CHECK (nivel_severidad IN ('INFO', 'WARNING', 'CRITICAL'))
);
GO

-- 10.3. INDICADOR (KPIs ejecutivos ambientales)
CREATE TABLE INDICADOR (
    id_indicador INT IDENTITY(1,1) NOT NULL,
    id_centro BIGINT NULL,
    codigo_kpi VARCHAR(40) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    unidad VARCHAR(30) NOT NULL,
    fecha_medicion DATE NOT NULL CONSTRAINT DF_IND_fecha DEFAULT (CAST(SYSDATETIME() AS DATE)),
    CONSTRAINT PK_INDICADOR PRIMARY KEY CLUSTERED (id_indicador),
    CONSTRAINT FK_IND_CENTRO FOREIGN KEY (id_centro) 
        REFERENCES CENTRO_ACOPIO(id_centro) ON DELETE CASCADE
);
GO

-- ============================================================================
-- SECCIÓN 11: ÍNDICES DE RENDIMIENTO (OPTIMIZACIÓN DE CONSULTAS)
-- ============================================================================

CREATE NONCLUSTERED INDEX IX_DISPOSITIVO_lote ON DISPOSITIVO(id_lote);
CREATE NONCLUSTERED INDEX IX_DISPOSITIVO_modelo ON DISPOSITIVO(id_modelo);
CREATE NONCLUSTERED INDEX IX_INVENTARIO_centro_disp ON INVENTARIO(id_centro, id_dispositivo);
CREATE NONCLUSTERED INDEX IX_EVALUACION_dispositivo ON EVALUACION_TECNICA(id_dispositivo);
CREATE NONCLUSTERED INDEX IX_HISTORIAL_dispositivo_fecha ON HISTORIAL_ESTADO(id_dispositivo, fecha_inicio DESC);
CREATE NONCLUSTERED INDEX IX_ORDEN_dispositivo ON ORDEN_TRABAJO(id_dispositivo);
CREATE NONCLUSTERED INDEX IX_MOVIMIENTO_fechas ON MOVIMIENTO(fecha_salida, fecha_llegada);
CREATE NONCLUSTERED INDEX IX_AUDITORIA_entidad_fecha ON AUDITORIA(entidad_afectada, fecha_hora DESC);
CREATE NONCLUSTERED INDEX IX_EVIDENCIA_dispositivo ON EVIDENCIA(id_dispositivo);
CREATE NONCLUSTERED INDEX IX_ARISTA_origen_destino ON ARISTA_RED(id_nodo_origen, id_nodo_destino);
GO

PRINT 'BD_ECORAEE_CLOUD creada e inicializada exitosamente en SQL Server.';
GO
