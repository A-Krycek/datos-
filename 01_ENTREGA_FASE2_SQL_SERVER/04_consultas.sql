-- ============================================================================
-- PROYECTO INTEGRADOR: EcoRAEE Cloud - Quinto Semestre 2026
-- ARCHIVO: 04_consultas.sql
-- DESCRIPCIÓN: Cinco consultas analíticas avanzadas utilizando JOIN, GROUP BY
--              y subconsultas para la trazabilidad y analítica de economía circular.
--
-- CONSULTAS REQUERIDAS:
--   a) Historial de estados de un dispositivo.
--   b) Inventario por centro y estado.
--   c) Dispositivos por categoría y clasificación técnica.
--   d) Porcentaje de dispositivos con la trazabilidad cerrada (con subconsulta).
--   e) Dispositivos recibidos que aún no tienen evaluación técnica.
--
-- AUTORES: Daniel Pazmiño, Matias Herrera, Ihair Llamuca
-- DOCENTE: Ing. María del Carmen Salazar Torres
-- MOTOR: Microsoft SQL Server 2019 / 2022 (T-SQL)
-- BASE DE DATOS: BD_ECORAEE_CLOUD
-- ============================================================================

USE BD_ECORAEE_CLOUD;
GO

PRINT '======================================================================';
PRINT 'EJECUCIÓN DE CONSULTAS ANALÍTICAS - EcoRAEE Cloud (04_consultas.sql)';
PRINT '======================================================================';
GO


-- ============================================================================
-- CONSULTA A: HISTORIAL DE ESTADOS DE UN DISPOSITIVO (TRAZABILIDAD COMPLETA)
-- ============================================================================
-- Objetivo: Obtener la línea de tiempo cronológica completa de un equipo específico,
--           mostrando la secuencia de estados por los que ha transitado, fechas,
--           el usuario/técnico responsable y las observaciones registradas.
-- Parámetro: Dispositivo con id_dispositivo = 1 (Laptop Lenovo ThinkPad T490).
-- Tablas utilizadas: HISTORIAL_ESTADO, DISPOSITIVO, MODELO_DISPOSITIVO, MARCA,
--                    ESTADO_DISPOSITIVO, USUARIO, EMPLEADO, PERSONA.
-- Cláusulas: INNER JOIN, WHERE, ORDER BY.
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT 'CONSULTA A: Historial cronológico de estados del Dispositivo 1';
PRINT '----------------------------------------------------------------------';

DECLARE @IdDispositivoConsultado BIGINT = 1;

SELECT 
    d.id_dispositivo,
    d.codigo_qr,
    CONCAT(m.nombre, ' (', ma.nombre, ')') AS equipo_modelo,
    he.numero_secuencia AS orden_evento,
    ed.codigo AS codigo_estado,
    ed.nombre AS nombre_estado,
    FORMAT(he.fecha_inicio, 'yyyy-MM-dd HH:mm:ss') AS fecha_inicio,
    ISNULL(FORMAT(he.fecha_fin, 'yyyy-MM-dd HH:mm:ss'), 'VIGENTE / FINAL') AS fecha_fin,
    DATEDIFF(MINUTE, he.fecha_inicio, ISNULL(he.fecha_fin, SYSDATETIME())) AS duracion_minutos,
    CONCAT(p.nombres, ' ', p.apellidos) AS usuario_responsable,
    r.nombre AS rol_responsable,
    he.observacion
FROM HISTORIAL_ESTADO he
INNER JOIN DISPOSITIVO d ON he.id_dispositivo = d.id_dispositivo
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN MARCA ma ON m.id_marca = ma.id_marca
INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
INNER JOIN USUARIO u ON he.id_usuario = u.id_usuario
INNER JOIN EMPLEADO emp ON u.id_empleado = emp.id_empleado
INNER JOIN PERSONA p ON emp.id_persona = p.id_persona
INNER JOIN ROL_SISTEMA r ON u.id_rol_sistema = r.id_rol_sistema
WHERE d.id_dispositivo = @IdDispositivoConsultado
ORDER BY he.numero_secuencia ASC;
GO


-- ============================================================================
-- CONSULTA B: INVENTARIO POR CENTRO DE ACOPIO Y ESTADO DEL DISPOSITIVO
-- ============================================================================
-- Objetivo: Conocer la cantidad exacta de dispositivos y el peso acumulado (kg)
--           que se encuentran almacenados físicamente en cada centro de acopio,
--           desglosado por el estado actual del dispositivo (donde fecha_fin IS NULL).
-- Tablas utilizadas: INVENTARIO, CENTRO_ACOPIO, TIPO_CENTRO, DISPOSITIVO,
--                    HISTORIAL_ESTADO, ESTADO_DISPOSITIVO.
-- Cláusulas: INNER JOIN, WHERE, GROUP BY, HAVING, ORDER BY.
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT 'CONSULTA B: Inventario consolidado por Centro de Acopio y Estado Actual';
PRINT '----------------------------------------------------------------------';

SELECT 
    ca.id_centro,
    ca.codigo_centro,
    ca.nombre AS centro_acopio,
    tc.nombre AS tipo_centro,
    ca.capacidad_max_unidades,
    ed.nombre AS estado_actual,
    COUNT(inv.id_dispositivo) AS cantidad_dispositivos,
    CAST(SUM(d.peso_kg) AS DECIMAL(10,2)) AS peso_acumulado_kg,
    CAST((COUNT(inv.id_dispositivo) * 100.0) / ca.capacidad_max_unidades AS DECIMAL(5,2)) AS porcentaje_ocupacion_centro
FROM INVENTARIO inv
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
INNER JOIN TIPO_CENTRO tc ON ca.id_tipo_centro = tc.id_tipo_centro
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN HISTORIAL_ESTADO he ON d.id_dispositivo = he.id_dispositivo 
                              AND he.fecha_fin IS NULL -- Filtra exclusivamente el estado actual
INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
GROUP BY 
    ca.id_centro,
    ca.codigo_centro,
    ca.nombre,
    tc.nombre,
    ca.capacidad_max_unidades,
    ed.nombre
ORDER BY 
    ca.nombre ASC, 
    cantidad_dispositivos DESC;
GO


-- ============================================================================
-- CONSULTA C: DISPOSITIVOS POR CATEGORÍA Y CLASIFICACIÓN TÉCNICA
-- ============================================================================
-- Objetivo: Generar el informe de caracterización de los RAEE evaluados, mostrando
--           cuántos equipos pertenecen a cada categoría y qué destino técnico
--           recibieron (Reutilizable, Reparable, Reciclable, No Recuperable),
--           junto con métricas de masa promedio y masa total en kilogramos.
-- Tablas utilizadas: DISPOSITIVO, MODELO_DISPOSITIVO, CATEGORIA_DISPOSITIVO,
--                    EVALUACION_TECNICA, CLASIFICACION_TECNICA.
-- Cláusulas: INNER JOIN, GROUP BY, ORDER BY, agregaciones (COUNT, AVG, SUM).
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT 'CONSULTA C: Dispositivos agrupados por Categoría y Clasificación Técnica';
PRINT '----------------------------------------------------------------------';

SELECT 
    cat.codigo AS codigo_categoria,
    cat.nombre AS categoria_raee,
    ct.codigo AS codigo_clasificacion,
    ct.nombre AS clasificacion_tecnica,
    COUNT(d.id_dispositivo) AS total_equipos_evaluados,
    CAST(AVG(d.peso_kg) AS DECIMAL(8,2)) AS peso_promedio_kg,
    CAST(SUM(d.peso_kg) AS DECIMAL(10,2)) AS peso_total_kg
FROM DISPOSITIVO d
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CATEGORIA_DISPOSITIVO cat ON m.id_categoria = cat.id_categoria
INNER JOIN EVALUACION_TECNICA et ON d.id_dispositivo = et.id_dispositivo
INNER JOIN CLASIFICACION_TECNICA ct ON et.id_clasificacion = ct.id_clasificacion
GROUP BY 
    cat.codigo,
    cat.nombre,
    ct.codigo,
    ct.nombre
ORDER BY 
    cat.nombre ASC, 
    total_equipos_evaluados DESC;
GO


-- ============================================================================
-- CONSULTA D: PORCENTAJE DE DISPOSITIVOS CON LA TRAZABILIDAD CERRADA
-- ============================================================================
-- Objetivo: Calcular la tasa porcentual de dispositivos que ya alcanzaron su
--           disposición o destino final (ciclo de vida cerrado), tanto a nivel
--           global en el sistema como en un desglose categorizado, cumpliendo
--           con el requerimiento de SUBCONSULTA, JOIN y GROUP BY.
-- Explicación de la Subconsulta: Se utilizan subconsultas escalares independientes
--   para computar el gran total de equipos registrados en el sistema y el total
--   de equipos en la tabla DESTINO_FINAL, permitiendo contrastar la participación.
-- Tablas utilizadas: DISPOSITIVO, MODELO_DISPOSITIVO, CATEGORIA_DISPOSITIVO,
--                    DESTINO_FINAL.
-- Cláusulas: INNER JOIN, LEFT JOIN, GROUP BY, Subconsultas escalares.
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT 'CONSULTA D.1: Tasa Porcentual Ejecutiva Global (Con Subconsulta Escalar)';
PRINT '----------------------------------------------------------------------';

SELECT 
    (SELECT COUNT(*) FROM DISPOSITIVO) AS total_dispositivos_sistema,
    (SELECT COUNT(*) FROM DESTINO_FINAL) AS total_dispositivos_cerrados,
    (SELECT COUNT(*) FROM DISPOSITIVO) - (SELECT COUNT(*) FROM DESTINO_FINAL) AS total_dispositivos_en_proceso,
    CAST(
        (CAST((SELECT COUNT(*) FROM DESTINO_FINAL) AS DECIMAL(10,2)) * 100.0) 
        / NULLIF((SELECT COUNT(*) FROM DISPOSITIVO), 0)
        AS DECIMAL(5,2)
    ) AS porcentaje_trazabilidad_cerrada_pct;

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT 'CONSULTA D.2: Desglose de Cierre por Categoría (JOIN + GROUP BY + Subconsultas)';
PRINT '----------------------------------------------------------------------';

SELECT 
    cat.nombre AS categoria,
    COUNT(d.id_dispositivo) AS equipos_recibidos_en_categoria,
    COUNT(df.id_destino_final) AS equipos_cerrados_en_categoria,
    CAST(
        (COUNT(df.id_destino_final) * 100.0) / NULLIF(COUNT(d.id_dispositivo), 0) 
        AS DECIMAL(5,2)
    ) AS tasa_cierre_categoria_pct,
    -- Subconsulta escalar que contextualiza la aportación de la categoría al gran total del sistema:
    CAST(
        (COUNT(df.id_destino_final) * 100.0) / NULLIF((SELECT COUNT(*) FROM DESTINO_FINAL), 0)
        AS DECIMAL(5,2)
    ) AS participacion_sobre_total_cerrados_pct
FROM DISPOSITIVO d
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CATEGORIA_DISPOSITIVO cat ON m.id_categoria = cat.id_categoria
LEFT JOIN DESTINO_FINAL df ON d.id_dispositivo = df.id_dispositivo
GROUP BY cat.nombre
ORDER BY equipos_recibidos_en_categoria DESC;
GO


-- ============================================================================
-- CONSULTA E: DISPOSITIVOS RECIBIDOS QUE AÚN NO TIENEN EVALUACIÓN TÉCNICA
-- ============================================================================
-- Objetivo: Identificar la cola operativa de trabajo pendiente (cuello de botella),
--           es decir, aquellos dispositivos que han ingresado formalmente a través
--           de un lote pero que todavía carecen de un diagnóstico técnico asignado.
-- Tablas utilizadas: DISPOSITIVO, LOTE, SOLICITUD_RECOLECCION, PERSONA,
--                    MODELO_DISPOSITIVO, MARCA, CATEGORIA_DISPOSITIVO,
--                    CONDICION_DISPOSITIVO, EVALUACION_TECNICA.
-- Cláusulas: INNER JOIN, LEFT JOIN (anti-join con IS NULL), ORDER BY.
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT 'CONSULTA E: Dispositivos recibidos pendientes de Evaluación Técnica';
PRINT '----------------------------------------------------------------------';

SELECT 
    d.id_dispositivo,
    d.codigo_qr,
    cat.nombre AS categoria,
    ma.nombre AS marca,
    m.nombre AS modelo,
    d.numero_serie,
    cd.nombre AS condicion_entrega,
    d.peso_kg,
    l.codigo_lote,
    p.nombre_razon_social AS generador_origen,
    FORMAT(d.fecha_registro, 'yyyy-MM-dd HH:mm') AS fecha_ingreso,
    DATEDIFF(DAY, d.fecha_registro, SYSDATETIME()) AS dias_espera_evaluacion
FROM DISPOSITIVO d
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN MARCA ma ON m.id_marca = ma.id_marca
INNER JOIN CATEGORIA_DISPOSITIVO cat ON m.id_categoria = cat.id_categoria
INNER JOIN CONDICION_DISPOSITIVO cd ON d.id_condicion = cd.id_condicion
INNER JOIN LOTE l ON d.id_lote = l.id_lote
INNER JOIN SOLICITUD_RECOLECCION sol ON l.id_solicitud = sol.id_solicitud
INNER JOIN PERSONA p ON sol.id_generador = p.id_persona
-- LEFT JOIN contra EVALUACION_TECNICA:
LEFT JOIN EVALUACION_TECNICA et ON d.id_dispositivo = et.id_dispositivo
WHERE et.id_evaluacion IS NULL -- CONDICIÓN FUNDAMENTAL: Filtra los equipos sin evaluación técnica
ORDER BY dias_espera_evaluacion DESC, d.id_dispositivo ASC;
GO

PRINT '';
PRINT '======================================================================';
PRINT 'FIN DE EJECUCIÓN DE LAS CINCO CONSULTAS ANALÍTICAS (04_consultas.sql)';
PRINT '======================================================================';
GO
