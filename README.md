# EcoRAEE Cloud - Repositorio Oficial
Plataforma Cloud de Gestión, Trazabilidad y Optimización de RAEE (Residuos de Aparatos Eléctricos y Electrónicos) bajo Modelo de Economía Circular en Quito, Ecuador.

---

## 👥 Equipo de Trabajo (UIDE / ASU)
* **Daniel Pazmiño**
* **Matias Herrera**
* **Ihair Llamuca**

**Docente:** Ing. María del Carmen Salazar Torres  
**Semestre:** Quinto Semestre – Período Académico 2026  
**Carrera:** Ingeniería en Tecnologías de la Información / Sistemas  

---

## 📁 Estructura del Repositorio

* **`00_INSTRUCCIONES_Y_PLAN_DE_TRABAJO/`**: Plan de trabajo colaborativo para 3 integrantes (`PLAN_TRABAJO_3_INTEGRANTES_ECORAEE.md`) y retroalimentación docente del 19 de octubre.
* **`01_ENTREGA_FASE2_SQL_SERVER/`**: Scripts T-SQL oficiales (`01_DDL.sql`, `02_DML.sql`, `03_pruebas.sql`, `04_consultas.sql`), diccionario de datos y documento de entrega formal (`DOCUMENTO_ENTREGA_FASE2_BDD.docx`).
* **`02_MODELO_CONCEPTUAL_Y_EER_APROBADO/`**: Diagrama Entidad-Relación extendido (EER) corregido y aprobado.
* **`03_MATEMATICA_Y_OPTIMIZACION_RED_LOGISTICA/`**: Formalización matemática del problema de flujo en redes y script ejecutable del algoritmo de Edmonds-Karp (`edmonds_karp.py`).
* **`04_ARQUITECTURA_CLOUD_AWS/`**: Blueprint de arquitectura en la nube para cuenta personal económica y plantilla CloudFormation (`02_cloudformation_ecoraee.yaml`).
* **`05_PROTOTIPO_SOFTWARE_ECORAEE/`**:
  * `backend/`: API REST modular desarrollada en FastAPI con autenticación JWT, registro de dispositivos QR y endpoint de optimización de red.
  * `frontend/`: Aplicación web SPA con panel de control, escáner, línea de tiempo y visualización del grafo de transporte.

---

## 🚀 Puesta en Marcha Rápida (Base de Datos)
1. Abrir **SQL Server Management Studio (SSMS)** o **Azure Data Studio**.
2. Ejecutar `01_ENTREGA_FASE2_SQL_SERVER/01_DDL.sql` para crear la base de datos `BD_ECORAEE_CLOUD` y las 30 tablas con sus restricciones.
3. Ejecutar `01_ENTREGA_FASE2_SQL_SERVER/02_DML.sql` para poblar los 32 dispositivos y los 4 ciclos completos de economía circular.
4. Ejecutar `01_ENTREGA_FASE2_SQL_SERVER/03_pruebas.sql` para verificar el rechazo de las 5 violaciones de integridad relacional.
5. Ejecutar `01_ENTREGA_FASE2_SQL_SERVER/04_consultas.sql` para visualizar los reportes analíticos avanzados.
