-- ============================================================================
-- PROYECTO INTEGRADOR: EcoRAEE Cloud - Quinto Semestre 2026
-- FASE 3: LÓGICA DE NEGOCIO Y OBJETOS PROGRAMABLES
-- ARCHIVO: 05_vistas.sql
-- DESCRIPCIÓN: Definición de tres vistas analíticas y operativas con sus
--              respectivas consultas de prueba SELECT para el seguimiento del RAEE.
--
-- EQUIPO: GRUPO 8
-- INTEGRANTES:
--   - Daniel Fernando Pazmiño Mera
--   - Matias Nicolas Herrera Cueva
--   - Ihair Geordano Llamuca López
-- DOCENTE: Ing. María del Carmen Salazar Torres, Mgtr.
-- MOTOR: Microsoft SQL Server 2019 / 2022 (T-SQL)
-- BASE DE DATOS: BD_ECORAEE_CLOUD
-- ============================================================================

USE BD_ECORAEE_CLOUD;
GO

PRINT '======================================================================';
PRINT 'INICIO DE CREACIÓN DE VISTAS ANALÍTICAS (05_vistas.sql) - GRUPO 8';
PRINT '======================================================================';
GO

-- ============================================================================
-- VISTA 1: VW_DISPOSITIVOS_ESTADO_ACTUAL
-- ============================================================================
-- Requerimiento 1.a: Estado actual de cada dispositivo, con su centro y si su
--                    trazabilidad está cerrada.
-- Objetivo: Proporcionar una visión consolidada de 360 grados de cada activo,
--           vinculando el modelo, la marca, la ubicación en bodega, el estado
--           vigente del ciclo de vida y la bandera de cierre de custodia.
-- ============================================================================

CREATE OR ALTER VIEW VW_DISPOSITIVOS_ESTADO_ACTUAL
AS
SELECT 
    d.id_dispositivo,
    d.codigo_qr,
    cat.nombre AS categoria,
    m.nombre AS modelo,
    ma.nombre AS marca,
    d.peso_kg,
    ISNULL(ca.nombre, 'EN TRÁNSITO / CERRADO') AS centro_acopio_actual,
    ISNULL(ca.codigo_centro, 'S/C') AS codigo_centro,
    ISNULL(ub.codigo_ubicacion, 'PISO / BODEGA') AS ubicacion_fisica,
    ed.codigo AS codigo_estado_actual,
    ed.nombre AS estado_actual,
    he.fecha_inicio AS fecha_inicio_estado,
    DATEDIFF(DAY, he.fecha_inicio, SYSDATETIME()) AS dias_en_estado_actual,
    CASE 
        WHEN df.id_destino_final IS NOT NULL OR ed.es_terminal = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS trazabilidad_cerrada,
    df.fecha_confirmacion AS fecha_cierre_trazabilidad,
    df.certificado_numero AS numero_certificado_cierre
FROM DISPOSITIVO d
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN MARCA ma ON m.id_marca = ma.id_marca
INNER JOIN CATEGORIA_DISPOSITIVO cat ON m.id_categoria = cat.id_categoria
-- Historial vigente (donde fecha_fin es NULL representa el estado activo)
LEFT JOIN HISTORIAL_ESTADO he ON d.id_dispositivo = he.id_dispositivo AND he.fecha_fin IS NULL
LEFT JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
-- Centro físico y percha de almacenamiento
LEFT JOIN INVENTARIO inv ON d.id_dispositivo = inv.id_dispositivo
LEFT JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
LEFT JOIN UBICACION ub ON inv.id_ubicacion = ub.id_ubicacion
-- Destino final confirmado (si existe)
LEFT JOIN DESTINO_FINAL df ON d.id_dispositivo = df.id_dispositivo;
GO

PRINT 'Vista [VW_DISPOSITIVOS_ESTADO_ACTUAL] creada o actualizada exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- CONSULTA DE EJEMPLO 1.a:
-- Listar una muestra de dispositivos activos y cerrados para validar la vista.
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> SELECT DE EJEMPLO 1.a: Consulta sobre VW_DISPOSITIVOS_ESTADO_ACTUAL';
SELECT TOP 10 
    id_dispositivo,
    codigo_qr,
    marca,
    modelo,
    centro_acopio_actual,
    estado_actual,
    trazabilidad_cerrada,
    numero_certificado_cierre
FROM VW_DISPOSITIVOS_ESTADO_ACTUAL
ORDER BY id_dispositivo ASC;
GO


-- ============================================================================
-- VISTA 2: VW_INVENTARIO_CENTRO_ESTADO
-- ============================================================================
-- Requerimiento 1.b: Inventario por centro y estado.
-- Objetivo: Generar el informe de control volumétrico de bodegas, mostrando
--           cuántos aparatos y qué masa total (kg) se encuentran físicamente en
--           cada centro según su condición operativa vigente, evaluando el
--           porcentaje de ocupación respecto a la capacidad instalada.
-- ============================================================================

CREATE OR ALTER VIEW VW_INVENTARIO_CENTRO_ESTADO
AS
SELECT 
    ca.id_centro,
    ca.codigo_centro,
    ca.nombre AS nombre_centro,
    tc.nombre AS tipo_centro,
    ed.id_estado,
    ed.codigo AS codigo_estado,
    ed.nombre AS nombre_estado,
    COUNT(inv.id_dispositivo) AS cantidad_dispositivos,
    CAST(ISNULL(SUM(d.peso_kg), 0) AS DECIMAL(10,2)) AS peso_acumulado_kg,
    ca.capacidad_max_unidades,
    CAST((COUNT(inv.id_dispositivo) * 100.0) / NULLIF(ca.capacidad_max_unidades, 0) AS DECIMAL(5,2)) AS porcentaje_ocupacion_unidades
FROM CENTRO_ACOPIO ca
INNER JOIN TIPO_CENTRO tc ON ca.id_tipo_centro = tc.id_tipo_centro
INNER JOIN INVENTARIO inv ON ca.id_centro = inv.id_centro
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN HISTORIAL_ESTADO he ON d.id_dispositivo = he.id_dispositivo AND he.fecha_fin IS NULL
INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
GROUP BY 
    ca.id_centro,
    ca.codigo_centro,
    ca.nombre,
    tc.nombre,
    ed.id_estado,
    ed.codigo,
    ed.nombre,
    ca.capacidad_max_unidades;
GO

PRINT 'Vista [VW_INVENTARIO_CENTRO_ESTADO] creada o actualizada exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- CONSULTA DE EJEMPLO 1.b:
-- Mostrar el consolidado de almacenamiento agrupado por centro y estado.
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> SELECT DE EJEMPLO 1.b: Consulta sobre VW_INVENTARIO_CENTRO_ESTADO';
SELECT 
    codigo_centro,
    nombre_centro,
    nombre_estado,
    cantidad_dispositivos,
    peso_acumulado_kg,
    capacidad_max_unidades,
    porcentaje_ocupacion_unidades
FROM VW_INVENTARIO_CENTRO_ESTADO
ORDER BY nombre_centro ASC, cantidad_dispositivos DESC;
GO


-- ============================================================================
-- VISTA 3: VW_DISPOSITIVOS_PENDIENTES_EVALUACION
-- ============================================================================
-- Requerimiento 1.c: Dispositivos recibidos que aún esperan evaluación técnica.
-- Objetivo: Identificar la cola operativa de diagnóstico (cuello de botella de
--           taller), listando los equipos que ingresaron formalmente pero aún
--           no tienen un informe técnico ni dictamen ambiental registrado.
-- ============================================================================

CREATE OR ALTER VIEW VW_DISPOSITIVOS_PENDIENTES_EVALUACION
AS
SELECT 
    d.id_dispositivo,
    d.codigo_qr,
    cat.nombre AS categoria,
    ma.nombre AS marca,
    m.nombre AS modelo,
    d.numero_serie,
    d.peso_kg,
    cd.nombre AS condicion_ingreso,
    l.codigo_lote,
    ISNULL(ca.nombre, 'BODEGA CENTRAL MATRIZ') AS centro_acopio_actual,
    p.nombre_razon_social AS generador_origen,
    d.fecha_registro AS fecha_ingreso_sistema,
    DATEDIFF(DAY, d.fecha_registro, SYSDATETIME()) AS dias_en_espera_evaluacion
FROM DISPOSITIVO d
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN MARCA ma ON m.id_marca = ma.id_marca
INNER JOIN CATEGORIA_DISPOSITIVO cat ON m.id_categoria = cat.id_categoria
INNER JOIN CONDICION_DISPOSITIVO cd ON d.id_condicion = cd.id_condicion
LEFT JOIN LOTE l ON d.id_lote = l.id_lote
LEFT JOIN SOLICITUD_RECOLECCION sol ON l.id_solicitud = sol.id_solicitud
LEFT JOIN PERSONA p ON sol.id_generador = p.id_persona
LEFT JOIN INVENTARIO inv ON d.id_dispositivo = inv.id_dispositivo
LEFT JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
-- Filtro fundamental: que NO exista registro en EVALUACION_TECNICA
WHERE NOT EXISTS (
    SELECT 1 
    FROM EVALUACION_TECNICA et 
    WHERE et.id_dispositivo = d.id_dispositivo
)
-- Y que no haya sido cerrado directamente
AND NOT EXISTS (
    SELECT 1 
    FROM DESTINO_FINAL df 
    WHERE df.id_dispositivo = d.id_dispositivo
);
GO

PRINT 'Vista [VW_DISPOSITIVOS_PENDIENTES_EVALUACION] creada o actualizada exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- CONSULTA DE EJEMPLO 1.c:
-- Listar los equipos en cola de diagnóstico ordenados por antigüedad de espera.
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> SELECT DE EJEMPLO 1.c: Consulta sobre VW_DISPOSITIVOS_PENDIENTES_EVALUACION';
SELECT TOP 10 
    id_dispositivo,
    codigo_qr,
    categoria,
    marca,
    modelo,
    peso_kg,
    centro_acopio_actual,
    dias_en_espera_evaluacion
FROM VW_DISPOSITIVOS_PENDIENTES_EVALUACION
ORDER BY dias_en_espera_evaluacion DESC, id_dispositivo ASC;
GO

PRINT '';
PRINT '======================================================================';
PRINT 'FIN DE EJECUCIÓN EXITOSA DE 05_vistas.sql (GRUPO 8)';
PRINT '======================================================================';
GO
