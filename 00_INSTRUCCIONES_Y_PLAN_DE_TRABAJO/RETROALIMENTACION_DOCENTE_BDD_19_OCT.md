# RETROALIMENTACIÓN OFICIAL Y PLAN DE CORRECCIÓN — MODELO EER (BDD)
**Institución:** Universidad Internacional del Ecuador (UIDE) / Arizona State University (ASU)  
**Asignatura:** Sistemas de Gestión de Base de Datos (05-SIN-A)  
**Docente:** Ing. María del Carmen Salazar Torres, Mgtr. (`mcsalazarto@uide.edu.ec`)  
**Fecha de Retroalimentación:** Lunes, 19 de octubre de 2026, 08:59  
**Estudiantes:** Daniel Fernando Pazmiño Mera, Matias Nicolas Herrera Cueva, Ihair Geordano Llamuca López  
**Documento Evaluado:** [Proyecto Integrador Fase 1.pdf](file:///c:/Users/airy/Downloads/Carpeta%20con%20todos%20los%20avances%20y%20contexto%20actual%20de%20proyecto/Proyecto%20Integrador%20Fase%201.pdf) / [diagrama entidad relacion actual.pdf](file:///c:/Users/airy/Downloads/Carpeta%20con%20todos%20los%20avances%20y%20contexto%20actual%20de%20proyecto/diagrama%20entidad%20relacion%20actual.pdf)

---

## 1. Transcripción Verbatim del Comentario Docente

> **Comentario de la Docente en Plataforma:**  
> *"Estimado Grupo, buen trabajo. El modelo EER es muy completo: cubre todos los dominios del proyecto, tiene claves primarias subrayadas, claves secundarias con (AK), relaciones con nombre y cardinalidad mínima y máxima, especializaciones de Persona y Dispositivo, y no incluye claves foráneas ni tipos de datos. Les sugiero agregar una clave parcial a DETALLE_MOVIMIENTO, que está como entidad débil pero no muestra qué atributo la identifica dentro de su movimiento. También les sugiero revisar el texto del PDF: menciona clientes, productos, precios, facturas y pedidos, que no son dominios de EcoRAEE Cloud. La nota baja por la clave parcial que falta."*

---

## 2. Análisis Técnico de la Evaluación

### 2.1. Aspectos Validados Positivamente por la Docente (Cumplimiento de Rúbrica)
* **Cobertura Total:** Cubre íntegramente la arquitectura de información del caso de estudio de economía circular.
* **Notación Chen Rigurosa:**
  * Claves primarias (PK) correctamente identificadas con **subrayado continuo**.
  * Claves alternativas / secundarias identificadas explícitamente con la notación **`(AK)`**.
  * Vínculos relacionales modelados mediante rombos con **verbos descriptivos** y especificación explícita de cardinalidad mínima y máxima `(min, max)`.
  * Especializaciones de herencia completas para `PERSONA` (Natural y Jurídica) y `DISPOSITIVO` (Computadora, Monitor, Tablet, Teléfono, Router, Otros).
  * **Pureza Conceptual:** Exclusión estricta de tipos de datos físicos (`VARCHAR`, `INT`, etc.) y de claves foráneas (`FK`), las cuales corresponden exclusivamente al modelo relacional lógico.

### 2.2. Observación 1: Falta de Clave Parcial en `DETALLE_MOVIMIENTO` (Causa de Disminución de Calificación)
* **Diagnóstico Teórico:**  
  En el modelo Entidad-Relación Extendido (EER) bajo notación de Peter Chen, una **entidad débil** (`weak entity`) no puede identificarse por sus propios atributos y depende en existencia e identificación de una entidad fuerte propietaria.
  * `DETALLE_MOVIMIENTO` fue graficada con **doble rectángulo**, conectada a `MOVIMIENTO` mediante el rombo doble `CONTIENE_DETALLE`.
  * Sin embargo, para ser formalmente válida, **toda entidad débil debe poseer una Clave Parcial o Discriminador**, representada mediante una elipse con **subrayado discontinuo / punteado** (`dashed underline`).
  * En el diagrama entregado, `DETALLE_MOVIMIENTO` solo poseía el atributo descriptivo `peso_kg_transferido`, careciendo del discriminador que identifique cada ítem dentro del movimiento logístico padre.

* **Solución Metodológica:**
  1. En el archivo fuente editable de Draw.io (`diagrama.xml`):
     * Agregar a `DETALLE_MOVIMIENTO` el atributo discriminador **`numero_linea`** (o **`secuencia_item`**), formateado con **subrayado discontinuo**.
     * Alternativamente, si cada línea de flete transporta un dispositivo individualizado, definir el atributo discriminador **`id_dispositivo`** con subrayado discontinuo.
  2. En el Modelo Lógico Relacional:
     * La clave primaria compuesta resultante es:
       $$\text{PK}(\text{DETALLE\_MOVIMIENTO}) = \{\underline{id\_movimiento}, \underline{numero\_linea}\} \quad \text{o} \quad \{\underline{id\_movimiento}, \underline{id\_dispositivo}\}$$

---

### 2.3. Observación 2: Inconsistencia Textual en el Reporte PDF (Términos Comerciales Ajenos al Dominio)
* **Diagnóstico:**  
  En la página 1 del documento entregado ([Proyecto Integrador Fase 1.pdf](file:///c:/Users/airy/Downloads/Carpeta%20con%20todos%20los%20avances%20y%20contexto%20actual%20de%20proyecto/Proyecto%20Integrador%20Fase%201.pdf)), en la sección **"2. Dominios de Datos Requeridos"**, se incluyó textualmente el enunciado de una plantilla genérica de comercio tradicional:
  > *"• Clientes y Entidades Comerciales: Información general, datos de contacto, identificaciones fiscales/legales y direcciones.*  
  > *• Catálogo de Productos y Categorías: Artículos, familias/categorías, precios base y especificaciones técnicas.*  
  > *• Transacciones e Inventario: Documentos de cabecera/detalle (facturas, pedidos), movimientos de stock y estados transaccionales."*

  La docente observa acertadamente que en **EcoRAEE Cloud NO existen clientes que compran, ni productos con precios de venta, ni pedidos o facturas comerciales**, sino un ecosistema académico de **Economía Circular y Gestión de RAEE**.

---

## 3. Texto Corregido Oficial para el Documento PDF (Reemplazo Inmediato)

A continuación se presenta la redacción corregida de la **Sección 2**, lista para ser incorporada en el informe de entrega y en la memoria técnica del proyecto:

```markdown
### 2. Dominios de Datos Requeridos del Ecosistema EcoRAEE Cloud

El modelo conceptual EER modela con precisión matemática y ontológica la totalidad de los dominios del ciclo de vida de los residuos electrónicos en el campus universitario:

1. **Usuarios, Empleados y Seguridad (RBAC):**
   * Gestión de credenciales seguras, cuentas de acceso y asignación de privilegios según el rol institucional (`ROL_ADMIN`, `ROL_OPERADOR`, `ROL_TECNICO`, `ROL_LOGISTICA`, `ROL_AUDITOR`).

2. **Generadores y Actores de la Economía Circular:**
   * Entidades originadoras de residuos (Facultades, Laboratorios y Departamentos de la UIDA como generadores institucionales; estudiantes y docentes como generadores comunitarios).
   * Actores externos receptores: Gestores ambientales de reciclaje calificados por el MAATE y Organizaciones Comunitarias/Educativas beneficiarias de donaciones.

3. **Catálogo de Hardware y Clasificación Técnica de RAEE:**
   * Caracterización de modelos, marcas y especialización por categorías tecnológicas (`COMPUTADORA`, `MONITOR`, `TABLET`, `TELEFONO`, `ROUTER`, `OTROS`).
   * Registro de condición física inicial y dictamen de evaluación técnica especializada (`REUTILIZABLE`, `REPARABLE`, `RECICLABLE`, `NO_RECUPERABLE`), regulando la aptitud para donación social o despiece industrial.

4. **Operaciones de Recepción, Logística y Trazabilidad Inmutable:**
   * Solicitudes de recolección y lotes agrupados de entrega.
   * Inventario georreferenciado por centro de acopio, bodegas, pasillos y estanterías físicas.
   * Documentos de transferencia logística con estructura cabecera/detalle (`MOVIMIENTO` y `DETALLE_MOVIMIENTO`), garantizando el balance de masa en kilogramos transferidos.
   * Órdenes de trabajo, tratamientos de mantenimiento/reparación y canibalización de componentes funcionales.
   * Cierre formal de trazabilidad con actas firmadas y manifiestos de disposición final vinculados a evidencias digitales en almacenamiento seguro S3.
```

---

## 4. Matriz de Trazabilidad de la Corrección

| Elemento Observado | Causa Raíz | Acción Correctiva Concreta | Estado |
| :--- | :--- | :--- | :---: |
| **Clave Parcial en `DETALLE_MOVIMIENTO`** | Omisión de elipse con subrayado discontinuo en notación Chen. | Agregar en Draw.io el atributo `numero_linea` (subrayado discontinuo) conectado a `DETALLE_MOVIMIENTO`. | **Solucionado en Especificación / Pendiente Exportar PNG/PDF** |
| **Texto de Dominios en Reporte PDF** | Uso literal del temario/rúbrica genérica en lugar del contexto de EcoRAEE. | Sustituir sección 2 del PDF por los 4 dominios reales de EcoRAEE Cloud (Generadores, RAEE, Lotes/Movimientos, Dictámenes). | **Texto redactado y aprobado** |
| **Script Físico SQL** | Verificación de clave primaria en DDL. | En `01_postgresql_ddl.sql`, la clave de `DETALLE_MOVIMIENTO` es compuesta `PRIMARY KEY (id_movimiento, id_dispositivo)`. Opcionalmente se añade `numero_linea INT NOT NULL`. | **Consistente** |
