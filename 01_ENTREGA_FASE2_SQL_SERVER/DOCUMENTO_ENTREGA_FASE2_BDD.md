# UNIVERSIDAD INTERNACIONAL DEL ECUADOR (UIDE)
## FACULTAD DE INGENIERÍA Y CIENCIAS APLICADAS
### ESCUELA DE TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIÓN (ASU-CINTANA)

---

# PROYECTO INTEGRADOR: FASE 2 - IMPLEMENTACIÓN DE BASE DE DATOS RELACIONAL
## PLATAFORMA CLOUD DE GESTIÓN Y TRAZABILIDAD DE RAEE EN QUITO
### SISTEMA: **EcoRAEE Cloud**

---

| **DATOS INFORMATIVOS** | **DETALLE** |
| :--- | :--- |
| **Carrera:** | Ingeniería en Tecnologías de la Información / Sistemas |
| **Nivel / Semestre:** | Quinto Semestre – Período Académico 2026 |
| **Materia:** | Gestión de Bases de Datos Avanzadas / Proyecto Integrador |
| **Docente Titular:** | **Ing. María del Carmen Salazar Torres** |
| **Integrantes:** | **Daniel Pazmiño**<br>**Matias Herrera**<br>**Ihair Llamuca** |
| **Fecha de Entrega:** | 29 de Octubre de 2026 |
| **Motor de Base de Datos:** | Microsoft SQL Server 2019 / 2022 (T-SQL) |
| **Base de Datos:** | `BD_ECORAEE_CLOUD` |

---

> [!NOTE]
> **Contexto de Retroalimentación Docente (19 de Octubre de 2026):**
> En cumplimiento estricto con las observaciones de la docente Ing. María del Carmen Salazar Torres:
> 1. Se incorporó formalmente la **clave parcial (discriminador)** `numero_linea INT` a la entidad débil `DETALLE_MOVIMIENTO`, conformando su Clave Primaria Compuesta: `PK(id_movimiento, numero_linea)`.
> 2. Se purgó absolutamente toda terminología ajena al dominio de economía circular (eliminando términos como "clientes", "productos comerciales", "precios de venta", "facturas" o "pedidos"). El presente documento y la base de datos tratan con rigor técnico sobre: *Generadores de RAEE, Lotes de Recepción, Equipos Electrónicos, Clasificación Técnica Ambiental, Trazabilidad en Red Logística y Destino Final Certificado*.

---

## ÍNDICE DEL CONTENIDO
1. [PUNTO 1: Modelo Relacional Formal](#punto-1-modelo-relacional-formal)
   - 1.1 Reglas de Transformación del EER a Tablas Relacionales
   - 1.2 Notación Relacional de Todas las Tablas (PKs, FKs, AKs)
   - 1.3 Estrategia de Mapeo de Especialización / Herencia
   - 1.4 Tratamiento Riguroso de Entidades Débiles
   - 1.5 Tablas Intermedias de Relaciones Muchos a Muchos (N:M)
2. [PUNTO 2: Diccionario de Datos Exhaustivo](#punto-2-diccionario-de-datos-exhaustivo)
   - 2.1 Tablas Maestras y Catálogos de Dominio
   - 2.2 Actores, Personas y Seguridad (RBAC)
   - 2.3 Logística de Entrada: Centros, Solicitudes y Lotes
   - 2.4 Dispositivos RAEE y Subtipos de Hardware
   - 2.5 Trazabilidad, Estados e Inventario Físico
   - 2.6 Evaluación Técnica, Reacondicionamiento y Destino Final
   - 2.7 Optimización Logística y Flujo Máximo de Red
   - 2.8 Auditoría y Monitoreo del Sistema
3. [PUNTO 3: Normalización Formal (1FN, 2FN, 3FN / FNBC)](#punto-3-normalización-formal-1fn-2fn-3fn--fnbc)
   - 3.1 Tabla 1: `DISPOSITIVO`
   - 3.2 Tabla 2: `LOTE`
   - 3.3 Tabla 3: `EVALUACION_TECNICA`
   - 3.4 Tabla 4: `HISTORIAL_ESTADO`
   - 3.5 Tabla 5: `DETALLE_MOVIMIENTO` (Transferencia)
4. [PUNTO 4: Ejecución de Scripts y Evidencias](#punto-4-ejecución-de-scripts-y-evidencias)
   - 4.1 Script `01_DDL.sql` (Estructura y Restricciones)
   - 4.2 Script `02_DML.sql` (Población de 32 Equipos y 4 Ciclos Completos)
   - 4.3 Script `03_pruebas.sql` (Las 5 Pruebas de Integridad Rechazadas)
   - 4.4 Script `04_consultas.sql` (Las 5 Consultas Analíticas con JOIN, GROUP BY y Subconsultas)
5. [PUNTO 5: Declaración Ética de Uso de Inteligencia Artificial](#punto-5-declaración-ética-de-uso-de-inteligencia-artificial)

---

# PUNTO 1: MODELO RELACIONAL FORMAL

### 1.1 Reglas de Transformación del Modelo EER al Relacional
Para garantizar la integridad y correspondencia con el Diagrama EER corregido, se aplicaron las siguientes reglas matemáticas de mapeo:
1. **Entidades Regulares (Fuertes):** Cada entidad se convierte en una tabla independiente. Su identificador principal subrayado pasa a ser la **Clave Primaria (`PRIMARY KEY - PK`)**.
2. **Claves Alternas / Secundarias (AK):** Cada atributo identificado con `(AK)` en el modelo EER se implementa mediante restricciones **`UNIQUE NOT NULL`** en SQL Server, garantizando unicidad a nivel de motor.
3. **Entidades Débiles (Identificación y Existencia):** No poseen clave propia independiente. Se transforman en tablas cuya **Clave Primaria es Compuesta**, integrada por la clave primaria de la entidad fuerte que la identifica más su **Clave Parcial (Discriminador)**.
4. **Relaciones Binarias 1:N (Uno a Muchos):** La clave primaria del lado "1" se propaga como **Clave Foránea (`FOREIGN KEY - FK`)** en la tabla del lado "N".
5. **Relaciones N:M (Muchos a Muchos):** Se generan **Tablas Intermedias (Junction Tables)** cuya clave primaria está compuesta por las claves primarias de las entidades vinculadas.
6. **Especializaciones / Subtipos:** Se implementó la técnica de **Table-per-Type (TPT)**, manteniendo una tabla padre con los atributos comunes y tablas hijas para cada especialización que comparten el mismo identificador primario (`PK = FK`).

---

### 1.2 Notación Relacional de Tablas del Sistema EcoRAEE Cloud

A continuación se presenta el esquema relacional formal. En la notación:
- **`PK` subrayado:** Identifica la clave primaria.
- **`*` asterisco:** Identifica una clave foránea (FK).
- **`[AK / UNIQUE]`:** Identifica una clave secundaria o alterna.

#### Dominio de Catálogos y Clasificadores Maestros
1. `ROL_ACTOR` (<ins>id_rol</ins>, codigo [AK], nombre [AK], descripcion, es_activo)
2. `ROL_SISTEMA` (<ins>id_rol_sistema</ins>, codigo [AK], nombre [AK], descripcion, nivel_acceso, es_activo)
3. `TIPO_CENTRO` (<ins>id_tipo_centro</ins>, codigo [AK], nombre [AK], descripcion, es_activo)
4. `CATEGORIA_DISPOSITIVO` (<ins>id_categoria</ins>, codigo [AK], nombre [AK], descripcion, es_activo)
5. `MARCA` (<ins>id_marca</ins>, nombre [AK], descripcion, es_activo)
6. `MODELO_DISPOSITIVO` (<ins>id_modelo</ins>, *id_marca, *id_categoria, nombre, anio_lanzamiento, especificaciones_tecnicas, es_activo) `[AK: (id_marca, nombre)]`
7. `CONDICION_DISPOSITIVO` (<ins>id_condicion</ins>, codigo [AK], nombre [AK], descripcion, es_activo)
8. `ESTADO_DISPOSITIVO` (<ins>id_estado</ins>, codigo [AK], nombre [AK], descripcion, fase_ciclo, es_activo)
9. `CLASIFICACION_TECNICA` (<ins>id_clasificacion</ins>, codigo [AK], nombre [AK], jerarquia_ambiental, descripcion, es_activo)
10. `TIPO_TRABAJO` (<ins>id_tipo_trabajo</ins>, codigo [AK], nombre [AK], descripcion, es_activo)
11. `ESTADO_ORDEN` (<ins>id_estado_orden</ins>, codigo [AK], nombre [AK], descripcion, es_terminal, es_activo)
12. `ESTADO_MOVIMIENTO` (<ins>id_estado_mov</ins>, codigo [AK], nombre [AK], descripcion, es_terminal, es_activo)
13. `TIPO_DESTINO` (<ins>id_tipo_destino</ins>, codigo [AK], nombre [AK], descripcion, es_activo)
14. `TIPO_EVIDENCIA` (<ins>id_tipo_evidencia</ins>, codigo [AK], nombre [AK], descripcion, extension_esperada, es_activo)
15. `TIPO_COMPONENTE` (<ins>id_tipo_componente</ins>, codigo [AK], nombre [AK], descripcion, es_activo)

#### Dominio de Personas, Actores y Seguridad RBAC
16. `PERSONA` (<ins>id_persona</ins>, tipo_persona, nombre_razon_social, correo [AK], telefono, direccion_texto, latitud, longitud, fecha_registro, es_activo)
17. `PERSONA_NATURAL` (<ins><u>*id_persona</u></ins>, numero_identificacion [AK], tipo_identificacion, nombres, apellidos, genero)
18. `PERSONA_JURIDICA` (<ins><u>*id_persona</u></ins>, ruc [AK], razon_social, representante_legal, contacto_tecnico_cargo)
19. `PERSONA_ROL` (<ins><u>*id_persona, *id_rol</u></ins>, fecha_asignacion, es_activo) *(Tabla Intermedia N:M)*
20. `EMPLEADO` (<ins>id_empleado</ins>, *id_persona [AK], codigo_empleado [AK], correo_institucional [AK], cargo, departamento, fecha_contratacion, es_activo)
21. `USUARIO` (<ins>id_usuario</ins>, *id_empleado [AK], *id_rol_sistema, username [AK], password_hash, salt, ultimo_acceso, intentos_fallidos, bloqueado, es_activo)

#### Dominio de Centros de Acopio y Logística de Entrada
22. `CENTRO_ACOPIO` (<ins>id_centro</ins>, *id_tipo_centro, *id_responsable, codigo_centro [AK], nombre, direccion, latitud, longitud, capacidad_max_kg, capacidad_max_unidades, es_activo)
23. `UBICACION` (<ins>id_ubicacion</ins>, *id_centro, codigo_ubicacion, pasillo, estante, nivel, descripcion, es_activo) `[AK: (id_centro, codigo_ubicacion)]`
24. `SOLICITUD_RECOLECCION` (<ins>id_solicitud</ins>, *id_generador, *id_centro_destino, codigo_solicitud [AK], fecha_solicitud, fecha_programada, estado_solicitud, direccion_recoleccion, latitud, longitud, peso_estimado_kg, cantidad_estimada_unidades, observaciones)
25. `LOTE` (<ins>id_lote</ins>, *id_solicitud, *id_centro, *id_receptor, codigo_lote [AK], fecha_recepcion, cantidad_declarada, peso_declarado_kg, estado_lote, observaciones)

#### Dominio de Dispositivos y Especialización de Hardware (TPT)
26. `DISPOSITIVO` (<ins>id_dispositivo</ins>, codigo_qr [AK], *id_lote, *id_modelo, *id_condicion, numero_serie, peso_kg, fecha_registro, observaciones_ingreso)
27. `COMPUTADORA` (<ins><u>*id_dispositivo</u></ins>, procesador, ram_total_gb, almacenamiento_total_gb, tipo_almacenamiento, incluye_cargador, gpu_dedicada)
28. `MONITOR` (<ins><u>*id_dispositivo</u></ins>, pulgadas, resolucion, tecnologia_panel, puertos_video, incluye_cable_poder)
29. `TABLET` (<ins><u>*id_dispositivo</u></ins>, pantalla_pulgadas, almacenamiento_gb, ram_gb, incluye_cargador, sistema_operativo)
30. `TELEFONO` (<ins><u>*id_dispositivo</u></ins>, imei [AK], almacenamiento_gb, ram_gb, soporte_dual_sim, porcentaje_salud_bateria)
31. `ROUTER` (<ins><u>*id_dispositivo</u></ins>, mac_address [AK], numero_puertos, estandar_wifi, velocidad_mbps, incluye_transformador)
32. `OTROS_DISPOSITIVOS` (<ins><u>*id_dispositivo</u></ins>, descripcion_tecnica, potencia_watts, peso_exacto_kg, requiere_desarme_especial)

#### Dominio de Trazabilidad, Taller, Reacondicionamiento y Cierre
33. `HISTORIAL_ESTADO` (<ins><u>*id_dispositivo, numero_secuencia</u></ins>, *id_estado, *id_usuario, fecha_inicio, fecha_fin, observacion) *(Entidad Débil de Dispositivo)*
34. `INVENTARIO` (<ins>id_inventario</ins>, *id_centro, *id_ubicacion, *id_dispositivo [AK], fecha_ingreso) *(Principio de Exclusión Atómica 1:1)*
35. `EVALUACION_TECNICA` (<ins>id_evaluacion</ins>, *id_dispositivo, *id_tecnico, *id_clasificacion, fecha_evaluacion, diagnostico_funcional, diagnostico_estetico, aprobado_reutilizacion)
36. `ORDEN_TRABAJO` (<ins>id_orden</ins>, codigo_orden [AK], *id_dispositivo, *id_responsable, *id_tipo_trabajo, *id_estado_orden, fecha_apertura, fecha_cierre, descripcion, resultado)
37. `TRATAMIENTO` (<ins>id_tratamiento</ins>, *id_orden, tipo_tratamiento, costo_estimado, costo_real, fecha_registro, observaciones)
38. `COMPONENTE` (<ins>id_componente</ins>, *id_dispositivo_origen, *id_dispositivo_actual, *id_tipo_componente, numero_serie, marca, modelo, capacidad, estado, fecha_extraccion)
39. `MOVIMIENTO` (<ins>id_movimiento</ins>, codigo_movimiento [AK], *id_centro_origen, *id_centro_destino, *id_transportista, *id_estado_mov, fecha_salida, fecha_llegada_estimada, fecha_llegada_real, observaciones)
40. `DETALLE_MOVIMIENTO` (<ins><u>*id_movimiento, numero_linea</u></ins>, *id_dispositivo, peso_kg_transferido) `[AK: (id_movimiento, id_dispositivo)]` *(Entidad Débil con Clave Parcial corregida)*
41. `DESTINO_FINAL` (<ins>id_destino_final</ins>, *id_dispositivo [AK], *id_tipo_destino, *id_receptor, fecha_confirmacion, certificado_numero, observaciones)
42. `EVIDENCIA` (<ins>id_evidencia</ins>, *id_tipo_evidencia, *id_dispositivo, *id_movimiento, ubicacion_archivo, hash_sha256, tamano_bytes, fecha_subida)

#### Dominio de Red Logística y Optimización Edmonds-Karp
43. `NODO_RED` (<ins>id_nodo</ins>, *id_centro [AK], codigo_nodo [AK], nombre, tipo_nodo, capacidad_procesamiento_kg, latitud, longitud, es_activo)
44. `ARISTA_RED` (<ins>id_arista</ins>, *id_nodo_origen, *id_nodo_destino, distancia_km, capacidad_max_kg, tiempo_promedio_horas, costo_transporte_usd, es_activo) `[AK: (id_nodo_origen, id_nodo_destino)]`
45. `ESCENARIO_RED` (<ins>id_escenario</ins>, codigo_escenario [AK], nombre, descripcion, fecha_creacion, es_activo)
46. `ESCENARIO_ARISTA` (<ins><u>*id_escenario, *id_arista</u></ins>, capacidad_modificada_kg, costo_modificado_usd, habilitada) *(Intermedia N:M)*
47. `RESULTADO_FLUJO` (<ins>id_resultado</ins>, *id_escenario, *id_nodo_fuente, *id_nodo_sumidero, fecha_ejecucion, flujo_maximo_total_kg, algoritmo_usado, duracion_ms, converge)
48. `RESULTADO_ARISTA` (<ins><u>*id_resultado, *id_arista</u></ins>, flujo_asignado_kg, saturada) *(Intermedia N:M)*

---

### 1.3 Estrategia de Mapeo de Especialización / Herencia (Table-per-Type)
En el modelo EER de EcoRAEE Cloud existen dos jerarquías de especialización:
1. **Jerarquía `PERSONA`:** Subdividida en `PERSONA_NATURAL` y `PERSONA_JURIDICA`.
   - Se aplicó **Table-per-Type (TPT)**. La tabla general `PERSONA` almacena los atributos de contacto y geolocalización comunes a cualquier actor.
   - Las tablas hijas `PERSONA_NATURAL` y `PERSONA_JURIDICA` contienen únicamente los atributos propios (ej. Cédula vs RUC, Razón Social vs Nombres/Apellidos) y utilizan `id_persona` simultáneamente como `PRIMARY KEY` y `FOREIGN KEY` referenciando a `PERSONA(id_persona) ON DELETE CASCADE`.
2. **Jerarquía `DISPOSITIVO`:** Subdividida en 6 tipos de equipamiento físico: `COMPUTADORA`, `MONITOR`, `TABLET`, `TELEFONO`, `ROUTER` y `OTROS_DISPOSITIVOS`.
   - Cada subtipo posee su propia tabla ligada por `id_dispositivo` (PK/FK). Esto previene la presencia de columnas nulas masivas en la base de datos y garantiza que las especificaciones técnicas complejas (como slots de RAM, puertos Ethernet o resoluciones de pantalla) mantengan integridad de dominio estricta.

---

### 1.4 Tratamiento Riguroso de Entidades Débiles
En atención a la retroalimentación de la docente, el sistema modela dos entidades débiles fundamentales:

#### A. `DETALLE_MOVIMIENTO` (Débil por Identificación de `MOVIMIENTO`)
- **Problema previo señalado:** La entidad figuraba como débil pero carecía de una clave parcial que individualizara cada ítem dentro del manifiesto de carga.
- **Solución implementada:** Se incorporó el atributo `numero_linea INT NOT NULL` como **Clave Parcial (Discriminador)**.
- **Clave Primaria Compuesta:**
  $$\text{PK}(\text{DETALLE\_MOVIMIENTO}) = \{\text{id\_movimiento}, \text{numero\_linea}\}$$
- Adicionalmente, cuenta con una restricción `UNIQUE (id_movimiento, id_dispositivo)` para impedir que un mismo dispositivo sea incluido dos veces en una misma transferencia.

#### B. `HISTORIAL_ESTADO` (Débil por Identificación de `DISPOSITIVO`)
- Un evento de estado no tiene sentido físico sin el equipo al cual describe.
- Posee la clave parcial `numero_secuencia INT NOT NULL` (1, 2, 3, ...).
- **Clave Primaria Compuesta:**
  $$\text{PK}(\text{HISTORIAL\_ESTADO}) = \{\text{id\_dispositivo}, \text{numero\_secuencia}\}$$

---

# PUNTO 2: DICCIONARIO DE DATOS EXHAUSTIVO

A continuación se detalla la especificación de atributos para todas las tablas del sistema:

### 2.1 Tablas Maestras y Catálogos de Dominio

#### Tabla: `ROL_ACTOR`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_rol` | `INT IDENTITY(1,1)` | No | PK | Clustered | Identificador único del rol de actor. |
| `codigo` | `VARCHAR(30)` | No | AK | `UNIQUE`, Uppercase | Código nemotécnico (ej. GENERADOR_EMPRESA, GESTOR_CALIFICADO). |
| `nombre` | `VARCHAR(60)` | No | AK | `UNIQUE` | Nombre representativo del rol. |
| `descripcion` | `VARCHAR(255)` | Sí | - | - | Alcance y funciones del rol en el sistema. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Bandera de vigencia lógica. |

#### Tabla: `CATEGORIA_DISPOSITIVO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_categoria` | `INT IDENTITY(1,1)` | No | PK | Clustered | Identificador único de categoría de RAEE. |
| `codigo` | `VARCHAR(30)` | No | AK | `UNIQUE` | Código técnico internacional (ej. COMPUTO_PORTATIL, MONITORES). |
| `nombre` | `VARCHAR(80)` | No | AK | `UNIQUE` | Denominación formal según clasificación de RAEE. |
| `descripcion` | `VARCHAR(255)` | Sí | - | - | Criterios de inclusión de aparatos en esta categoría. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Estado de actividad de la categoría. |

#### Tabla: `CLASIFICACION_TECNICA`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_clasificacion`| `INT IDENTITY(1,1)` | No | PK | Clustered | Identificador de clasificación de destino técnico. |
| `codigo` | `VARCHAR(30)` | No | AK | `UNIQUE` | Código operativo: REUTILIZABLE, REPARABLE, RECICLABLE, NO_RECUPERABLE. |
| `nombre` | `VARCHAR(60)` | No | AK | `UNIQUE` | Nombre del dictamen técnico. |
| `jerarquia_ambiental` | `INT` | No | - | `CHECK (> 0)` | Jerarquía en economía circular (1 = Máxima prioridad/Reúso). |
| `descripcion` | `VARCHAR(255)` | Sí | - | - | Procedimiento técnico derivado. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Estado del clasificador. |

---

### 2.2 Actores, Personas y Seguridad

#### Tabla: `PERSONA`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_persona` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador maestro de la persona/entidad. |
| `tipo_persona` | `VARCHAR(20)` | No | - | `CHECK IN ('NATURAL', 'JURIDICA')` | Discriminador de tipo de entidad legal. |
| `nombre_razon_social`| `VARCHAR(200)` | No | - | - | Nombre visible, razón social o nombres consolidados. |
| `correo` | `VARCHAR(120)` | No | AK | `UNIQUE`, `CHECK LIKE '%_@__%.__%'` | Correo de notificación oficial validado por regex sintáctica. |
| `telefono` | `VARCHAR(20)` | Sí | - | - | Teléfono celular o fijo de contacto en Ecuador. |
| `direccion_texto` | `VARCHAR(255)` | No | - | - | Dirección física completa en el DMQ. |
| `latitud` | `DECIMAL(10,8)` | Sí | - | `CHECK (-90 a 90)` | Coordenada geográfica WGS84 para ruteo logístico. |
| `longitud` | `DECIMAL(11,8)` | Sí | - | `CHECK (-180 a 180)`| Coordenada geográfica WGS84 para ruteo logístico. |
| `fecha_registro`| `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Marca de tiempo exacta de alta en la plataforma. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Estado de vigencia de la entidad. |

#### Tabla: `PERSONA_NATURAL`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_persona` | `BIGINT` | No | PK, FK | `REFERENCES PERSONA ON DELETE CASCADE` | Enlace por herencia con la entidad base `PERSONA`. |
| `numero_identificacion`| `VARCHAR(20)` | No | AK | `UNIQUE` | Cédula ecuatoriana de 10 dígitos o pasaporte. |
| `tipo_identificacion`| `VARCHAR(20)` | No | - | `CHECK IN ('CEDULA', 'PASAPORTE', 'RUC_NATURAL')` | Tipo legal del documento de identificación. |
| `nombres` | `VARCHAR(100)` | No | - | - | Nombres completos de la persona. |
| `apellidos` | `VARCHAR(100)` | No | - | - | Apellidos de la persona natural. |
| `genero` | `VARCHAR(20)` | Sí | - | - | Género de la persona (opcional para analítica social). |

#### Tabla: `PERSONA_JURIDICA`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_persona` | `BIGINT` | No | PK, FK | `REFERENCES PERSONA ON DELETE CASCADE` | Enlace por herencia con la entidad base `PERSONA`. |
| `ruc` | `VARCHAR(13)` | No | AK | `UNIQUE` | Registro Único de Contribuyentes (13 dígitos). |
| `razon_social` | `VARCHAR(200)` | No | - | - | Razón social formal registrada en el SRI. |
| `representante_legal`| `VARCHAR(150)` | Sí | - | - | Nombre completo del representante legal apoderado. |
| `contacto_tecnico_cargo`| `VARCHAR(100)`| Sí | - | - | Cargo del contacto responsable de la gestión de RAEE. |

#### Tabla: `EMPLEADO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_empleado` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador único del funcionario de EcoRAEE. |
| `id_persona` | `BIGINT` | No | FK, AK | `UNIQUE`, `REFERENCES PERSONA` | Vínculo 1:1 con la entidad persona. |
| `codigo_empleado` | `VARCHAR(30)` | No | AK | `UNIQUE` | Código institucional asignado (ej. EMP-001). |
| `correo_institucional`| `VARCHAR(120)` | No | AK | `UNIQUE`, `CHECK (@uide.edu.ec / @uida.edu.ec)` | Correo institucional universitario corporativo. |
| `cargo` | `VARCHAR(100)` | No | - | - | Rol laboral operativo asignado. |
| `departamento` | `VARCHAR(100)` | No | - | - | Unidad operativa (ej. Taller Central, Logística). |
| `fecha_contratacion`| `DATE` | No | - | - | Fecha de inicio de labores. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Estado laboral activo. |

#### Tabla: `USUARIO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_usuario` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador de cuenta de acceso. |
| `id_empleado` | `BIGINT` | No | FK, AK | `UNIQUE`, `REFERENCES EMPLEADO` | Relación 1:1 con el empleado. |
| `id_rol_sistema` | `INT` | No | FK | `REFERENCES ROL_SISTEMA` | Rol de control de acceso RBAC. |
| `username` | `VARCHAR(50)` | No | AK | `UNIQUE` | Identificador de inicio de sesión. |
| `password_hash` | `CHAR(64)` | No | - | Algoritmo SHA-256 | Firma criptográfica de la credencial. |
| `salt` | `VARCHAR(32)` | No | - | Criptosemilla | Salt criptográfico aleatorio contra rainbow tables. |
| `ultimo_acceso` | `DATETIME2` | Sí | - | - | Marca de tiempo del último inicio de sesión. |
| `intentos_fallidos` | `INT` | No | - | `DEFAULT (0)` | Contador de intentos de acceso fallidos. |
| `bloqueado` | `BIT` | No | - | `DEFAULT (0)` | Bandera de bloqueo por seguridad. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Estado de vigencia de la cuenta. |

---

### 2.3 Logística de Entrada: Centros, Solicitudes y Lotes

#### Tabla: `CENTRO_ACOPIO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_centro` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador del centro físico de almacenamiento/taller. |
| `id_tipo_centro` | `INT` | No | FK | `REFERENCES TIPO_CENTRO` | Tipo de nodo (Acopio Primario, Clasificación, Taller). |
| `id_responsable` | `BIGINT` | No | FK | `REFERENCES EMPLEADO` | Encargado de la custodia del centro. |
| `codigo_centro` | `VARCHAR(30)` | No | AK | `UNIQUE` | Nemónico de sede (ej. CENTRO-NORTE, CAMPUS-MATRIZ). |
| `nombre` | `VARCHAR(120)` | No | - | - | Nombre público del establecimiento. |
| `direccion` | `VARCHAR(255)` | No | - | - | Dirección física del inmueble. |
| `latitud` | `DECIMAL(10,8)` | No | - | - | Latitud geográfica. |
| `longitud` | `DECIMAL(11,8)` | No | - | - | Longitud geográfica. |
| `capacidad_max_kg` | `DECIMAL(10,2)` | No | - | `CHECK (> 0)` | Límite de masa ambiental en kilogramos. |
| `capacidad_max_unidades`| `INT` | No | - | `CHECK (> 0)` | Límite de unidades físicas de equipos. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Estado de operación del centro. |

#### Tabla: `UBICACION`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_ubicacion` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador interno de estantería/percha. |
| `id_centro` | `BIGINT` | No | FK | `REFERENCES CENTRO_ACOPIO` | Centro donde está el casillero. |
| `codigo_ubicacion` | `VARCHAR(30)` | No | - | `UNIQUE(id_centro, codigo_ubicacion)` | Código de pasillo y posición (ej. EST-A1-N2). |
| `pasillo` | `VARCHAR(20)` | No | - | - | Pasillo o zona del almacén. |
| `estante` | `VARCHAR(20)` | No | - | - | Racks o estante de almacenamiento. |
| `nivel` | `VARCHAR(20)` | No | - | - | Nivel de altura en el rack. |
| `descripcion` | `VARCHAR(255)` | Sí | - | - | Notas de dimensiones o carga admisible. |
| `es_activo` | `BIT` | No | - | `DEFAULT (1)` | Disponibilidad física. |

#### Tabla: `SOLICITUD_RECOLECCION`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_solicitud` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Número correlativo de orden de retiro de RAEE. |
| `id_generador` | `BIGINT` | No | FK | `REFERENCES PERSONA` | Persona natural o jurídica que entrega los residuos. |
| `id_centro_destino`| `BIGINT` | No | FK | `REFERENCES CENTRO_ACOPIO` | Centro receptor asignado. |
| `codigo_solicitud` | `VARCHAR(30)` | No | AK | `UNIQUE` | Código de trámite oficial (ej. SOL-2026-0001). |
| `fecha_solicitud` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Fecha y hora de generación del pedido. |
| `fecha_programada` | `DATE` | Sí | - | - | Fecha calendarizada de retiro logístico. |
| `estado_solicitud` | `VARCHAR(30)` | No | - | `CHECK IN ('PENDIENTE', 'APROBADA', 'EN_CAMINO', 'COMPLETADA', 'CANCELADA')` | Estado del trámite de retiro. |
| `direccion_recoleccion`| `VARCHAR(255)`| No | - | - | Punto de carga exacto. |
| `latitud` | `DECIMAL(10,8)` | Sí | - | - | Geoposición del punto de retiro. |
| `longitud` | `DECIMAL(11,8)` | Sí | - | - | Geoposición del punto de retiro. |
| `peso_estimado_kg` | `DECIMAL(8,2)` | Sí | - | `CHECK (> 0)` | Estimación de masa entregada. |
| `cantidad_estimada_unidades`| `INT` | Sí | - | `CHECK (> 0)` | Número aproximado de equipos. |
| `observaciones` | `VARCHAR(MAX)` | Sí | - | - | Requerimientos de montacargas o estiba. |

#### Tabla: `LOTE`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_lote` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador único del lote de recepción. |
| `id_solicitud` | `BIGINT` | Sí | FK | `REFERENCES SOLICITUD_RECOLECCION` | Solicitud asociada (NULL para entregas espontáneas). |
| `id_centro` | `BIGINT` | No | FK | `REFERENCES CENTRO_ACOPIO` | Centro físico donde se descarga y custodia el lote. |
| `id_receptor` | `BIGINT` | No | FK | `REFERENCES EMPLEADO` | Bodeguero/Custodio que firma el acta de recepción. |
| `codigo_lote` | `VARCHAR(30)` | No | AK | `UNIQUE` | Identificador serializado de lote (ej. LOTE-2026-001). |
| `fecha_recepcion` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Momento exacto de ingreso formal. |
| `cantidad_declarada`| `INT` | No | - | `CHECK (> 0)` | Total de piezas físicas recibidas según acta. |
| `peso_declarado_kg`| `DECIMAL(10,2)` | Sí | - | `CHECK (> 0)` | Masa neta pesada en báscula de entrada. |
| `estado_lote` | `VARCHAR(30)` | No | - | `DEFAULT ('RECEPCIONADO')` | Estado del procesamiento del lote. |
| `observaciones` | `VARCHAR(MAX)` | Sí | - | - | Notas de condición exterior o embalaje. |

---

### 2.4 Dispositivos RAEE y Subtipos de Hardware

#### Tabla: `DISPOSITIVO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador numérico interno del equipo. |
| `codigo_qr` | `VARCHAR(50)` | No | AK | `UNIQUE` | Identificador alfanumérico grabado en el rótulo QR físico. |
| `id_lote` | `BIGINT` | No | FK | `REFERENCES LOTE` | Lote de ingreso de procedencia. |
| `id_modelo` | `BIGINT` | No | FK | `REFERENCES MODELO_DISPOSITIVO` | Especificación de marca y modelo del fabricante. |
| `id_condicion` | `INT` | No | FK | `REFERENCES CONDICION_DISPOSITIVO` | Condición cosmética y física inicial de entrega. |
| `numero_serie` | `VARCHAR(80)` | Sí | - | - | Número de serie impreso de fábrica por el OEM. |
| `peso_kg` | `DECIMAL(8,2)` | No | - | `CHECK (peso_kg > 0)` | Peso individual en báscula electrónica. |
| `fecha_registro` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Fecha de registro individual en el sistema. |
| `observaciones_ingreso`| `VARCHAR(MAX)` | Sí | - | - | Daños físicos evidentes detectados al escanear el QR. |

#### Tabla: `COMPUTADORA` (Subtipo TPT de `DISPOSITIVO`)
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Llave primaria compartida que hereda de `DISPOSITIVO`. |
| `procesador` | `VARCHAR(100)` | No | - | - | Modelo de CPU (ej. Intel Core i7-10510U). |
| `ram_total_gb` | `INT` | No | - | `CHECK (> 0)` | Capacidad instalada de memoria RAM en Gigabytes. |
| `almacenamiento_total_gb`| `INT` | No | - | `CHECK (> 0)` | Capacidad total de almacenamiento masivo. |
| `tipo_almacenamiento`| `VARCHAR(30)` | No | - | `CHECK IN ('HDD', 'SSD_SATA', 'SSD_NVME', 'HIBRIDO', 'SIN_DISCO')` | Tecnología de unidad de disco. |
| `incluye_cargador`| `BIT` | No | - | `DEFAULT (0)` | Presencia de fuente de alimentación externa. |
| `gpu_dedicada` | `VARCHAR(100)` | Sí | - | - | Tarjeta gráfica discreta (ej. NVIDIA GTX 1650). |

#### Tabla: `MONITOR` (Subtipo TPT de `DISPOSITIVO`)
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Herencia 1:1 de `DISPOSITIVO`. |
| `pulgadas` | `DECIMAL(4,1)` | No | - | `CHECK (> 0)` | Diagonal visible de la pantalla. |
| `resolucion` | `VARCHAR(30)` | No | - | - | Resolución nativa (ej. 1920x1080 FHD). |
| `tecnologia_panel` | `VARCHAR(30)` | No | - | `CHECK IN ('IPS', 'VA', 'TN', 'OLED', 'CRT')` | Tipo de tecnología de panel visual. |
| `puertos_video` | `VARCHAR(100)` | Sí | - | - | Conectores presentes (HDMI, DP, VGA, DVI). |
| `incluye_cable_poder`| `BIT` | No | - | `DEFAULT (0)` | Incluye cable de alimentación eléctrica. |

#### Tabla: `TABLET` (Subtipo TPT de `DISPOSITIVO`)
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Herencia 1:1 de `DISPOSITIVO`. |
| `pantalla_pulgadas`| `DECIMAL(4,1)` | No | - | `CHECK (> 0)` | Tamaño de display táctil. |
| `almacenamiento_gb`| `INT` | No | - | `CHECK (> 0)` | Memoria flash interna. |
| `ram_gb` | `INT` | Sí | - | `CHECK (> 0)` | Memoria RAM integrada en placa. |
| `incluye_cargador`| `BIT` | No | - | `DEFAULT (0)` | Adaptador y cable USB presentes. |
| `sistema_operativo`| `VARCHAR(50)` | Sí | - | - | SO instalado de origen (iPadOS, Android). |

#### Tabla: `TELEFONO` (Subtipo TPT de `DISPOSITIVO`)
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Herencia 1:1 de `DISPOSITIVO`. |
| `imei` | `VARCHAR(20)` | Sí | AK | `UNIQUE` (Índice filtrado donde IMEI no es nulo) | Identificador internacional de equipo móvil. |
| `almacenamiento_gb`| `INT` | No | - | `CHECK (> 0)` | Capacidad interna de almacenamiento. |
| `ram_gb` | `INT` | Sí | - | `CHECK (> 0)` | Memoria RAM. |
| `soporte_dual_sim`| `BIT` | No | - | `DEFAULT (0)` | Capacidad de dos ranuras SIM. |
| `porcentaje_salud_bateria`| `INT` | Sí | - | `CHECK (0 a 100)` | Porcentaje de retención de carga química en batería. |

#### Tabla: `ROUTER` (Subtipo TPT de `DISPOSITIVO`)
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Herencia 1:1 de `DISPOSITIVO`. |
| `mac_address` | `VARCHAR(20)` | Sí | AK | `UNIQUE` (Índice filtrado donde MAC no es nula) | Dirección física del adaptador de red. |
| `numero_puertos` | `INT` | No | - | `CHECK (>= 0)` | Cantidad de interfaces RJ45 ethernet. |
| `estandar_wifi` | `VARCHAR(30)` | Sí | - | - | Protocolo inalámbrico (WiFi 5, WiFi 6). |
| `velocidad_mbps` | `INT` | Sí | - | `CHECK (> 0)` | Rendimiento teórico máximo de transferencia. |
| `incluye_transformador`| `BIT` | No | - | `DEFAULT (0)` | Adaptador eléctrico original. |

#### Tabla: `OTROS_DISPOSITIVOS` (Subtipo TPT de `DISPOSITIVO`)
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Herencia 1:1 de `DISPOSITIVO`. |
| `descripcion_tecnica`| `VARCHAR(255)`| No | - | - | Detalle de naturaleza del equipo (impresora, proyector, switch). |
| `potencia_watts` | `INT` | Sí | - | `CHECK (> 0)` | Consumo eléctrico nominal reportado. |
| `peso_exacto_kg` | `DECIMAL(8,2)` | No | - | `CHECK (> 0)` | Peso verificado en tara. |
| `requiere_desarme_especial`| `BIT` | No | - | `DEFAULT (0)` | Alerta de sustancias o desensamble riesgoso. |

---

### 2.5 Trazabilidad, Estados e Inventario Físico

#### Tabla: `HISTORIAL_ESTADO` *(Entidad Débil)*
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_dispositivo` | `BIGINT` | No | PK, FK | `REFERENCES DISPOSITIVO ON DELETE CASCADE` | Entidad fuerte que identifica el historial. |
| `numero_secuencia`| `INT` | No | PK | `CHECK (> 0)` (Clave Parcial) | Orden secuencial del evento (1, 2, 3...) dentro de la historia del equipo. |
| `id_estado` | `INT` | No | FK | `REFERENCES ESTADO_DISPOSITIVO` | Estado operativo alcanzado. |
| `id_usuario` | `BIGINT` | No | FK | `REFERENCES USUARIO` | Usuario que ejecutó la transición de estado. |
| `fecha_inicio` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Momento exacto en que ingresó al estado. |
| `fecha_fin` | `DATETIME2` | Sí | - | - | Momento de salida del estado (`NULL` indica estado vigente actual). |
| `observacion` | `VARCHAR(MAX)` | Sí | - | - | Bitácora técnica del cambio. |

#### Tabla: `INVENTARIO` *(Principio de Exclusión Atómica 1:1)*
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_inventario` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Número de registro en bodega activa. |
| `id_centro` | `BIGINT` | No | FK | `REFERENCES CENTRO_ACOPIO` | Centro donde se aloja el equipo. |
| `id_ubicacion` | `BIGINT` | Sí | FK | `REFERENCES UBICACION` | Posición en percha/rack (NULL si está en tránsito en piso). |
| `id_dispositivo` | `BIGINT` | No | FK, AK | `UNIQUE`, `REFERENCES DISPOSITIVO` | **Garantía Atómica:** Un dispositivo solo puede estar en un único casillero a la vez. |
| `fecha_ingreso` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Momento de colocación en el almacén. |

---

### 2.6 Evaluación Técnica, Reacondicionamiento y Destino Final

#### Tabla: `EVALUACION_TECNICA`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_evaluacion` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador del diagnóstico formal. |
| `id_dispositivo` | `BIGINT` | No | FK | `REFERENCES DISPOSITIVO` | Equipo sobre el cual se realiza el test. |
| `id_tecnico` | `BIGINT` | No | FK | `REFERENCES EMPLEADO` | Especialista que emite el veredicto. |
| `id_clasificacion`| `INT` | No | FK | `REFERENCES CLASIFICACION_TECNICA` | Dictamen: Reutilizable, Reparable, Reciclable, No Recuperable. |
| `fecha_evaluacion`| `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Fecha y hora del examen físico/eléctrico. |
| `diagnostico_funcional`| `VARCHAR(MAX)`| No | - | - | Resumen de tests de encendido, POST, memoria y disco. |
| `diagnostico_estetico`| `VARCHAR(MAX)` | Sí | - | - | Estado cosmético del chasis y carcasas. |
| `aprobado_reutilizacion`| `BIT` | No | - | `DEFAULT (0)` | Bandera de aptitud directa sin intervención profunda. |

#### Tabla: `ORDEN_TRABAJO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_orden` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador único de orden de taller. |
| `codigo_orden` | `VARCHAR(30)` | No | AK | `UNIQUE` | Código de taller (ej. OT-2026-0001). |
| `id_dispositivo` | `BIGINT` | No | FK | `REFERENCES DISPOSITIVO` | Equipo sometido a reparación/desarme. |
| `id_responsable` | `BIGINT` | No | FK | `REFERENCES EMPLEADO` | Técnico asignado al trabajo. |
| `id_tipo_trabajo` | `INT` | No | FK | `REFERENCES TIPO_TRABAJO` | Categoría (Limpieza, Reparación electrónica, Canibalización). |
| `id_estado_orden` | `INT` | No | FK | `REFERENCES ESTADO_ORDEN` | Estado de la orden (Abierta, En Proceso, Concluida). |
| `fecha_apertura` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Apertura de la OT. |
| `fecha_cierre` | `DATETIME2` | Sí | - | - | Conclusión y entrega del equipo. |
| `descripcion` | `VARCHAR(MAX)` | No | - | - | Trabajos detallados a ejecutar. |
| `resultado` | `VARCHAR(MAX)` | Sí | - | - | Hallazgos post-intervención técnica. |

#### Tabla: `TRATAMIENTO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_tratamiento` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador de la intervención. |
| `id_orden` | `BIGINT` | No | FK | `REFERENCES ORDEN_TRABAJO ON DELETE CASCADE` | Orden matriz de la cual deriva el trabajo. |
| `tipo_tratamiento`| `VARCHAR(100)` | No | - | - | Operación concreta realizada (ej. Soldadura, cambio de pasta térmica). |
| `costo_estimado` | `DECIMAL(8,2)` | No | - | `CHECK (>= 0)` | Presupuesto previsto de insumos (USD). |
| `costo_real` | `DECIMAL(8,2)` | Sí | - | `CHECK (>= 0)` | Costo real consumido en el reacondicionamiento. |
| `fecha_registro` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Registro contable del tratamiento. |
| `observaciones` | `VARCHAR(MAX)` | Sí | - | - | Repuestos empleados o incidencias. |

#### Tabla: `COMPONENTE`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_componente` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador de pieza recuperada. |
| `id_dispositivo_origen`| `BIGINT` | No | FK | `REFERENCES DISPOSITIVO` | Equipo donante de donde fue canibalizado el componente. |
| `id_dispositivo_actual`| `BIGINT` | Sí | FK | `REFERENCES DISPOSITIVO` | Equipo receptor donde fue reinstalado (NULL si está en stock). |
| `id_tipo_componente`| `INT` | No | FK | `REFERENCES TIPO_COMPONENTE` | Tipo de pieza (Memoria RAM, Disco SSD, Fuente ATX). |
| `numero_serie` | `VARCHAR(80)` | Sí | - | - | Serial propio de la parte extraída. |
| `marca` | `VARCHAR(80)` | Sí | - | - | Marca del componente. |
| `modelo` | `VARCHAR(80)` | Sí | - | - | Modelo de la pieza. |
| `capacidad` | `VARCHAR(50)` | Sí | - | - | Capacidad técnica (ej. 16GB DDR4, 512GB NVMe). |
| `estado` | `VARCHAR(30)` | No | - | `CHECK IN ('DISPONIBLE', 'INSTALADO', 'DEFECTUOSO', 'RECICLADO')` | Estado operativo de la refacción. |
| `fecha_extraccion`| `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Fecha de desarme y registro. |

#### Tabla: `MOVIMIENTO`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_movimiento` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador de la transferencia de carga. |
| `codigo_movimiento`| `VARCHAR(30)` | No | AK | `UNIQUE` | Manifiesto de ruta logística (ej. TRF-2026-0001). |
| `id_centro_origen`| `BIGINT` | No | FK | `REFERENCES CENTRO_ACOPIO` | Centro expedidor de la carga. |
| `id_centro_destino`| `BIGINT` | No | FK | `REFERENCES CENTRO_ACOPIO`, `CHECK (origen <> destino)` | Centro receptor de la carga. |
| `id_transportista`| `BIGINT` | No | FK | `REFERENCES EMPLEADO` | Conductor/Logístico responsable de la estiba. |
| `id_estado_mov` | `INT` | No | FK | `REFERENCES ESTADO_MOVIMIENTO` | Estado del viaje (Preparación, En Tránsito, Recibido). |
| `fecha_salida` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Salida de patio de origen. |
| `fecha_llegada_estimada`| `DATETIME2`| Sí | - | - | Hora prevista de entrega. |
| `fecha_llegada_real`| `DATETIME2` | Sí | - | - | Confirmación de arribo y descarga. |
| `observaciones` | `VARCHAR(MAX)` | Sí | - | - | Precintos de seguridad del camión o incidentes. |

#### Tabla: `DETALLE_MOVIMIENTO` *(Entidad Débil con Clave Parcial Corregida)*
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_movimiento` | `BIGINT` | No | PK, FK | `REFERENCES MOVIMIENTO ON DELETE CASCADE` | Entidad fuerte que agrupa el ítem transferido. |
| `numero_linea` | `INT` | No | PK | `CHECK (> 0)` (Clave Parcial) | **Discriminador de la entidad débil.** Número de ítem en la guía (1, 2, 3...). |
| `id_dispositivo` | `BIGINT` | No | FK | `REFERENCES DISPOSITIVO`, `UNIQUE(id_movimiento, id_dispositivo)` | Dispositivo físico transferido en el flete. |
| `peso_kg_transferido`| `DECIMAL(8,2)` | No | - | `CHECK (> 0)` | Masa individual registrada para control de carga del vehículo. |

#### Tabla: `DESTINO_FINAL` *(Cierre de Trazabilidad)*
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_destino_final`| `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador del acto de disposición final o egreso. |
| `id_dispositivo` | `BIGINT` | No | FK, AK | `UNIQUE`, `REFERENCES DISPOSITIVO` | **Unicidad de Cierre:** Un equipo solo puede tener un destino final registrado. |
| `id_tipo_destino` | `INT` | No | FK | `REFERENCES TIPO_DESTINO` | Destino (Donación Comunitaria, Gestor Calificado, Celda de Seguridad). |
| `id_receptor` | `BIGINT` | No | FK | `REFERENCES PERSONA` | Entidad receptora beneficiaria o gestora ambiental acreditada por MAATE. |
| `fecha_confirmacion`| `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Fecha del acta de entrega-recepción formal. |
| `certificado_numero`| `VARCHAR(60)` | Sí | - | - | Número de manifiesto de disposición final ambiental o acta de donación. |
| `observaciones` | `VARCHAR(MAX)` | Sí | - | - | Cláusulas de responsabilidad ambiental y garantía extendida. |

#### Tabla: `EVIDENCIA`
| Columna | Tipo SQL Server | Nulo | Clave | Restricción / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_evidencia` | `BIGINT IDENTITY(1,1)`| No | PK | Clustered | Identificador único de evidencia fotográfica/documental. |
| `id_tipo_evidencia`| `INT` | No | FK | `REFERENCES TIPO_EVIDENCIA` | Formato (FOTO_INGRESO, ACTA_DONACION_PDF, CERTIFICADO_DESTRUCCION). |
| `id_dispositivo` | `BIGINT` | Sí | FK | `REFERENCES DISPOSITIVO` | Dispositivo al que pertenece la evidencia (o NULL si es de viaje). |
| `id_movimiento` | `BIGINT` | Sí | FK | `REFERENCES MOVIMIENTO` | Manifiesto al que pertenece la evidencia (o NULL si es de equipo). |
| `ubicacion_archivo`| `VARCHAR(500)` | No | - | `CHECK (LIKE 's3://ecoraee-evidencias-storage/%')` | URI inmutable en AWS S3. |
| `hash_sha256` | `CHAR(64)` | No | - | Integridad Criptográfica | Hash SHA-256 para prevenir alteración o fraude forense. |
| `tamano_bytes` | `BIGINT` | No | - | `CHECK (> 0)` | Tamaño exacto del fichero almacenado. |
| `fecha_subida` | `DATETIME2` | No | - | `DEFAULT (SYSDATETIME())`| Timestamp de almacenamiento en cloud. |

---

# PUNTO 3: NORMALIZACIÓN FORMAL (1FN, 2FN, 3FN / FNBC)

En este apartado se demuestra rigurosamente el proceso de normalización para las **cinco tablas requeridas por la rúbrica**, exhibiendo el análisis de dependencias funcionales y la justificación teórica de por qué el diseño alcanza la **Tercera Forma Normal (3FN)** y la **Forma Normal de Boyce-Codd (FNBC)** sin anomalías de inserción, modificación o eliminación.

---

### 3.1 TABLA 1: `DISPOSITIVO`

#### Estructura y Esquema:
$$\text{DISPOSITIVO}(\underline{\text{id\_dispositivo}}, \text{codigo\_qr}, \text{id\_lote}, \text{id\_modelo}, \text{id\_condicion}, \text{numero\_serie}, \text{peso\_kg}, \text{fecha\_registro}, \text{observaciones\_ingreso})$$

- **Clave Primaria ($PK$):** $\{\text{id\_dispositivo}\}$
- **Clave Alterna / Candidata ($AK$):** $\{\text{codigo\_qr}\}$

#### Dependencias Funcionales Relevantes ($DF$):
1. $DF_1: \{\text{id\_dispositivo}\} \rightarrow \{\text{codigo\_qr}, \text{id\_lote}, \text{id\_modelo}, \text{id\_condicion}, \text{numero\_serie}, \text{peso\_kg}, \text{fecha\_registro}, \text{observaciones\_ingreso}\}$
2. $DF_2: \{\text{codigo\_qr}\} \rightarrow \{\text{id\_dispositivo}, \text{id\_lote}, \text{id\_modelo}, \text{id\_condicion}, \text{numero\_serie}, \text{peso\_kg}, \text{fecha\_registro}, \text{observaciones\_ingreso}\}$

#### Justificación de Formas Normales:
* **Primera Forma Normal (1FN):**
  - Todos los atributos contienen únicamente valores escalares indivisibles (atómicos). No existen atributos multivaluados (como listas o arrays de componentes embebidos) ni grupos repetitivos. La clave primaria `id_dispositivo` está unívocamente definida y ningún atributo clave acepta nulos. Por tanto, **cumple la 1FN**.
* **Segunda Forma Normal (2FN):**
  - Una relación está en 2FN si está en 1FN y ningún atributo no clave tiene una dependencia funcional parcial respecto a una clave candidata compuesta. En `DISPOSITIVO`, la clave primaria $\{\text{id\_dispositivo}\}$ y la clave candidata $\{\text{codigo\_qr}\}$ son **claves simples (atómicas, de un solo atributo)**. Al no existir claves compuestas, es matemáticamente imposible que existan dependencias parciales. Por tanto, **cumple la 2FN**.
* **Tercera Forma Normal (3FN):**
  - Una relación está en 3FN si está en 2FN y para toda dependencia funcional no trivial $X \rightarrow Y$, se cumple que:
    1. $X$ es una superclave de la relación, o
    2. Cada atributo en $Y$ es un atributo primo (pertenece a alguna clave candidata).
  - En `DISPOSITIVO`, los únicos determinantes de atributos no primos son $\{\text{id\_dispositivo}\}$ y $\{\text{codigo\_qr}\}$. Ambos son superclaves (claves candidatas completas e irreductibles).
  - *Prevención de anomalías transitivas:* Atributos descriptivos de la marca o categoría no residen en `DISPOSITIVO`, sino en sus tablas maestras independientes (`MODELO_DISPOSITIVO`, `MARCA`, `CATEGORIA_DISPOSITIVO`). Por tanto, no existe ninguna dependencia transitiva del tipo $\text{id\_dispositivo} \rightarrow \text{id\_modelo} \rightarrow \text{nombre\_marca}$. En consecuencia, **cumple la 3FN**.
* **Forma Normal de Boyce-Codd (FNBC):**
  - Como todo determinante en las dependencias funcionales $DF_1$ y $DF_2$ es una clave candidata estricta, la tabla cumple igualmente con la **FNBC**.

---

### 3.2 TABLA 2: `LOTE`

#### Estructura y Esquema:
$$\text{LOTE}(\underline{\text{id\_lote}}, \text{id\_solicitud}, \text{id\_centro}, \text{id\_receptor}, \text{codigo\_lote}, \text{fecha\_recepcion}, \text{cantidad\_declarada}, \text{peso\_declarado\_kg}, \text{estado\_lote}, \text{observaciones})$$

- **Clave Primaria ($PK$):** $\{\text{id\_lote}\}$
- **Clave Alterna / Candidata ($AK$):** $\{\text{codigo\_lote}\}$

#### Dependencias Funcionales Relevantes ($DF$):
1. $DF_1: \{\text{id\_lote}\} \rightarrow \{\text{id\_solicitud}, \text{id\_centro}, \text{id\_receptor}, \text{codigo\_lote}, \text{fecha\_recepcion}, \text{cantidad\_declarada}, \text{peso\_declarado\_kg}, \text{estado\_lote}, \text{observaciones}\}$
2. $DF_2: \{\text{codigo\_lote}\} \rightarrow \{\text{id\_lote}, \text{id\_solicitud}, \text{id\_centro}, \text{id\_receptor}, \text{fecha\_recepcion}, \text{cantidad\_declarada}, \text{peso\_declarado\_kg}, \text{estado\_lote}, \text{observaciones}\}$

#### Justificación de Formas Normales:
* **Cumplimiento de 1FN:**
  - Los datos de pesaje, cantidad de piezas, fechas y claves son atómicos y pertenecen a dominios elementales definidos. No existen estructuras anidadas ni subtablas en las columnas.
* **Cumplimiento de 2FN:**
  - La clave primaria $\{\text{id\_lote}\}$ consta de un único atributo. No existen subconjuntos propios de la clave que puedan determinar atributos no primos. Por definición matemática, está en 2FN.
* **Cumplimiento de 3FN:**
  - No existen dependencias transitivas entre atributos no clave. Por ejemplo, los datos del receptor (nombres, cargo) o del centro de acopio (dirección, capacidad) no se almacenan redundantemente en `LOTE`, sino que se referencian mediante sus claves foráneas `id_receptor` e `id_centro`. Por ende, no existe transitividad ($\text{id\_lote} \rightarrow \text{id\_centro} \rightarrow \text{direccion\_centro}$). Todo determinante es superclave. Por tanto, **cumple la 3FN**.

---

### 3.3 TABLA 3: `EVALUACION_TECNICA`

#### Estructura y Esquema:
$$\text{EVALUACION\_TECNICA}(\underline{\text{id\_evaluacion}}, \text{id\_dispositivo}, \text{id\_tecnico}, \text{id\_clasificacion}, \text{fecha\_evaluacion}, \text{diagnostico\_funcional}, \text{diagnostico\_estetico}, \text{aprobado\_reutilizacion})$$

- **Clave Primaria ($PK$):** $\{\text{id\_evaluacion}\}$

#### Dependencias Funcionales Relevantes ($DF$):
1. $DF_1: \{\text{id\_evaluacion}\} \rightarrow \{\text{id\_dispositivo}, \text{id\_tecnico}, \text{id\_clasificacion}, \text{fecha\_evaluacion}, \text{diagnostico\_funcional}, \text{diagnostico\_estetico}, \text{aprobado\_reutilizacion}\}$

#### Justificación de Formas Normales:
* **Cumplimiento de 1FN:**
  - Todos los atributos albergan valores escalares puros. El diagnóstico técnico está formalizado como texto descriptivo indivisible y la aprobación de reutilización es un valor binario booleano (`BIT`).
* **Cumplimiento de 2FN:**
  - La clave primaria es simple (`id_evaluacion`). Al no tener una clave compuesta, no pueden existir dependencias parciales.
* **Cumplimiento de 3FN:**
  - Los atributos `diagnostico_funcional`, `diagnostico_estetico` y `aprobado_reutilizacion` dependen directa y exclusivamente de la clave `id_evaluacion`. No existe transitividad entre atributos no clave: `id_clasificacion` no determina el diagnóstico estético, ni `id_tecnico` determina la clasificación asignada. Los datos descriptivos de la clasificación técnica (como la jerarquía ambiental de residuos) residen exclusivamente en la tabla `CLASIFICACION_TECNICA`. En consecuencia, el único determinante es la superclave `id_evaluacion`. Por tanto, **cumple la 3FN**.

---

### 3.4 TABLA 4: `HISTORIAL_ESTADO` (Entidad Débil)

#### Estructura y Esquema:
$$\text{HISTORIAL\_ESTADO}(\underline{\text{id\_dispositivo}}, \underline{\text{numero\_secuencia}}, \text{id\_estado}, \text{id\_usuario}, \text{fecha\_inicio}, \text{fecha\_fin}, \text{observacion})$$

- **Clave Primaria Compuesta ($PK$):** $\{\text{id\_dispositivo}, \text{numero\_secuencia}\}$
- **Clave Parcial (Discriminador):** $\text{numero\_secuencia}$
- **Clave Foránea Identificadora ($FK$):** $\text{id\_dispositivo} \rightarrow \text{DISPOSITIVO}(\text{id\_dispositivo})$

#### Dependencias Funcionales Relevantes ($DF$):
1. $DF_1: \{\text{id\_dispositivo}, \text{numero\_secuencia}\} \rightarrow \{\text{id\_estado}, \text{id\_usuario}, \text{fecha\_inicio}, \text{fecha\_fin}, \text{observacion}\}$

#### Justificación de Formas Normales:
* **Cumplimiento de 1FN:**
  - Los eventos de cambio de estado se modelan verticalmente mediante filas atómicas. No existen listas delimitadas de estados en una sola celda.
* **Cumplimiento de 2FN:**
  - La clave primaria es compuesta por $\{\text{id\_dispositivo}, \text{numero\_secuencia}\}$.
  - Para estar en 2FN, ningún atributo no primo debe depender funcionalmente de una parte propia de la clave (es decir, solo de `id_dispositivo` o solo de `numero_secuencia`):
    - ¿$\{\text{id\_dispositivo}\} \rightarrow \text{id\_estado}$? **Falso**, pues a lo largo del tiempo un mismo dispositivo transita por múltiples estados secuenciales (Recolectado, Evaluado, Reparado, etc.). Se requiere obligatoriamente el `numero_secuencia` para identificar el estado exacto en ese paso temporal.
    - ¿$\{\text{numero\_secuencia}\} \rightarrow \text{id\_estado}$? **Falso**, el número 1 es el estado inicial para cualquier equipo en general, pero cada equipo específico puede haber entrado en un estado distinto en su secuencia 1 dependiendo de su flujo logístico.
    - Por lo tanto, todos los atributos no clave (`id_estado`, `id_usuario`, `fecha_inicio`, `fecha_fin`, `observacion`) dependen de la **totalidad conjunta e indivisible** de la clave primaria $\{\text{id\_dispositivo}, \text{numero\_secuencia}\}$. No existen dependencias parciales. **Cumple estrictamente la 2FN**.
* **Cumplimiento de 3FN:**
  - No existen dependencias transitivas entre atributos no clave. La descripción del estado (ej. "En Bodega", "En Desarme") se encuentra aislada en la tabla maestra `ESTADO_DISPOSITIVO`. El usuario que registró el cambio se referencia mediante `id_usuario` sin replicar sus datos personales. El único determinante es la clave primaria completa. Por tanto, **cumple la 3FN**.

---

### 3.5 TABLA 5: `DETALLE_MOVIMIENTO` (Transferencia Logística - Entidad Débil)

#### Estructura y Esquema:
$$\text{DETALLE\_MOVIMIENTO}(\underline{\text{id\_movimiento}}, \underline{\text{numero\_linea}}, \text{id\_dispositivo}, \text{peso\_kg\_transferido})$$

- **Clave Primaria Compuesta ($PK$):** $\{\text{id\_movimiento}, \text{numero\_linea}\}$
- **Clave Parcial (Discriminador):** $\text{numero\_linea}$
- **Clave Foránea Identificadora ($FK$):** $\text{id\_movimiento} \rightarrow \text{MOVIMIENTO}(\text{id\_movimiento})$
- **Restricción de Unicidad Adicional ($AK$):** $\{\text{id\_movimiento}, \text{id\_dispositivo}\}$

#### Dependencias Funcionales Relevantes ($DF$):
1. $DF_1: \{\text{id\_movimiento}, \text{numero\_linea}\} \rightarrow \{\text{id\_dispositivo}, \text{peso\_kg\_transferido}\}$
2. $DF_2: \{\text{id\_movimiento}, \text{id\_dispositivo}\} \rightarrow \{\text{numero\_linea}, \text{peso\_kg\_transferido}\}$

#### Justificación de Formas Normales:
* **Cumplimiento de 1FN:**
  - El manifiesto logístico desagrega cada bulto/equipo cargado en el vehículo de transporte en un registro individual e indivisible. Cumple 1FN.
* **Cumplimiento de 2FN:**
  - La clave primaria está conformada por $\{\text{id\_movimiento}, \text{numero\_linea}\}$.
  - Verificación de ausencia de dependencias parciales:
    - ¿$\{\text{id\_movimiento}\} \rightarrow \text{id\_dispositivo}$? **Falso**, un movimiento o camión transporta una pluralidad de dispositivos distintos en una misma guía de remisión.
    - ¿$\{\text{numero\_linea}\} \rightarrow \text{id\_dispositivo}$? **Falso**, la línea 1 existe en el movimiento 1, en el movimiento 2 y en cualquier otro viaje, conteniendo dispositivos enteramente disímiles.
    - Por ende, tanto `id_dispositivo` como `peso_kg_transferido` dependen obligatoriamente de la conjunción de $\{\text{id\_movimiento}, \text{numero\_linea}\}$. No existen dependencias parciales. **Cumple la 2FN**.
* **Cumplimiento de 3FN / FNBC:**
  - La tabla posee dos claves candidatas: $K_1 = \{\text{id\_movimiento}, \text{numero\_linea}\}$ y $K_2 = \{\text{id\_movimiento}, \text{id\_dispositivo}\}$.
  - En ambas dependencias funcionales ($DF_1$ y $DF_2$), el lado izquierdo (determinante) es una clave candidata completa. No existen atributos no clave que determinen a otros atributos no clave.
  - La información del camión o conductor no reside aquí, sino en `MOVIMIENTO`. Las especificaciones técnicas del equipo no residen aquí, sino en `DISPOSITIVO`. Por tanto, **cumple rigurosamente la 3FN y la FNBC**.

---

# PUNTO 4: EJECUCIÓN DE SCRIPTS Y EVIDENCIAS

Los cuatro archivos `.sql` entregados fueron probados exhaustivamente en **Microsoft SQL Server**. A continuación se detalla su funcionamiento y las instrucciones para reproducir las evidencias requeridas por la rúbrica.

```
database/sql_server_entrega/
├── 01_DDL.sql         -> Crea la base BD_ECORAEE_CLOUD, esquemas, 30 tablas y restricciones.
├── 02_DML.sql         -> Inserta el catálogo maestro, actores, 32 dispositivos y 4 ciclos completos.
├── 03_pruebas.sql     -> Ejecuta y captura el rechazo obligatorio de las 5 violaciones de integridad.
└── 04_consultas.sql   -> Ejecuta las 5 consultas analíticas avanzadas de economía circular.
```

---

### 4.1 Script `01_DDL.sql` (Creación de Base y Restricciones)
- **Instrucción de Ejecución:** Abrir el archivo en SQL Server Management Studio (SSMS) o Azure Data Studio y presionar `Execute` (F5).
- **Comportamiento del Script:**
  1. Detecta si la base `BD_ECORAEE_CLOUD` existe; si está presente, cierra conexiones activas (`SINGLE_USER WITH ROLLBACK IMMEDIATE`) y la recrea desde cero en un estado completamente limpio.
  2. Crea las 21 tablas base, las 6 tablas hijas de hardware (TPT) y las 3 tablas intermedias N:M.
  3. Define todas las restricciones: `PRIMARY KEY CLUSTERED`, `FOREIGN KEY` con integridad referencial restrictiva (o en cascada para débiles/herencia), `UNIQUE`, `CHECK` (geoposiciones, correos, masa positiva, estados finitos) y valores `DEFAULT`.
- **Mensaje esperado de éxito:**
  `Comandos completados correctamente. Base de datos BD_ECORAEE_CLOUD creada con éxito.`

---

### 4.2 Script `02_DML.sql` (Datos Inventados: 32 Dispositivos y 4 Ciclos Completos)
- **Volumen poblado:**
  - 15 Catálogos maestros con descripciones técnicas.
  - 10 Actores (Personas naturales, empresas generadoras, gestores autorizados y personal técnico de la UIDE).
  - 3 Centros de acopio en el Distrito Metropolitano de Quito (Norte, Sur y Campus UIDE Matriz) con 10 ubicaciones físicas en estanterías.
  - **32 Dispositivos RAEE individuales** (superando el umbral de 30 exigido por la rúbrica), abarcando computadoras portátiles, all-in-one, servidores, monitores IPS, smartphones y routers empresariales con marcas y números de serie sintéticos coherentes.
- **Los 4 Ciclos Completos de Vida (Del Registro al Cierre por Clasificación Técnica):**
  1. **Ciclo 1 - Dispositivo 1 (`REUTILIZABLE`):** Laptop Lenovo ThinkPad T490. Recibida en lote de donación -> Evaluada en laboratorio -> Aprobada para reúso -> Retirada de inventario de bodega -> Asignada en **Donación Comunitaria** a la Fundación Semillas del Futuro con acta certificada `ACTA-DON-2026-001`.
  2. **Ciclo 2 - Dispositivo 2 (`REPARABLE`):** PC Dell OptiPlex 7080. Recibida -> Evaluada como reparable -> Se abre Orden de Trabajo `OT-2026-001` -> Se ejecuta Tratamiento de cambio de fuente ATX y mantenimiento -> Pruebas de encendido OK -> Cierre mediante asignación social certificada `ACTA-DON-2026-002`.
  3. **Ciclo 3 - Dispositivo 3 (`RECICLABLE`):** Switch Cisco Catalyst 2960. Recibido -> Diagnóstico de obsolescencia tecnológica -> Se canibaliza su fuente modular (`COMPONENTE` aprovechable en stock) -> Chasis transferido formalmente a ReciclaMetal S.A. con manifiesto ambiental `MANIF-MAATE-2026-881` para fundición de cobre y aluminio.
  4. **Ciclo 4 - Dispositivo 4 (`NO RECUPERABLE`):** Smartphone Samsung Galaxy S10. Recibido con batería hinchada y sulfatación irreversible -> Diagnosticado como residuo peligroso -> Retirado de stock -> Entregado a gestor de celdas ambientales controladas con acta de destrucción segura `CERT-DEST-MAATE-991`.

---

### 4.3 Script `03_pruebas.sql` (Cinco Instrucciones Rechazadas por el Motor)
El script incluye una ejecución controlada mediante bloques `TRY...CATCH` que extrae el código y mensaje de error de SQL Server, así como las sentencias independientes para ser resaltadas y ejecutadas manualmente:

#### Prueba 1: Violación de Clave Primaria (PK Repetida)
- **Instrucción:** Inserción en la entidad débil `HISTORIAL_ESTADO` de una tupla con `(id_dispositivo = 1, numero_secuencia = 1)`, cuando dicha secuencia ya existe.
- **Resultado del Motor:** **RECHAZADO**.
- **Error SQL Server:**
  `Msg 2627, Level 14, State 1: Violation of PRIMARY KEY constraint 'PK_HISTORIAL_ESTADO'. Cannot insert duplicate key in object 'dbo.HISTORIAL_ESTADO'. The duplicate key value is (1, 1).`

#### Prueba 2: Violación de Clave Foránea (FK Inexistente)
- **Instrucción:** Inserción en `DISPOSITIVO` de un equipo con `id_modelo = 99999` (inexistente en el catálogo maestro).
- **Resultado del Motor:** **RECHAZADO**.
- **Error SQL Server:**
  `Msg 547, Level 16, State 0: The INSERT statement conflicted with the FOREIGN KEY constraint "FK_DISPOSITIVO_MODELO". The conflict occurred in database "BD_ECORAEE_CLOUD", table "dbo.MODELO_DISPOSITIVO", column 'id_modelo'.`

#### Prueba 3: Violación de Clave Alterna / Candidata (UNIQUE Repetido)
- **Instrucción:** Inserción en `DISPOSITIVO` de un registro con el código QR `'QR-2026-ECU-000001'` (perteneciente al Dispositivo 1).
- **Resultado del Motor:** **RECHAZADO**.
- **Error SQL Server:**
  `Msg 2627, Level 14, State 1: Violation of UNIQUE KEY constraint 'UQ_DISPOSITIVO_qr'. Cannot insert duplicate key in object 'dbo.DISPOSITIVO'. The duplicate key value is (QR-2026-ECU-000001).`

#### Prueba 4: Violación de Restricción de Dominio (CHECK Incumplido)
- **Instrucción:** Inserción en `DISPOSITIVO` con una masa de `-12.50 kg` (violando `CHECK (peso_kg > 0)`).
- **Resultado del Motor:** **RECHAZADO**.
- **Error SQL Server:**
  `Msg 547, Level 16, State 0: The INSERT statement conflicted with the CHECK constraint "CK_DISPOSITIVO_peso". The conflict occurred in database "BD_ECORAEE_CLOUD", table "dbo.DISPOSITIVO", column 'peso_kg'.`

#### Prueba 5: Violación por Borrado Restringido (DELETE con Registros Relacionados)
- **Instrucción:** Intento de borrar el centro de acopio matriz mediante `DELETE FROM CENTRO_ACOPIO WHERE id_centro = 1;`.
- **Resultado del Motor:** **RECHAZADO**.
- **Error SQL Server:**
  `Msg 547, Level 16, State 0: The DELETE statement conflicted with the REFERENCE constraint "FK_UBICACION_CENTRO". The conflict occurred in database "BD_ECORAEE_CLOUD", table "dbo.UBICACION", column 'id_centro'.`

---

### 4.4 Script `04_consultas.sql` (Cinco Consultas Analíticas Avanzadas)

#### Consulta A: Historial de Estados de un Dispositivo
- **Objetivo:** Trazabilidad cronológica completa con tiempos de permanencia, técnico responsable y bitácora de eventos para el Dispositivo 1.
- **SQL Resumido:**
  ```sql
  SELECT 
      d.id_dispositivo, d.codigo_qr, CONCAT(m.nombre, ' (', ma.nombre, ')') AS equipo_modelo,
      he.numero_secuencia AS orden_evento, ed.nombre AS nombre_estado,
      FORMAT(he.fecha_inicio, 'yyyy-MM-dd HH:mm') AS fecha_inicio,
      ISNULL(FORMAT(he.fecha_fin, 'yyyy-MM-dd HH:mm'), 'VIGENTE / FINAL') AS fecha_fin,
      CONCAT(p.nombres, ' ', p.apellidos) AS usuario_responsable, he.observacion
  FROM HISTORIAL_ESTADO he
  INNER JOIN DISPOSITIVO d ON he.id_dispositivo = d.id_dispositivo
  INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
  INNER JOIN MARCA ma ON m.id_marca = ma.id_marca
  INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
  INNER JOIN USUARIO u ON he.id_usuario = u.id_usuario
  INNER JOIN EMPLEADO emp ON u.id_empleado = emp.id_empleado
  INNER JOIN PERSONA p ON emp.id_persona = p.id_persona
  WHERE d.id_dispositivo = 1
  ORDER BY he.numero_secuencia ASC;
  ```

#### Consulta B: Inventario por Centro de Acopio y Estado del Dispositivo
- **Objetivo:** Mostrar la distribución de unidades físicas y masa total (kg) almacenada en cada centro según el estado operativo vigente (`fecha_fin IS NULL`), comparándolo contra la capacidad física instalada.
- **SQL Resumido:**
  ```sql
  SELECT 
      ca.codigo_centro, ca.nombre AS centro_acopio, ed.nombre AS estado_actual,
      COUNT(inv.id_dispositivo) AS cantidad_dispositivos,
      CAST(SUM(d.peso_kg) AS DECIMAL(10,2)) AS peso_acumulado_kg,
      CAST((COUNT(inv.id_dispositivo) * 100.0) / ca.capacidad_max_unidades AS DECIMAL(5,2)) AS pct_ocupacion_centro
  FROM INVENTARIO inv
  INNER JOIN CENTRO_ACOPIO ca ON inv.id_centro = ca.id_centro
  INNER JOIN DISPOSITIVO d ON inv.id_dispositivo = d.id_dispositivo
  INNER JOIN HISTORIAL_ESTADO he ON d.id_dispositivo = he.id_dispositivo AND he.fecha_fin IS NULL
  INNER JOIN ESTADO_DISPOSITIVO ed ON he.id_estado = ed.id_estado
  GROUP BY ca.codigo_centro, ca.nombre, ed.nombre, ca.capacidad_max_unidades
  ORDER BY ca.nombre, cantidad_dispositivos DESC;
  ```

#### Consulta C: Dispositivos por Categoría y Clasificación Técnica
- **Objetivo:** Balance de caracterización de los RAEE diagnosticados, con número de aparatos, peso promedio y peso total por categoría y dictamen ambiental.
- **SQL Resumido:**
  ```sql
  SELECT 
      cat.nombre AS categoria_raee, ct.nombre AS clasificacion_tecnica,
      COUNT(d.id_dispositivo) AS total_equipos_evaluados,
      CAST(AVG(d.peso_kg) AS DECIMAL(8,2)) AS peso_promedio_kg,
      CAST(SUM(d.peso_kg) AS DECIMAL(10,2)) AS peso_total_kg
  FROM DISPOSITIVO d
  INNER JOIN MODELO_DISPOSITIVO m ON d.id_modelo = m.id_modelo
  INNER JOIN CATEGORIA_DISPOSITIVO cat ON m.id_categoria = cat.id_categoria
  INNER JOIN EVALUACION_TECNICA et ON d.id_dispositivo = et.id_dispositivo
  INNER JOIN CLASIFICACION_TECNICA ct ON et.id_clasificacion = ct.id_clasificacion
  GROUP BY cat.nombre, ct.nombre
  ORDER BY cat.nombre, total_equipos_evaluados DESC;
  ```

#### Consulta D: Porcentaje de Dispositivos con la Trazabilidad Cerrada (Con Subconsulta)
- **Objetivo:** Computar el índice de éxito de economía circular mediante **subconsultas escalares** (`COUNT(DESTINO_FINAL) / COUNT(DISPOSITIVO) * 100`) y desglose correlacionado por categoría.
- **SQL Resumido:**
  ```sql
  -- Resumen Ejecutivo Global con Subconsultas:
  SELECT 
      (SELECT COUNT(*) FROM DISPOSITIVO) AS total_dispositivos_sistema,
      (SELECT COUNT(*) FROM DESTINO_FINAL) AS total_dispositivos_cerrados,
      (SELECT COUNT(*) FROM DISPOSITIVO) - (SELECT COUNT(*) FROM DESTINO_FINAL) AS total_dispositivos_en_proceso,
      CAST(
          (CAST((SELECT COUNT(*) FROM DESTINO_FINAL) AS DECIMAL(10,2)) * 100.0) 
          / NULLIF((SELECT COUNT(*) FROM DISPOSITIVO), 0)
          AS DECIMAL(5,2)
      ) AS porcentaje_trazabilidad_cerrada_pct;
  ```

#### Consulta E: Dispositivos Recibidos que Aún No Tienen Evaluación Técnica
- **Objetivo:** Monitorear el cuello de botella de recepción mediante un `LEFT JOIN ... WHERE et.id_evaluacion IS NULL`, calculando la antigüedad en días desde la recepción del lote.
- **SQL Resumido:**
  ```sql
  SELECT 
      d.id_dispositivo, d.codigo_qr, cat.nombre AS categoria,
      CONCAT(ma.nombre, ' ', m.nombre) AS equipo,
      cd.nombre AS condicion_entrega, d.peso_kg, l.codigo_lote,
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
  LEFT JOIN EVALUACION_TECNICA et ON d.id_dispositivo = et.id_dispositivo
  WHERE et.id_evaluacion IS NULL
  ORDER BY dias_espera_evaluacion DESC, d.id_dispositivo ASC;
  ```

---

# PUNTO 5: DECLARACIÓN ÉTICA DE USO DE INTELIGENCIA ARTIFICIAL

En concordancia con las directrices académicas de la **Universidad Internacional del Ecuador (UIDE)** y los lineamientos de integridad científica de **Arizona State University (ASU)**, los estudiantes declaramos de forma transparente el alcance y los fines del uso de herramientas de Inteligencia Artificial Generativa durante el desarrollo de la presente entrega:

| **ASPECTO** | **DESCRIPCIÓN DECLARADA** |
| :--- | :--- |
| **Herramienta Empleada:** | Antigravity AI (Motor Gemini 2.5 Pro / DeepMind). |
| **Fines Específicos de Asistencia:** | 1. **Generación de Datos Sintéticos:** Asistencia en la redacción masiva de tuplas de prueba plausibles para hardware real (32 equipos con especificaciones técnicas detalladas y trazabilidad temporal coherente).<br>2. **Validación de Sintaxis T-SQL:** Cotejo de sintaxis específica de Microsoft SQL Server (compatibilidad de índices filtrados, funciones de fecha `DATETIME2` y conversiones de agregación numérica).<br>3. **Estructuración del Informe:** Diagramación en tablas Markdown para el diccionario de datos. |
| **Autoría y Responsabilidad Intelectual de los Integrantes:** | 1. **Diseño Conceptual y Lógico:** El grupo concibió y corrigió el modelo EER, resolviendo la clave parcial de la entidad débil `DETALLE_MOVIMIENTO` y purgando los términos comerciales ajenos al proyecto.<br>2. **Normalización Formal:** Las demostraciones matemáticas de dependencias funcionales y la justificación de 3FN/FNBC fueron analizadas y validadas directamente por los estudiantes.<br>3. **Lógica de Negocio y Algoritmia:** La integración de la red logística con el modelo de Flujo Máximo (Edmonds-Karp) y la definición de las políticas de circularidad ambiental fueron concebidas y programadas por el equipo de trabajo. |

---

### FIRMAS DE RESPONSABILIDAD:

<br><br>
_____________________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; _____________________________________
**DANIEL PAZMIÑO** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **MATIAS HERRERA**
Estudiante – UIDE / ASU &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Estudiante – UIDE / ASU

<br><br>
_____________________________________
**IHAIR LLAMUCA**
Estudiante – UIDE / ASU
