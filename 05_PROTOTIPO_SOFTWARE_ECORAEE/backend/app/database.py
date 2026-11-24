import os
import sqlite3
from pathlib import Path

# URL de la base de datos (PostgreSQL RDS o SQLite local)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecoraee_dev.db")

def is_postgres():
    url = os.getenv("DATABASE_URL", DATABASE_URL)
    return url.startswith("postgresql://") or url.startswith("postgres://")

class AdaptableCursor:
    """Cursor que adapta transparentemente consultas SQL estándar entre SQLite (?) y PostgreSQL (%s)."""
    def __init__(self, raw_cursor, is_pg=False):
        self._c = raw_cursor
        self._is_pg = is_pg

    def execute(self, query, params=()):
        if self._is_pg:
            query = query.replace("?", "%s").replace("datetime('now')", "NOW()").replace('datetime("now")', "NOW()")
        if params:
            self._c.execute(query, tuple(params))
        else:
            self._c.execute(query)
        return self

    def executescript(self, script):
        if self._is_pg:
            self._c.execute(script)
        else:
            self._c.executescript(script)
        return self

    def fetchone(self):
        return self._c.fetchone()

    def fetchall(self):
        return self._c.fetchall()

    @property
    def lastrowid(self):
        return getattr(self._c, "lastrowid", None)

class AdaptableConnection:
    """Conexión envoltorio para unificar operaciones de SQLite y PostgreSQL."""
    def __init__(self, raw_conn, is_pg=False):
        self._conn = raw_conn
        self._is_pg = is_pg

    def cursor(self):
        raw_c = self._conn.cursor()
        return AdaptableCursor(raw_c, self._is_pg)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

def get_connection():
    """Retorna una conexión activa a PostgreSQL (RDS) o SQLite nativo."""
    db_url = os.getenv("DATABASE_URL", DATABASE_URL)
    if db_url.startswith("postgresql://") or db_url.startswith("postgres://"):
        import psycopg2
        from psycopg2.extras import RealDictCursor
        raw = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
        return AdaptableConnection(raw, is_pg=True)
    else:
        db_path = Path(__file__).resolve().parent.parent / "ecoraee_dev.db"
        raw = sqlite3.connect(str(db_path), check_same_thread=False)
        raw.row_factory = sqlite3.Row
        return AdaptableConnection(raw, is_pg=False)

def get_db():
    """Generador de conexión para inyección de dependencias en FastAPI."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """
    Inicializa el esquema de tablas en la base de datos (PostgreSQL RDS o SQLite)
    sin requerir ORMs externos como SQLAlchemy.
    """
    conn = get_connection()
    cursor = conn.cursor()

    if is_postgres():
        print("[EcoRAEE BD] Conectando a PostgreSQL RDS en Amazon Web Services...")
        ddl = """
        CREATE TABLE IF NOT EXISTS rol_sistema (
            id_rol_sistema SERIAL PRIMARY KEY,
            codigo VARCHAR(30) UNIQUE NOT NULL,
            nombre VARCHAR(60) UNIQUE NOT NULL,
            descripcion VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS usuario (
            id_usuario SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(30) NOT NULL DEFAULT 'ROL_OPERADOR',
            activo INT DEFAULT 1,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categoria_dispositivo (
            id_categoria SERIAL PRIMARY KEY,
            codigo VARCHAR(30) UNIQUE NOT NULL,
            nombre VARCHAR(80) UNIQUE NOT NULL,
            descripcion VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS centro_acopio (
            id_centro SERIAL PRIMARY KEY,
            codigo_centro VARCHAR(30) UNIQUE NOT NULL,
            nombre VARCHAR(120) NOT NULL,
            direccion VARCHAR(200) NOT NULL,
            capacidad_max_unidades INT DEFAULT 1000,
            capacidad_max_kg DOUBLE PRECISION DEFAULT 5000.0,
            activo INT DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS lote (
            id_lote SERIAL PRIMARY KEY,
            codigo_lote VARCHAR(30) UNIQUE NOT NULL,
            id_generador INT DEFAULT 1,
            cantidad_declarada INT NOT NULL,
            peso_declarado_kg DOUBLE PRECISION,
            observaciones TEXT,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS estado_dispositivo (
            id_estado SERIAL PRIMARY KEY,
            codigo VARCHAR(30) UNIQUE NOT NULL,
            nombre VARCHAR(60) NOT NULL,
            es_terminal INT DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS dispositivo (
            id_dispositivo SERIAL PRIMARY KEY,
            codigo_qr VARCHAR(50) UNIQUE NOT NULL,
            numero_serie VARCHAR(50),
            id_modelo INT DEFAULT 1,
            id_lote INT,
            id_condicion INT DEFAULT 1,
            peso_kg DOUBLE PRECISION NOT NULL,
            observaciones TEXT,
            id_centro_actual INT DEFAULT 1,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS historial_estado (
            id_historial SERIAL PRIMARY KEY,
            id_dispositivo INT NOT NULL,
            numero_secuencia INT NOT NULL,
            id_estado INT NOT NULL,
            id_usuario INT DEFAULT 1,
            fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_fin TIMESTAMP,
            observacion TEXT
        );

        CREATE TABLE IF NOT EXISTS evaluacion_tecnica (
            id_evaluacion SERIAL PRIMARY KEY,
            id_dispositivo INT NOT NULL,
            id_clasificacion INT NOT NULL,
            diagnostico_funcional TEXT,
            diagnostico_estetico TEXT,
            aprobado_reutilizacion INT DEFAULT 0,
            fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS destino_final (
            id_destino SERIAL PRIMARY KEY,
            id_dispositivo INT NOT NULL,
            id_tipo_destino INT NOT NULL,
            entidad_receptora VARCHAR(120) NOT NULL,
            certificado_numero VARCHAR(60) NOT NULL,
            fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            observaciones TEXT
        );
        """
        cursor.executescript(ddl)
        conn.commit()

        # Semilla inicial en RDS si está vacío
        cursor.execute("SELECT COUNT(*) as total FROM centro_acopio")
        row = cursor.fetchone()
        total = row["total"] if isinstance(row, dict) else row[0]
        if total == 0:
            cursor.executescript("""
            INSERT INTO centro_acopio (codigo_centro, nombre, direccion, capacidad_max_unidades, capacidad_max_kg, activo) VALUES
            ('CEN-NORTE-01', 'Centro de Acopio Norte (Quito)', 'Av. Galo Plaza Lasso y Capitán Ramón Borja', 1500, 7500.0, 1),
            ('CEN-SUR-02', 'Centro de Acopio Sur (Quito)', 'Av. Maldonado y Morán Valverde', 1200, 6000.0, 1),
            ('CEN-GYE-01', 'Centro de Acopio Guayaquil', 'Parque Industrial Inmaconsa', 2000, 10000.0, 1);

            INSERT INTO categoria_dispositivo (codigo, nombre, descripcion) VALUES
            ('CAT-PC', 'Computadoras y Laptops', 'Equipos informáticos principales'),
            ('CAT-MON', 'Monitores y Pantallas', 'Displays CRT, LCD y LED'),
            ('CAT-TEL', 'Teléfonos y Celulares', 'Dispositivos de comunicación móvil'),
            ('CAT-NET', 'Equipos de Telecomunicaciones', 'Routers, switches y antenas');

            INSERT INTO lote (codigo_lote, id_generador, cantidad_declarada, peso_declarado_kg, observaciones) VALUES
            ('LOT-2026-001', 1, 15, 120.5, 'Lote institucional de CPUs y periféricos dados de baja'),
            ('LOT-2026-002', 1, 8, 45.0, 'Monitores LED y teclados para despiece');

            INSERT INTO dispositivo (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones, id_centro_actual) VALUES
            ('QR-UIDA-PC-001', 'SN-DELL-9001', 1, 1, 1, 7.8, 'Equipo encendido sin disco duro', 1),
            ('QR-UIDA-PC-002', 'SN-HP-8002', 1, 1, 2, 8.2, 'Placa madre con condensadores inflados', 1),
            ('QR-UIDA-MON-003', 'SN-LG-7003', 2, 2, 1, 4.5, 'Monitor funcional pantalla limpia', 1),
            ('QR-UIDA-NET-004', 'SN-CISCO-6004', 4, 1, 1, 3.2, 'Switch 24 puertos funcional', 1);

            INSERT INTO historial_estado (id_dispositivo, numero_secuencia, id_estado, id_usuario, observacion) VALUES
            (1, 1, 1, 1, 'Ingreso inicial a centro de acopio'),
            (2, 1, 1, 1, 'Ingreso inicial a centro de acopio'),
            (3, 1, 1, 1, 'Ingreso inicial a centro de acopio'),
            (4, 1, 1, 1, 'Ingreso inicial a centro de acopio');
            """)
            conn.commit()
        print("[EcoRAEE BD] Conexión y tablas en Amazon RDS PostgreSQL inicializadas exitosamente.")
    else:
        # SQLite local
        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS rol_sistema (
            id_rol_sistema INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            nombre TEXT UNIQUE NOT NULL,
            descripcion TEXT
        );

        CREATE TABLE IF NOT EXISTS usuario (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'ROL_OPERADOR',
            activo INTEGER DEFAULT 1,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categoria_dispositivo (
            id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            nombre TEXT UNIQUE NOT NULL,
            descripcion TEXT
        );

        CREATE TABLE IF NOT EXISTS centro_acopio (
            id_centro INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_centro TEXT UNIQUE NOT NULL,
            nombre TEXT NOT NULL,
            direccion TEXT NOT NULL,
            capacidad_max_unidades INTEGER DEFAULT 1000,
            capacidad_max_kg REAL DEFAULT 5000.0,
            activo INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS lote (
            id_lote INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_lote TEXT UNIQUE NOT NULL,
            id_generador INTEGER DEFAULT 1,
            cantidad_declarada INTEGER NOT NULL,
            peso_declarado_kg REAL,
            observaciones TEXT,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS estado_dispositivo (
            id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            nombre TEXT NOT NULL,
            es_terminal INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS dispositivo (
            id_dispositivo INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_qr TEXT UNIQUE NOT NULL,
            numero_serie TEXT,
            id_modelo INTEGER DEFAULT 1,
            id_lote INTEGER,
            id_condicion INTEGER DEFAULT 1,
            peso_kg REAL NOT NULL,
            observaciones TEXT,
            id_centro_actual INTEGER DEFAULT 1,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS historial_estado (
            id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
            id_dispositivo INTEGER NOT NULL,
            numero_secuencia INTEGER NOT NULL,
            id_estado INTEGER NOT NULL,
            id_usuario INTEGER DEFAULT 1,
            fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_fin TIMESTAMP,
            observacion TEXT
        );

        CREATE TABLE IF NOT EXISTS evaluacion_tecnica (
            id_evaluacion INTEGER PRIMARY KEY AUTOINCREMENT,
            id_dispositivo INTEGER NOT NULL,
            id_clasificacion INTEGER NOT NULL,
            diagnostico_funcional TEXT,
            diagnostico_estetico TEXT,
            aprobado_reutilizacion INTEGER DEFAULT 0,
            fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS destino_final (
            id_destino INTEGER PRIMARY KEY AUTOINCREMENT,
            id_dispositivo INTEGER NOT NULL,
            id_tipo_destino INTEGER NOT NULL,
            entidad_receptora TEXT NOT NULL,
            certificado_numero TEXT NOT NULL,
            fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            observaciones TEXT
        );
        """)
        conn.commit()

        cursor.execute("SELECT COUNT(*) as total FROM centro_acopio")
        if cursor.fetchone()["total"] == 0:
            cursor.executescript("""
            INSERT INTO centro_acopio (codigo_centro, nombre, direccion, capacidad_max_unidades, capacidad_max_kg, activo) VALUES
            ('CEN-NORTE-01', 'Centro de Acopio Norte (Quito)', 'Av. Galo Plaza Lasso y Capitán Ramón Borja', 1500, 7500.0, 1),
            ('CEN-SUR-02', 'Centro de Acopio Sur (Quito)', 'Av. Maldonado y Morán Valverde', 1200, 6000.0, 1),
            ('CEN-GYE-01', 'Centro de Acopio Guayaquil', 'Parque Industrial Inmaconsa', 2000, 10000.0, 1);

            INSERT INTO categoria_dispositivo (codigo, nombre, descripcion) VALUES
            ('CAT-PC', 'Computadoras y Laptops', 'Equipos informáticos principales'),
            ('CAT-MON', 'Monitores y Pantallas', 'Displays CRT, LCD y LED'),
            ('CAT-TEL', 'Teléfonos y Celulares', 'Dispositivos de comunicación móvil'),
            ('CAT-NET', 'Equipos de Telecomunicaciones', 'Routers, switches y antenas');

            INSERT INTO lote (codigo_lote, id_generador, cantidad_declarada, peso_declarado_kg, observaciones) VALUES
            ('LOT-2026-001', 1, 15, 120.5, 'Lote institucional de CPUs y periféricos dados de baja'),
            ('LOT-2026-002', 1, 8, 45.0, 'Monitores LED y teclados para despiece');

            INSERT INTO dispositivo (codigo_qr, numero_serie, id_modelo, id_lote, id_condicion, peso_kg, observaciones, id_centro_actual) VALUES
            ('QR-UIDA-PC-001', 'SN-DELL-9001', 1, 1, 1, 7.8, 'Equipo encendido sin disco duro', 1),
            ('QR-UIDA-PC-002', 'SN-HP-8002', 1, 1, 2, 8.2, 'Placa madre con condensadores inflados', 1),
            ('QR-UIDA-MON-003', 'SN-LG-7003', 2, 2, 1, 4.5, 'Monitor funcional pantalla limpia', 1),
            ('QR-UIDA-NET-004', 'SN-CISCO-6004', 4, 1, 1, 3.2, 'Switch 24 puertos funcional', 1);

            INSERT INTO historial_estado (id_dispositivo, numero_secuencia, id_estado, id_usuario, observacion) VALUES
            (1, 1, 1, 1, 'Ingreso inicial a centro de acopio'),
            (2, 1, 1, 1, 'Ingreso inicial a centro de acopio'),
            (3, 1, 1, 1, 'Ingreso inicial a centro de acopio'),
            (4, 1, 1, 1, 'Ingreso inicial a centro de acopio');
            """)
            conn.commit()
        print("[EcoRAEE SQLite] Base de datos nativa SQLite inicializada correctamente sin SQLAlchemy.")

    conn.close()
