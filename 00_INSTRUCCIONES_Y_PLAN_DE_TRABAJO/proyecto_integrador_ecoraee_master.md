# ECO RAEE CLOUD — MASTER PROJECT KNOWLEDGE BASE & WORKSPACE CONSOLIDATION

**Institución:** Universidad Internacional de América (UIDA) / Universidad Internacional del Ecuador (UIDE)  
**Programa:** Ingeniería en Sistemas de Información — Quinto Semestre  
**Proyecto:** Plataforma Cloud para la Gestión, Trazabilidad y Optimización de Residuos Electrónicos en un Ecosistema de Economía Circular  
**Contexto Operativo:** Campus universitario único en Quito, Pichincha. Gestión integral de RAEE institucionales y de la comunidad universitaria.

---

## 1. MATRIZ DE ARTICULACIÓN CURRICULAR Y ESTADO GENERAL DE ACTIVIDADES

| Asignatura | Alcance y Contribución | Hito / Tarea | Estado Actual |
| :--- | :--- | :--- | :---: |
| **Sistemas de Gestión de Bases de Datos** | Modelo conceptual EER, Lógico 3FN, Diccionario de Datos, Script Físico SQL. | 1. Modelo Conceptual EER (Draw.io en Chen estricto). Retroalimentación recibida el 19/Oct/2026: observaciones sobre clave parcial en `DETALLE_MOVIMIENTO` y corrección de dominios en reporte PDF. | **EVALUADO / CORRECCIÓN EN MARCHA** |
| | | 2. Corrección de carátula ("Sistemas de Gestión de Bases de Datos", eliminación de "Seguridad"). | **COMPLETADO** |
| | | 3. Demostración formal de normalización (1FN, 2FN, 3FN / BCNF con dependencias funcionales). | **COMPLETADO** |
| | | 4. Diccionario de datos normalizado (21 tablas documentadas con reglas RN-01 a RN-08). | **COMPLETADO** |
| | | 5. Script Físico DDL SQL Server / PostgreSQL (corrección de índices duplicados y filtered index para IMEI). | **COMPLETADO** |
| **Arquitectura en la Nube (AWS)** | Arquitectura VPC, cómputo EC2, base RDS, evidencias S3, observabilidad y gobierno IAM. | 1. Definición estándar de nombres de recursos y ARNs (`ecoraee-evidencias-storage`, `ecoraee-backend-app`, etc.). | **COMPLETADO** |
| | | 2. Parte 2: Organización IAM, usuarios, 5 grupos de mínimo privilegio, políticas gestionadas y Service Role EC2. | **COMPLETADO** |
| | | 3. Generación de Prompt para IA de Lucidchart y prototipo HTML interactivo. | **COMPLETADO** |
| | | 4. Parte 1: Diagrama de red en Lucidchart (VPC, subredes públicas/privadas, IGW, NAT, ALB, EC2, RDS, S3). | **EN PROGRESO / PENDIENTE DE ENSAMBLE FINAL** |
| | | 5. Plantillas de Infraestructura como Código (CloudFormation / Terraform). | **PENDIENTE** |
| **Arquitectura Empresarial e Industrial** | Línea base AS-IS, arquitectura objetivo TO-BE, brechas TOGAF, procesos BPMN y gobierno ARB. | 1. Diagnóstico y Arquitectura Empresarial AS-IS (Línea Base UIDA, matrices de problemas P-01 a P-06, capacidades, procesos D1 a D8). | **COMPLETADO (Fase 1 Documentada)** |
| | | 2. Modelado de Arquitectura Objetivo TO-BE y Matriz de Brechas (Gap Analysis). | **PENDIENTE (Parcial 2)** |
| | | 3. Procesos BPMN detallados TO-BE y Acta de Gobierno ARB. | **PENDIENTE (Parcial 2)** |
| **Estructuras Matemáticas Discretas** | Formalización lógica, teoría de conjuntos y funciones, grafo dirigido $G=(V,E)$, algoritmo Edmonds-Karp. | 1. RF-MD-01: Formalización de 5 reglas de negocio nucleares en lógica proposicional con tablas de verdad. | **COMPLETADO** |
| | | 2. RF-MD-02: Definición formal de conjuntos, relaciones binarias y funciones matemáticas. | **EN PROGRESO** |
| | | 3. RF-MD-03: Modelado matemático del grafo $G=(V,E)$ y capacidades $c(u,v)$. | **PENDIENTE** |
| | | 4. RF-MD-04 & RF-MD-05: Algoritmo de flujo máximo / corte mínimo en Python y validación de 2 escenarios. | **PENDIENTE** |
| **Innovación en la Sociedad** | Análisis socio-técnico, mapa de poder, justicia ambiental, dilemas éticos y pitch en inglés. | 1. Identificación de actores vulnerables, asimetrías de poder y riesgos de exclusión. | **PENDIENTE** |
| | | 2. Diseño de intervención innovadora, métricas de impacto y pitch de 5 minutos en inglés. | **PENDIENTE** |
| **Integración MVP** | Aplicación web full-stack con trazabilidad de extremo a extremo. | 1. Backend API REST en Python con FastAPI. | **PENDIENTE** |
| | | 2. Frontend SPA en React / Vanilla JS publicado en Amazon S3. | **PENDIENTE** |

---

## 2. REGLAS DE NEGOCIO FORMALIZADAS (RF-MD-01)

### Regla 1: Restricción de Donación a Beneficiarios (RN-04)
*Enunciado:* Un dispositivo clasificado como no recuperable no puede asignarse a un beneficiario.
* Proposiciones:
  * $p$: El dispositivo posee la clasificación técnica `NO_RECUPERABLE`.
  * $q$: La solicitud de destino final registrada corresponde a `BENEFICIARIO`.
  * $r$: El sistema autoriza y registra formalmente la salida definitiva del dispositivo.
* Formalización:
  $$(p \land q) \rightarrow \neg r \quad \equiv \quad r \rightarrow \neg(p \land q)$$
* Tabla de Verdad:
  $$\begin{array}{|c|c|c|c|c|c|}
  \hline
  p & q & r & p \land q & \neg r & (p \land q) \rightarrow \neg r \\
  \hline
  \text{V} & \text{V} & \text{V} & \text{V} & \text{F} & \mathbf{F} \quad (\text{Violación de regla}) \\
  \text{V} & \text{V} & \text{F} & \text{V} & \text{V} & \mathbf{V} \quad (\text{Bloqueo exitoso de donación de chatarra}) \\
  \text{V} & \text{F} & \text{V} & \text{F} & \text{F} & \mathbf{V} \quad (\text{Salida permitida a reciclaje/disposición}) \\
  \text{V} & \text{F} & \text{F} & \text{F} & \text{V} & \mathbf{V} \\
  \text{F} & \text{V} & \text{V} & \text{F} & \text{F} & \mathbf{V} \quad (\text{Equipo reparado/reutilizable donado}) \\
  \text{F} & \text{V} & \text{F} & \text{F} & \text{V} & \mathbf{V} \\
  \text{F} & \text{F} & \text{V} & \text{F} & \text{F} & \mathbf{V} \\
  \text{F} & \text{F} & \text{F} & \text{F} & \text{V} & \mathbf{V} \\
  \hline
  \end{array}$$

### Regla 2: Evaluación Técnica Exclusiva por Personal Autorizado (RN-02)
*Enunciado:* Solo un técnico autorizado puede registrar una evaluación o cambiar la clasificación técnica.
* Proposiciones:
  * $p$: El usuario autenticado posee el rol activo de `TECNICO_DIAGNOSTICO`.
  * $q$: El usuario solicita registrar o modificar la evaluación/clasificación.
  * $r$: El sistema procesa y persiste la evaluación técnica.
* Formalización:
  $$(p \land q) \leftrightarrow r$$
* Condición de Validación: Se bloquea la persistencia si $p=\text{F}$ o si no existe petición formal ($q=\text{F}$).

### Regla 3: Cierre de Movimiento Logístico con Trazabilidad Completa (RN-03)
*Enunciado:* Un movimiento no puede cerrarse si origen, destino, responsable o evidencia están incompletos.
* Proposiciones:
  * $a$: Registra centro de origen válido.
  * $b$: Registra centro de destino válido ($origen \neq destino$).
  * $c$: Empleado responsable debidamente asignado.
  * $d$: Existe al menos una evidencia documental o fotografía vinculada en almacenamiento.
  * $C$: El sistema marca el movimiento como `CERRADO` / `ENTREGADO`.
* Formalización:
  $$(a \land b \land c \land d) \leftrightarrow C$$

### Regla 4: Integridad de Capacidad en Rutas de Transporte (RN-05)
*Enunciado:* La cantidad transferida por una arista no puede superar su capacidad disponible.
* Proposiciones:
  * $p$: $\text{flujo}(u,v) \le \text{capacidad}(u,v)$.
  * $q$: La arista $(u,v)$ está activa en el escenario logístico.
  * $r$: El sistema autoriza la programación del traslado.
* Formalización:
  $$(p \land q) \leftrightarrow r$$

### Regla 5: Cierre Definitivo del Ciclo de Vida del RAEE (RN-08)
*Enunciado:* El cierre de trazabilidad requiere un destino final confirmado y una fecha de confirmación.
* Proposiciones:
  * $p$: El dispositivo tiene asociado un registro en `DESTINO_FINAL`.
  * $q$: $fecha\_confirmacion \neq \text{NULL}$.
  * $r$: El dispositivo pasa a estado terminal `TRAZABILIDAD_CERRADA`.
* Formalización:
  $$(p \land q) \leftrightarrow r$$

---

## 3. ARQUITECTURA DE DATOS: MODELO CONCEPTUAL Y LÓGICO

### 3.0. Retroalimentación Oficial Docente (Ing. María del Carmen Salazar Torres - 19/Oct/2026)
* **Canal y Fecha:** Plataforma académica UIDE, Lunes 19 de octubre de 2026 a las 08:59.
* **Comentario Textual:**
  > *"Estimado Grupo, buen trabajo. El modelo EER es muy completo: cubre todos los dominios del proyecto, tiene claves primarias subrayadas, claves secundarias con (AK), relaciones con nombre y cardinalidad mínima y máxima, especializaciones de Persona y Dispositivo, y no incluye claves foráneas ni tipos de datos. Les sugiero agregar una clave parcial a DETALLE_MOVIMIENTO, que está como entidad débil pero no muestra qué atributo la identifica dentro de su movimiento. También les sugiero revisar el texto del PDF: menciona clientes, productos, precios, facturas y pedidos, que no son dominios de EcoRAEE Cloud. La nota baja por la clave parcial que falta."*
* **Acciones Correctivas Obligatorias:**
  1. **Clave Parcial en `DETALLE_MOVIMIENTO`:** En el diagrama conceptual EER (Draw.io), incorporar el atributo discriminador `numero_linea` (o `secuencia_item`) con **subrayado discontinuo (dashed line)** vinculado a `DETALLE_MOVIMIENTO`.
  2. **Depuración Textual del PDF de Entrega (Sección 2):** Eliminar conceptos comerciales genéricos ("clientes, precios, facturas, pedidos") y formalizar los 4 dominios reales de **EcoRAEE Cloud** (Generadores/Donantes, Catálogo de RAEE y Clasificación Técnica, Gestión Logística/Trazabilidad, Evidencias Digitales y Destino Final).
  3. **Documento Técnico de Soporte:** Generado en [`docs/RETROALIMENTACION_DOCENTE_BDD_19_OCT.md`](file:///c:/Users/airy/Downloads/Carpeta%20con%20todos%20los%20avances%20y%20contexto%20actual%20de%20proyecto/docs/RETROALIMENTACION_DOCENTE_BDD_19_OCT.md).

### 3.1. Correcciones Metodológicas Implementadas
1. **Entidades Débiles en Chen Puro:**
   * `HISTORIAL_ESTADO`: Rectángulo doble, conectado a `DISPOSITIVO` por rombo doble `REGISTRA_HISTORIAL`. Clave parcial: `numero_secuencia` (subrayado discontinuo).
   * `DETALLE_MOVIMIENTO`: Rectángulo doble, conectado a `MOVIMIENTO` por rombo doble `CONTIENE_DETALLE`. Clave parcial: `id_dispositivo`.
2. **Claves Alternas / Secundarias Marcadas con (AK):**
   * `DISPOSITIVO`: `codigo_qr (AK)`, `numero_serie (AK)`.
   * `PERSONA_NATURAL`: `numero_identificacion (AK)`.
   * `PERSONA_JURIDICA`: `ruc (AK)`.
   * `LOTE`: `codigo_lote (AK)`.
   * `CENTRO_ACOPIO`: `codigo_centro (AK)`.
   * `ORDEN_TRABAJO`: `codigo_orden (AK)`.
   * `USUARIO`: `username (AK)`.
   * `EMPLEADO`: `codigo_empleado (AK)`, `correo_institucional (AK)`.
3. **Pureza EER:** Sin tipos de datos físicos (`VARCHAR`, `INT`) ni claves foráneas embebidas en el modelo conceptual.
4. **Articulación Matemática:** Rombo `MAPEA_A` que conecta `CENTRO_ACOPIO` con `NODO_RED`.
5. **Gobernanza Conectada:** `AUDITORIA` asociada a `USUARIO`/`DISPOSITIVO`, `ALERTA` asociada a `INVENTARIO`, e `INDICADOR` asociado a `CENTRO_ACOPIO`.

### 3.2. Demostración Formal de Normalización (1FN, 2FN, 3FN / BCNF)
* **Caso `DETALLE_MOVIMIENTO`:**
  * Clave Primaria: $\{id\_movimiento, id\_dispositivo\}$.
  * Dependencia: $\{id\_movimiento, id\_dispositivo\} \rightarrow peso\_kg\_transferido$.
  * Justificación: `peso_kg_transferido` no repite el `peso_kg` de `DISPOSITIVO`, pues este último es nominal de entrada, mientras que en el detalle representa la carga neta despachada en ese flete específico (pudiendo haber sufrido despiece o embalaje especial). No hay dependencias parciales ni transitivas: 3FN / BCNF cumplida.
* **Caso Catálogo `DISPOSITIVO`:**
  * La separación de `MODELO_DISPOSITIVO` ($\{id\_modelo\} \rightarrow \{nombre, id\_marca, id\_categoria\}$) y `DISPOSITIVO` ($\{id\_dispositivo\} \rightarrow \{codigo\_qr, id\_modelo, \dots\}$) elimina la dependencia transitiva $\{id\_dispositivo\} \rightarrow id\_modelo \rightarrow marca$: 3FN cumplida.

### 3.3. Diccionario de Datos Normalizado (Tablas Centrales)
* **`PERSONA`**: `id_persona` (PK), `correo` (NN), `telefono`, `direccion`, `fecha_registro`, `estado`.
* **`PERSONA_NATURAL`**: `id_persona` (PK/FK), `tipo_identificacion`, `numero_identificacion` (UK), `nombres`, `apellidos`.
* **`PERSONA_JURIDICA`**: `id_persona` (PK/FK), `ruc` (UK), `razon_social`, `nombre_comercial`.
* **`EMPLEADO`**: `id_empleado` (PK), `id_persona` (FK/UK), `codigo_empleado` (UK), `correo_institucional` (UK), `fecha_ingreso`, `estado`.
* **`USUARIO`**: `id_usuario` (PK), `id_empleado` (FK/UK), `username` (UK), `password_hash`, `activo`, `ultimo_acceso`.
* **`CENTRO_ACOPIO`**: `id_centro` (PK), `id_tipo_centro` (FK), `codigo_centro` (UK), `nombre`, `direccion`, `capacidad_max_unidades`, `capacidad_max_kg`, `activo`.
* **`LOTE`**: `id_lote` (PK), `codigo_lote` (UK), `id_generador` (FK), `id_solicitud` (FK opcional), `fecha_registro`, `cantidad_declarada`, `observaciones`.
* **`DISPOSITIVO`**: `id_dispositivo` (PK), `codigo_qr` (UK), `numero_serie`, `id_modelo` (FK), `id_lote` (FK opcional), `peso_kg`, `fecha_registro`, `observaciones`.
* **Especializaciones Subtipo (1:1):**
  * `COMPUTADORA`: `id_dispositivo` (PK/FK), `ram_total_gb`, `almacenamiento_total_gb`.
  * `MONITOR`: `id_dispositivo` (PK/FK), `pulgadas`, `resolucion`, `tipo_panel`.
  * `TABLET`: `id_dispositivo` (PK/FK), `imei` (UK filtrado), `almacenamiento_gb`, `sistema_operativo`.
  * `ROUTER`: `id_dispositivo` (PK/FK), `numero_puertos`, `estandar_wifi`, `velocidad_maxima_mbps`.
  * `TELEFONO`: `id_dispositivo` (PK/FK), `imei` (UK filtrado), `almacenamiento_gb`, `sistema_operativo`.
* **`COMPONENTE`**: `id_componente` (PK), `id_dispositivo_origen` (FK opcional), `id_dispositivo_actual` (FK opcional), `id_tipo_componente` (FK), `marca`, `modelo`, `numero_serie`, `capacidad`, `fecha_registro`, `fecha_extraccion`.
* **`HISTORIAL_ESTADO`**: `id_dispositivo` (PK/FK), `numero_secuencia` (PK discriminador), `id_estado` (FK), `id_usuario` (FK), `fecha_inicio`, `fecha_fin`, `observacion`.
* **`ORDEN_TRABAJO`**: `id_orden` (PK), `codigo_orden` (UK), `id_dispositivo` (FK), `id_responsable` (FK), `id_tipo_trabajo` (FK), `id_estado_orden` (FK), `fecha_apertura`, `fecha_cierre`, `descripcion`, `resultado`.
* **`MOVIMIENTO`**: `id_movimiento` (PK), `id_centro_origen` (FK), `id_centro_destino` (FK), `id_responsable` (FK), `id_estado_movimiento` (FK), `fecha_salida`, `fecha_llegada`, `observaciones`.
* **`DETALLE_MOVIMIENTO`**: `id_movimiento` (PK/FK), `id_dispositivo` (PK/FK), `peso_kg_transferido`.
* **`DESTINO_FINAL`**: `id_destino_final` (PK), `id_dispositivo` (FK/UK), `id_tipo_destino` (FK), `id_receptor` (FK), `fecha_confirmacion`, `observaciones`.
* **`EVIDENCIA`**: `id_evidencia` (PK), `id_tipo_evidencia` (FK), `id_usuario` (FK), `ubicacion_archivo` (URL S3), `fecha_subida`, `descripcion`.
* **Red Matemática:** `NODO_RED`, `ARISTA_RED`, `ESCENARIO_RED`, `ESCENARIO_ARISTA`, `RESULTADO_FLUJO`, `RESULTADO_ARISTA`.
* **Gobernanza:** `AUDITORIA`, `ALERTA`, `INDICADOR`.

---

## 4. MODELO FÍSICO DDL (OPTIMIZADO Y CORREGIDO PARA SQL SERVER / RDS)

```sql
-- DDL AJUSTADO: Eliminación de índice duplicado en codigo_qr y soporte de NULLs en IMEI mediante índices filtrados
-- Tabla TABLET
IF OBJECT_ID('TABLET', 'U') IS NOT NULL DROP TABLE TABLET;
CREATE TABLE TABLET (
    id_dispositivo BIGINT NOT NULL,
    imei VARCHAR(20) NULL,
    almacenamiento_gb INT NOT NULL,
    sistema_operativo VARCHAR(40) NOT NULL,
    CONSTRAINT PK_TABLET PRIMARY KEY (id_dispositivo),
    CONSTRAINT FK_TABLET_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_TABLET_almacenamiento CHECK (almacenamiento_gb > 0)
);
CREATE UNIQUE NONCLUSTERED INDEX UQ_TABLET_imei ON TABLET(imei) WHERE imei IS NOT NULL;

-- Tabla TELEFONO
IF OBJECT_ID('TELEFONO', 'U') IS NOT NULL DROP TABLE TELEFONO;
CREATE TABLE TELEFONO (
    id_dispositivo BIGINT NOT NULL,
    imei VARCHAR(20) NULL,
    almacenamiento_gb INT NOT NULL,
    sistema_operativo VARCHAR(40) NOT NULL,
    CONSTRAINT PK_TELEFONO PRIMARY KEY (id_dispositivo),
    CONSTRAINT FK_TELEFONO_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo) ON DELETE CASCADE,
    CONSTRAINT CK_TELEFONO_almacenamiento CHECK (almacenamiento_gb > 0)
);
CREATE UNIQUE NONCLUSTERED INDEX UQ_TELEFONO_imei ON TELEFONO(imei) WHERE imei IS NOT NULL;

-- Tabla DETALLE_MOVIMIENTO con clave compuesta estricta
IF OBJECT_ID('DETALLE_MOVIMIENTO', 'U') IS NOT NULL DROP TABLE DETALLE_MOVIMIENTO;
CREATE TABLE DETALLE_MOVIMIENTO (
    id_movimiento BIGINT NOT NULL,
    id_dispositivo BIGINT NOT NULL,
    peso_kg DECIMAL(8,2) NOT NULL,
    CONSTRAINT PK_DETALLE_MOVIMIENTO PRIMARY KEY (id_movimiento, id_dispositivo),
    CONSTRAINT FK_DM_MOVIMIENTO FOREIGN KEY (id_movimiento) 
        REFERENCES MOVIMIENTO(id_movimiento) ON DELETE CASCADE,
    CONSTRAINT FK_DM_DISPOSITIVO FOREIGN KEY (id_dispositivo) 
        REFERENCES DISPOSITIVO(id_dispositivo),
    CONSTRAINT CK_DM_peso CHECK (peso_kg > 0)
);

-- Corrección de redundancia de índices:
-- Se omite IX_DISPOSITIVO_codigo_qr porque UQ_DISPOSITIVO_qr crea el índice automáticamente.
CREATE NONCLUSTERED INDEX IX_DISPOSITIVO_numero_serie ON DISPOSITIVO(numero_serie) WHERE numero_serie IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_DISPOSITIVO_id_modelo ON DISPOSITIVO(id_modelo);
CREATE NONCLUSTERED INDEX IX_DISPOSITIVO_id_lote ON DISPOSITIVO(id_lote);
CREATE NONCLUSTERED INDEX IX_INVENTARIO_centro_disp ON INVENTARIO(id_centro, id_dispositivo);
CREATE NONCLUSTERED INDEX IX_EVALUACION_dispositivo ON EVALUACION_TECNICA(id_dispositivo);
CREATE NONCLUSTERED INDEX IX_HISTORIAL_ESTADO_disp ON HISTORIAL_ESTADO(id_dispositivo, numero_secuencia);
CREATE NONCLUSTERED INDEX IX_ORDEN_TRABAJO_dispositivo ON ORDEN_TRABAJO(id_dispositivo);
CREATE NONCLUSTERED INDEX IX_ORDEN_TRABAJO_responsable ON ORDEN_TRABAJO(id_responsable);
CREATE NONCLUSTERED INDEX IX_AUDITORIA_entidad_fecha ON AUDITORIA(entidad_afectada, fecha_hora DESC);
```

---

## 5. ARQUITECTURA EN LA NUBE AWS: IDENTIDADES, ROLES Y MÍNIMO PRIVILEGIO (IAM)

### 5.1. Nombres Estándar de Recursos
* **Bucket S3 (Evidencias y Certificados):** `ecoraee-evidencias-storage`
* **Instancia EC2 Backend:** `ecoraee-backend-app`
* **Base de Datos RDS (PostgreSQL / SQL Server):** `ecoraee-relational-db`
* **Rol IAM de Servicio (Cómputo):** `EcoRAEE-EC2-ExecutionRole`

### 5.2. Matriz de Asignación RBAC
1. **`Infra-Admins`** (`user.infra1`, `user.infra2`):
   * Managed: `AmazonVPCFullAccess`, `AmazonEC2ReadOnlyAccess`.
   * Customer: `EcoRAEE-InfraCompute-Policy` (Permite gestión de EC2/VPC; `Deny` explícito a `rds:*` y borrado en S3).
2. **`DBA-Admins`** (`user.dba1`):
   * Managed: `AmazonRDSReadOnlyAccess`.
   * Customer: `EcoRAEE-DBAManagement-Policy` (Gestión de mantenimiento y snapshots; `Deny` a `rds:DeleteDBInstance` sin snapshot).
3. **`App-Admins`** (`user.appadmin1`):
   * Managed: `AmazonEC2ReadOnlyAccess`, `CloudWatchReadOnlyAccess`.
   * Customer: `EcoRAEE-AppOps-Policy` (Reinicio y configuración vía SSM `SendCommand` sin abrir puerto SSH).
4. **`App-Developers`** (`user.dev1`, `user.dev2`):
   * Managed: `AWSCodeCommitReadOnlyAccess`.
   * Customer: `EcoRAEE-DevLogs-Policy` (Lectura de CloudWatch Logs `/aws/ecoraee/*` y bucket S3 de desarrollo).
5. **`Monitoring-Ops`** (`user.monitor1`, `user.audit1`):
   * Managed: `CloudWatchReadOnlyAccess`, `AWSCloudTrail_ReadOnlyAccess`.
   * Customer: `EcoRAEE-AuditCompliance-Policy` (Auditoría continua de métricas y exportación de reportes de cumplimiento ambiental).

### 5.3. Service Role: `EcoRAEE-EC2-ExecutionRole`
* **Trust Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
* **Customer Policy Adjunta (`EcoRAEE-BackendAccess-Policy`):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3EvidenciasReadWrite",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::ecoraee-evidencias-storage/*"
    },
    {
      "Sid": "AllowS3ListBucketMetadata",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::ecoraee-evidencias-storage"
    },
    {
      "Sid": "AllowCloudWatchTelemetry",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/aws/ecoraee/*"
    }
  ]
}
```

---

## 6. DIAGNÓSTICO AS-IS (ARQUITECTURA EMPRESARIAL - FASE 1)

* **Problemas Centrales Diagnosticados:**
  * `P-01`: Pérdida de trazabilidad del ciclo de vida del dispositivo.
  * `P-02`: Inconsistencia y redundancia de datos por duplicación en hojas de cálculo y papel.
  * `P-03`: Control deficiente de inventario físico y desincronización con bodegas.
  * `P-04`: Alta carga operativa manual en recepción y diagnóstico.
  * `P-05`: Dificultad para auditar y ubicar evidencias fotográficas (fotos en teléfonos personales).
  * `P-06`: Imposibilidad de generar métricas ejecutivas en tiempo real.
* **Procesos Clave Mapeados:**
  * `PRC-01`: Gobernanza y Supervisión.
  * `PRC-02`: Recepción y Registro de Ingreso.
  * `PRC-03`: Evaluación Técnica y Clasificación.
  * `PRC-04`: Almacenamiento y Control de Stock.
  * `PRC-05`: Gestión de Documentación y Evidencias.
  * `PRC-06`: Distribución, Transferencia y Cierre de Caso.
  * `PRC-07`: Consolidación de Métricas e Indicadores.

---

## 7. SIGUIENTES PASOS TÉCNICOS PARA EJECUCIÓN INMEDIATA
1. **Completar RF-MD-02 (Matemática Discreta):** Especificación matemática de Conjuntos ($A, D, C, K, S, T$), Relaciones y Funciones.
2. **Implementar RF-MD-03, RF-MD-04 y RF-MD-05 (Matemática Discreta):** Grafo dirigido $G=(V,E)$ y script en Python del algoritmo de flujo máximo / corte mínimo (**Edmonds-Karp**).
3. **Estructura del Backend (FastAPI):** Configuración de rutas (`/auth`, `/devices`, `/inventory`, `/network`) y conexión ORM a base de datos.
4. **Arquitectura Cloud Parte 1:** Diagrama de red en Lucidchart y plantilla CloudFormation.