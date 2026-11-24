-- ============================================================================
-- PROYECTO INTEGRADOR: EcoRAEE Cloud - Quinto Semestre 2026
-- FASE 3: LÓGICA DE NEGOCIO Y OBJETOS PROGRAMABLES
-- ARCHIVO: 08_transacciones.sql
-- DESCRIPCIÓN: Demostración experimental de las propiedades ACID mediante
--              tres escenarios de transferencia logística:
--                a) Transferencia correcta con COMMIT (Atomicidad y Consistencia).
--                b) Transferencia con error forzado a mitad con ROLLBACK (Todo o Nada).
--                c) El mismo error sin transacción (Evidencia de datos a medias).
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
PRINT 'INICIO DEL BANCO DE PRUEBAS TRANSACCIONALES ACID (08_transacciones)';
PRINT '======================================================================';
GO


-- ============================================================================
-- CASO A: TRANSFERENCIA CORRECTA QUE TERMINA EN COMMIT
-- ============================================================================
-- Requerimiento 4.a: Una transferencia correcta, que termina en COMMIT.
-- Propiedad ACID demostrada: ATOMICIDAD Y CONSISTENCIA.
--   - Atomicidad: Se ejecutan todas las operaciones (cabecera en MOVIMIENTO,
--     detalle en DETALLE_MOVIMIENTO y reubicación en INVENTARIO) como una
--     unidad indivisible.
--   - Consistencia: La base de datos pasa de un estado válido a otro estado
--     completamente íntegro, respetando todas las claves y restricciones.
-- ============================================================================

PRINT '----------------------------------------------------------------------';
PRINT '>>> CASO A: TRANSFERENCIA CORRECTA CON COMMIT (DISPOSITIVO 15)';
PRINT '----------------------------------------------------------------------';

-- 1. Estado ANTES de la transferencia
PRINT '';
PRINT '--- [CASO A] Estado de INVENTARIO del Dispositivo 15 ANTES:';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    m.nombre AS modelo,
    ca.id_centro,
    ca.nombre AS centro_actual,
    inv.fecha_ingreso
FROM INVENTARIO inv
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
WHERE inv.id_dispositivo = 15;

PRINT '--- [CASO A] Movimientos registrados para el Dispositivo 15 ANTES:';
SELECT 
    m.id_movimiento,
    m.codigo_movimiento,
    c_orig.nombre AS origen,
    c_dest.nombre AS destino,
    dm.id_dispositivo,
    dm.peso_kg_transferido,
    m.fecha_salida
FROM DETALLE_MOVIMIENTO dm
INNER JOIN MOVIMIENTO m ON dm.id_movimiento = m.id_movimiento
INNER JOIN CENTRO_ACOPIO c_orig ON m.id_centro_origen = c_orig.id_centro
INNER JOIN CENTRO_ACOPIO c_dest ON m.id_centro_destino = c_dest.id_centro
WHERE dm.id_dispositivo = 15;

-- 2. Ejecución de la transferencia correcta mediante el procedimiento almacenado
PRINT '';
PRINT 'Ejecutando procedimiento de transferencia hacia Centro Granados (ID = 2)...';
EXEC dbo.SP_TRANSFERIR_DISPOSITIVO
    @id_dispositivo = 15,
    @id_centro_destino = 2, -- Campus Granados
    @id_responsable = 4,    -- Diego Logística
    @observaciones = 'Transferencia Caso A: Ejecución normal confirmada con COMMIT.';

-- 3. Estado DESPUÉS de la transferencia
PRINT '';
PRINT '--- [CASO A] Estado de INVENTARIO del Dispositivo 15 DESPUÉS (COMMIT):';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    m.nombre AS modelo,
    ca.id_centro,
    ca.nombre AS nuevo_centro_actual,
    inv.fecha_ingreso
FROM INVENTARIO inv
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
WHERE inv.id_dispositivo = 15;

PRINT '--- [CASO A] Movimientos registrados para el Dispositivo 15 DESPUÉS (Nuevo registro confirmado):';
SELECT 
    m.id_movimiento,
    m.codigo_movimiento,
    c_orig.nombre AS origen,
    c_dest.nombre AS destino,
    dm.id_dispositivo,
    dm.peso_kg_transferido,
    m.fecha_salida
FROM DETALLE_MOVIMIENTO dm
INNER JOIN MOVIMIENTO m ON dm.id_movimiento = m.id_movimiento
INNER JOIN CENTRO_ACOPIO c_orig ON m.id_centro_origen = c_orig.id_centro
INNER JOIN CENTRO_ACOPIO c_dest ON m.id_centro_destino = c_dest.id_centro
WHERE dm.id_dispositivo = 15
ORDER BY m.id_movimiento DESC;

/*
===============================================================================
JUSTIFICACIÓN TEÓRICA ACID - CASO A:
Propiedades Demostradas: ATOMICIDAD Y CONSISTENCIA
1. ATOMICIDAD: Todas las modificaciones (inserción en MOVIMIENTO, creación de
   la tupla en DETALLE_MOVIMIENTO y actualización de la bodega en INVENTARIO)
   se confirmaron como una sola transacción indivisible (COMMIT TRANSACTION).
2. CONSISTENCIA: La base de datos mantuvo las reglas de integridad referencial
   y lógica física: el equipo se dio de baja del centro de origen y quedó
   custodiado en el centro de destino sin duplicar existencias.
===============================================================================
*/
GO


-- ============================================================================
-- CASO B: TRANSFERENCIA CON ERROR FORZADO A MITAD QUE TERMINA EN ROLLBACK
-- ============================================================================
-- Requerimiento 4.b: Una con un error forzado a mitad (por ejemplo, un
--                    responsable nulo o violación de CHECK), que termina en ROLLBACK.
-- Propiedad ACID demostrada: ATOMICIDAD ("TODO O NADA").
--   - Al fallar una instrucción a medio camino, el manejador de excepciones
--     ejecuta ROLLBACK TRANSACTION, revirtiendo cualquier cambio previo y
--     dejando el sistema en su estado consistente original.
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT '>>> CASO B: TRANSFERENCIA CON ERROR FORZADO A MITAD Y ROLLBACK (DISPOSITIVO 16)';
PRINT '----------------------------------------------------------------------';

-- 1. Estado ANTES del intento de transferencia
PRINT '';
PRINT '--- [CASO B] Estado de INVENTARIO del Dispositivo 16 ANTES:';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    m.nombre AS modelo,
    ca.id_centro,
    ca.nombre AS centro_actual
FROM INVENTARIO inv
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
WHERE inv.id_dispositivo = 16;

PRINT '--- [CASO B] Conteo de movimientos del Dispositivo 16 ANTES:';
SELECT COUNT(*) AS total_movimientos_previos 
FROM DETALLE_MOVIMIENTO 
WHERE id_dispositivo = 16;

-- 2. Ejecución con Transacción y Error Forzado en el Paso 2
PRINT '';
PRINT 'Iniciando BEGIN TRANSACTION con error forzado en el segundo paso...';

DECLARE @CodigoMovPruebaB VARCHAR(40) = 'TRF-TEST-ROLLBACK-B001';

BEGIN TRANSACTION;
BEGIN TRY
    -- PASO 1 (Exitoso): Se crea la cabecera en MOVIMIENTO
    PRINT '  -> Paso 1: Insertando cabecera de movimiento (TRF-TEST-ROLLBACK-B001)...';
    INSERT INTO MOVIMIENTO (
        codigo_movimiento,
        id_centro_origen,
        id_centro_destino,
        id_responsable,
        id_estado_movimiento,
        fecha_salida,
        observaciones
    ) VALUES (
        @CodigoMovPruebaB,
        1, -- Origen: Campus Matriz
        2, -- Destino: Campus Granados
        4, -- Responsable: Diego Logística
        2, -- Estado: En Tránsito
        SYSDATETIME(),
        'Prueba Caso B: Se forzará error en la siguiente instrucción'
    );

    DECLARE @IdMovGeneradoB BIGINT = SCOPE_IDENTITY();

    -- PASO 2 (ERROR FORZADO): Intentar insertar en DETALLE_MOVIMIENTO con peso negativo
    -- Violación forzada de la restricción: CONSTRAINT CK_DM_peso CHECK (peso_kg_transferido > 0)
    PRINT '  -> Paso 2: Intentando insertar detalle con PESO NEGATIVO (-45.50 kg)...';
    INSERT INTO DETALLE_MOVIMIENTO (
        id_movimiento,
        numero_linea,
        id_dispositivo,
        peso_kg_transferido
    ) VALUES (
        @IdMovGeneradoB,
        1,
        16,
        -45.50 -- ERROR FORZADO: Violará CK_DM_peso
    );

    -- PASO 3: Reubicación en inventario (nunca se alcanzará debido al error)
    UPDATE INVENTARIO 
    SET id_centro = 2 
    WHERE id_dispositivo = 16;

    COMMIT TRANSACTION;
    PRINT 'ALERTA INESPERADA: ¡La transacción terminó en COMMIT!';
END TRY
BEGIN CATCH
    -- Detección del error y ejecución forzosa del ROLLBACK
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRANSACTION;
        PRINT '>>> ÉXITO: Error capturado por bloque CATCH. Se ejecutó ROLLBACK TRANSACTION.';
        PRINT 'Mensaje de error capturado: ' + ERROR_MESSAGE();
    END;
END CATCH;

-- 3. Estado DESPUÉS de la transferencia fallida (Verificación de Atomicidad)
PRINT '';
PRINT '--- [CASO B] Estado de INVENTARIO del Dispositivo 16 DESPUÉS (DATO NO CAMBIÓ):';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    m.nombre AS modelo,
    ca.id_centro,
    ca.nombre AS centro_actual,
    'PRESERVADO POR ROLLBACK' AS verificacion
FROM INVENTARIO inv
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
WHERE inv.id_dispositivo = 16;

PRINT '--- [CASO B] Verificación de que la cabecera del Paso 1 fue deshecha y NO existe:';
SELECT 
    COUNT(*) AS registros_encontrados_con_codigo_b,
    '0 = Éxito total: La cabecera fue deshecha' AS explicacion
FROM MOVIMIENTO 
WHERE codigo_movimiento = @CodigoMovPruebaB;

/*
===============================================================================
JUSTIFICACIÓN TEÓRICA ACID - CASO B:
Propiedad Demostrada: ATOMICIDAD (PRINCIPIO DEL "TODO O NADA")
- Aunque la primera sentencia (INSERT INTO MOVIMIENTO) fue físicamente exitosa,
  la falla en la segunda sentencia (violación de CK_DM_peso) obligó al motor
  a deshacer íntegramente la transacción mediante ROLLBACK.
- Como consecuencia, la cabecera creada se eliminó de la memoria transaccional
  y el inventario del Dispositivo 16 permaneció exactamente en su estado
  consistente previo, evitando corromper la base de datos con registros parciales.
===============================================================================
*/
GO


-- ============================================================================
-- CASO C: EL MISMO ERROR SIN TRANSACCIÓN (PARA VER QUÉ QUEDA A MEDIAS)
-- ============================================================================
-- Requerimiento 4.c: El mismo error sin transacción, para ver qué queda a medias.
-- Propiedad ACID demostrada: VIOLACIÓN DE ATOMICIDAD Y PÉRDIDA DE CONSISTENCIA.
--   - Al trabajar en modo autocommit (sin BEGIN TRANSACTION), cada instrucción
--     se vuelve permanente de forma individual.
--   - Si ocurre un fallo en el segundo paso, el primer paso QUEDA GRABADO
--     A MEDIAS en disco, generando datos huérfanos e inconsistencias graves.
-- ============================================================================

PRINT '';
PRINT '----------------------------------------------------------------------';
PRINT '>>> CASO C: EL MISMO ERROR SIN TRANSACCIÓN (EVIDENCIA DE DATOS A MEDIAS)';
PRINT '----------------------------------------------------------------------';

-- 1. Estado ANTES de la operación
PRINT '';
PRINT '--- [CASO C] Estado de INVENTARIO del Dispositivo 17 ANTES:';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    m.nombre AS modelo,
    ca.id_centro,
    ca.nombre AS centro_actual
FROM INVENTARIO inv
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
WHERE inv.id_dispositivo = 17;

-- 2. Ejecución SIN Transacción (Modo Autocommit)
PRINT '';
PRINT 'Ejecutando instrucciones aisladas SIN BEGIN TRANSACTION...';

DECLARE @CodigoMovPruebaC VARCHAR(40) = 'TRF-ERROR-SIN-TX-MEDIAS';
DECLARE @IdMovGeneradoC BIGINT;

-- PASO 1 (Se confirma permanentemente al no haber transacción que lo cubra)
PRINT '  -> Paso 1: Insertando cabecera de movimiento SIN TRANSACCIÓN...';
INSERT INTO MOVIMIENTO (
    codigo_movimiento,
    id_centro_origen,
    id_centro_destino,
    id_responsable,
    id_estado_movimiento,
    fecha_salida,
    observaciones
) VALUES (
    @CodigoMovPruebaC,
    1, -- Matriz
    2, -- Granados
    4, -- Diego Logística
    1, -- Programado
    SYSDATETIME(),
    'PELIGRO: Registro huérfano generado a medias por falta de transacción'
);

SET @IdMovGeneradoC = SCOPE_IDENTITY();
PRINT '     ¡Paso 1 consolidado en disco con ID: ' + CAST(@IdMovGeneradoC AS VARCHAR(10)) + '!';

-- PASO 2 (Falla catastrófica por peso negativo)
PRINT '  -> Paso 2: Intentando insertar detalle con peso negativo (-99.99 kg)...';
BEGIN TRY
    INSERT INTO DETALLE_MOVIMIENTO (
        id_movimiento,
        numero_linea,
        id_dispositivo,
        peso_kg_transferido
    ) VALUES (
        @IdMovGeneradoC,
        1,
        17,
        -99.99 -- ERROR FORZADO: Violará CK_DM_peso
    );
END TRY
BEGIN CATCH
    PRINT '     ¡Fallo esperado en Paso 2! Error: ' + ERROR_MESSAGE();
END CATCH;

-- PASO 3: La actualización de inventario nunca se ejecuta
PRINT '  -> Paso 3: La actualización de INVENTARIO fue omitida por el error anterior.';

-- 3. Estado DESPUÉS: Demostración visual de la inconsistencia ("Datos a Medias")
PRINT '';
PRINT '--- [CASO C] EVIDENCIA DE DATOS A MEDIAS (INCONSISTENCIA EN LA BASE):';

PRINT '1. En la tabla MOVIMIENTO quedó una cabecera HUÉRFANA permanente:';
SELECT 
    id_movimiento,
    codigo_movimiento,
    id_centro_origen,
    id_centro_destino,
    fecha_salida,
    observaciones
FROM MOVIMIENTO 
WHERE codigo_movimiento = @CodigoMovPruebaC;

PRINT '2. En la tabla DETALLE_MOVIMIENTO NO existe ningún ítem asociado al movimiento:';
SELECT 
    COUNT(*) AS total_items_detalle,
    'ANOMALÍA: Movimiento de carga sin bultos asociados' AS diagnostico_inconsistencia
FROM DETALLE_MOVIMIENTO 
WHERE id_movimiento = @IdMovGeneradoC;

PRINT '3. En la tabla INVENTARIO el dispositivo NUNCA se movió (Sigue en centro de origen):';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    ca.id_centro,
    ca.nombre AS centro_actual,
    'DESCOORDINACIÓN: Hay flete registrado pero el equipo nunca salió de inventario' AS estado
FROM INVENTARIO inv
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
WHERE inv.id_dispositivo = 17;

/*
===============================================================================
JUSTIFICACIÓN TEÓRICA ACID - CASO C:
Propiedades Violadas: PÉRDIDA DE ATOMICIDAD Y RUPTURA DE CONSISTENCIA
1. VIOLACIÓN DE ATOMICIDAD: Al no existir un bloque transaccional
   (BEGIN TRANSACTION ... COMMIT / ROLLBACK), el motor SQL Server aplicó
   autocommit individual a cada instrucción. La cabecera en MOVIMIENTO se grabó
   de forma irreversible, mientras que las operaciones subsecuentes fallaron.
2. PÉRDIDA DE CONSISTENCIA: La base de datos quedó en un estado "a medias" y
   corrupto para el negocio: existe una guía de remisión física sin mercancía
   en DETALLE_MOVIMIENTO, y el equipo sigue constando físicamente en el almacén
   de origen.
3. CONCLUSIÓN: Esta prueba demuestra de manera irrefutable por qué los sistemas
   transaccionales empresariales y de trazabilidad crítica exigen el uso
   mandatorio de transacciones atómicas con manejo de excepciones (TRY...CATCH).
===============================================================================
*/

-- Limpieza controlada del registro huérfano de la prueba C para no ensuciar la base
DELETE FROM MOVIMIENTO WHERE codigo_movimiento = @CodigoMovPruebaC;
PRINT '';
PRINT '>>> Limpieza completada: Registro huérfano de prueba C eliminado para restaurar consistencia.';
GO

PRINT '';
PRINT '======================================================================';
PRINT 'FIN DE EJECUCIÓN EXITOSA DE 08_transacciones.sql (GRUPO 8)';
PRINT '======================================================================';
GO
