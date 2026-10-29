# EcoRAEE Cloud — Backend API REST (FastAPI)
**Universidad Internacional del Ecuador (UIDE) / Arizona State University (ASU)**  
**Proyecto Integrador — Quinto Semestre**

API REST modular de alto rendimiento para la gestión del ciclo de vida, trazabilidad inmutable y optimización de flujo de residuos electrónicos.

---

## 1. Arquitectura y Tecnologías
* **Framework:** FastAPI (Python 3.10+) con tipado estricto Pydantic V2.
* **Persistencia:** SQLAlchemy 2.0 ORM conectado a **PostgreSQL 16 en Amazon RDS** (o SQLite local para pruebas rápidas).
* **Seguridad:** Autenticación JWT y Control de Acceso Basado en Roles (RBAC).
* **Optimización Matemática:** Integración nativa del algoritmo **Edmonds-Karp (Ford-Fulkerson)** para flujo máximo y corte mínimo.
* **Documentación Interactiva:** OpenAPI / Swagger UI en `/docs`.

---

## 2. Estructura del Módulo Backend
```
backend/
├── app/
│   ├── config.py             # Configuración centralizada de entorno
│   ├── database.py           # Conexión SQLAlchemy y generador get_db()
│   ├── security.py           # Hashes, tokens JWT y validador de roles RBAC
│   ├── main.py               # Instancia FastAPI y registro de routers
│   ├── models/
│   │   └── entities.py       # Modelos ORM (21 entidades del EER aprobado)
│   ├── schemas/
│   │   └── dtos.py           # Esquemas Pydantic de entrada y salida
│   └── routers/
│       ├── auth.py           # Login y verificación de perfiles (CP-01)
│       ├── devices.py        # Registro, consulta QR y cambio de estado (CP-02, CP-03, CP-14)
│       └── network.py        # Optimización de flujo logístico Edmonds-Karp (CP-09)
├── .env.example              # Plantilla de variables de entorno
└── requirements.txt          # Dependencias del proyecto
```

---

## 3. Instrucciones de Ejecución Local

1. **Crear y activar entorno virtual:**
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   # En Linux/Mac:
   source venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configurar variables de entorno:**
   Copiar `.env.example` a `.env` y ajustar la cadena de conexión a PostgreSQL. Si no se tiene PostgreSQL activo localmente, configurar:
   ```env
   DATABASE_URL=sqlite:///./ecoraee_dev.db
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```
   * **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
   * **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 4. Matriz de Casos de Prueba Implementados en la API

| Endpoint | Método | Caso de Prueba Oficial | Criterio de Aceptación Verificado |
| :--- | :---: | :---: | :--- |
| `/api/v1/auth/login` | `POST` | **CP-01** (Acceso por Rol) | Emite JWT con el rol del usuario; valida credenciales correctas e incorrectas. |
| `/api/v1/devices` | `POST` | **CP-02** (Registro y Lote) | Inserta dispositivo en inventario y bloquea códigos QR duplicados (`HTTP 409`). |
| `/api/v1/devices/{qr}/transition-state` | `POST` | **CP-03** (Transición Estado) | Actualiza el ciclo de vida, sella fecha fin del estado previo y genera secuencia inmutable. |
| `/api/v1/devices/{qr}` | `GET` | **CP-14** (Trazabilidad) | Retorna todo el historial ordenado cronológicamente desde el ingreso hasta el destino final. |
| `/api/v1/network/optimize-flow` | `GET` | **CP-09** (Integración Matemática) | Ejecuta Edmonds-Karp sobre las aristas de la BD, calculando flujo máximo y corte mínimo. |
