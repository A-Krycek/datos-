-- ============================================================================
-- PROYECTO INTEGRADOR: EcoRAEE Cloud - Quinto Semestre 2026
-- FASE 3: LÓGICA DE NEGOCIO Y OBJETOS PROGRAMABLES
-- ARCHIVO: 07_triggers.sql
-- DESCRIPCIÓN: Implementación de triggers para automatización de la bitácora
--              histórica ante cambios de estado y para cumplimiento forzoso
--              de reglas de negocio (cierre condicionado a destino final).
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
PRINT 'INICIO DE CREACIÓN DE TRIGGERS Y PRUEBAS (07_triggers.sql) - GRUPO 8';
PRINT '======================================================================';
GO

-- ============================================================================
-- PASO PREVIO: INCORPORACIÓN DE COLUMNA DE ESTADO OPERATIVO EN DISPOSITIVO
-- ============================================================================
-- Para permitir que las aplicaciones o técnicos actualicen el estado directo
-- de un activo y el trigger audite la historia, incorporamos de forma segura
-- la columna id_estado_actual sincronizada con el catálogo ESTADO_DISPOSITIVO.
-- ============================================================================

IF COL_LENGTH('DISPOSITIVO', 'id_estado_actual') IS NULL
BEGIN
    ALTER TABLE DISPOSITIVO ADD id_estado_actual INT NULL;
    ALTER TABLE DISPOSITIVO ADD CONSTRAINT FK_DISPOSITIVO_ESTADO_ACTUAL 
        FOREIGN KEY (id_estado_actual) REFERENCES ESTADO_DISPOSITIVO(id_estado);
    PRINT 'Columna [id_estado_actual] agregada exitosamente a la tabla DISPOSITIVO.';
END;
GO

-- Sincronizar el estado actual inicial de cada dispositivo a partir de HISTORIAL_ESTADO
UPDATE d
SET id_estado_actual = he.id_estado
FROM DISPOSITIVO d
INNER JOIN HISTORIAL_ESTADO he ON d.id_dispositivo = he.id_dispositivo
WHERE he.fecha_fin IS NULL;
GO


-- ============================================================================
-- TRIGGER 1: TRG_DISPOSITIVO_GUARDAR_HISTORIAL
-- ============================================================================
-- Requerimiento 3.a: Trigger que guarde en el historial cada cambio de estado
--                    de un dispositivo. Muestren el historial antes y después.
-- Lógica:
--   - Se dispara AFTER UPDATE en DISPOSITIVO cuando se modifica id_estado_actual.
--   - Cierra el registro anterior en HISTORIAL_ESTADO seteando fecha_fin = SYSDATETIME().
--   - Inserta una nueva fila en HISTORIAL_ESTADO con numero_secuencia correlativo,
--     el nuevo estado, timestamp actual y observación de auditoría.
-- ============================================================================

CREATE OR ALTER TRIGGER dbo.TRG_DISPOSITIVO_GUARDAR_HISTORIAL
ON dbo.DISPOSITIVO
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Actuar únicamente si la columna id_estado_actual fue modificada
    IF UPDATE(id_estado_actual)
    BEGIN
        -- 1. Cerrar el estado previo en HISTORIAL_ESTADO (fecha_fin = SYSDATETIME())
        UPDATE he
        SET fecha_fin = SYSDATETIME()
        FROM HISTORIAL_ESTADO he
        INNER JOIN inserted i ON he.id_dispositivo = i.id_dispositivo
        INNER JOIN deleted d ON i.id_dispositivo = d.id_dispositivo
        WHERE he.fecha_fin IS NULL
          AND (d.id_estado_actual IS NULL OR d.id_estado_actual <> i.id_estado_actual);

        -- 2. Insertar nuevo evento histórico en la entidad débil HISTORIAL_ESTADO
        INSERT INTO HISTORIAL_ESTADO (
            id_dispositivo,
            numero_secuencia,
            id_estado,
            id_usuario,
            fecha_inicio,
            fecha_fin,
            observacion
        )
        SELECT 
            i.id_dispositivo,
            -- Generación correlativa del discriminador de secuencia
            ISNULL((SELECT MAX(h2.numero_secuencia) 
                    FROM HISTORIAL_ESTADO h2 
                    WHERE h2.id_dispositivo = i.id_dispositivo), 0) + 1,
            i.id_estado_actual,
            1, -- Usuario Administrador/Sistema asignado al evento automático
            SYSDATETIME(),
            NULL, -- fecha_fin en NULL representa el estado activo vigente
            CONCAT('Transición de estado auditada por TRG_DISPOSITIVO_GUARDAR_HISTORIAL. Estado anterior: ', 
                   ISNULL(CAST(d.id_estado_actual AS VARCHAR(10)), 'INICIAL'), 
                   ' -> Nuevo estado: ', CAST(i.id_estado_actual AS VARCHAR(10)))
        FROM inserted i
        INNER JOIN deleted d ON i.id_dispositivo = d.id_dispositivo
        WHERE (d.id_estado_actual IS NULL OR d.id_estado_actual <> i.id_estado_actual);
    END;
END;
GO

PRINT 'Trigger [TRG_DISPOSITIVO_GUARDAR_HISTORIAL] creado exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- PRUEBA TRIGGER 3.a:
-- Demostración de auditoría automática mostrando el historial ANTES y DESPUÉS.
-- Usaremos el Dispositivo 10 (actualmente en estado 2: RECOLECTADO).
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> DEMOSTRACIÓN TRIGGER 3.a: Cambio de estado y auditoría automática';

-- A. Historial ANTES de la modificación
PRINT '--- HISTORIAL_ESTADO del Dispositivo 10 ANTES de la actualización:';
SELECT 
    he.id_dispositivo,
    he.numero_secuencia,
    ed.nombre AS estado,
    FORMAT(he.fecha_inicio, 'yyyy-MM-dd HH:mm:ss') AS fecha_inicio,
    ISNULL(FORMAT(he.fecha_fin, 'yyyy-MM-dd HH:mm:ss'), 'VIGENTE (NULL)') AS fecha_fin,
    he.observacion
FROM HISTORIAL_ESTADO he
INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
WHERE he.id_dispositivo = 10
ORDER BY he.numero_secuencia ASC;

-- B. Ejecución del UPDATE sobre DISPOSITIVO (Transición a estado 4: EN_REACONDICIONAMIENTO)
PRINT '';
PRINT 'Ejecutando: UPDATE DISPOSITIVO SET id_estado_actual = 4 WHERE id_dispositivo = 10...';
UPDATE DISPOSITIVO
SET id_estado_actual = 4 -- En Taller de Reparación
WHERE id_dispositivo = 10;

-- C. Historial DESPUÉS de la modificación (El trigger debió cerrar la secuencia 1 e insertar la 2)
PRINT '';
PRINT '--- HISTORIAL_ESTADO del Dispositivo 10 DESPUÉS de la actualización:';
SELECT 
    he.id_dispositivo,
    he.numero_secuencia,
    ed.nombre AS estado,
    FORMAT(he.fecha_inicio, 'yyyy-MM-dd HH:mm:ss') AS fecha_inicio,
    ISNULL(FORMAT(he.fecha_fin, 'yyyy-MM-dd HH:mm:ss'), 'VIGENTE (NULL)') AS fecha_fin,
    he.observacion
FROM HISTORIAL_ESTADO he
INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
WHERE he.id_dispositivo = 10
ORDER BY he.numero_secuencia ASC;
GO


-- ============================================================================
-- TRIGGER 2: TRG_PREVENIR_CIERRE_SIN_DESTINO_FINAL
-- ============================================================================
-- Requerimiento 3.b: Uno que impida romper una regla del negocio, por ejemplo
--                    cerrar un dispositivo sin destino final. Muestren el error
--                    y que el dato no cambió.
-- Regla de Negocio (RN-08):
--   Ningún dispositivo puede transitar al estado terminal 'TRAZABILIDAD_CERRADA'
--   (id_estado = 7) si no existe previamente un registro formal en la tabla
--   DESTINO_FINAL que certifique su donación, reciclaje o destrucción autorizada.
-- ============================================================================

CREATE OR ALTER TRIGGER dbo.TRG_PREVENIR_CIERRE_SIN_DESTINO_FINAL
ON dbo.DISPOSITIVO
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(id_estado_actual)
    BEGIN
        -- Verificar si algún registro intenta pasar a estado terminal sin tener DESTINO_FINAL
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN ESTADO_DISPOSITIVO ed ON i.id_estado_actual = ed.id_estado
            WHERE (ed.es_terminal = 1 OR ed.codigo = 'TRAZABILIDAD_CERRADA' OR i.id_estado_actual = 7)
              AND NOT EXISTS (
                  SELECT 1 
                  FROM DESTINO_FINAL df 
                  WHERE df.id_dispositivo = i.id_dispositivo
              )
        )
        BEGIN
            -- Violación de regla de negocio: Cancelar la transacción
            RAISERROR('REGLA DE NEGOCIO VIOLADA [RN-08]: Operación abortada por trigger [TRG_PREVENIR_CIERRE_SIN_DESTINO_FINAL]. No es posible cerrar la trazabilidad de un equipo sin haber registrado previamente su acta o certificado formal en la tabla DESTINO_FINAL.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END;
    END;
END;
GO

PRINT 'Trigger [TRG_PREVENIR_CIERRE_SIN_DESTINO_FINAL] creado exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- PRUEBA TRIGGER 3.b:
-- Demostración de bloqueo de regla de negocio con captura de error y verificación.
-- Usaremos el Dispositivo 12 (equipo activo en bodega sin destino final registrado).
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> DEMOSTRACIÓN TRIGGER 3.b: Intento de cierre sin acta de DESTINO_FINAL';

-- A. Estado del Dispositivo 12 ANTES del intento indebido
PRINT '--- Estado del Dispositivo 12 ANTES de intentar el cierre:';
SELECT 
    d.id_dispositivo,
    d.codigo_qr,
    d.id_estado_actual,
    ed.nombre AS estado_actual,
    CASE 
        WHEN EXISTS (SELECT 1 FROM DESTINO_FINAL df WHERE df.id_dispositivo = d.id_dispositivo) THEN 'SÍ'
        ELSE 'NO (Sin Destino)'
    END AS posee_destino_final
FROM DISPOSITIVO d
INNER JOIN ESTADO_DISPOSITIVO ed ON d.id_estado_actual = ed.id_estado
WHERE d.id_dispositivo = 12;

-- B. Intento de forzar id_estado_actual = 7 (TRAZABILIDAD_CERRADA) dentro de un bloque TRY...CATCH
PRINT '';
PRINT 'Intentando ejecutar: UPDATE DISPOSITIVO SET id_estado_actual = 7 WHERE id_dispositivo = 12...';
BEGIN TRY
    UPDATE DISPOSITIVO
    SET id_estado_actual = 7 -- Estado terminal prohibido sin registro en DESTINO_FINAL
    WHERE id_dispositivo = 12;

    PRINT 'ALERTA INESPERADA: ¡La instrucción se ejecutó! (Fallo en la validación del trigger)';
END TRY
BEGIN CATCH
    PRINT '>>> ÉXITO DE RECHAZO: El trigger [TRG_PREVENIR_CIERRE_SIN_DESTINO_FINAL] bloqueó la operación.';
    PRINT 'Código de Error: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Mensaje Técnico: ' + ERROR_MESSAGE();
END CATCH;

-- C. Verificación de que el dato NO cambió (se mantiene el estado original)
PRINT '';
PRINT '--- Estado del Dispositivo 12 DESPUÉS de la instrucción rechazada (DATO INTACTO):';
SELECT 
    d.id_dispositivo,
    d.codigo_qr,
    d.id_estado_actual,
    ed.nombre AS estado_actual,
    'DATO NO CAMBIÓ - PRESERVADO POR ROLLBACK' AS comprobacion_integridad
FROM DISPOSITIVO d
INNER JOIN ESTADO_DISPOSITIVO ed ON d.id_estado_actual = ed.id_estado
WHERE d.id_dispositivo = 12;
GO

PRINT '';
PRINT '======================================================================';
PRINT 'FIN DE EJECUCIÓN EXITOSA DE 07_triggers.sql (GRUPO 8)';
PRINT '======================================================================';
GO
