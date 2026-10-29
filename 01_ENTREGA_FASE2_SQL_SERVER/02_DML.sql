-- ============================================================================
-- PROYECTO INTEGRADOR - QUINTO SEMESTRE 2026
-- ASIGNATURA: SISTEMAS DE GESTIÓN DE BASES DE DATOS (05-SIN-A)
-- UNIVERSIDAD INTERNACIONAL DEL ECUADOR (UIDE) / ARIZONA STATE UNIVERSITY
-- INTEGRANTES: Daniel Fernando Pazmiño Mera, Matias Nicolas Herrera Cueva, Ihair Geordano Llamuca López
-- MOTOR: MICROSOFT SQL SERVER (T-SQL)
-- ARCHIVO: 02_DML.sql
-- DESCRIPCIÓN: CARGA DE DATOS SINTÉTICOS EN TODAS LAS TABLAS DEL ECOSISTEMA
--              INCLUYE 32 DISPOSITIVOS Y 4 CICLOS COMPLETOS DE TRAZABILIDAD
--              (UNO POR CADA CLASIFICACIÓN TÉCNICA: REUTILIZABLE, REPARABLE,
--              RECICLABLE Y NO_RECUPERABLE).
-- ============================================================================

USE BD_ECORAEE_CLOUD;
GO

SET NOCOUNT ON;
BEGIN TRANSACTION;

-- ============================================================================
-- 1. CARGA DE CATÁLOGOS BASE
-- ============================================================================

INSERT INTO ROL_ACTOR (codigo, nombre, descripcion) VALUES
('GENERADOR_INST', 'Generador Institucional (Facultades/Dptos)', 'Departamentos internos de la UIDA que dan de baja activos tecnológicos'),
('GENERADOR_COMUN', 'Generador Comunidad (Alumnos/Docentes)', 'Personas naturales de la comunidad universitaria que entregan RAEE personal'),
('CENTRO_ACOPIO', 'Centro de Acopio Universitario', 'Punto de recolección y bodegaje temporal en campus'),
('TALLER_DIAG', 'Taller de Diagnóstico y Reparación', 'Laboratorio de ingeniería para reacondicionamiento y mantenimiento'),
('GESTOR_RECICL', 'Gestor Ambiental Calificado', 'Empresas autorizadas por el MAATE para reciclaje y despiece seguro'),
('BENEFICIARIO_SOC', 'Entidad Receptora de Donaciones', 'Escuelas rurales, fundaciones o sectores vulnerables beneficiarios');

INSERT INTO ROL_SISTEMA (codigo, nombre, descripcion) VALUES
('ROL_ADMIN', 'Administrador General del Sistema', 'Acceso total a catálogos, auditoría, gobernanza y reportería'),
('ROL_OPERADOR', 'Operador de Centro de Acopio', 'Recepción física de lotes, pesaje, etiquetado QR e inventario inicial'),
('ROL_TECNICO', 'Técnico Especialista de Diagnóstico', 'Evaluación técnica, clasificación y ejecución de órdenes de taller'),
('ROL_LOGISTICA', 'Coordinador de Rutas y Logística', 'Planificación de fletes, gestión de movimientos y análisis de capacidades'),
('ROL_AUDITOR', 'Auditor de Calidad y Cumplimiento', 'Verificación de trazabilidad ininterrumpida y evidencias en S3');

INSERT INTO TIPO_CENTRO (codigo, nombre, descripcion) VALUES
('CAMPUS_MATRIZ', 'Campus Principal Universitario', 'Instalación central UIDA en Quito (Av. Simón Bolívar)'),
('CAMPUS_SATELITE', 'Campus Satélite / Extensión', 'Extensión universitaria con punto verde de recolección'),
('TALLER_LAB', 'Laboratorio Técnico de Ingeniería', 'Instalación equipada con bancos de prueba para reparación'),
('GESTOR_EXT', 'Planta Externa de Reciclaje', 'Instalaciones industriales del gestor calificado'),
('SEDE_COMUNIDAD', 'Sede de Beneficiario Social', 'Escuelas rurales y fundaciones comunitarias');

INSERT INTO CATEGORIA_DISPOSITIVO (codigo, nombre, descripcion) VALUES
('COMPUTADORA', 'Computadoras y Portátiles', 'Laptops, desktops y estaciones de trabajo'),
('MONITOR', 'Monitores y Pantallas', 'Monitores LED, LCD, pantallas y displays'),
('TABLET', 'Tablets y Lectores Digitales', 'Dispositivos portátiles táctiles'),
('TELEFONO', 'Teléfonos Inteligentes y Móviles', 'Terminales celulares y smartphones'),
('ROUTER', 'Equipos de Redes y Conectividad', 'Switches, routers, access points y firewalls'),
('OTROS', 'Periféricos e Impresoras', 'Impresoras, fuentes, teclados y accesorios');

INSERT INTO MARCA (nombre) VALUES
('Dell'), ('HP'), ('Lenovo'), ('Apple'), ('Cisco'), ('Samsung'), ('Epson'), ('Kingston');

INSERT INTO MODELO_DISPOSITIVO (id_marca, id_categoria, nombre) VALUES
(1, 1, 'OptiPlex 7070 SFF'),        -- 1
(1, 1, 'Latitude 5400 Laptop'),     -- 2
(2, 1, 'EliteDesk 800 G4'),         -- 3
(2, 1, 'ProBook 450 G6 Laptop'),    -- 4
(3, 1, 'ThinkPad T480 Laptop'),     -- 5
(1, 2, 'UltraSharp U2415b 24"'),    -- 6
(2, 2, 'HP Pavilion 22cwa 21.5"'),  -- 7
(4, 3, 'iPad 9th Generation'),      -- 8
(6, 3, 'Galaxy Tab A8'),            -- 9
(4, 4, 'iPhone 11 64GB'),           -- 10
(6, 4, 'Galaxy A52'),               -- 11
(5, 5, 'Catalyst 2960-X Switch'),   -- 12
(5, 5, 'RV340 VPN Router');         -- 13

INSERT INTO CONDICION_DISPOSITIVO (codigo, nombre, descripcion) VALUES
('OPERATIVO_BUENO', 'Operativo en Buen Estado', 'Equipo funcional sin defectos técnicos notables'),
('OPERATIVO_DESGASTE', 'Operativo con Desgaste', 'Funcional pero con signos de desgaste o batería disminuida'),
('DANADO_REPARABLE', 'Dañado pero Reparable', 'Presenta fallo menor subsanable (RAM, disco, fuente)'),
('OBSOLETO_CHATARRA', 'Obsoleto o No Recuperable', 'Daño irreparable en placa base o tecnología descontinuada');

INSERT INTO ESTADO_DISPOSITIVO (codigo, nombre, descripcion, es_terminal) VALUES
('REGISTRADO', 'Registrado en Solicitud', 'Dispositivo declarado previo a ingreso físico', 0),
('RECOLECTADO', 'Recolectado en Acopio', 'Ingresado físicamente en centro de acopio y pesado', 0),
('EVALUADO', 'Evaluación Técnica Realizada', 'Diagnóstico técnico completado con dictamen formal', 0),
('EN_REACONDICIONAMIENTO', 'En Taller de Reparación', 'En proceso de mantenimiento, limpieza o cambio de partes', 0),
('LISTO_DONACION', 'Listo para Donación', 'Reacondicionado, verificado y apto para beneficiario', 0),
('TRANSFERIDO_RECICLAJE', 'Transferido a Gestor', 'Despachado formalmente para despiece o reciclaje', 0),
('TRAZABILIDAD_CERRADA', 'Trazabilidad Cerrada', 'Destino final confirmado con acta o certificado', 1);

INSERT INTO CLASIFICACION_TECNICA (codigo, nombre, permite_donacion, descripcion) VALUES
('REUTILIZABLE', 'Reutilizable Directo', 1, 'Equipo 100% funcional apto para donación inmediata'),
('REPARABLE', 'Reparable en Taller', 1, 'Requiere sustitución de partes menores o mantenimiento para estar operativo'),
('RECICLABLE', 'Aprovechamiento Material (Reciclaje)', 0, 'No viable operativamente; sus metales y piezas son valorizables'),
('NO_RECUPERABLE', 'Disposición Final Segura', 0, 'Residuo peligroso sin valor de recuperación para celda de seguridad');

INSERT INTO TIPO_TRABAJO (codigo, nombre, descripcion) VALUES
('MANTENIMIENTO_PREV', 'Mantenimiento y Limpieza', 'Limpieza interna, cambio de pasta térmica y ventiladores'),
('UPGRADE_HARDWARE', 'Sustitución de Componentes', 'Instalación de disco SSD o ampliación de memoria RAM'),
('DESPIECE_CANIBAL', 'Desensamble y Canibalización', 'Extracción de componentes funcionales para stock de repuestos'),
('BORRADO_SEGURO', 'Borrado Seguro de Datos', 'Sobreescritura certificada de datos en discos duros');

INSERT INTO ESTADO_ORDEN (codigo, nombre) VALUES
('ABIERTA', 'Orden Creada'),
('EN_EJECUCION', 'En Proceso Técnico'),
('COMPLETADA_EXITOSA', 'Trabajo Concluido Exitosamente'),
('NO_REPARABLE', 'Declarado Irreparable en Banco');

INSERT INTO ESTADO_MOVIMIENTO (codigo, nombre) VALUES
('PROGRAMADO', 'Flete Programado'),
('EN_TRANSITO', 'Carga en Tránsito'),
('ENTREGADO', 'Entrega Confirmada en Destino'),
('CANCELADO', 'Flete Cancelado');

INSERT INTO TIPO_DESTINO (codigo, nombre, es_social, descripcion) VALUES
('DONACION_EDUCATIVA', 'Donación a Institución Educativa', 1, 'Entrega social gratuita a escuelas rurales y fundaciones'),
('GESTOR_RECICLAJE_CERT', 'Gestor de Reciclaje Calificado', 0, 'Entrega a planta industrial autorizada por el MAATE'),
('DESTRUCCION_SEGURA', 'Destrucción Ambiental Segura', 0, 'Confinamiento de residuos peligrosos (pilas, condensadores, PCB)');

INSERT INTO TIPO_EVIDENCIA (codigo, nombre, descripcion) VALUES
('FOTO_RECEPCION', 'Fotografía de Ingreso y Etiqueta', 'Foto del estado físico del chasis y código de barras'),
('FOTO_DIAGNOSTICO', 'Fotografía de Falla Interna', 'Foto de capacitor inflado, pantalla o placa madre'),
('ACTA_ENTREGA', 'Acta de Traspaso Firmada', 'Documento PDF con firmas de responsabilidad'),
('MANIFIESTO_GESTOR', 'Manifiesto Ambiental de Disposición', 'Certificado oficial de valorización o destrucción del gestor');

INSERT INTO TIPO_COMPONENTE (codigo, nombre, descripcion) VALUES
('MEMORIA_RAM', 'Memoria RAM DDR3/DDR4', 'Módulos de memoria para portátiles y desktops'),
('DISCO_SSD', 'Unidad de Estado Sólido SSD', 'Almacenamiento SATA o NVMe'),
('FUENTE_PODER', 'Fuente de Alimentación', 'Cargadores y fuentes internas ATX'),
('MODULO_RED', 'Tarjeta / Módulo de Conectividad', 'Módulos Wi-Fi o tarjetas Ethernet');

-- ============================================================================
-- 2. PERSONAS, EMPLEADOS, USUARIOS Y CENTROS
-- ============================================================================

INSERT INTO PERSONA (correo, telefono, direccion) VALUES
('admin.ecoraee@uide.edu.ec', '0991234567', 'Campus UIDA, Av. Simón Bolívar, Quito'),     -- 1
('carlos.operador@uide.edu.ec', '0987654321', 'Campus UIDA, Bodega General de Activos'),  -- 2
('maria.tecnico@uide.edu.ec', '0976543210', 'Laboratorio de Hardware Lab-302'),          -- 3
('diego.logistica@uide.edu.ec', '0965432109', 'Centro de Despacho y Logística'),         -- 4
('ana.auditora@uide.edu.ec', '0954321098', 'Oficina de Sostenibilidad Ambiental'),        -- 5
('facultad.sistemas@uide.edu.ec', '022987654', 'Facultad de Ciencias de la Computación'),-- 6
('direccion.financiera@uide.edu.ec', '022987655', 'Edificio Administrativo Piso 2'),      -- 7
('reciclametal.quito@reciclametal.ec', '022345678', 'Parque Industrial Sur, Quito'),      -- 8
('fundacion.futuro@calderon.org', '022876543', 'Sector Calderón, Calle Principal 45');   -- 9

INSERT INTO PERSONA_NATURAL (id_persona, tipo_identificacion, numero_identificacion, nombres, apellidos) VALUES
(1, 'CEDULA', '1712345678', 'Administrador', 'General'),
(2, 'CEDULA', '1723456789', 'Carlos', 'Mendoza'),
(3, 'CEDULA', '1734567890', 'María', 'Salazar'),
(4, 'CEDULA', '1745678901', 'Diego', 'Andrade'),
(5, 'CEDULA', '1756789012', 'Ana', 'Paredes');

INSERT INTO PERSONA_JURIDICA (id_persona, ruc, razon_social, nombre_comercial) VALUES
(6, '1790012345001', 'UIDE Facultad de Ciencias de la Computación', 'Facultad Sistemas UIDA'),
(7, '1790012345002', 'UIDE Dirección Administrativa y Financiera', 'Dirección Activos UIDA'),
(8, '1792345678001', 'ReciclaMetal del Ecuador S.A.', 'ReciclaMetal Quito'),
(9, '1798765432001', 'Fundación Semillas del Futuro Calderón', 'Fundación Niños de Calderón');

INSERT INTO PERSONA_ROL (id_persona, id_rol_actor) VALUES
(1, 1), (2, 3), (3, 4), (4, 4), (5, 5), (6, 1), (7, 1), (8, 5), (9, 6);

INSERT INTO EMPLEADO (id_persona, codigo_empleado, correo_institucional, cargo) VALUES
(1, 'EMP-001', 'admin.ecoraee@uide.edu.ec', 'Administrador de Plataforma'),
(2, 'EMP-002', 'carlos.operador@uide.edu.ec', 'Operador de Centro de Acopio'),
(3, 'EMP-003', 'maria.tecnico@uide.edu.ec', 'Técnico Especialista de Diagnóstico'),
(4, 'EMP-004', 'diego.logistica@uide.edu.ec', 'Coordinador de Rutas y Logística'),
(5, 'EMP-005', 'ana.auditora@uide.edu.ec', 'Oficial de Sostenibilidad y Calidad');

INSERT INTO USUARIO (id_empleado, id_rol_sistema, username, password_hash) VALUES
(1, 1, 'admin_sys', 'hash_sha256_admin_secret_2026'),
(2, 2, 'operador_carlos', 'hash_sha256_operador_secret_2026'),
(3, 3, 'tecnico_maria', 'hash_sha256_tecnico_secret_2026'),
(4, 4, 'logistica_diego', 'hash_sha256_logistica_secret_2026'),
(5, 5, 'auditor_ana', 'hash_sha256_auditor_secret_2026');

INSERT INTO CENTRO_ACOPIO (id_tipo_centro, codigo_centro, nombre, direccion, capacidad_max_unidades, capacidad_max_kg) VALUES
(1, 'CA-MATRIZ', 'Centro de Acopio Campus Matriz UIDA', 'Av. Simón Bolívar, Quito', 500, 3500.00),
(2, 'CA-GRANADOS', 'Punto Verde Campus Granados', 'Av. Granados y Colimes, Quito', 150, 900.00),
(3, 'TALLER-LAB300', 'Taller Técnico y Laboratorio Lab-300', 'Campus Matriz, Bloque E', 100, 600.00),
(4, 'GESTOR-SUR', 'Planta Industrial ReciclaMetal Sur', 'Parque Industrial Guamaní, Quito', 2500, 20000.00),
(5, 'DEST-CALDERON', 'Centro Educativo Comunitario Calderón', 'Sector San Juan de Calderón', 80, 500.00);

INSERT INTO UBICACION (id_centro, codigo_ubicacion, pasillo, estante, nivel, descripcion) VALUES
(1, 'MAT-P1-E1-N1', 'A1', 'E1', 'N1', 'Recepción y triage de Laptops y Desktops'),
(1, 'MAT-P1-E2-N1', 'A1', 'E2', 'N1', 'Estantería de Monitores y Pantallas'),
(1, 'MAT-P2-E1-N2', 'A2', 'E1', 'N2', 'Gavetas de Dispositivos Móviles y Tablets'),
(3, 'TAL-B1-E1-M1', 'B1', 'Taller', 'Mesa1', 'Banco de Pruebas y Diagnóstico'),
(3, 'TAL-REP-01', 'B2', 'Repuestos', 'GavetaA', 'Stock de Repuestos Funcionales Canibalizados');

-- ============================================================================
-- 3. SOLICITUDES Y LOTES DE RAEE
-- ============================================================================

INSERT INTO SOLICITUD_RECOLECCION (id_generador, codigo_solicitud, estado_solicitud, direccion_recoleccion, observaciones) VALUES
(6, 'SOL-2026-001', 'COMPLETADA', 'Laboratorio de Informática 4', 'Renovación de equipos de cómputo por baja de activos'),
(7, 'SOL-2026-002', 'COMPLETADA', 'Edificio Administrativo Piso 2 y 3', 'Baja de portátiles, teléfonos y monitores por recambio'),
(6, 'SOL-2026-003', 'EN_CAMINO', 'Laboratorio de Redes y Telecomunicaciones', 'Baja de switches, routers y cableado estructurado');

INSERT INTO LOTE (codigo_lote, id_generador, id_solicitud, cantidad_declarada, peso_declarado_kg, observaciones) VALUES
('LOTE-2026-01', 6, 1, 15, 120.50, 'Lote de 15 computadoras Dell OptiPlex de laboratorios'),
('LOTE-2026-02', 7, 2, 12, 45.80, 'Lote de portátiles ejecutivas, teléfonos y monitores'),
('LOTE-2026-03', 6, 3, 5, 28.00, 'Lote de switches Cisco y routers de telecomunicaciones');

-- ============================================================================
-- 4. POBLACIÓN DE 32 DISPOSITIVOS (CON SUBTIPOS)
-- ============================================================================

-- DISPOSITIVO 1 (CICLO 1 - REUTILIZABLE DIRECTO): Laptop Dell Latitude 5400
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones)
VALUES ('QR-UIDA-PC-001', 'SN-DELL-LAT771A', 2, 2, 1, 1.85, 'Laptop ejecutiva en excelente estado, cargador original');
INSERT INTO COMPUTADORA (id_dispositivo, procesador, ram_total_gb, almacenamiento_total_gb, formato)
VALUES (1, 'Intel Core i7-8665U', 16, 512, 'LAPTOP');

-- DISPOSITIVO 2 (CICLO 2 - REPARABLE EN TALLER): Desktop Dell OptiPlex 7070
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones)
VALUES ('QR-UIDA-PC-002', 'SN-DELL-OPT882B', 1, 1, 3, 8.20, 'Falla en arranque: condensador quemado en fuente interna');
INSERT INTO COMPUTADORA (id_dispositivo, procesador, ram_total_gb, almacenamiento_total_gb, formato)
VALUES (2, 'Intel Core i5-8500', 8, 256, 'DESKTOP_SFF');

-- DISPOSITIVO 3 (CICLO 3 - RECICLABLE / DESPIECE): Switch Cisco Catalyst 2960
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones)
VALUES ('QR-UIDA-SW-003', 'SN-CSCO-FOC129C', 12, 3, 4, 4.80, 'Tecnología 10/100 obsoleta, fuente funcional apta para canibalización');
INSERT INTO ROUTER (id_dispositivo, numero_puertos, estandar_wifi, velocidad_maxima_mbps)
VALUES (3, 24, 'FastEthernet/Gigabit', 1000);

-- DISPOSITIVO 4 (CICLO 4 - NO RECUPERABLE / DESTRUCCIÓN): Teléfono Samsung Galaxy A52
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones)
VALUES ('QR-UIDA-MO-004', 'SN-SAM-A52881D', 11, 2, 4, 0.19, 'Impacto severo con rotura total de chasis, sulfatación en placa y batería inflada');
INSERT INTO TELEFONO (id_dispositivo, imei, almacenamiento_gb, sistema_operativo)
VALUES (4, '864910029384756', 128, 'Android 13');

-- DISPOSITIVOS 5 AL 32 (28 DISPOSITIVOS ADICIONALES PARA OPERACIÓN E INVENTARIO)
-- 5 a 10: Desktops Dell OptiPlex
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones) VALUES
('QR-UIDA-PC-005', 'SN-DELL-OPT005', 1, 1, 2, 8.10, 'Equipo de laboratorio con desgaste normal'),
('QR-UIDA-PC-006', 'SN-DELL-OPT006', 1, 1, 2, 8.15, 'Equipo de laboratorio con desgaste normal'),
('QR-UIDA-PC-007', 'SN-DELL-OPT007', 1, 1, 3, 8.30, 'Disco mecánico dañado, requiere cambio a SSD'),
('QR-UIDA-PC-008', 'SN-DELL-OPT008', 1, 1, 2, 8.20, 'Operativo'),
('QR-UIDA-PC-009', 'SN-DELL-OPT009', 1, 1, 1, 8.10, 'Buen estado cosmético'),
('QR-UIDA-PC-010', 'SN-DELL-OPT010', 1, 1, 3, 8.25, 'Problema de memoria RAM intermitente');

INSERT INTO COMPUTADORA (id_dispositivo, procesador, ram_total_gb, almacenamiento_total_gb, formato) VALUES
(5, 'Intel Core i5-8500', 8, 500, 'DESKTOP_SFF'),
(6, 'Intel Core i5-8500', 8, 500, 'DESKTOP_SFF'),
(7, 'Intel Core i5-8500', 4, 500, 'DESKTOP_SFF'),
(8, 'Intel Core i5-8500', 8, 256, 'DESKTOP_SFF'),
(9, 'Intel Core i5-8500', 16, 512, 'DESKTOP_SFF'),
(10, 'Intel Core i5-8500', 4, 256, 'DESKTOP_SFF');

-- 11 a 15: Laptops HP ProBook y ThinkPad
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones) VALUES
('QR-UIDA-LP-011', 'SN-HP-PB450-11', 4, 2, 2, 1.90, 'Portátil administrativo teclado desgastado'),
('QR-UIDA-LP-012', 'SN-HP-PB450-12', 4, 2, 3, 1.95, 'Batería inflada que debe desecharse'),
('QR-UIDA-LP-013', 'SN-LEN-TP480-13', 5, 2, 1, 1.75, 'ThinkPad operativa con cargador'),
('QR-UIDA-LP-014', 'SN-LEN-TP480-14', 5, 2, 2, 1.78, 'ThinkPad operativa'),
('QR-UIDA-LP-015', 'SN-HP-ED800-15', 3, 1, 2, 7.50, 'HP EliteDesk de laboratorio');

INSERT INTO COMPUTADORA (id_dispositivo, procesador, ram_total_gb, almacenamiento_total_gb, formato) VALUES
(11, 'Intel Core i5-8265U', 8, 256, 'LAPTOP'),
(12, 'Intel Core i5-8265U', 8, 256, 'LAPTOP'),
(13, 'Intel Core i7-8550U', 16, 512, 'LAPTOP'),
(14, 'Intel Core i5-8350U', 8, 256, 'LAPTOP'),
(15, 'Intel Core i7-8700', 16, 512, 'DESKTOP_SFF');

-- 16 a 20: Monitores Dell y HP
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones) VALUES
('QR-UIDA-MN-016', 'SN-DELL-U24-16', 6, 2, 1, 4.30, 'Monitor IPS 24" excelente estado'),
('QR-UIDA-MN-017', 'SN-DELL-U24-17', 6, 2, 2, 4.35, 'Monitor IPS con leve rayón superficial'),
('QR-UIDA-MN-018', 'SN-HP-PAV22-18', 7, 2, 2, 3.10, 'Monitor HP 21.5" operativo'),
('QR-UIDA-MN-019', 'SN-HP-PAV22-19', 7, 2, 3, 3.15, 'Presenta líneas verticales en panel'),
('QR-UIDA-MN-020', 'SN-DELL-U24-20', 6, 1, 4, 4.40, 'Panel LCD quebrado internamente por caída');

INSERT INTO MONITOR (id_dispositivo, pulgadas, resolucion, tipo_panel) VALUES
(16, 24.0, '1920x1200', 'IPS'),
(17, 24.0, '1920x1200', 'IPS'),
(18, 21.5, '1920x1080', 'IPS'),
(19, 21.5, '1920x1080', 'TN'),
(20, 24.0, '1920x1200', 'IPS');

-- 21 a 24: Tablets iPad y Samsung
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones) VALUES
('QR-UIDA-TB-021', 'SN-APL-IPD-21', 8, 2, 1, 0.49, 'iPad operativo para donación a biblioteca'),
('QR-UIDA-TB-022', 'SN-APL-IPD-22', 8, 2, 2, 0.49, 'iPad funcional con desgaste en carcasa'),
('QR-UIDA-TB-023', 'SN-SAM-TAB-23', 9, 2, 2, 0.51, 'Galaxy Tab operativa'),
('QR-UIDA-TB-024', 'SN-SAM-TAB-24', 9, 2, 3, 0.52, 'Conector USB-C flojo, requiere resoldadura');

INSERT INTO TABLET (id_dispositivo, imei, almacenamiento_gb, sistema_operativo) VALUES
(21, '354890102938401', 64, 'iPadOS 17'),
(22, '354890102938402', 64, 'iPadOS 17'),
(23, '354890102938403', 32, 'Android 12'),
(24, '354890102938404', 32, 'Android 12');

-- 25 a 28: Teléfonos Inteligentes
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones) VALUES
('QR-UIDA-MO-025', 'SN-APL-IP11-25', 10, 2, 1, 0.19, 'iPhone 11 funcional batería 88%'),
('QR-UIDA-MO-026', 'SN-APL-IP11-26', 10, 2, 2, 0.19, 'iPhone 11 con cristal posterior quebrado'),
('QR-UIDA-MO-027', 'SN-SAM-A52-27', 11, 2, 2, 0.19, 'Galaxy A52 operativo'),
('QR-UIDA-MO-028', 'SN-SAM-A52-28', 11, 2, 3, 0.19, 'Puerto de carga sulfatado');

INSERT INTO TELEFONO (id_dispositivo, imei, almacenamiento_gb, sistema_operativo) VALUES
(25, '359012019283725', 64, 'iOS 17'),
(26, '359012019283726', 64, 'iOS 17'),
(27, '864910029384727', 128, 'Android 13'),
(28, '864910029384728', 128, 'Android 13');

-- 29 a 32: Routers y Networking
INSERT INTO DISPOSITIVO (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones) VALUES
('QR-UIDA-NT-029', 'SN-CSCO-2960-29', 12, 3, 1, 4.80, 'Switch Cisco operativo con orejas de rack'),
('QR-UIDA-NT-030', 'SN-CSCO-2960-30', 12, 3, 2, 4.80, 'Switch Cisco operativo'),
('QR-UIDA-NT-031', 'SN-CSCO-RV34-31', 13, 3, 1, 1.20, 'Router VPN Cisco funcional'),
('QR-UIDA-NT-032', 'SN-CSCO-RV34-32', 13, 3, 4, 1.25, 'Router con fuente quemada y placa dañada');

INSERT INTO ROUTER (id_dispositivo, numero_puertos, estandar_wifi, velocidad_maxima_mbps) VALUES
(29, 24, 'Gigabit Ethernet', 1000),
(30, 24, 'Gigabit Ethernet', 1000),
(31, 4, 'Gigabit / Dual WAN', 1000),
(32, 4, 'Gigabit', 1000);

-- ============================================================================
-- 5. TRAZABILIDAD: 4 CICLOS COMPLETOS (DEL REGISTRO AL CIERRE)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CICLO 1: DISPOSITIVO 1 -> REUTILIZABLE (DONACIÓN EDUCATIVA)
-- ----------------------------------------------------------------------------
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, fecha_fin, observacion) VALUES
(1, 1, 1, 1, '2026-10-10 09:00', '2026-10-10 11:00', 'Registro inicial en solicitud por entrega de personal administrativo'),
(1, 2, 2, 2, '2026-10-10 11:00', '2026-10-11 14:00', 'Recepción física y pesaje en Campus Matriz'),
(1, 3, 3, 3, '2026-10-11 14:00', '2026-10-12 10:00', 'Evaluación técnica: 100% operativo, batería al 91%, sin sectores defectuosos'),
(1, 4, 5, 3, '2026-10-12 10:00', '2026-10-14 16:30', 'Aprobado dictamen de donación social comunitaria'),
(1, 5, 7, 5, '2026-10-14 16:30', NULL, 'Destino final confirmado en Centro Calderón. Trazabilidad cerrada.');

INSERT INTO EVALUACION_TECNICA (id_dispositivo, id_tecnico, id_clasificacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion)
VALUES (1, 3, 1, 'Procesador, memorias y NVMe en estado óptimo. Batería en 91% de salud.', 'Excelente estado exterior, leves marcas de uso.', 1);

INSERT INTO DESTINO_FINAL (id_dispositivo, id_tipo_destino, id_receptor, fecha_confirmacion, certificado_numero, observaciones)
VALUES (1, 1, 9, '2026-10-14', 'ACTA-DON-2026-001', 'Donado a Fundación Semillas del Futuro para equipamiento de aula de clases.');

-- ----------------------------------------------------------------------------
-- CICLO 2: DISPOSITIVO 2 -> REPARABLE (REACONDICIONAMIENTO EN TALLER Y REASIGNACIÓN)
-- ----------------------------------------------------------------------------
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, fecha_fin, observacion) VALUES
(2, 1, 1, 1, '2026-10-09 08:30', '2026-10-09 10:15', 'Declarado en lote de baja de laboratorio'),
(2, 2, 2, 2, '2026-10-09 10:15', '2026-10-10 09:00', 'Recepción en bodega Campus Matriz'),
(2, 3, 3, 3, '2026-10-10 09:00', '2026-10-10 16:00', 'Evaluación técnica: Falla en fuente de poder. Placa y CPU en buen estado'),
(2, 4, 4, 3, '2026-10-10 16:00', '2026-10-13 11:00', 'Ingreso a banco de taller para reemplazo de módulo de alimentación'),
(2, 5, 5, 3, '2026-10-13 11:00', '2026-10-15 14:00', 'Reparación exitosa y prueba de estrés de 24 horas superada'),
(2, 6, 7, 5, '2026-10-15 14:00', NULL, 'Entregado a escuela comunitaria con acta oficial.');

INSERT INTO EVALUACION_TECNICA (id_dispositivo, id_tecnico, id_clasificacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion)
VALUES (2, 3, 2, 'No pasa el POST por capacitor dañado en fuente. Requiere cambio de fuente interna.', 'Chasis metálico en buen estado general.', 0);

INSERT INTO ORDEN_TRABAJO (codigo_orden, id_dispositivo, id_responsable, id_tipo_trabajo, id_estado_orden, fecha_apertura, fecha_cierre, descripcion, resultado)
VALUES ('OT-2026-001', 2, 3, 2, 3, '2026-10-10 16:00', '2026-10-13 10:30', 'Sustituir fuente de poder y limpiar ventiladores.', 'Equipo enciende y completa pruebas de diagnóstico.');

INSERT INTO TRATAMIENTO (id_orden, tipo_tratamiento, costo_estimado, costo_real, observaciones)
VALUES (1, 'Reemplazo de Fuente ATX y Pasta Térmica', 25.00, 20.00, 'Se utilizó fuente de repuesto compatible en stock.');

INSERT INTO DESTINO_FINAL (id_dispositivo, id_tipo_destino, id_receptor, fecha_confirmacion, certificado_numero, observaciones)
VALUES (2, 1, 9, '2026-10-15', 'ACTA-DON-2026-002', 'Equipo reacondicionado asignado a sala de lectura comunitaria.');

-- ----------------------------------------------------------------------------
-- CICLO 3: DISPOSITIVO 3 -> RECICLABLE (CANIBALIZACIÓN Y TRANSFERENCIA A RECICLAMETAL)
-- ----------------------------------------------------------------------------
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, fecha_fin, observacion) VALUES
(3, 1, 1, 1, '2026-10-08 10:00', '2026-10-08 11:30', 'Registro por renovación de switch de red'),
(3, 2, 2, 2, '2026-10-08 11:30', '2026-10-09 15:00', 'Recepción en acopio Matriz'),
(3, 3, 3, 3, '2026-10-09 15:00', '2026-10-11 12:00', 'Evaluación técnica: Obsoleto para uso universitario; módulos valorizables'),
(3, 4, 4, 3, '2026-10-11 12:00', '2026-10-12 10:00', 'Desensamble de fuente y coolers para stock de repuestos'),
(3, 5, 6, 4, '2026-10-12 10:00', '2026-10-14 17:00', 'Despacho en lote de flete hacia gestor de reciclaje'),
(3, 6, 7, 5, '2026-10-14 17:00', NULL, 'Manifiesto de valorización de metales recibido de ReciclaMetal.');

INSERT INTO EVALUACION_TECNICA (id_dispositivo, id_tecnico, id_clasificacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion)
VALUES (3, 3, 3, 'Puertos FastEthernet incompatibles con estándares de campus. Chasis y fuentes reciclables.', 'Desgaste exterior severo.', 0);

INSERT INTO COMPONENTE (id_dispositivo_origen, id_dispositivo_actual, id_tipo_componente, marca, modelo, capacidad, estado)
VALUES (3, NULL, 3, 'Cisco', 'PWR-C2-250WAC', '250W', 'DISPONIBLE');

INSERT INTO DESTINO_FINAL (id_dispositivo, id_tipo_destino, id_receptor, fecha_confirmacion, certificado_numero, observaciones)
VALUES (3, 2, 8, '2026-10-14', 'MANIF-MAATE-2026-881', 'Transferido a ReciclaMetal S.A. para fundición y extracción de cobre/aluminio.');

-- ----------------------------------------------------------------------------
-- CICLO 4: DISPOSITIVO 4 -> NO RECUPERABLE (DESTRUCCIÓN SEGURA / CELDA AMBIENTAL)
-- ----------------------------------------------------------------------------
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, fecha_fin, observacion) VALUES
(4, 1, 1, 1, '2026-10-05 14:00', '2026-10-05 16:00', 'Recepción en ánfora de recolección comunitaria'),
(4, 2, 2, 2, '2026-10-05 16:00', '2026-10-06 10:00', 'Ingresado y clasificado preliminarmente'),
(4, 3, 3, 3, '2026-10-06 10:00', '2026-10-07 11:30', 'Evaluación técnica: Batería degradada químicamente e hinchada, riesgo de ignición'),
(4, 4, 6, 4, '2026-10-07 11:30', '2026-10-08 15:00', 'Despacho de emergencia bajo protocolo de residuo peligroso'),
(4, 5, 7, 5, '2026-10-08 15:00', NULL, 'Certificado de destrucción e inertización de celdas de litio emitido.');

INSERT INTO EVALUACION_TECNICA (id_dispositivo, id_tecnico, id_clasificacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion)
VALUES (4, 3, 4, 'Daño irreversible por líquido y cortocircuito general. Celda de litio con perforación parcial.', 'Pantalla estallada y chasis deformado.', 0);

INSERT INTO DESTINO_FINAL (id_dispositivo, id_tipo_destino, id_receptor, fecha_confirmacion, certificado_numero, observaciones)
VALUES (4, 3, 8, '2026-10-08', 'CERT-DEST-MAATE-991', 'Disposición final segura en celda de seguridad de residuos peligrosos.');

-- ============================================================================
-- 6. HISTORIALES Y EVALUACIONES DE LOS DISPOSITIVOS ACTIVOS (5 AL 32)
-- ============================================================================

-- Dispositivos 5 a 10 (En campus Matriz)
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, observacion) VALUES
(5, 1, 1, 1, '2026-10-15 09:00', 'Ingreso por lote de laboratorio'),
(5, 2, 2, 2, '2026-10-15 11:00', 'Recepción en bodega Matriz'),
(6, 1, 1, 1, '2026-10-15 09:00', 'Ingreso por lote de laboratorio'),
(6, 2, 2, 2, '2026-10-15 11:00', 'Recepción en bodega Matriz'),
(7, 1, 1, 1, '2026-10-15 09:00', 'Ingreso por lote de laboratorio'),
(7, 2, 2, 2, '2026-10-15 11:30', 'Recepción en bodega Matriz'),
(7, 3, 3, 3, '2026-10-16 10:00', 'Evaluación técnica completada: Disco mecánico con sectores reasignados'),
(8, 1, 1, 1, '2026-10-16 08:30', 'Ingreso por lote'),
(8, 2, 2, 2, '2026-10-16 09:45', 'Recepción física'),
(9, 1, 1, 1, '2026-10-16 08:30', 'Ingreso por lote'),
(9, 2, 2, 2, '2026-10-16 10:00', 'Recepción física'),
(9, 3, 3, 3, '2026-10-17 14:00', 'Evaluado como Reutilizable'),
(10, 1, 1, 1, '2026-10-16 08:30', 'Ingreso por lote'),
(10, 2, 2, 2, '2026-10-16 10:15', 'Recepción en bodega Matriz');

-- Evaluaciones para algunos de los equipos activos
INSERT INTO EVALUACION_TECNICA (id_dispositivo, id_tecnico, id_clasificacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion) VALUES
(7, 3, 2, 'Disco duro mecánico con sectores dañados. CPU y motherboard operativos.', 'Buen estado exterior.', 0),
(9, 3, 1, 'Excelente rendimiento en benchmarks, disco SSD al 99% de vida útil.', 'Sin marcas ni rayones.', 1);

-- Historial para equipos 11 a 32 (Muestras de estado RECOLECTADO o EVALUADO)
INSERT INTO HISTORIAL_ESTADO (id_dispositivo, numero_secuencia, id_estado, id_usuario, fecha_inicio, observacion) VALUES
(11, 1, 2, 2, '2026-10-18 09:00', 'Portátil HP recibido en bodega'),
(12, 1, 2, 2, '2026-10-18 09:30', 'Portátil HP recibido en bodega'),
(13, 1, 2, 2, '2026-10-18 10:00', 'ThinkPad recibida'),
(13, 2, 3, 3, '2026-10-19 11:00', 'Evaluada: Reutilizable'),
(14, 1, 2, 2, '2026-10-18 10:30', 'ThinkPad recibida'),
(15, 1, 2, 2, '2026-10-18 11:00', 'HP EliteDesk recibido'),
(16, 1, 2, 2, '2026-10-19 09:00', 'Monitor UltraSharp recibido'),
(17, 1, 2, 2, '2026-10-19 09:30', 'Monitor UltraSharp recibido'),
(18, 1, 2, 2, '2026-10-19 10:00', 'Monitor HP recibido'),
(19, 1, 2, 2, '2026-10-19 10:30', 'Monitor HP recibido'),
(20, 1, 2, 2, '2026-10-19 11:00', 'Monitor Dell quebrado'),
(21, 1, 2, 2, '2026-10-20 09:00', 'iPad 9th recibido'),
(22, 1, 2, 2, '2026-10-20 09:30', 'iPad 9th recibido'),
(23, 1, 2, 2, '2026-10-20 10:00', 'Galaxy Tab recibida'),
(24, 1, 2, 2, '2026-10-20 10:30', 'Galaxy Tab recibida'),
(25, 1, 2, 2, '2026-10-21 09:00', 'iPhone 11 recibido'),
(26, 1, 2, 2, '2026-10-21 09:30', 'iPhone 11 recibido'),
(27, 1, 2, 2, '2026-10-21 10:00', 'Galaxy A52 recibido'),
(28, 1, 2, 2, '2026-10-21 10:30', 'Galaxy A52 recibido'),
(29, 1, 2, 2, '2026-10-22 09:00', 'Switch Cisco recibido'),
(30, 1, 2, 2, '2026-10-22 09:30', 'Switch Cisco recibido'),
(31, 1, 2, 2, '2026-10-22 10:00', 'Router Cisco recibido'),
(32, 1, 2, 2, '2026-10-22 10:30', 'Router Cisco dañado recibido');

-- Evaluaciones técnicas adicionales
INSERT INTO EVALUACION_TECNICA (id_dispositivo, id_tecnico, id_clasificacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion) VALUES
(13, 3, 1, 'Equipo completamente funcional, pruebas de memoria y disco OK.', 'Excelente.', 1),
(16, 3, 1, 'Panel IPS brillante sin píxeles muertos.', 'Muy bueno.', 1),
(20, 3, 3, 'Pantalla quebrada irreparablemente, fuente y carcasa aprovechables.', 'Dañado.', 0),
(21, 3, 1, 'Tablet funcional al 100%, batería al 95%.', 'Buen estado.', 1),
(32, 3, 4, 'Placa con pistas quemadas por descarga eléctrica.', 'Carcasa con hollín.', 0);

-- ============================================================================
-- 7. UBICACIÓN DE DISPOSITIVOS ACTIVOS EN INVENTARIO (1:1 EXCLUSIÓN ATÓMICA)
-- (Los dispositivos 1, 2, 3 y 4 no están en inventario porque cerraron trazabilidad)
-- ============================================================================

INSERT INTO INVENTARIO (id_centro, id_ubicacion, id_dispositivo) VALUES
(1, 1, 5), (1, 1, 6), (1, 1, 7), (1, 1, 8), (1, 1, 9), (1, 1, 10),
(1, 1, 11), (1, 1, 12), (1, 1, 13), (1, 1, 14), (1, 1, 15),
(1, 2, 16), (1, 2, 17), (1, 2, 18), (1, 2, 19), (1, 2, 20),
(1, 3, 21), (1, 3, 22), (2, NULL, 23), (2, NULL, 24),
(1, 3, 25), (1, 3, 26), (2, NULL, 27), (2, NULL, 28),
(1, 1, 29), (1, 1, 30), (1, 1, 31), (3, 4, 32);

-- ============================================================================
-- 8. MOVIMIENTOS LOGÍSTICOS Y DETALLES (CON CLAVE PARCIAL numero_linea)
-- ============================================================================

INSERT INTO MOVIMIENTO (codigo_movimiento, id_centro_origen, id_centro_destino, id_responsable, id_estado_movimiento, fecha_salida, fecha_llegada, observaciones) VALUES
('MOV-2026-001', 1, 5, 4, 3, '2026-10-14 14:00', '2026-10-14 16:00', 'Despacho de laptop donada hacia Fundación Calderón'),
('MOV-2026-002', 1, 3, 4, 3, '2026-10-10 14:00', '2026-10-10 15:30', 'Traslado de PC para diagnóstico y reparación en taller'),
('MOV-2026-003', 1, 4, 4, 3, '2026-10-13 09:00', '2026-10-13 11:30', 'Flete de materiales no recuperables y switch hacia planta ReciclaMetal Sur');

-- DETALLE_MOVIMIENTO con clave compuesta {id_movimiento, numero_linea}
INSERT INTO DETALLE_MOVIMIENTO (id_movimiento, numero_linea, id_dispositivo, peso_kg_transferido) VALUES
(1, 1, 1, 1.85),
(2, 1, 2, 8.20),
(3, 1, 3, 4.80),
(3, 2, 4, 0.19);

-- ============================================================================
-- 9. EVIDENCIAS DIGITALES EN AMAZON S3
-- ============================================================================

INSERT INTO EVIDENCIA (id_tipo_evidencia, id_dispositivo, id_movimiento, id_usuario, ubicacion_archivo, nombre_archivo_original, formato_mime, peso_bytes, hash_sha256, descripcion) VALUES
(1, 1, NULL, 2, 's3://ecoraee-evidencias-storage/evidencias/2026/10/disp_1_ingreso.jpg', 'FOTO_ING_DISP_1.jpg', 'image/jpeg', 1542100, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'Fotografía de laptop Dell al momento del pesaje inicial'),
(3, 1, 1, 5, 's3://ecoraee-evidencias-storage/actas/2026/10/acta_donacion_disp_1.pdf', 'ACTA_DONACION_001.pdf', 'application/pdf', 920400, 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0', 'Acta formal de entrega y donación a escuela comunitaria firmada'),
(2, 2, NULL, 3, 's3://ecoraee-evidencias-storage/evidencias/2026/10/disp_2_falla_fuente.jpg', 'DIAG_FALLA_PC02.jpg', 'image/jpeg', 1420500, 'bf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149a', 'Foto de módulo de capacitor abombado en fuente ATX'),
(4, 3, 3, 5, 's3://ecoraee-evidencias-storage/manifiestos/2026/10/manifiesto_maate_disp3.pdf', 'MANIFIESTO_MAATE_881.pdf', 'application/pdf', 850200, '4ca495991b7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b93', 'Copia de manifiesto de disposición ambiental con gestor ReciclaMetal'),
(4, 4, 3, 5, 's3://ecoraee-evidencias-storage/manifiestos/2026/10/cert_peligroso_disp4.pdf', 'CERT_PELIGROSO_991.pdf', 'application/pdf', 789100, '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'Certificado de confinamiento en celda de seguridad de celdas de litio');

-- ============================================================================
-- 10. RED MATEMÁTICA Y LOGÍSTICA (GRAFO G=(V,E) PARA EDMONDS-KARP)
-- ============================================================================

INSERT INTO NODO_RED (id_centro, codigo_nodo, nombre, tipo_nodo, capacidad_procesamiento_kg) VALUES
(1, 'N_CAMPUS_MATRIZ', 'Campus Principal UIDA', 'FUENTE', 5000.00),
(2, 'N_CAMPUS_GRANADOS', 'Punto Satélite Granados', 'FUENTE', 1500.00),
(3, 'N_TALLER_LAB300', 'Taller Técnico y Clasificación', 'INTERMEDIO', 2000.00),
(4, 'N_GESTOR_RECICLAJE', 'Planta ReciclaMetal Sur', 'SUMIDERO', 10000.00),
(5, 'N_FUNDACION_SOCIAL', 'Fundación Calderón Norte', 'SUMIDERO', 1000.00);

INSERT INTO ARISTA_RED (id_nodo_origen, id_nodo_destino, capacidad_max_kg, costo_transporte_usd, tiempo_horas) VALUES
(1, 3, 1200.00, 25.00, 0.50), -- Matriz -> Taller
(2, 3, 800.00, 45.00, 1.20),  -- Granados -> Taller
(1, 4, 1500.00, 80.00, 1.80), -- Matriz -> ReciclaMetal
(3, 4, 1000.00, 70.00, 1.50), -- Taller -> ReciclaMetal
(3, 5, 600.00, 50.00, 1.00);  -- Taller -> Fundación Calderón

INSERT INTO ESCENARIO_RED (codigo_escenario, nombre, descripcion) VALUES
('ESC-BASE-2026', 'Escenario Base Operativo Normal', 'Capacidades de flete estándar semanales'),
('ESC-CONTINGENCIA-LLUVIA', 'Escenario Contingencia Vial Sur', 'Reducción de capacidad hacia el sur por derrumbe en Av. Simón Bolívar');

INSERT INTO ESCENARIO_ARISTA (id_escenario, id_arista, capacidad_modificada_kg) VALUES
(2, 3, 400.00); -- Matriz -> Reciclador restringida a 400 kg

INSERT INTO RESULTADO_FLUJO (id_escenario, nodo_fuente_codigo, nodo_sumidero_codigo, flujo_maximo_total_kg, tiempo_computo_ms) VALUES
(1, 'SUPER_FUENTE', 'SUPER_SUMIDERO', 3100.00, 1.45),
(2, 'SUPER_FUENTE', 'SUPER_SUMIDERO', 2000.00, 1.20);

INSERT INTO RESULTADO_ARISTA (id_resultado, id_arista, flujo_asignado_kg, arista_saturada) VALUES
(1, 1, 1200.00, 1),
(1, 2, 400.00, 0),
(1, 3, 1500.00, 1),
(1, 4, 1000.00, 1),
(1, 5, 600.00, 1);

-- ============================================================================
-- 11. GOBERNANZA, AUDITORÍA Y OBSERVABILIDAD
-- ============================================================================

INSERT INTO AUDITORIA (id_usuario, entidad_afectada, identificador_registro, operacion, datos_previos, datos_nuevos, direccion_ip) VALUES
(1, 'DISPOSITIVO', 'QR-UIDA-PC-001', 'INSERT', NULL, '{"codigo_qr": "QR-UIDA-PC-001", "peso_kg": 1.85}', '192.168.10.45'),
(3, 'EVALUACION_TECNICA', '1', 'INSERT', NULL, '{"id_dispositivo": 1, "clasificacion": "REUTILIZABLE"}', '192.168.10.60'),
(5, 'DESTINO_FINAL', 'QR-UIDA-PC-001', 'INSERT', NULL, '{"destino": "DONACION_EDUCATIVA", "fecha": "2026-10-14"}', '192.168.10.12');

INSERT INTO ALERTA (id_centro, tipo_alerta, nivel_severidad, mensaje, resuelta) VALUES
(1, 'CAPACIDAD_BODEGA', 'INFO', 'Centro de Acopio Matriz se encuentra al 28% de su capacidad total.', 1),
(2, 'DESPACHO_PENDIENTE', 'WARNING', 'Punto Satélite Granados acumula 5 equipos listos para traslado a taller.', 0);

INSERT INTO INDICADOR (id_centro, codigo_kpi, nombre, valor, unidad) VALUES
(1, 'KPI-REUT-RATE', 'Tasa de Reutilización Institucional', 65.50, '%'),
(1, 'KPI-RECIC-RATE', 'Tasa de Reciclaje y Valorización', 34.50, '%'),
(1, 'KPI-KG-CAPTADOS', 'Total Kilogramos Captados en Semestre', 142.10, 'kg');

COMMIT TRANSACTION;
GO

PRINT '02_DML.sql ejecutado exitosamente: 32 dispositivos y 4 ciclos completos cargados.';
GO
