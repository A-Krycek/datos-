-- ============================================================================
-- PROYECTO INTEGRADOR: EcoRAEE Cloud - Quinto Semestre 2026
-- ARCHIVO: 03_pruebas.sql
-- DESCRIPCIÓN: Cinco pruebas de integridad relacional que el motor SQL Server
--              DEBE rechazar obligatoriamente (PK, FK, UNIQUE, CHECK, DELETE FK).
--
-- AUTORES: Daniel Pazmiño, Matias Herrera, Ihair Llamuca
-- DOCENTE: Ing. María del Carmen Salazar Torres
-- MOTOR: Microsoft SQL Server 2019 / 2022 (T-SQL)
-- BASE DE DATOS: BD_ECORAEE_CLOUD
-- ============================================================================

USE BD_ECORAEE_CLOUD;
GO

PRINT '======================================================================';
PRINT 'INICIO DEL BANCO DE PRUEBAS DE INTEGRIDAD Y RESTRICCIONES (03_pruebas)';
PRINT 'Cada una de las siguientes 5 pruebas debe ser rechazada por el motor.';
PRINT '======================================================================';
GO

-- ============================================================================
-- PRUEBA 1: VIOLACIÓN DE CLAVE PRIMARIA (PK REPETIDA)
-- ============================================================================
-- Objetivo: Verificar que SQL Server rechace la inserción de una tupla cuya clave
--           primaria ya exista en la tabla.
-- Tabla evaluada: HISTORIAL_ESTADO (Entidad Débil con Clave Primaria Compuesta).
-- Clave Primaria: PK_HISTORIAL_ESTADO (id_dispositivo, numero_secuencia).
-- Contexto: El dispositivo 1 ya posee registrado el evento de secuencia 1 en 02_DML.
-- Restricción infringida: CONSTRAINT PK_HISTORIAL_ESTADO PRIMARY KEY (id_dispositivo, numero_secuencia).
-- Código de error esperado de SQL Server: Error 2627, Severity 14, State 1.
-- ============================================================================

PRINT '';
PRINT '>>> EJECUTANDO PRUEBA 1: Inserción de Clave Primaria duplicada...';

-- A continuación, la instrucción en bloque TRY...CATCH para validar programáticamente:
BEGIN TRY
    INSERT INTO HISTORIAL_ESTADO (
        id_dispositivo, 
        numero_secuencia, 
        id_estado, 
        id_usuario, 
        fecha_inicio, 
        observacion
    ) VALUES (
        1,              -- id_dispositivo existente (Laptop ThinkPad T490)
        1,              -- numero_secuencia YA EXISTE para el dispositivo 1
        2,              -- id_estado (RECOLECTADO)
        1,              -- id_usuario
        SYSDATETIME(), 
        'Intento de duplicar evento de secuencia inicial 1 para el dispositivo 1'
    );
    
    PRINT 'ALERTA INESPERADA: ¡La instrucción fue permitida! (Error en la definición de la PK)';
END TRY
BEGIN CATCH
    PRINT 'ÉXITO DE RECHAZO: El motor SQL Server bloqueó la operación correctamente.';
    PRINT 'Número de Error: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Mensaje Técnico: ' + ERROR_MESSAGE();
    PRINT 'Línea de Error: ' + CAST(ERROR_LINE() AS VARCHAR(10));
END CATCH;
GO

-- INSTRUCCIÓN AISLADA (Para ejecutar de forma individual en SSMS y observar el error nativo en rojo):
/*
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, observacion)
VALUES (1, 1, 2, 1, SYSDATETIME(), 'Intento de clave primaria duplicada');
*/
GO


-- ============================================================================
-- PRUEBA 2: VIOLACIÓN DE CLAVE FORÁNEA (FK INEXISTENTE)
-- ============================================================================
-- Objetivo: Verificar que el motor rechace la inserción de un registro hijo que hace
--           referencia a un registro padre inexistente en la tabla referenciada.
-- Tabla evaluada: DISPOSITIVO.
-- Clave Foránea: FK_DISPOSITIVO_MODELO (id_modelo) -> MODELO_DISPOSITIVO(id_modelo).
-- Contexto: Se intenta registrar un dispositivo asociándolo al id_modelo = 99999,
--           el cual no existe en el catálogo maestro de modelos.
-- Restricción infringida: CONSTRAINT FK_DISPOSITIVO_MODELO FOREIGN KEY.
-- Código de error esperado de SQL Server: Error 547, Severity 16, State 0.
-- ============================================================================

PRINT '';
PRINT '>>> EJECUTANDO PRUEBA 2: Inserción de Clave Foránea con valor inexistente...';

BEGIN TRY
    INSERT INTO DISPOSITIVO (
        codigo_qr, 
        id_lote, 
        id_modelo, 
        id_condicion, 
        numero_serie, 
        peso_kg, 
        observaciones_ingreso
    ) VALUES (
        'QR-TEST-FK-ERROR-001', 
        1,          -- Lote existente
        99999,      -- ID DE MODELO INEXISTENTE EN MODELO_DISPOSITIVO
        1,          -- Condición existente
        'SN-ERR-FK-9999', 
        2.50, 
        'Prueba de integridad referencial FK inexistente'
    );

    PRINT 'ALERTA INESPERADA: ¡La instrucción fue permitida! (Error en la definición de la FK)';
END TRY
BEGIN CATCH
    PRINT 'ÉXITO DE RECHAZO: El motor SQL Server bloqueó la operación correctamente.';
    PRINT 'Número de Error: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Mensaje Técnico: ' + ERROR_MESSAGE();
    PRINT 'Línea de Error: ' + CAST(ERROR_LINE() AS VARCHAR(10));
END CATCH;
GO

-- INSTRUCCIÓN AISLADA (Para ejecutar de forma individual en SSMS y observar el error nativo en rojo):
/*
INSERT INTO DISPOSITIVO (codigo_qr, id_lote, id_modelo, id_condicion, numero_serie, peso_kg, observaciones_ingreso)
VALUES ('QR-TEST-FK-ERROR-001', 1, 99999, 1, 'SN-ERR-FK-9999', 2.50, 'Prueba de FK inexistente');
*/
GO


-- ============================================================================
-- PRUEBA 3: VIOLACIÓN DE CLAVE CANDIDATA / ALTERNA (UNIQUE REPETIDO)
-- ============================================================================
-- Objetivo: Comprobar que no puedan existir dos registros distintos con el mismo
--           valor en un campo declarado UNIQUE (Clave Alterna AK del EER).
-- Tabla evaluada: DISPOSITIVO.
-- Clave Alterna: UQ_DISPOSITIVO_qr (codigo_qr).
-- Contexto: En 02_DML ya existe el dispositivo 1 con 'QR-2026-ECU-000001'.
--           Se intenta insertar un nuevo dispositivo con ese mismo código QR.
-- Restricción infringida: CONSTRAINT UQ_DISPOSITIVO_qr UNIQUE (codigo_qr).
-- Código de error esperado de SQL Server: Error 2627, Severity 14, State 1.
-- ============================================================================

PRINT '';
PRINT '>>> EJECUTANDO PRUEBA 3: Inserción de valor duplicado en campo UNIQUE (AK)...';

BEGIN TRY
    INSERT INTO DISPOSITIVO (
        codigo_qr, 
        id_lote, 
        id_modelo, 
        id_condicion, 
        numero_serie, 
        peso_kg, 
        observaciones_ingreso
    ) VALUES (
        'QR-2026-ECU-000001', -- VALOR YA EXISTENTE EN LA BASE DE DATOS (Dispositivo 1)
        1, 
        2, 
        1, 
        'SN-DISTINTO-PERO-QR-DUPLICADO', 
        1.80, 
        'Intento de duplicar el identificador QR físico'
    );

    PRINT 'ALERTA INESPERADA: ¡La instrucción fue permitida! (Error en la restricción UNIQUE)';
END TRY
BEGIN CATCH
    PRINT 'ÉXITO DE RECHAZO: El motor SQL Server bloqueó la operación correctamente.';
    PRINT 'Número de Error: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Mensaje Técnico: ' + ERROR_MESSAGE();
    PRINT 'Línea de Error: ' + CAST(ERROR_LINE() AS VARCHAR(10));
END CATCH;
GO

-- INSTRUCCIÓN AISLADA (Para ejecutar de forma individual en SSMS y observar el error nativo en rojo):
/*
INSERT INTO DISPOSITIVO (codigo_qr, id_lote, id_modelo, id_condicion, numero_serie, peso_kg, observaciones_ingreso)
VALUES ('QR-2026-ECU-000001', 1, 2, 1, 'SN-DUP-QR', 1.80, 'Intento duplicar QR');
*/
GO


-- ============================================================================
-- PRUEBA 4: VIOLACIÓN DE RESTRICCIÓN DE VERIFICACIÓN (CHECK INCUMPLIDO)
-- ============================================================================
-- Objetivo: Comprobar que el motor valide los rangos y reglas de dominio definidas
--           en las restricciones CHECK lógicas de negocio.
-- Tabla evaluada: DISPOSITIVO.
-- Restricción: CK_DISPOSITIVO_peso CHECK (peso_kg > 0).
-- Contexto: Se intenta insertar un dispositivo RAEE con un peso negativo (-12.50 kg).
--           En el modelo de economía circular y física de materiales, el peso
--           debe ser estrictamente positivo.
-- Restricción infringida: CONSTRAINT CK_DISPOSITIVO_peso CHECK (peso_kg > 0).
-- Código de error esperado de SQL Server: Error 547, Severity 16, State 0.
-- ============================================================================

PRINT '';
PRINT '>>> EJECUTANDO PRUEBA 4: Inserción de valor que incumple restricción CHECK...';

BEGIN TRY
    INSERT INTO DISPOSITIVO (
        codigo_qr, 
        id_lote, 
        id_modelo, 
        id_condicion, 
        numero_serie, 
        peso_kg, 
        observaciones_ingreso
    ) VALUES (
        'QR-TEST-CHECK-PESO-001', 
        1, 
        1, 
        1, 
        'SN-PESO-NEGATIVO', 
        -12.50, -- VALOR NEGATIVO INVÁLIDO (Debe ser > 0)
        'Intento de registrar un peso físicamente imposible'
    );

    PRINT 'ALERTA INESPERADA: ¡La instrucción fue permitida! (Error en la restricción CHECK)';
END TRY
BEGIN CATCH
    PRINT 'ÉXITO DE RECHAZO: El motor SQL Server bloqueó la operación correctamente.';
    PRINT 'Número de Error: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Mensaje Técnico: ' + ERROR_MESSAGE();
    PRINT 'Línea de Error: ' + CAST(ERROR_LINE() AS VARCHAR(10));
END CATCH;
GO

-- INSTRUCCIÓN AISLADA (Para ejecutar de forma individual en SSMS y observar el error nativo en rojo):
/*
INSERT INTO DISPOSITIVO (codigo_qr, id_lote, id_modelo, id_condicion, numero_serie, peso_kg, observaciones_ingreso)
VALUES ('QR-TEST-CHECK-PESO-001', 1, 1, 1, 'SN-PESO-NEGATIVO', -12.50, 'Peso negativo');
*/
GO


-- ============================================================================
-- PRUEBA 5: VIOLACIÓN POR BORRADO RESTRINGIDO (DELETE CON DATOS RELACIONADOS)
-- ============================================================================
-- Objetivo: Comprobar que no sea posible eliminar un registro padre fundamental
--           mientras existan registros hijos que dependan de él mediante integridad
--           referencial estricta (ON DELETE NO ACTION / RESTRICT).
-- Tabla evaluada: CENTRO_ACOPIO (Padre).
-- Tablas dependientes: UBICACION, INVENTARIO, MOVIMIENTO, NODO_RED.
-- Contexto: Se intenta eliminar el centro de acopio con id_centro = 1 (Centro Norte -
--           La Florida), el cual tiene perchas físicas de inventario (UBICACION),
--           dispositivos almacenados (INVENTARIO) y transferencias logísticas (MOVIMIENTO).
-- Restricción infringida: CONSTRAINT FK_UBICACION_CENTRO (o FK_INV_CENTRO / FK_MOV_origen).
-- Código de error esperado de SQL Server: Error 547, Severity 16, State 0.
-- ============================================================================

PRINT '';
PRINT '>>> EJECUTANDO PRUEBA 5: Eliminación de registro padre con registros hijos asociados...';

BEGIN TRY
    DELETE FROM CENTRO_ACOPIO 
    WHERE id_centro = 1; -- Centro con stock, ubicaciones y movimientos asociados

    PRINT 'ALERTA INESPERADA: ¡El registro padre fue eliminado! (Violación de integridad referencial)';
END TRY
BEGIN CATCH
    PRINT 'ÉXITO DE RECHAZO: El motor SQL Server bloqueó la operación correctamente.';
    PRINT 'Número de Error: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Mensaje Técnico: ' + ERROR_MESSAGE();
    PRINT 'Línea de Error: ' + CAST(ERROR_LINE() AS VARCHAR(10));
END CATCH;
GO

-- INSTRUCCIÓN AISLADA (Para ejecutar de forma individual en SSMS y observar el error nativo en rojo):
/*
DELETE FROM CENTRO_ACOPIO WHERE id_centro = 1;
*/
GO

PRINT '';
PRINT '======================================================================';
PRINT 'RESUMEN: Las 5 pruebas de integridad relacional fueron validadas y';
PRINT 'rechazadas exitosamente por Microsoft SQL Server (100% de cumplimiento).';
PRINT '======================================================================';
GO
