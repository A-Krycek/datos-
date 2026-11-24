# Reporte de Despliegue y Gestión de Procesos – Backend ECORAEE

**Fecha:** 23 de noviembre de 2026  
**Entorno:** Instancia EC2 Ubuntu (`ip-172-31-12-142`)  
**Componente:** Prototipo de Software ECORAEE (`05_PROTOTIPO_SOFTWARE_ECORAEE`)  

---

## 1. Objetivo
Actualizar el código fuente del repositorio en el servidor de producción, reiniciar el servicio backend desarrollado en FastAPI/Uvicorn y migrar la gestión del proceso hacia **PM2** para garantizar persistencia, monitoreo de logs y reinicios simplificados.

---

## 2. Actividades Realizadas

### Sincronización del Repositorio (Git)
* **Ubicación en el directorio local del proyecto:** `~/datos-`
* **Ejecución:** `git pull origin main` (actualización fast-forward del commit `d1d780e` al `5e76442`), incorporando cambios en:
  * Módulos de base de datos (`app/database.py`).
  * Seguridad y autenticación dual JWT (`app/security.py`).
  * Enrutadores con soporte REST completo (`app/routers/devices.py`).
  * Esquemas Pydantic / DTOs (`app/schemas/dtos.py`).
  * Suite de pruebas automatizadas (`test_api_plan.py`).
  * Archivos estáticos del frontend unificado (`frontend/vanilla/`).

### Diagnóstico y Detención del Proceso Anterior
* Al intentar reiniciar vía `systemd` (`ecoraee.service`), se verificó que el servicio no estaba registrado como unidad del sistema.
* Mediante inspección de procesos (`ps aux`), se identificó la instancia activa de `uvicorn` corriendo directamente desde el entorno virtual (`venv`) en el puerto 8000 (PID inicial 5182).
* Se detuvo el proceso manualmente (`kill`) para liberar el puerto 8000 antes de la migración.

### Migración a Gestión con PM2 (npm)
* Instalación de Node.js, npm y el gestor de procesos PM2 de forma global:
  ```bash
  sudo npm install -g pm2
  ```
* Inicialización del servidor ASGI apuntando al binario del entorno virtual:
  ```bash
  pm2 start ./venv/bin/uvicorn --name "ecoraee" -- app.main:app --host 0.0.0.0 --port 8000
  ```
* Configuración de persistencia ante reinicios del sistema operativo mediante:
  ```bash
  pm2 save
  pm2 startup
  ```

---

## 3. Estado Actual y Operación

* **Estado del servicio:** Activo y escuchando en `http://0.0.0.0:8000` bajo el identificador `ecoraee` en PM2.
* **Frontend montado:** Disponible en `http://0.0.0.0:8000/app`.
* **Documentación OpenAPI (Swagger):** Disponible en `http://0.0.0.0:8000/docs`.

### Flujo Estándar de Actualización Futura
Para futuras actualizaciones de código en el servidor EC2 de producción, el procedimiento estándar simplificado es:

```bash
# 1. Acceder al directorio y sincronizar cambios
cd ~/datos- && git pull origin main

# 2. Reiniciar el servicio en PM2
pm2 restart ecoraee

# 3. Verificación de estado y logs
pm2 status
pm2 logs ecoraee
```
