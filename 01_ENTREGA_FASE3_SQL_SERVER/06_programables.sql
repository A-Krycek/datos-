-- ============================================================================
-- PROYECTO INTEGRADOR: EcoRAEE Cloud - Quinto Semestre 2026
-- FASE 3: LÓGICA DE NEGOCIO Y OBJETOS PROGRAMABLES
-- ARCHIVO: 06_programables.sql
-- DESCRIPCIÓN: Procedimientos almacenados para registro de evaluaciones técnicas
--              y transferencias seguras entre centros (con transacciones y TRY...CATCH),
--              junto con función escalar de cálculo de días sin cierre de trazabilidad.
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
PRINT 'INICIO DE CREACIÓN DE OBJETOS PROGRAMABLES (06_programables.sql) - GRUPO 8';
PRINT '======================================================================';
GO


-- ============================================================================
-- PROCEDIMIENTO 1: SP_REGISTRAR_EVALUACION_TECNICA
-- ============================================================================
-- Requerimiento 2.a: Procedimiento que registra la evaluación técnica de un
--                    dispositivo (parámetros: dispositivo, técnico y clasificación).
-- Lógica implementada:
--   1. Valida existencia e idoneidad del dispositivo, técnico y clasificación.
--   2. Inserta la pericia técnica en EVALUACION_TECNICA.
--   3. Cierra el estado vigente previo en HISTORIAL_ESTADO (fecha_fin = SYSDATETIME()).
--   4. Inserta el nuevo estado 'EVALUADO' (id_estado = 3) con secuencia correlativa.
-- ============================================================================

CREATE OR ALTER PROCEDURE dbo.SP_REGISTRAR_EVALUACION_TECNICA
    @id_dispositivo BIGINT,
    @id_tecnico BIGINT,
    @id_clasificacion INT,
    @diagnostico_funcional VARCHAR(MAX) = 'Evaluación técnica y operativa completada en laboratorio. Pruebas de POST, memoria y encendido verificadas.',
    @diagnostico_estetico VARCHAR(MAX) = 'Chasis en buen estado exterior con leves marcas cosméticas de uso.',
    @aprobado_reutilizacion BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- 1. Validaciones de integridad de negocio
    IF NOT EXISTS (SELECT 1 FROM DISPOSITIVO WHERE id_dispositivo = @id_dispositivo)
    BEGIN
        RAISERROR('ERROR: El dispositivo con ID %I64d no existe en la base de datos.', 16, 1, @id_dispositivo);
        RETURN -1;
    END;

    IF NOT EXISTS (SELECT 1 FROM EMPLEADO WHERE id_empleado = @id_tecnico)
    BEGIN
        RAISERROR('ERROR: El técnico con ID de empleado %I64d no existe en la nómina institucional.', 16, 1, @id_tecnico);
        RETURN -2;
    END;

    IF NOT EXISTS (SELECT 1 FROM CLASIFICACION_TECNICA WHERE id_clasificacion = @id_clasificacion)
    BEGIN
        RAISERROR('ERROR: La clasificación técnica con ID %d no es válida en el catálogo maestro.', 16, 1, @id_clasificacion);
        RETURN -3;
    END;

    -- Inferir bandera de reutilización si no fue provista explícitamente
    IF @aprobado_reutilizacion IS NULL
    BEGIN
        IF @id_clasificacion = 1 -- REUTILIZABLE
            SET @aprobado_reutilizacion = 1;
        ELSE
            SET @aprobado_reutilizacion = 0;
    END;

    -- 2. Ejecución controlada mediante Transacción
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Insertar diagnóstico en EVALUACION_TECNICA
        INSERT INTO EVALUACION_TECNICA (
            id_dispositivo,
            id_tecnico,
            id_clasificacion,
            diagnostico_funcional,
            diagnostico_estetico,
            fecha_evaluacion,
            aprobado_reutilizacion
        ) VALUES (
            @id_dispositivo,
            @id_tecnico,
            @id_clasificacion,
            @diagnostico_funcional,
            @diagnostico_estetico,
            SYSDATETIME(),
            @aprobado_reutilizacion
        );

        -- Cerrar el estado anterior en HISTORIAL_ESTADO
        UPDATE HISTORIAL_ESTADO
        SET fecha_fin = SYSDATETIME()
        WHERE id_dispositivo = @id_dispositivo 
          AND fecha_fin IS NULL;

        -- Obtener el siguiente número de secuencia para la entidad débil
        DECLARE @siguiente_secuencia INT;
        SELECT @siguiente_secuencia = ISNULL(MAX(numero_secuencia), 0) + 1
        FROM HISTORIAL_ESTADO
        WHERE id_dispositivo = @id_dispositivo;

        -- Obtener el id_usuario asociado al técnico evaluador (o fallback a admin)
        DECLARE @id_usuario_tecnico BIGINT;
        SELECT @id_usuario_tecnico = id_usuario 
        FROM USUARIO 
        WHERE id_empleado = @id_tecnico;

        IF @id_usuario_tecnico IS NULL
            SET @id_usuario_tecnico = 1;

        -- Obtener nombre de la clasificación para la bitácora
        DECLARE @nombre_clasificacion VARCHAR(60);
        SELECT @nombre_clasificacion = nombre 
        FROM CLASIFICACION_TECNICA 
        WHERE id_clasificacion = @id_clasificacion;

        -- Registrar nuevo evento en HISTORIAL_ESTADO con id_estado = 3 (EVALUADO)
        INSERT INTO HISTORIAL_ESTADO (
            id_dispositivo,
            numero_secuencia,
            id_estado,
            id_usuario,
            fecha_inicio,
            fecha_fin,
            observacion
        ) VALUES (
            @id_dispositivo,
            @siguiente_secuencia,
            3, -- Estado: EVALUACION_TECNICA_REALIZADA
            @id_usuario_tecnico,
            SYSDATETIME(),
            NULL,
            CONCAT('Evaluación técnica registrada mediante SP_REGISTRAR_EVALUACION_TECNICA. Dictamen: ', @nombre_clasificacion)
        );

        COMMIT TRANSACTION;
        PRINT '>>> ÉXITO: Evaluación técnica del Dispositivo ' + CAST(@id_dispositivo AS VARCHAR(10)) + ' registrada correctamente.';
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrMsg VARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrNum INT = ERROR_NUMBER();
        RAISERROR('ERROR al registrar evaluación técnica (Código %d): %s', 16, 1, @ErrNum, @ErrMsg);
        RETURN -99;
    END CATCH;
END;
GO

PRINT 'Procedimiento [SP_REGISTRAR_EVALUACION_TECNICA] creado exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- EJEMPLO DE USO 2.a:
-- Registrar la evaluación técnica del dispositivo 8 asignándole dictamen REPARABLE (id = 2)
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> EJEMPLO DE USO 2.a: Ejecutando SP_REGISTRAR_EVALUACION_TECNICA...';

-- Verificar si el dispositivo 8 ya tiene evaluación; si la tiene, seleccionamos otro sin evaluar
DECLARE @IdDispAEvaluar BIGINT;
SELECT TOP 1 @IdDispAEvaluar = id_dispositivo 
FROM VW_DISPOSITIVOS_PENDIENTES_EVALUACION;

IF @IdDispAEvaluar IS NOT NULL
BEGIN
    PRINT 'Evaluando dispositivo en espera ID: ' + CAST(@IdDispAEvaluar AS VARCHAR(10));
    EXEC dbo.SP_REGISTRAR_EVALUACION_TECNICA 
        @id_dispositivo = @IdDispAEvaluar,
        @id_tecnico = 3,       -- maria.tecnico (Especialista de Laboratorio)
        @id_clasificacion = 2, -- REPARABLE
        @diagnostico_funcional = 'Falla de lectura en puertos USB frontales y capacitor desoldado. Placa madre y CPU en excelente estado.',
        @diagnostico_estetico = 'Carcasa metálica sin abolladuras.',
        @aprobado_reutilizacion = 0;

    -- Comprobación SELECT de los resultados generados
    SELECT TOP 1 
        et.id_evaluacion,
        et.id_dispositivo,
        d.codigo_qr,
        emp.codigo_empleado AS tecnico,
        ct.nombre AS dictamen_clasificacion,
        et.fecha_evaluacion,
        et.diagnostico_funcional
    FROM EVALUACION_TECNICA et
    INNER JOIN DISPOSITIVO d ON et.id_dispositivo = d.id_dispositivo
    INNER JOIN EMPLEADO emp ON et.id_tecnico = emp.id_empleado
    INNER JOIN CLASIFICACION_TECNICA ct ON et.id_clasificacion = ct.id_clasificacion
    WHERE et.id_dispositivo = @IdDispAEvaluar
    ORDER BY et.id_evaluacion DESC;
END
ELSE
    PRINT 'Todos los dispositivos ya cuentan con evaluación técnica previa.';
GO


-- ============================================================================
-- PROCEDIMIENTO 2: SP_TRANSFERIR_DISPOSITIVO
-- ============================================================================
-- Requerimiento 2.b: Procedimiento que transfiere un dispositivo a otro centro:
--                    registra el movimiento y cambia el centro del dispositivo,
--                    dentro de una transacción con TRY...CATCH.
-- ============================================================================

CREATE OR ALTER PROCEDURE dbo.SP_TRANSFERIR_DISPOSITIVO
    @id_dispositivo BIGINT,
    @id_centro_destino BIGINT,
    @id_responsable BIGINT,
    @observaciones VARCHAR(MAX) = 'Transferencia logística autorizada de equipos RAEE entre sedes'
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- 1. Validaciones preventivas de negocio
    IF NOT EXISTS (SELECT 1 FROM DISPOSITIVO WHERE id_dispositivo = @id_dispositivo)
    BEGIN
        RAISERROR('ERROR: El dispositivo ID %I64d no existe.', 16, 1, @id_dispositivo);
        RETURN -1;
    END;

    -- Obtener centro de acopio actual y peso del equipo desde INVENTARIO
    DECLARE @id_centro_origen BIGINT;
    DECLARE @peso_dispositivo DECIMAL(8,2);

    SELECT 
        @id_centro_origen = inv.id_centro,
        @peso_dispositivo = d.peso_kg
    FROM INVENTARIO inv
    INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
    WHERE inv.id_dispositivo = @id_dispositivo;

    IF @id_centro_origen IS NULL
    BEGIN
        RAISERROR('ERROR: El dispositivo ID %I64d no se encuentra almacenado en ninguna bodega de inventario activa.', 16, 1, @id_dispositivo);
        RETURN -2;
    END;

    IF @id_centro_origen = @id_centro_destino
    BEGIN
        RAISERROR('ERROR: El centro de origen y el centro de destino son idénticos (Centro %I64d). Operación cancelada.', 16, 1, @id_centro_origen);
        RETURN -3;
    END;

    IF NOT EXISTS (SELECT 1 FROM CENTRO_ACOPIO WHERE id_centro = @id_centro_destino AND activo = 1)
    BEGIN
        RAISERROR('ERROR: El centro de destino ID %I64d no existe o se encuentra inactivo.', 16, 1, @id_centro_destino);
        RETURN -4;
    END;

    IF @id_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM EMPLEADO WHERE id_empleado = @id_responsable)
    BEGIN
        RAISERROR('ERROR: El responsable de la transferencia (Empleado ID %I64d) es obligatorio y debe existir en nómina.', 16, 1, @id_responsable);
        RETURN -5;
    END;

    -- 2. BLOQUE TRANSACCIONAL ATÓMICO (ACID: Atomicidad y Consistencia)
    BEGIN TRANSACTION;
    BEGIN TRY
        -- A. Generar código de manifiesto de transferencia único
        DECLARE @codigo_mov VARCHAR(40);
        SET @codigo_mov = 'TRF-' + CONVERT(VARCHAR(8), GETDATE(), 112) + '-' + 
                          CAST(@id_dispositivo AS VARCHAR(10)) + '-' + 
                          SUBSTRING(REPLACE(CAST(NEWID() AS VARCHAR(36)),'-',''), 1, 4);

        -- B. Insertar cabecera en MOVIMIENTO
        INSERT INTO MOVIMIENTO (
            codigo_movimiento,
            id_centro_origen,
            id_centro_destino,
            id_responsable,
            id_estado_movimiento,
            fecha_salida,
            fecha_llegada,
            observaciones
        ) VALUES (
            @codigo_mov,
            @id_centro_origen,
            @id_centro_destino,
            @id_responsable,
            3, -- Estado: ENTREGADO (Carga recibida formalmente en destino)
            SYSDATETIME(),
            SYSDATETIME(),
            @observaciones
        );

        DECLARE @id_movimiento_generado BIGINT = SCOPE_IDENTITY();

        -- C. Insertar ítem en la entidad débil DETALLE_MOVIMIENTO (con clave parcial numero_linea = 1)
        INSERT INTO DETALLE_MOVIMIENTO (
            id_movimiento,
            numero_linea,
            id_dispositivo,
            peso_kg_transferido
        ) VALUES (
            @id_movimiento_generado,
            1, -- Primera línea del manifiesto
            @id_dispositivo,
            @peso_dispositivo
        );

        -- D. Cambiar el centro del dispositivo en la tabla INVENTARIO (reubicación física)
        UPDATE INVENTARIO
        SET id_centro = @id_centro_destino,
            id_ubicacion = NULL, -- Queda en zona de recepción hasta ser reubicado en percha
            fecha_ingreso = SYSDATETIME()
        WHERE id_dispositivo = @id_dispositivo;

        -- E. Confirmar la transacción
        COMMIT TRANSACTION;

        PRINT '>>> ÉXITO: Dispositivo ' + CAST(@id_dispositivo AS VARCHAR(10)) + 
              ' transferido exitosamente del Centro ' + CAST(@id_centro_origen AS VARCHAR(10)) + 
              ' al Centro ' + CAST(@id_centro_destino AS VARCHAR(10)) + 
              ' bajo el Manifiesto ' + @codigo_mov + '.';
        RETURN 0;
    END TRY
    BEGIN CATCH
        -- En caso de cualquier excepción, abortar y revertir cambios (Atomicidad)
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMensaje VARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorNumero INT = ERROR_NUMBER();
        RAISERROR('ERROR al ejecutar transferencia (Código %d): %s', 16, 1, @ErrorNumero, @ErrorMensaje);
        RETURN -99;
    END CATCH;
END;
GO

PRINT 'Procedimiento [SP_TRANSFERIR_DISPOSITIVO] creado exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- EJEMPLO DE USO 2.b:
-- Transferir el dispositivo 14 desde su centro actual (Matriz) al Centro Granados (ID = 2)
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> EJEMPLO DE USO 2.b: Ejecutando SP_TRANSFERIR_DISPOSITIVO...';

-- Verificación ANTES de la transferencia
PRINT '--- Estado de INVENTARIO ANTES de transferir Dispositivo 14:';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    ca.id_centro,
    ca.nombre AS centro_actual,
    inv.fecha_ingreso
FROM INVENTARIO inv
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
WHERE inv.id_dispositivo = 14;

-- Ejecución de la transferencia
EXEC dbo.SP_TRANSFERIR_DISPOSITIVO
    @id_dispositivo = 14,
    @id_centro_destino = 2, -- Campus Granados
    @id_responsable = 4,    -- Diego Logística
    @observaciones = 'Transferencia de prueba ejecutada desde 06_programables.sql';

-- Verificación DESPUÉS de la transferencia
PRINT '--- Estado de INVENTARIO DESPUÉS de transferir Dispositivo 14:';
SELECT 
    inv.id_dispositivo,
    d.codigo_qr,
    ca.id_centro,
    ca.nombre AS nuevo_centro,
    inv.fecha_ingreso
FROM INVENTARIO inv
INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
WHERE inv.id_dispositivo = 14;

-- Verificación del manifiesto y detalle creado
PRINT '--- Manifiesto registrado en MOVIMIENTO y DETALLE_MOVIMIENTO:';
SELECT TOP 1
    m.id_movimiento,
    m.codigo_movimiento,
    c_orig.nombre AS origen,
    c_dest.nombre AS destino,
    dm.id_dispositivo,
    dm.peso_kg_transferido,
    m.fecha_salida
FROM MOVIMIENTO m
INNER JOIN DETALLE_MOVIMIENTO dm ON m.id_movimiento = dm.id_movimiento
INNER JOIN CENTRO_ACOPIO c_orig ON m.id_centro_origen = c_orig.id_centro
INNER JOIN CENTRO_ACOPIO c_dest ON m.id_centro_destino = c_dest.id_centro
WHERE dm.id_dispositivo = 14
ORDER BY m.id_movimiento DESC;
GO


-- ============================================================================
-- FUNCIÓN: FN_DIAS_SIN_CIERRE_TRAZABILIDAD
-- ============================================================================
-- Requerimiento 2.c: Función que devuelve los días que lleva un dispositivo
--                    sin cerrar su trazabilidad.
-- Retorno:
--   - 0 : Si el equipo ya cuenta con acta de DESTINO_FINAL confirmada (ciclo cerrado).
--   - N : Número de días transcurridos entre fecha_registro y hoy (ciclo abierto).
--   - NULL : Si el dispositivo no existe.
-- ============================================================================

CREATE OR ALTER FUNCTION dbo.FN_DIAS_SIN_CIERRE_TRAZABILIDAD (
    @id_dispositivo BIGINT
)
RETURNS INT
AS
BEGIN
    DECLARE @dias_transcurridos INT;
    DECLARE @fecha_ingreso DATETIME2;

    -- Obtener la fecha en que el equipo fue registrado
    SELECT @fecha_ingreso = fecha_registro
    FROM DISPOSITIVO
    WHERE id_dispositivo = @id_dispositivo;

    IF @fecha_ingreso IS NULL
        RETURN NULL;

    -- Si el equipo ya posee un registro confirmado en DESTINO_FINAL, su trazabilidad está cerrada
    IF EXISTS (SELECT 1 FROM DESTINO_FINAL WHERE id_dispositivo = @id_dispositivo)
    BEGIN
        SET @dias_transcurridos = 0;
    END
    ELSE
    BEGIN
        -- Si continúa en circuito operativo, calcular días de antigüedad
        SET @dias_transcurridos = DATEDIFF(DAY, @fecha_ingreso, SYSDATETIME());
    END;

    RETURN @dias_transcurridos;
END;
GO

PRINT 'Función [FN_DIAS_SIN_CIERRE_TRAZABILIDAD] creada exitosamente.';
GO

-- ----------------------------------------------------------------------------
-- EJEMPLO DE USO 2.c:
-- Consultar la función sobre una muestra de dispositivos cerrados y en proceso.
-- ----------------------------------------------------------------------------
PRINT '';
PRINT '>>> EJEMPLO DE USO 2.c: Consulta utilizando la función escalar...';
SELECT TOP 10 
    d.id_dispositivo,
    d.codigo_qr,
    m.nombre AS modelo,
    FORMAT(d.fecha_registro, 'yyyy-MM-dd HH:mm') AS fecha_ingreso,
    dbo.FN_DIAS_SIN_CIERRE_TRAZABILIDAD(d.id_dispositivo) AS dias_sin_cerrar,
    CASE 
        WHEN dbo.FN_DIAS_SIN_CIERRE_TRAZABILIDAD(d.id_dispositivo) = 0 THEN 'TRAZABILIDAD CERRADA (0 días)'
        ELSE 'EN PROCESO ACTIVO'
    END AS estado_ciclo_vida
FROM DISPOSITIVO d
INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
ORDER BY dias_sin_cerrar DESC, d.id_dispositivo ASC;
GO

PRINT '';
PRINT '======================================================================';
PRINT 'FIN DE EJECUCIÓN EXITOSA DE 06_programables.sql (GRUPO 8)';
PRINT '======================================================================';
GO
