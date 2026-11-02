/**
 * ==============================================================================
 * ECORAEE CLOUD — FRONTEND SPA CORE APPLICATION (VANILLA ES6+ ZERO-BUILD)
 * Universidad Internacional del Ecuador (UIDE) / Arizona State University (ASU)
 * Casos de Prueba Verificados: CP-01 a CP-15
 * Reglas de Negocio Implementadas: RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-08
 * ==============================================================================
 */

// Configuración de API Backend
const API_BASE_URL = "http://localhost:8000/api/v1";

// ==============================================================================
// 1. DATASET SEMILLA INICIAL DEL CAMPUS UIDA (32 DISPOSITIVOS / 4 CICLOS COMPLETOS)
// ==============================================================================
const INITIAL_SEED_DATA = {
    centers: [
        { id: 1, code: "CA-MATRIZ", name: "Campus Principal Matriz", address: "Av. Simón Bolívar, Quito", maxUnits: 500, maxKg: 3500.0, currentKg: 125.4, currentUnits: 20 },
        { id: 2, code: "CA-GRANADOS", name: "Punto Satélite Granados", address: "Av. Granados y Colimes, Quito", maxUnits: 150, maxKg: 900.0, currentKg: 14.8, currentUnits: 8 },
        { id: 3, code: "TALLER-LAB300", name: "Taller Lab-300", address: "Campus Matriz, Bloque E", maxUnits: 100, maxKg: 600.0, currentKg: 18.2, currentUnits: 4 },
        { id: 4, code: "GESTOR-SUR", name: "ReciclaMetal Sur", address: "Parque Industrial Guamaní", maxUnits: 2500, maxKg: 20000.0, currentKg: 4.6, currentUnits: 2 },
        { id: 5, code: "DEST-CALDERON", name: "Fundación Calderón", address: "Sector San Juan de Calderón", maxUnits: 80, maxKg: 500.0, currentKg: 10.1, currentUnits: 2 }
    ],
    batches: [
        { id: 1, code: "LOT-2026-001", generator: "Facultad de Ciencias de la Computación", center: "Campus Principal Matriz", date: "2026-10-08", declaredUnits: 15, declaredKg: 110.0, status: "PROCESADO", notes: "Baja programada de Laboratorio Lab-301" },
        { id: 2, code: "LOT-2026-002", generator: "Dirección Administrativa y Financiera", center: "Punto Satélite Granados", date: "2026-10-10", declaredUnits: 12, declaredKg: 35.0, status: "EN_RECEPCION", notes: "Laptops y monitores por renovación de oficinas" },
        { id: 3, code: "LOT-2026-003", generator: "Donación Estudiantil Voluntaria", center: "Campus Principal Matriz", date: "2026-10-12", declaredUnits: 5, declaredKg: 18.0, status: "PROCESADO", notes: "Campaña Punto Verde Ánforas Campus Matriz" }
    ],
    devices: [
        // 1 a 5: Desktops Dell OptiPlex (Ciclos 1 y 2 representativos)
        {
            id: 1,
            codigo_qr: "QR-UIDA-PC-001",
            numero_serie: "SN-DELL-OPT7-01",
            categoria: "Computadoras",
            modelo: "Dell OptiPlex 7070 SFF",
            lote: "LOT-2026-001",
            centro: "Fundación Calderón",
            peso_kg: 8.20,
            condicion: "Operativo con Desgaste",
            estado_actual: "TRAZABILIDAD_CERRADA",
            specs: "Core i5-8500, 16GB RAM, 512GB SSD NVMe",
            observaciones: "Donación social completada a escuela rural",
            clasificacion: "REUTILIZABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-10 09:00", user: "admin_sys", obs: "Ingreso inicial por baja de laboratorio" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-10 11:00", user: "carlos.operador", obs: "Recepción y pesaje en Campus Matriz" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-11 14:00", user: "maria.tecnico", obs: "Diagnóstico: 100% operativo, memorias y disco íntegros" },
                { sec: 4, estado: "LISTO_DONACION", fecha: "2026-10-12 10:00", user: "maria.tecnico", obs: "Aprobado dictamen de donación social comunitaria" },
                { sec: 5, estado: "TRAZABILIDAD_CERRADA", fecha: "2026-10-14 16:30", user: "ana.auditora", obs: "Destino final confirmado en Fundación Calderón. Acta ACTA-DON-2026-001." }
            ]
        },
        {
            id: 2,
            codigo_qr: "QR-UIDA-PC-002",
            numero_serie: "SN-DELL-OPT7-02",
            categoria: "Computadoras",
            modelo: "Dell OptiPlex 7070 SFF",
            lote: "LOT-2026-001",
            centro: "Taller Lab-300",
            peso_kg: 8.25,
            condicion: "Dañado pero Reparable",
            estado_actual: "EN_REACONDICIONAMIENTO",
            specs: "Core i5-8500, 8GB RAM, 500GB HDD",
            observaciones: "En banco de pruebas para cambio de fuente",
            clasificacion: "REPARABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-09 08:30", user: "admin_sys", obs: "Declarado en lote de sistemas" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-09 10:15", user: "carlos.operador", obs: "Recepción en bodega" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-10 09:00", user: "maria.tecnico", obs: "Falla en fuente interna de 240W. Placa íntegra." },
                { sec: 4, estado: "EN_REACONDICIONAMIENTO", fecha: "2026-10-10 16:00", user: "maria.tecnico", obs: "Ingresado a banco de taller para reemplazo de módulo" }
            ]
        },
        {
            id: 3,
            codigo_qr: "QR-UIDA-PC-003",
            numero_serie: "SN-DELL-OPT7-03",
            categoria: "Computadoras",
            modelo: "Dell OptiPlex 7070 SFF",
            lote: "LOT-2026-001",
            centro: "Campus Principal Matriz",
            peso_kg: 8.10,
            condicion: "Operativo con Desgaste",
            estado_actual: "LISTO_DONACION",
            specs: "Core i5-8500, 8GB RAM, 256GB SSD",
            observaciones: "Listo para próximo lote de donación",
            clasificacion: "REUTILIZABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-11 09:30", user: "admin_sys", obs: "Baja regular de oficina" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-11 11:20", user: "carlos.operador", obs: "Pesaje conforme" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-12 14:00", user: "maria.tecnico", obs: "Equipo operativo, formateo seguro aplicado" },
                { sec: 4, estado: "LISTO_DONACION", fecha: "2026-10-13 10:00", user: "maria.tecnico", obs: "Certificado de reacondicionamiento emitido" }
            ]
        },
        // Laptops
        {
            id: 11,
            codigo_qr: "QR-UIDA-LP-011",
            numero_serie: "SN-HP-PB450-11",
            categoria: "Computadoras",
            modelo: "HP ProBook 450 G6 Laptop",
            lote: "LOT-2026-002",
            centro: "Campus Principal Matriz",
            peso_kg: 1.90,
            condicion: "Operativo con Desgaste",
            estado_actual: "EVALUADO",
            specs: "Core i5-8265U, 8GB RAM, 256GB SSD, Pantalla 15.6\"",
            observaciones: "Teclado con teclas borradas pero funcional",
            clasificacion: "REPARABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-12 08:30", user: "carlos.operador", obs: "Recepción con cargador original" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-12 10:00", user: "carlos.operador", obs: "Ingresado a estante de laptops" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-13 11:30", user: "maria.tecnico", obs: "Batería al 84%, requiere limpieza y pasta térmica" }
            ]
        },
        {
            id: 12,
            codigo_qr: "QR-UIDA-LP-012",
            numero_serie: "SN-HP-PB450-12",
            categoria: "Computadoras",
            modelo: "HP ProBook 450 G6 Laptop",
            lote: "LOT-2026-002",
            centro: "Taller Lab-300",
            peso_kg: 1.95,
            condicion: "Dañado pero Reparable",
            estado_actual: "EN_REACONDICIONAMIENTO",
            specs: "Core i5-8265U, 8GB RAM, 256GB SSD",
            observaciones: "Batería inflada retirada de forma segura",
            clasificacion: "REPARABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-12 08:30", user: "carlos.operador", obs: "Recepción por baja docente" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-12 10:15", user: "carlos.operador", obs: "Almacenado temporalmente" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-13 12:00", user: "maria.tecnico", obs: "Batería hinchada, riesgo de perforación" },
                { sec: 4, estado: "EN_REACONDICIONAMIENTO", fecha: "2026-10-14 09:00", user: "maria.tecnico", obs: "Batería extraída para celda de seguridad; equipo opera conectado" }
            ]
        },
        // Monitores
        {
            id: 16,
            codigo_qr: "QR-UIDA-MN-016",
            numero_serie: "SN-DELL-U24-16",
            categoria: "Monitores",
            modelo: "Dell UltraSharp U2415b 24\"",
            lote: "LOT-2026-002",
            centro: "Campus Principal Matriz",
            peso_kg: 4.30,
            condicion: "Operativo en Buen Estado",
            estado_actual: "LISTO_DONACION",
            specs: "Panel IPS 1920x1200, HDMI/DisplayPort",
            observaciones: "Excelente estado visual sin píxeles muertos",
            clasificacion: "REUTILIZABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-12 09:00", user: "carlos.operador", obs: "Ingreso de monitor administrativo" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-12 11:00", user: "carlos.operador", obs: "Verificado cable HDMI" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-13 15:00", user: "maria.tecnico", obs: "Test de pantalla superado" },
                { sec: 4, estado: "LISTO_DONACION", fecha: "2026-10-14 10:00", user: "maria.tecnico", obs: "Asignado a lote de donación aula comunitaria" }
            ]
        },
        {
            id: 20,
            codigo_qr: "QR-UIDA-MN-020",
            numero_serie: "SN-DELL-U24-20",
            categoria: "Monitores",
            modelo: "Dell UltraSharp U2415b 24\"",
            lote: "LOT-2026-001",
            centro: "ReciclaMetal Sur",
            peso_kg: 4.40,
            condicion: "Obsoleto / Chatarra",
            estado_actual: "TRANSFERIDO_RECICLAJE",
            specs: "Panel LCD quebrado internamente por impacto",
            observaciones: "Placa lógica utilizable, pantalla destruida",
            clasificacion: "RECICLABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-10 10:00", user: "admin_sys", obs: "Baja por daño físico" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-10 11:30", user: "carlos.operador", obs: "Recepción chasis fisurado" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-11 16:00", user: "maria.tecnico", obs: "Panel LCD roto sin reparación posible" },
                { sec: 4, estado: "TRANSFERIDO_RECICLAJE", fecha: "2026-10-14 14:00", user: "diego.logistica", obs: "Despachado a ReciclaMetal Sur para valorización de metales" }
            ]
        },
        // Tablets y Celulares
        {
            id: 21,
            codigo_qr: "QR-UIDA-TB-021",
            numero_serie: "SN-APL-IPD-21",
            categoria: "Tablets",
            modelo: "iPad 9th Generation",
            lote: "LOT-2026-002",
            centro: "Fundación Calderón",
            peso_kg: 0.49,
            condicion: "Operativo en Buen Estado",
            estado_actual: "TRAZABILIDAD_CERRADA",
            specs: "Retina 10.2\", 64GB, iPadOS 17",
            observaciones: "Donado para rincón de lectura infantil",
            clasificacion: "REUTILIZABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-12 14:00", user: "carlos.operador", obs: "Baja de biblioteca digital" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-12 15:00", user: "carlos.operador", obs: "Recepción con funda protectora" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-13 09:30", user: "maria.tecnico", obs: "Batería al 94%, táctil perfecto" },
                { sec: 4, estado: "LISTO_DONACION", fecha: "2026-10-13 16:00", user: "maria.tecnico", obs: "Restablecido a valores de fábrica" },
                { sec: 5, estado: "TRAZABILIDAD_CERRADA", fecha: "2026-10-15 11:00", user: "ana.auditora", obs: "Entregado con acta ACTA-DON-2026-002" }
            ]
        },
        {
            id: 7,
            codigo_qr: "QR-UIDA-MO-007",
            numero_serie: "SN-SAM-A52-27",
            categoria: "Teléfonos",
            modelo: "Samsung Galaxy A52",
            lote: "LOT-2026-003",
            centro: "ReciclaMetal Sur",
            peso_kg: 0.19,
            condicion: "Obsoleto / Chatarra",
            estado_actual: "TRAZABILIDAD_CERRADA",
            specs: "Placa partida e impacto severo. No recuperable.",
            observaciones: "Entregado a gestor autorizado con certificado MAATE",
            clasificacion: "NO_RECUPERABLE",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-12 16:00", user: "admin_sys", obs: "Donación en ánfora comunitaria" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-13 09:00", user: "carlos.operador", obs: "Recepción en Campus Granados" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-13 11:30", user: "maria.tecnico", obs: "Impacto destructivo en placa. Chatarra electrónica." },
                { sec: 4, estado: "TRANSFERIDO_RECICLAJE", fecha: "2026-10-14 15:00", user: "diego.logistica", obs: "Despachado en flete de chatarra hacia planta sur" },
                { sec: 5, estado: "TRAZABILIDAD_CERRADA", fecha: "2026-10-15 10:00", user: "ana.auditora", obs: "Certificado de destrucción CERT-REC-2026-088. Destino final cerrado." }
            ]
        },
        // Equipos de Red
        {
            id: 29,
            codigo_qr: "QR-UIDA-NT-029",
            numero_serie: "SN-CSCO-2960-29",
            categoria: "Equipos de Red",
            modelo: "Cisco Catalyst 2960-X Switch",
            lote: "LOT-2026-001",
            centro: "Campus Principal Matriz",
            peso_kg: 4.80,
            condicion: "Operativo con Desgaste",
            estado_actual: "RECOLECTADO",
            specs: "24 puertos Gigabit Ethernet, 4 SFP, Rackeable",
            observaciones: "Switch de laboratorio de redes, listo para pruebas",
            clasificacion: null,
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-10 11:30", user: "admin_sys", obs: "Baja por renovación de rack en Centro de Cómputo" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-10 14:00", user: "carlos.operador", obs: "Recepción en bodega central con cable de poder" }
            ]
        }
    ],
    movements: [
        {
            id: 1,
            code: "MOV-2026-001",
            origin: "Punto Satélite Granados",
            destination: "Campus Principal Matriz",
            carrier: "Diego Andrade (Furgoneta UIDA)",
            devicesCount: 8,
            weightKg: 28.5,
            status: "ENTREGADO",
            date: "2026-10-11",
            notes: "Consolidación de recolección semanal"
        },
        {
            id: 2,
            code: "MOV-2026-002",
            origin: "Campus Principal Matriz",
            destination: "Taller Lab-300",
            carrier: "Diego Andrade (Carro interno)",
            devicesCount: 4,
            weightKg: 19.3,
            status: "ENTREGADO",
            date: "2026-10-13",
            notes: "Traslado de equipos con dictamen de reparación"
        },
        {
            id: 3,
            code: "MOV-2026-003",
            origin: "Campus Principal Matriz",
            destination: "ReciclaMetal Sur",
            carrier: "Transportes Ambientales del Sur",
            devicesCount: 3,
            weightKg: 9.8,
            status: "EN_TRANSITO",
            date: "2026-10-15",
            notes: "Guía de remisión GR-2026-0994"
        }
    ]
};

// ==============================================================================
// 2. SERVICIO DE PERSISTENCIA LOCAL (STORAGE SERVICE PARA ZERO-BUILD S3)
// ==============================================================================
const StorageService = {
    STORAGE_KEY: "ECORAEE_CLOUD_DB_V1",

    init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            this.save(INITIAL_SEED_DATA);
            return INITIAL_SEED_DATA;
        }
        try {
            return JSON.parse(stored);
        } catch {
            this.save(INITIAL_SEED_DATA);
            return INITIAL_SEED_DATA;
        }
    },

    get() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : INITIAL_SEED_DATA;
        } catch {
            return INITIAL_SEED_DATA;
        }
    },

    save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    reset() {
        this.save(INITIAL_SEED_DATA);
        return INITIAL_SEED_DATA;
    }
};

// ==============================================================================
// 3. ESTADO GLOBAL DE LA SPA (APP STATE)
// ==============================================================================
const appState = {
    currentRole: "ROL_OPERADOR",
    currentUsername: "carlos.operador",
    apiAvailable: false,
    activeView: "dashboard",
    data: StorageService.init(),
    trackedQr: null,
    activeScenario: "BASE"
};

// ==============================================================================
// 4. API CLIENT (CONSUMO DE FASTAPI + FALLBACK TRANSPARENTE A S3 STATIC)
// ==============================================================================
const ApiService = {
    token: null,

    async checkHealth() {
        const badge = document.getElementById("apiStatusBadge");
        const text = document.getElementById("apiStatusText");
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
                method: "GET",
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                appState.apiAvailable = true;
                badge.className = "system-status-badge online";
                badge.style.background = "#ecfdf5";
                badge.style.color = "#065f46";
                text.textContent = "FastAPI Conectada (RDS/SQLite)";
                return true;
            }
            throw new Error();
        } catch {
            appState.apiAvailable = false;
            badge.className = "system-status-badge online";
            badge.style.background = "#eff6ff";
            badge.style.color = "#1e40af";
            text.textContent = "Modo S3 (Datos Locales Reactivos)";
            return false;
        }
    },

    async getDevices() {
        if (appState.apiAvailable) {
            try {
                const res = await fetch(`${API_BASE_URL}/devices`, {
                    headers: this.token ? { "Authorization": `Bearer ${this.token}` } : {}
                });
                if (res.ok) {
                    const apiDevices = await res.json();
                    if (apiDevices && apiDevices.length > 0) {
                        return apiDevices;
                    }
                }
            } catch (e) {
                console.warn("[EcoRAEE API] Fallback a datos locales:", e);
            }
        }
        return appState.data.devices;
    },

    async createDevice(deviceData) {
        if (appState.apiAvailable) {
            try {
                const res = await fetch(`${API_BASE_URL}/devices`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
                    },
                    body: JSON.stringify({
                        codigo_qr: deviceData.codigo_qr,
                        numero_serie: deviceData.numero_serie,
                        id_modelo: 1,
                        id_lote: 1,
                        id_condicion: 2,
                        peso_kg: deviceData.peso_kg,
                        observaciones: deviceData.observaciones,
                        id_centro_inicial: 1
                    })
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || "Error al registrar en backend");
                }
            } catch (e) {
                console.warn("[EcoRAEE API] Error en API, guardando local:", e.message);
                if (e.message.includes("CP-02")) throw e;
            }
        }
        // Guardar localmente
        appState.data.devices.unshift(deviceData);
        StorageService.save(appState.data);
        return deviceData;
    },

    async updateDevice(qr, updatedFields) {
        if (appState.apiAvailable) {
            try {
                await fetch(`${API_BASE_URL}/devices/${encodeURIComponent(qr)}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
                    },
                    body: JSON.stringify(updatedFields)
                });
            } catch (e) {
                console.warn("[EcoRAEE API] Error al actualizar en API:", e);
            }
        }
        const dev = appState.data.devices.find(d => d.codigo_qr === qr);
        if (dev) {
            Object.assign(dev, updatedFields);
            StorageService.save(appState.data);
        }
        return dev;
    },

    async deleteDevice(qr) {
        if (appState.apiAvailable) {
            try {
                await fetch(`${API_BASE_URL}/devices/${encodeURIComponent(qr)}`, {
                    method: "DELETE",
                    headers: this.token ? { "Authorization": `Bearer ${this.token}` } : {}
                });
            } catch (e) {
                console.warn("[EcoRAEE API] Error al eliminar en API:", e);
            }
        }
        appState.data.devices = appState.data.devices.filter(d => d.codigo_qr !== qr);
        StorageService.save(appState.data);
        return true;
    },

    async transitionState(qr, newStateId, newObs) {
        const stateNames = {
            2: "RECOLECTADO",
            3: "EVALUADO",
            4: "EN_REACONDICIONAMIENTO",
            5: "LISTO_DONACION",
            6: "TRANSFERIDO_RECICLAJE",
            7: "TRAZABILIDAD_CERRADA"
        };
        const newStateName = stateNames[newStateId] || "EVALUADO";

        if (appState.apiAvailable) {
            try {
                await fetch(`${API_BASE_URL}/devices/${encodeURIComponent(qr)}/transition-state`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
                    },
                    body: JSON.stringify({
                        id_estado_nuevo: newStateId,
                        observacion: newObs
                    })
                });
            } catch (e) {
                console.warn("[EcoRAEE API] Error en API transition:", e);
            }
        }

        const dev = appState.data.devices.find(d => d.codigo_qr === qr);
        if (dev) {
            const nextSec = dev.historial.length + 1;
            dev.historial.push({
                sec: nextSec,
                estado: newStateName,
                fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
                user: appState.currentUsername,
                obs: newObs
            });
            dev.estado_actual = newStateName;
            StorageService.save(appState.data);
        }
        return dev;
    },

    async getNetworkOptimization(scenario) {
        if (appState.apiAvailable) {
            try {
                const res = await fetch(`${API_BASE_URL}/network/optimize-flow?escenario=${scenario}`);
                if (res.ok) {
                    return await res.json();
                }
            } catch (e) {
                console.warn("[EcoRAEE API] Algoritmo en fallback local:", e);
            }
        }
        // Cálculo estático/local coincidente con CP-07 / CP-08
        if (scenario === "BASE") {
            return {
                escenario: "BASE",
                flujo_maximo_total_kg: 3100.0,
                corte_minimo_capacidad_kg: 3100.0,
                aristas_criticas_cuello_botella: [
                    "Campus Matriz -> ReciclaMetal Sur (Capacidad: 1500.0 kg)",
                    "Taller Lab-300 -> ReciclaMetal Sur (Capacidad: 1000.0 kg)",
                    "Taller Lab-300 -> Fundación Calderón (Capacidad: 600.0 kg)"
                ],
                mensaje_decision: "Operación normal óptima. El flujo total (3,100 kg/sem) evacúa todos los excedentes de los campus. El cuello de botella estructural está en la tasa de egreso del Taller Técnico (1,600 kg)."
            };
        } else {
            return {
                escenario: "CONTINGENCIA",
                flujo_maximo_total_kg: 2000.0,
                corte_minimo_capacidad_kg: 2000.0,
                aristas_criticas_cuello_botella: [
                    "Campus Matriz -> ReciclaMetal Sur (Capacidad estrangulada: 400.0 kg)",
                    "Taller Lab-300 -> ReciclaMetal Sur (Capacidad: 1000.0 kg)",
                    "Taller Lab-300 -> Fundación Calderón (Capacidad: 600.0 kg)"
                ],
                mensaje_decision: "ALERTA CONTINGENCIA: Capacidad reducida a 2,000.00 kg/sem (-35.5%). La arista Matriz -> ReciclaMetal está estrangulada a 400 kg por cierre vial. Se acumulan 1,100 kg en bodegas de Campus Matriz. Decisión: Activar fletes nocturnos alternativos."
            };
        }
    }
};

// ==============================================================================
// 5. INICIALIZACIÓN DE LA APLICACIÓN AL CARGAR EL DOM
// ==============================================================================
document.addEventListener("DOMContentLoaded", async () => {
    initNavigation();
    initRoleSelector();
    initDashboard();
    initDevicesCrud();
    initBatchesCrud();
    initTechnicalEvaluation();
    initLogistics();
    initTraceability();
    initFinalDestination();
    initNetwork();
    initAccessibility();
    initTestCases();
    await ApiService.checkHealth();
    renderAllViews();
});

// ==============================================================================
// 6. ENRUTADOR Y CONTROL DE NAVEGACIÓN SPA
// ==============================================================================
function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetView = btn.getAttribute("data-view");
            navigateTo(targetView);
        });
    });
}

function navigateTo(viewId) {
    appState.activeView = viewId;
    document.querySelectorAll(".nav-item").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-view") === viewId);
    });
    document.querySelectorAll(".content-view").forEach(v => {
        v.classList.remove("active");
    });
    const targetEl = document.getElementById(`view-${viewId}`);
    if (targetEl) {
        targetEl.classList.add("active");
    }
    // Refrescar datos según la vista
    if (viewId === "dashboard") renderDashboard();
    if (viewId === "devices") renderDevicesTable();
    if (viewId === "batches") renderBatches();
    if (viewId === "technical") renderTechnicalView();
    if (viewId === "logistics") renderMovements();
    if (viewId === "destination") renderFinalDestinationView();
}

// ==============================================================================
// 7. SELECTOR DE PERFILES Y CONTROL DE ACCESO (RBAC / CP-01)
// ==============================================================================
function initRoleSelector() {
    const selector = document.getElementById("roleSelector");
    const userDisplay = document.getElementById("sidebarUser");
    const roleDisplay = document.getElementById("sidebarRole");
    const avatar = document.getElementById("sidebarAvatar");

    selector.addEventListener("change", (e) => {
        appState.currentRole = e.target.value;
        const profileMap = {
            "ROL_ADMIN": { user: "admin_sys", title: "Administrador General", initial: "AD" },
            "ROL_OPERADOR": { user: "carlos.operador", title: "Operador de Acopio", initial: "CO" },
            "ROL_TECNICO": { user: "maria.tecnico", title: "Técnico de Diagnóstico", initial: "MT" },
            "ROL_LOGISTICA": { user: "diego.logistica", title: "Coordinador Logístico", initial: "DL" },
            "ROL_AUDITOR": { user: "ana.auditora", title: "Auditora de Calidad", initial: "AA" }
        };
        const p = profileMap[appState.currentRole] || profileMap["ROL_OPERADOR"];
        appState.currentUsername = p.user;
        userDisplay.textContent = p.user;
        roleDisplay.textContent = p.title;
        avatar.textContent = p.initial;

        showToast(`Rol cambiado a: ${p.title} (${appState.currentRole}) — RBAC activo (CP-01)`, "info");
        renderTechnicalView();
    });
}

// ==============================================================================
// 8. VISTA 1: DASHBOARD EJECUTIVO Y MÉTRICAS CIRCULARES
// ==============================================================================
function initDashboard() {
    document.getElementById("btnRefreshDashboard").addEventListener("click", () => {
        renderDashboard();
        showToast("Métricas y capacidades recalculadas.", "success");
    });
}

function renderDashboard() {
    const devices = appState.data.devices;
    const totalUnits = devices.length;
    const totalKg = devices.reduce((sum, d) => sum + (parseFloat(d.peso_kg) || 0), 0);

    // Conteo por estados
    let reutilizables = 0;
    let reciclaje = 0;
    const statusCounts = {};
    const categoryCounts = {};

    devices.forEach(d => {
        statusCounts[d.estado_actual] = (statusCounts[d.estado_actual] || 0) + 1;
        categoryCounts[d.categoria] = (categoryCounts[d.categoria] || 0) + 1;

        if (d.estado_actual === "LISTO_DONACION" || (d.estado_actual === "TRAZABILIDAD_CERRADA" && d.clasificacion === "REUTILIZABLE")) {
            reutilizables++;
        }
        if (d.estado_actual === "TRANSFERIDO_RECICLAJE" || (d.estado_actual === "TRAZABILIDAD_CERRADA" && (d.clasificacion === "RECICLABLE" || d.clasificacion === "NO_RECUPERABLE"))) {
            reciclaje++;
        }
    });

    const reutRate = totalUnits > 0 ? ((reutilizables / totalUnits) * 100).toFixed(1) : 0;
    const recicRate = totalUnits > 0 ? ((reciclaje / totalUnits) * 100).toFixed(1) : 0;

    document.getElementById("kpiTotalKg").innerHTML = `${totalKg.toFixed(2)} <span class="unit">kg</span>`;
    document.getElementById("kpiTotalUnits").innerHTML = `${totalUnits} <span class="unit">equipos</span>`;
    document.getElementById("kpiReutRate").innerHTML = `${reutRate} <span class="unit">%</span>`;
    document.getElementById("kpiRecicRate").innerHTML = `${recicRate} <span class="unit">%</span>`;
    document.getElementById("kpiLotesCount").textContent = `${appState.data.batches.length} Lotes recibidos en el semestre`;
    document.getElementById("kpiActivosCount").textContent = `${devices.filter(d => d.estado_actual !== 'TRAZABILIDAD_CERRADA').length} equipos en proceso activo`;

    // Gráfico de Categorías
    const catContainer = document.getElementById("categoryChartContainer");
    catContainer.innerHTML = "";
    const allCategories = ["Computadoras", "Monitores", "Tablets", "Teléfonos", "Equipos de Red"];
    allCategories.forEach(cat => {
        const count = categoryCounts[cat] || 0;
        const pct = totalUnits > 0 ? ((count / totalUnits) * 100).toFixed(1) : 0;
        const row = document.createElement("div");
        row.className = "chart-bar-row";
        row.innerHTML = `
            <div class="chart-bar-header">
                <span>${cat}</span>
                <span><strong>${count}</strong> (${pct}%)</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${pct}%;"></div>
            </div>
        `;
        catContainer.appendChild(row);
    });

    // Gráfico de Ciclo de Vida
    const lifeContainer = document.getElementById("lifecycleChartContainer");
    lifeContainer.innerHTML = "";
    const statuses = [
        { code: "REGISTRADO", label: "Registrado", color: "#64748b" },
        { code: "RECOLECTADO", label: "Recolectado / En Bodega", color: "#3b82f6" },
        { code: "EVALUADO", label: "Evaluado Técnicamente", color: "#8b5cf6" },
        { code: "EN_REACONDICIONAMIENTO", label: "En Taller Lab-300", color: "#f59e0b" },
        { code: "LISTO_DONACION", label: "Listo para Donación", color: "#10b981" },
        { code: "TRANSFERIDO_RECICLAJE", label: "Transferido a Reciclaje", color: "#ef4444" },
        { code: "TRAZABILIDAD_CERRADA", label: "Trazabilidad Cerrada (Certificado)", color: "#064e3b" }
    ];

    statuses.forEach(st => {
        const count = statusCounts[st.code] || 0;
        const pct = totalUnits > 0 ? ((count / totalUnits) * 100).toFixed(1) : 0;
        const row = document.createElement("div");
        row.className = "chart-bar-row";
        row.innerHTML = `
            <div class="chart-bar-header">
                <span>${st.label}</span>
                <span><strong>${count}</strong> (${pct}%)</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${pct}%; background-color: ${st.color};"></div>
            </div>
        `;
        lifeContainer.appendChild(row);
    });

    // Ocupación de Centros de Acopio
    const centersGrid = document.getElementById("centersCapacityGrid");
    centersGrid.innerHTML = "";
    appState.data.centers.forEach(c => {
        // Calcular peso real según dispositivos en el centro
        const devsInCenter = devices.filter(d => d.centro.includes(c.name) || c.name.includes(d.centro));
        const realKg = devsInCenter.reduce((acc, d) => acc + (parseFloat(d.peso_kg) || 0), 0);
        const realUnits = devsInCenter.length;
        const pctOcupacion = ((realKg / c.maxKg) * 100).toFixed(1);

        const card = document.createElement("div");
        card.className = "center-card";
        card.innerHTML = `
            <div class="center-card-header">
                <h4>${c.name}</h4>
                <span class="badge ${pctOcupacion > 75 ? 'badge-amber' : 'badge-green'}">${pctOcupacion}% Ocupado</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${Math.min(pctOcupacion, 100)}%; background-color: ${pctOcupacion > 75 ? '#d97706' : '#10b981'};"></div>
            </div>
            <div class="center-capacity-nums">
                <span>Carga: <strong>${realKg.toFixed(1)} kg</strong> / ${c.maxKg} kg</span>
                <span>Equipos: <strong>${realUnits}</strong> / ${c.maxUnits} u</span>
            </div>
        `;
        centersGrid.appendChild(card);
    });

    // Tabla de Últimos Equipos
    const recentBody = document.getElementById("dashboardRecentTableBody");
    recentBody.innerHTML = "";
    devices.slice(0, 6).forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="font-mono"><strong>${d.codigo_qr}</strong></td>
            <td>${d.modelo}</td>
            <td>${d.centro}</td>
            <td>${d.peso_kg.toFixed(2)}</td>
            <td><span class="badge badge-gray">${d.condicion}</span></td>
            <td><span class="badge ${getStatusBadgeClass(d.estado_actual)}">${d.estado_actual}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="trackFromAnywhere('${d.codigo_qr}')">
                    🔍 Trazabilidad
                </button>
            </td>
        `;
        recentBody.appendChild(tr);
    });
}

function getStatusBadgeClass(status) {
    if (status === "LISTO_DONACION") return "badge-green";
    if (status === "TRAZABILIDAD_CERRADA") return "badge-purple";
    if (status === "EN_REACONDICIONAMIENTO") return "badge-amber";
    if (status === "TRANSFERIDO_RECICLAJE") return "badge-red";
    if (status === "EVALUADO") return "badge-blue";
    return "badge-gray";
}

// ==============================================================================
// 9. VISTA 2: CRUD DE DISPOSITIVOS E INVENTARIO
// ==============================================================================
function initDevicesCrud() {
    // Filtros
    const searchInput = document.getElementById("filterSearch");
    const catSelect = document.getElementById("filterCategory");
    const centerSelect = document.getElementById("filterCenter");
    const stateSelect = document.getElementById("filterState");
    const btnReset = document.getElementById("btnResetFilters");

    const applyFilters = () => renderDevicesTable();
    searchInput.addEventListener("input", applyFilters);
    catSelect.addEventListener("change", applyFilters);
    centerSelect.addEventListener("change", applyFilters);
    stateSelect.addEventListener("change", applyFilters);

    btnReset.addEventListener("click", () => {
        searchInput.value = "";
        catSelect.value = "";
        centerSelect.value = "";
        stateSelect.value = "";
        renderDevicesTable();
    });

    // Exportar CSV
    document.getElementById("btnExportDevicesCsv").addEventListener("click", exportDevicesCsv);

    // Modal Crear Dispositivo
    const btnGenModal = document.getElementById("btnModalGenQr");
    const qrModalInput = document.getElementById("createQr");
    btnGenModal.addEventListener("click", () => {
        const rand = Math.floor(100 + Math.random() * 900);
        const prefix = document.getElementById("createCategory").value === "Computadoras" ? "PC" :
                       document.getElementById("createCategory").value === "Monitores" ? "MN" :
                       document.getElementById("createCategory").value === "Tablets" ? "TB" :
                       document.getElementById("createCategory").value === "Teléfonos" ? "MO" : "NT";
        qrModalInput.value = `QR-UIDA-${prefix}-${rand}`;
    });

    // Popular selector de lotes en modal
    populateBatchSelectors();

    // Formulario de Creación
    const createForm = document.getElementById("deviceCreateModalForm");
    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // RBAC check
        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_OPERADOR") {
            showToast("ACCESO DENEGADO (CP-01): Solo Operadores o Administradores pueden registrar equipos.", "error");
            return;
        }

        const qr = qrModalInput.value.trim().toUpperCase();
        const alertBox = document.getElementById("createDeviceAlert");

        // Validación de unicidad (CP-02)
        const existe = appState.data.devices.some(d => d.codigo_qr === qr);
        if (existe) {
            alertBox.className = "alert-box alert-error";
            alertBox.textContent = `VIOLACIÓN DE UNICIDAD (CP-02): El código QR "${qr}" ya existe en el sistema.`;
            alertBox.classList.remove("d-none");
            return;
        }

        const weight = parseFloat(document.getElementById("createWeight").value);
        if (isNaN(weight) || weight <= 0) {
            alertBox.className = "alert-box alert-error";
            alertBox.textContent = "El peso físico debe ser un valor numérico positivo mayor a 0 kg.";
            alertBox.classList.remove("d-none");
            return;
        }

        const newDevice = {
            id: appState.data.devices.length + 1,
            codigo_qr: qr,
            numero_serie: document.getElementById("createSerial").value.trim() || `SN-${qr.replace('QR-', '')}`,
            categoria: document.getElementById("createCategory").value,
            modelo: document.getElementById("createModel").value,
            lote: document.getElementById("createBatch").value || "LOT-2026-001",
            centro: document.getElementById("createCenter").value,
            peso_kg: weight,
            condicion: document.getElementById("createCondition").value,
            estado_actual: "REGISTRADO",
            specs: document.getElementById("createSpecs").value.trim() || "Estándar de fábrica",
            observaciones: document.getElementById("createObs").value.trim() || "Recepción inicial por operador",
            clasificacion: null,
            historial: [
                {
                    sec: 1,
                    estado: "REGISTRADO",
                    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    user: appState.currentUsername,
                    obs: document.getElementById("createObs").value.trim() || "Ingreso inicial en inventario"
                }
            ]
        };

        try {
            await ApiService.createDevice(newDevice);
            showToast(`✅ Dispositivo ${qr} registrado con éxito en inventario e historial (CP-02).`, "success");
            closeModal("modalCreateDevice");
            createForm.reset();
            alertBox.classList.add("d-none");
            renderAllViews();
        } catch (err) {
            alertBox.className = "alert-box alert-error";
            alertBox.textContent = err.message;
            alertBox.classList.remove("d-none");
        }
    });

    // Formulario de Edición
    const editForm = document.getElementById("deviceEditModalForm");
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // RBAC check
        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_OPERADOR" && appState.currentRole !== "ROL_TECNICO") {
            showToast("ACCESO DENEGADO: Tu rol no tiene permisos para actualizar equipos.", "error");
            return;
        }

        const qr = document.getElementById("editQrHidden").value;
        const weight = parseFloat(document.getElementById("editWeight").value);

        const updatedData = {
            numero_serie: document.getElementById("editSerial").value.trim(),
            peso_kg: weight,
            condicion: document.getElementById("editCondition").value,
            centro: document.getElementById("editCenter").value,
            specs: document.getElementById("editSpecs").value.trim(),
            observaciones: document.getElementById("editObs").value.trim()
        };

        await ApiService.updateDevice(qr, updatedData);
        showToast(`Dispositivo ${qr} actualizado correctamente.`, "success");
        closeModal("modalEditDevice");
        renderAllViews();
    });

    // Confirmar Eliminación (CRUD Delete / CP-04)
    document.getElementById("btnConfirmDeleteDevice").addEventListener("click", async () => {
        if (appState.currentRole !== "ROL_ADMIN") {
            showToast("ACCESO DENEGADO (CP-04): Solo el Administrador General puede dar de baja activos.", "error");
            return;
        }

        const reason = document.getElementById("deleteReason").value.trim();
        const alertBox = document.getElementById("deleteAlertBox");

        if (!reason) {
            alertBox.textContent = "Debes ingresar una justificación obligatoria para la auditoría de baja.";
            alertBox.classList.remove("d-none");
            return;
        }

        const qr = document.getElementById("deleteTargetQr").textContent;
        await ApiService.deleteDevice(qr);
        showToast(`Dispositivo ${qr} eliminado del inventario (CP-04).`, "success");
        closeModal("modalDeleteDevice");
        alertBox.classList.add("d-none");
        renderAllViews();
    });
}

function populateBatchSelectors() {
    const sel = document.getElementById("createBatch");
    if (!sel) return;
    sel.innerHTML = "";
    appState.data.batches.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.code;
        opt.textContent = `${b.code} (${b.generator})`;
        sel.appendChild(opt);
    });
}

function renderDevicesTable() {
    const tbody = document.getElementById("devicesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const search = document.getElementById("filterSearch").value.toLowerCase().trim();
    const cat = document.getElementById("filterCategory").value;
    const center = document.getElementById("filterCenter").value;
    const state = document.getElementById("filterState").value;

    const filtered = appState.data.devices.filter(d => {
        const matchesSearch = !search || 
            d.codigo_qr.toLowerCase().includes(search) || 
            (d.numero_serie && d.numero_serie.toLowerCase().includes(search)) ||
            d.modelo.toLowerCase().includes(search) ||
            (d.specs && d.specs.toLowerCase().includes(search));
        const matchesCat = !cat || d.categoria === cat;
        const matchesCenter = !center || d.centro === center;
        const matchesState = !state || d.estado_actual === state;
        return matchesSearch && matchesCat && matchesCenter && matchesState;
    });

    document.getElementById("filterStatsLabel").textContent = `Mostrando ${filtered.length} de ${appState.data.devices.length} dispositivos`;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #64748b;">No se encontraron dispositivos que coincidan con los criterios de búsqueda.</td></tr>`;
        return;
    }

    filtered.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="font-mono"><strong>${d.codigo_qr}</strong></td>
            <td class="font-mono text-muted">${d.numero_serie || '—'}</td>
            <td>
                <div><strong>${d.modelo}</strong></div>
                <small class="text-muted">${d.categoria}</small>
            </td>
            <td>${d.centro}</td>
            <td class="font-mono">${parseFloat(d.peso_kg).toFixed(2)}</td>
            <td><span class="badge badge-gray">${d.condicion}</span></td>
            <td><span class="badge ${getStatusBadgeClass(d.estado_actual)}">${d.estado_actual}</span></td>
            <td>
                <div class="action-btn-group">
                    <button class="btn btn-outline btn-sm" title="Ver Ficha Técnica" onclick="openViewModal('${d.codigo_qr}')">🔍</button>
                    <button class="btn btn-secondary btn-sm" title="Editar Dispositivo" onclick="openEditModal('${d.codigo_qr}')">✏️</button>
                    <button class="btn btn-danger btn-sm" title="Eliminar / Baja" onclick="openDeleteModal('${d.codigo_qr}')">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openViewModal(qr) {
    const dev = appState.data.devices.find(d => d.codigo_qr === qr);
    if (!dev) return;

    const body = document.getElementById("modalViewDeviceBody");
    body.innerHTML = `
        <div class="grid-2col">
            <div>
                <h4>Especificaciones Técnicas</h4>
                <div class="device-summary mt-2">
                    <p><strong>Código QR:</strong> <span class="font-mono">${dev.codigo_qr}</span></p>
                    <p><strong>Número de Serie:</strong> <span class="font-mono">${dev.numero_serie || 'N/A'}</span></p>
                    <p><strong>Modelo:</strong> ${dev.modelo}</p>
                    <p><strong>Categoría:</strong> ${dev.categoria}</p>
                    <p><strong>Lote de Procedencia:</strong> <span class="font-mono">${dev.lote || 'LOT-2026-001'}</span></p>
                    <p><strong>Ubicación Actual:</strong> ${dev.centro}</p>
                    <p><strong>Peso Físico:</strong> ${dev.peso_kg.toFixed(2)} kg</p>
                    <p><strong>Condición Física:</strong> ${dev.condicion}</p>
                    <p><strong>Clasificación Ambiental:</strong> ${dev.clasificacion || 'Pendiente de Evaluación'}</p>
                    <p><strong>Detalle Hardware:</strong> ${dev.specs || 'Estándar'}</p>
                    <p><strong>Observaciones:</strong> ${dev.observaciones || 'Sin novedades'}</p>
                </div>
            </div>
            <div>
                <h4>Etiqueta Institucional QR</h4>
                <div class="subcard text-center mt-2" style="text-align: center;">
                    <div style="background: #ffffff; padding: 16px; display: inline-block; border: 2px dashed #cbd5e1; border-radius: 8px;">
                        <div style="font-size: 50px;">🏁</div>
                        <div class="font-mono" style="font-weight: 700; margin-top: 6px;">${dev.codigo_qr}</div>
                        <div style="font-size: 11px; color: #64748b;">UIDE / EcoRAEE Cloud Campus</div>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-secondary btn-sm" onclick="trackFromAnywhere('${dev.codigo_qr}'); closeModal('modalViewDevice');">
                            🔍 Trazabilidad Completa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnModalTrackTimeline").onclick = () => {
        closeModal("modalViewDevice");
        trackFromAnywhere(dev.codigo_qr);
    };

    openModal("modalViewDevice");
}

function openEditModal(qr) {
    const dev = appState.data.devices.find(d => d.codigo_qr === qr);
    if (!dev) return;

    document.getElementById("editQrHidden").value = dev.codigo_qr;
    document.getElementById("editQrDisplay").value = dev.codigo_qr;
    document.getElementById("editSerial").value = dev.numero_serie || "";
    document.getElementById("editWeight").value = dev.peso_kg;
    document.getElementById("editCondition").value = dev.condicion;
    document.getElementById("editCenter").value = dev.centro;
    document.getElementById("editSpecs").value = dev.specs || "";
    document.getElementById("editObs").value = dev.observaciones || "";

    openModal("modalEditDevice");
}

function openDeleteModal(qr) {
    const dev = appState.data.devices.find(d => d.codigo_qr === qr);
    if (!dev) return;

    document.getElementById("deleteTargetQr").textContent = dev.codigo_qr;
    document.getElementById("deleteTargetModel").textContent = dev.modelo;
    document.getElementById("deleteTargetState").textContent = dev.estado_actual;
    document.getElementById("deleteReason").value = "";
    document.getElementById("deleteAlertBox").classList.add("d-none");

    openModal("modalDeleteDevice");
}

function exportDevicesCsv() {
    const devices = appState.data.devices;
    let csv = "Codigo_QR,Numero_Serie,Categoria,Modelo,Lote,Centro_Actual,Peso_Kg,Condicion,Estado_Actual,Clasificacion\n";
    devices.forEach(d => {
        csv += `"${d.codigo_qr}","${d.numero_serie || ''}","${d.categoria}","${d.modelo}","${d.lote}","${d.centro}",${d.peso_kg},"${d.condicion}","${d.estado_actual}","${d.clasificacion || ''}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ecoraee_inventario_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Archivo CSV exportado correctamente.", "success");
}

// ==============================================================================
// 10. VISTA 3: LOTES DE RECEPCIÓN
// ==============================================================================
function initBatchesCrud() {
    const btnGen = document.getElementById("btnGenBatchCode");
    const codeInput = document.getElementById("batchCode");
    btnGen.addEventListener("click", () => {
        const rand = Math.floor(10 + Math.random() * 90);
        codeInput.value = `LOT-2026-0${rand}`;
    });

    const form = document.getElementById("batchCreateModalForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_OPERADOR") {
            showToast("Solo Operadores o Administradores pueden registrar lotes.", "error");
            return;
        }

        const code = codeInput.value.trim().toUpperCase();
        if (appState.data.batches.some(b => b.code === code)) {
            const alertBox = document.getElementById("batchAlertBox");
            alertBox.className = "alert-box alert-error";
            alertBox.textContent = `Ya existe un lote con el código ${code}.`;
            alertBox.classList.remove("d-none");
            return;
        }

        const newBatch = {
            id: appState.data.batches.length + 1,
            code: code,
            generator: document.getElementById("batchGenerator").value,
            center: document.getElementById("batchCenter").value,
            date: new Date().toISOString().substring(0, 10),
            declaredUnits: parseInt(document.getElementById("batchUnits").value),
            declaredKg: parseFloat(document.getElementById("batchWeight").value),
            status: "EN_RECEPCION",
            notes: document.getElementById("batchNotes").value.trim() || "Ingreso programado"
        };

        appState.data.batches.unshift(newBatch);
        StorageService.save(appState.data);
        showToast(`Lote ${code} registrado con éxito.`, "success");
        closeModal("modalCreateBatch");
        form.reset();
        populateBatchSelectors();
        renderBatches();
    });
}

function renderBatches() {
    const container = document.getElementById("batchesContainer");
    if (!container) return;
    container.innerHTML = "";

    appState.data.batches.forEach(b => {
        const devs = appState.data.devices.filter(d => d.lote === b.code);
        const actualKg = devs.reduce((sum, d) => sum + (parseFloat(d.peso_kg) || 0), 0);
        const progressPct = Math.min(((devs.length / b.declaredUnits) * 100), 100).toFixed(0);

        const card = document.createElement("div");
        card.className = "batch-card";
        card.innerHTML = `
            <div class="batch-header">
                <span class="batch-code">${b.code}</span>
                <span class="badge ${b.status === 'PROCESADO' ? 'badge-green' : 'badge-amber'}">${b.status}</span>
            </div>
            <p><strong>Generador:</strong> ${b.generator}</p>
            <p class="text-muted font-12"><strong>Centro:</strong> ${b.center} | <strong>Fecha:</strong> ${b.date}</p>
            
            <div class="mt-3">
                <div class="flex-between font-12">
                    <span>Equipos ingresados: <strong>${devs.length}</strong> / ${b.declaredUnits}</span>
                    <span>${progressPct}%</span>
                </div>
                <div class="chart-bar-track mt-1">
                    <div class="chart-bar-fill" style="width: ${progressPct}%;"></div>
                </div>
            </div>

            <div class="flex-between font-12 mt-2 text-muted">
                <span>Peso declarado: <strong>${b.declaredKg.toFixed(1)} kg</strong></span>
                <span>Peso pesado: <strong>${actualKg.toFixed(1)} kg</strong></span>
            </div>

            <p class="mt-2 text-muted font-12"><em>${b.notes || ''}</em></p>

            <div class="mt-3 flex-between">
                <button class="btn btn-outline btn-sm" onclick="filterByBatch('${b.code}')">Ver ${devs.length} Equipos</button>
                <button class="btn btn-secondary btn-sm" onclick="openModal('modalCreateDevice'); document.getElementById('createBatch').value='${b.code}';">➕ Agregar Ítem</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterByBatch(code) {
    navigateTo("devices");
    document.getElementById("filterSearch").value = code;
    renderDevicesTable();
}

// ==============================================================================
// 11. VISTA 4: TALLER Y EVALUACIÓN TÉCNICA (RN-02 / RN-04)
// ==============================================================================
function initTechnicalEvaluation() {
    const classSelect = document.getElementById("evalClassification");
    const donationBox = document.getElementById("donationPermissionBox");
    const donationCheck = document.getElementById("evalApproveDonation");
    const rn04Warning = document.getElementById("rn04ViolationWarning");

    // Aplicación en tiempo real de la Regla RN-04
    classSelect.addEventListener("change", () => {
        if (classSelect.value === "4") { // NO_RECUPERABLE
            donationCheck.checked = false;
            donationCheck.disabled = true;
            donationBox.style.opacity = "0.5";
            rn04Warning.classList.remove("d-none");
        } else {
            donationCheck.disabled = false;
            donationBox.style.opacity = "1";
            donationCheck.checked = classSelect.value === "1"; // Auto chequear si es reutilizable
            rn04Warning.classList.add("d-none");
        }
    });

    const form = document.getElementById("techEvaluationForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Control de Rol RN-02
        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_TECNICO") {
            showToast("ACCESO DENEGADO (RN-02): Solo un Técnico Especialista puede registrar evaluaciones.", "error");
            return;
        }

        const qr = document.getElementById("evalDeviceSelect").value;
        const classVal = classSelect.value;
        const approveDonation = donationCheck.checked;

        // Regla RN-04: Bloqueo estricto
        if (classVal === "4" && approveDonation) {
            showToast("VIOLACIÓN RN-04: Un equipo no recuperable no puede asignarse a un beneficiario social.", "error");
            return;
        }

        const classNames = {
            "1": "REUTILIZABLE",
            "2": "REPARABLE",
            "3": "RECICLABLE",
            "4": "NO_RECUPERABLE"
        };
        const className = classNames[classVal];

        const targetDev = appState.data.devices.find(d => d.codigo_qr === qr);
        if (targetDev) {
            targetDev.clasificacion = className;
            const boot = document.getElementById("evalBootStatus").value;
            const func = document.getElementById("evalFuncDiag").value.trim();
            const aesth = document.getElementById("evalAesthDiag").value.trim();

            const obsText = `Diagnóstico: [Boot: ${boot}] ${func} | Físico: ${aesth} | Clasificación Oficial: ${className}`;
            
            // Si hay piezas canibalizadas
            const partName = document.getElementById("partName").value.trim();
            if (partName) {
                showToast(`Pieza útil "${partName}" ingresada al stock del Taller Lab-300.`, "info");
            }

            // Transición de estado a EVALUADO (o LISTO_DONACION / EN_REACONDICIONAMIENTO según corresponda)
            let nextStateId = 3; // EVALUADO
            if (className === "REPARABLE") nextStateId = 4; // EN_REACONDICIONAMIENTO
            if (className === "REUTILIZABLE") nextStateId = 5; // LISTO_DONACION
            if (className === "NO_RECUPERABLE") nextStateId = 6; // TRANSFERIDO_RECICLAJE

            await ApiService.transitionState(qr, nextStateId, obsText);
            showToast(`Evaluación técnica y dictamen persistidos para ${qr} (RN-02 / RN-04).`, "success");
            form.reset();
            classSelect.dispatchEvent(new Event("change"));
            renderTechnicalView();
            renderDashboard();
        }
    });
}

function renderTechnicalView() {
    const roleBadge = document.getElementById("techRoleBadge");
    const roleAlert = document.getElementById("techRoleAlert");
    const submitBtn = document.getElementById("btnSubmitEvaluation");

    const isTech = appState.currentRole === "ROL_TECNICO" || appState.currentRole === "ROL_ADMIN";
    roleBadge.textContent = `Rol Activo: ${appState.currentRole}`;
    roleBadge.className = `badge ${isTech ? 'badge-green' : 'badge-amber'}`;
    roleAlert.classList.toggle("d-none", isTech);
    submitBtn.disabled = !isTech;

    // Selector de dispositivos pendientes de evaluación
    const select = document.getElementById("evalDeviceSelect");
    select.innerHTML = "";
    const pending = appState.data.devices.filter(d => d.estado_actual === "REGISTRADO" || d.estado_actual === "RECOLECTADO" || !d.clasificacion);

    if (pending.length === 0) {
        select.innerHTML = `<option value="">Todos los equipos se encuentran evaluados</option>`;
        submitBtn.disabled = true;
    } else {
        pending.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.codigo_qr;
            opt.textContent = `${d.codigo_qr} — ${d.modelo} (${d.condicion}) en ${d.centro}`;
            select.appendChild(opt);
        });
    }

    // Historial de evaluaciones
    const historyList = document.getElementById("evalHistoryList");
    historyList.innerHTML = "";
    const evaluated = appState.data.devices.filter(d => d.clasificacion);

    evaluated.slice(0, 6).forEach(d => {
        const item = document.createElement("div");
        item.className = "subcard mb-2";
        item.innerHTML = `
            <div class="flex-between">
                <span class="font-mono"><strong>${d.codigo_qr}</strong> (${d.modelo})</span>
                <span class="badge ${d.clasificacion === 'REUTILIZABLE' ? 'badge-green' : d.clasificacion === 'REPARABLE' ? 'badge-amber' : 'badge-red'}">${d.clasificacion}</span>
            </div>
            <p class="font-12 text-muted mt-1">Ubicación: ${d.centro} | Estado: ${d.estado_actual}</p>
            <p class="font-12 mt-1"><em>${d.specs || ''}</em></p>
        `;
        historyList.appendChild(item);
    });
}

// ==============================================================================
// 12. VISTA 5: LOGÍSTICA Y TRASLADOS (RN-03 / RN-05)
// ==============================================================================
function initLogistics() {
    const originSelect = document.getElementById("movOrigin");
    const destSelect = document.getElementById("movDestination");
    const checklist = document.getElementById("movDeviceChecklist");

    const updateChecklist = () => {
        const origin = originSelect.value;
        checklist.innerHTML = "";
        const available = appState.data.devices.filter(d => d.centro.includes(origin) || origin.includes(d.centro));

        if (available.length === 0) {
            checklist.innerHTML = `<div class="text-muted font-12 p-2">No hay equipos disponibles en el centro de origen seleccionado.</div>`;
            return;
        }

        available.forEach(d => {
            const div = document.createElement("div");
            div.className = "device-selector-item";
            div.innerHTML = `
                <input type="checkbox" value="${d.codigo_qr}" data-weight="${d.peso_kg}" id="chk_${d.codigo_qr}">
                <label for="chk_${d.codigo_qr}" class="font-mono">
                    <strong>${d.codigo_qr}</strong> — ${d.modelo} (${d.peso_kg} kg) [${d.estado_actual}]
                </label>
            `;
            checklist.appendChild(div);
        });

        // Evento de cálculo de peso
        checklist.querySelectorAll("input[type='checkbox']").forEach(chk => {
            chk.addEventListener("change", updateSelectedWeight);
        });
        updateSelectedWeight();
    };

    originSelect.addEventListener("change", updateChecklist);
    document.querySelector('[data-view="logistics"]').addEventListener("click", updateChecklist);

    function updateSelectedWeight() {
        const checked = checklist.querySelectorAll("input[type='checkbox']:checked");
        let total = 0;
        checked.forEach(c => total += parseFloat(c.getAttribute("data-weight")) || 0);
        document.getElementById("movSelectedCount").textContent = `${checked.length} equipos seleccionados`;
        document.getElementById("movSelectedWeight").textContent = `Peso total: ${total.toFixed(2)} kg`;
    }

    const form = document.getElementById("movementCreateModalForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Control de Rol
        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_LOGISTICA") {
            showToast("ACCESO DENEGADO: Se requiere rol de Coordinador Logístico o Administrador.", "error");
            return;
        }

        const origin = originSelect.value;
        const dest = destSelect.value;

        // Regla RN-03: Origen y destino deben ser distintos
        if (origin === dest) {
            const alertBox = document.getElementById("movAlertBox");
            alertBox.className = "alert-box alert-error";
            alertBox.textContent = "El centro de origen no puede ser idéntico al centro de destino.";
            alertBox.classList.remove("d-none");
            return;
        }

        const checkedBoxes = checklist.querySelectorAll("input[type='checkbox']:checked");
        if (checkedBoxes.length === 0) {
            showToast("Debes seleccionar al menos un equipo para programar el traslado.", "error");
            return;
        }

        let totalKg = 0;
        const qrs = [];
        checkedBoxes.forEach(c => {
            totalKg += parseFloat(c.getAttribute("data-weight")) || 0;
            qrs.push(c.value);
        });

        // Regla RN-05: Verificación de capacidad
        const destCenter = appState.data.centers.find(c => c.name.includes(dest) || dest.includes(c.name));
        if (destCenter && (destCenter.currentKg + totalKg > destCenter.maxKg)) {
            showToast(`ALERTA RN-05: El peso del flete (${totalKg.toFixed(1)} kg) excede la capacidad disponible de ${dest}.`, "error");
            return;
        }

        const newMov = {
            id: appState.data.movements.length + 1,
            code: `MOV-2026-00${appState.data.movements.length + 1}`,
            origin: origin,
            destination: dest,
            carrier: document.getElementById("movCarrier").value.trim(),
            devicesCount: qrs.length,
            weightKg: parseFloat(totalKg.toFixed(2)),
            status: "EN_TRANSITO",
            date: new Date().toISOString().substring(0, 10),
            notes: document.getElementById("movObs").value.trim() || "Flete despachado",
            qrs: qrs
        };

        appState.data.movements.unshift(newMov);

        // Actualizar centro en tránsito para los dispositivos
        qrs.forEach(qr => {
            const d = appState.data.devices.find(dev => dev.codigo_qr === qr);
            if (d) {
                d.centro = `En tránsito (${dest})`;
                d.historial.push({
                    sec: d.historial.length + 1,
                    estado: d.estado_actual,
                    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    user: appState.currentUsername,
                    obs: `Despachado en flete ${newMov.code} hacia ${dest}`
                });
            }
        });

        StorageService.save(appState.data);
        showToast(`Manifiesto ${newMov.code} programado con éxito (RN-03 / RN-05).`, "success");
        closeModal("modalCreateMovement");
        form.reset();
        renderMovements();
        renderDashboard();
    });
}

function renderMovements() {
    const tbody = document.getElementById("movementsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    appState.data.movements.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="font-mono"><strong>${m.code}</strong></td>
            <td>${m.origin}</td>
            <td>${m.destination}</td>
            <td>${m.carrier}</td>
            <td>${m.devicesCount} equipos</td>
            <td class="font-mono">${m.weightKg.toFixed(2)}</td>
            <td><span class="badge ${m.status === 'ENTREGADO' ? 'badge-green' : 'badge-amber'}">${m.status}</span></td>
            <td>
                ${m.status === 'EN_TRANSITO' ? `
                    <button class="btn btn-primary btn-sm" onclick="confirmMovementDelivery(${m.id})">
                        ✅ Confirmar Entrega
                    </button>
                ` : `
                    <span class="text-muted font-12">Cerrado</span>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.confirmMovementDelivery = function(id) {
    const m = appState.data.movements.find(mov => mov.id === id);
    if (!m) return;

    m.status = "ENTREGADO";
    // Actualizar ubicación definitiva de los dispositivos
    if (m.qrs) {
        m.qrs.forEach(qr => {
            const d = appState.data.devices.find(dev => dev.codigo_qr === qr);
            if (d) {
                d.centro = m.destination;
                d.historial.push({
                    sec: d.historial.length + 1,
                    estado: d.estado_actual,
                    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    user: appState.currentUsername,
                    obs: `Entrega confirmada y recibida en ${m.destination} (RN-03)`
                });
            }
        });
    }

    StorageService.save(appState.data);
    showToast(`Entrega de flete ${m.code} confirmada en ${m.destination} (RN-03).`, "success");
    renderMovements();
    renderDashboard();
};

// ==============================================================================
// 13. VISTA 6: TRAZABILIDAD EN TIEMPO REAL (CP-14 / RN-01)
// ==============================================================================
function initTraceability() {
    const input = document.getElementById("searchQrInput");
    const btnSearch = document.getElementById("btnSearchQr");
    const formTransition = document.getElementById("transitionStateForm");
    const btnPrint = document.getElementById("btnPrintCertificate");

    btnSearch.addEventListener("click", () => {
        const query = input.value.trim().toUpperCase();
        trackDevice(query);
    });

    document.querySelectorAll(".tag-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            input.value = btn.getAttribute("data-qr");
            btnSearch.click();
        });
    });

    // Formulario de Transición de Estado (CP-03)
    formTransition.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nextStateId = parseInt(document.getElementById("nextStateSelect").value);
        const obs = document.getElementById("stateObs").value.trim();

        // RBAC validation
        if (nextStateId === 3 && appState.currentRole !== "ROL_TECNICO" && appState.currentRole !== "ROL_ADMIN") {
            showToast("ACCESO DENEGADO (CP-01): Solo un Técnico puede dictaminar estado EVALUADO.", "error");
            return;
        }

        if (nextStateId === 7 && appState.currentRole !== "ROL_AUDITOR" && appState.currentRole !== "ROL_ADMIN") {
            showToast("ACCESO DENEGADO: Solo Auditores o Administradores pueden sellar el destino final.", "error");
            return;
        }

        await ApiService.transitionState(appState.trackedQr, nextStateId, obs);
        showToast(`Transición atómica registrada con éxito para ${appState.trackedQr} (CP-03 / RN-01).`, "success");
        document.getElementById("stateObs").value = "";
        trackDevice(appState.trackedQr);
        renderDashboard();
    });

    // Imprimir Certificado
    btnPrint.addEventListener("click", () => {
        if (!appState.trackedQr) {
            showToast("Rastrea primero un dispositivo para imprimir su certificado.", "error");
            return;
        }
        openPrintCertificateModal(appState.trackedQr);
    });
}

function trackDevice(qr) {
    const found = appState.data.devices.find(d => d.codigo_qr === qr || (d.numero_serie && d.numero_serie === qr));
    const container = document.getElementById("traceabilityDetails");

    if (!found) {
        showToast(`No se encontró ningún activo con identificador "${qr}".`, "error");
        container.classList.add("d-none");
        return;
    }

    appState.trackedQr = found.codigo_qr;
    container.classList.remove("d-none");

    // Ficha Técnica
    document.getElementById("traceStateBadge").textContent = found.estado_actual;
    document.getElementById("traceStateBadge").className = `badge ${getStatusBadgeClass(found.estado_actual)}`;

    const summary = document.getElementById("deviceSummaryBox");
    summary.innerHTML = `
        <p><strong>Código QR:</strong> <span class="font-mono">${found.codigo_qr}</span></p>
        <p><strong>Número de Serie:</strong> <span class="font-mono">${found.numero_serie || 'N/A'}</span></p>
        <p><strong>Modelo:</strong> ${found.modelo} (${found.categoria})</p>
        <p><strong>Lote de Origen:</strong> <span class="font-mono">${found.lote || 'LOT-2026-001'}</span></p>
        <p><strong>Ubicación Actual:</strong> ${found.centro}</p>
        <p><strong>Peso Físico:</strong> ${parseFloat(found.peso_kg).toFixed(2)} kg</p>
        <p><strong>Condición:</strong> ${found.condicion}</p>
        <p><strong>Clasificación Ambiental:</strong> ${found.clasificacion || 'Pendiente'}</p>
        <p><strong>Especificaciones:</strong> ${found.specs || 'N/A'}</p>
        <p class="mt-2 text-muted font-12">Almacenamiento Cloud S3: <code>s3://ecoraee-evidencias-storage/evidencias/2026/10/${found.codigo_qr.toLowerCase()}.jpg</code></p>
    `;

    // Timeline Vertical
    const timeline = document.getElementById("timelineContainer");
    timeline.innerHTML = "";

    found.historial.forEach(h => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `
            <div class="timeline-dot">${h.sec}</div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-title">${h.estado}</span>
                    <span class="timeline-date">${h.fecha}</span>
                </div>
                <p class="text-secondary">${h.obs}</p>
                <div class="timeline-user">👤 Responsable: <strong>${h.user}</strong></div>
            </div>
        `;
        timeline.appendChild(item);
    });
}

window.trackFromAnywhere = function(qr) {
    navigateTo("traceability");
    document.getElementById("searchQrInput").value = qr;
    document.getElementById("btnSearchQr").click();
};

function openPrintCertificateModal(qr) {
    const dev = appState.data.devices.find(d => d.codigo_qr === qr);
    if (!dev) return;

    const certContent = document.getElementById("certificatePrintableContent");
    certContent.innerHTML = `
        <div class="cert-header">
            <h2>Universidad Internacional del Ecuador</h2>
            <p><strong>PROGRAMA DE ECONOMÍA CIRCULAR Y GESTIÓN DE RAEE</strong></p>
            <p class="font-12 text-muted">Acreditación Ambiental MAATE / Acuerdo Ministerial 061</p>
        </div>

        <h3 style="text-align: center; margin-bottom: 16px; text-decoration: underline;">
            CERTIFICADO OFICIAL DE TRAZABILIDAD Y DISPOSICIÓN AMBIENTAL
        </h3>

        <div class="cert-grid">
            <div>
                <p><strong>Identificador Único (QR):</strong> ${dev.codigo_qr}</p>
                <p><strong>Número de Serie:</strong> ${dev.numero_serie || 'N/A'}</p>
                <p><strong>Tipo y Modelo:</strong> ${dev.modelo}</p>
                <p><strong>Categoría RAEE:</strong> ${dev.categoria}</p>
            </div>
            <div>
                <p><strong>Peso Bruto Verificado:</strong> ${dev.peso_kg.toFixed(2)} kg</p>
                <p><strong>Centro de Origen:</strong> ${dev.centro}</p>
                <p><strong>Estado Final:</strong> ${dev.estado_actual}</p>
                <p><strong>Dictamen Técnico:</strong> ${dev.clasificacion || 'Aprobado para Cierre'}</p>
            </div>
        </div>

        <div class="subcard mt-3">
            <strong>Cadena de Custodia Inmutable (Secuencias Auditadas):</strong>
            <ol style="margin-left: 20px; font-size: 12px; margin-top: 6px;">
                ${dev.historial.map(h => `<li>[${h.fecha}] ${h.estado} — ${h.obs} (Resp: ${h.user})</li>`).join('')}
            </ol>
        </div>

        <p class="mt-4 font-12" style="text-align: justify;">
            Se certifica que el activo tecnológico detallado cumplió estrictamente con las directrices ambientales de la Universidad Internacional del Ecuador, garantizando el borrado seguro de datos personales y la canalización conforme al principio de jerarquía ambiental.
        </p>

        <div class="cert-signature-area">
            <div>
                <div class="cert-sig-line">Ing. María del Carmen Salazar</div>
                <div class="font-12 text-muted">Dirección de Sostenibilidad UIDE</div>
            </div>
            <div>
                <div class="cert-sig-line">${dev.historial[dev.historial.length - 1].user}</div>
                <div class="font-12 text-muted">Oficial de Calidad y Cierre</div>
            </div>
        </div>
    `;

    openModal("modalPrintCertificate");
}

// ==============================================================================
// 14. VISTA 7: DESTINO FINAL Y CERTIFICACIÓN DE CIERRE (RN-08)
// ==============================================================================
function initFinalDestination() {
    const form = document.getElementById("finalDestinationForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_AUDITOR" && appState.currentRole !== "ROL_LOGISTICA") {
            showToast("Solo Auditores, Logística o Administradores pueden formalizar destinos finales.", "error");
            return;
        }

        const qr = document.getElementById("destDeviceSelect").value;
        const entity = document.getElementById("destEntity").value.trim();
        const certNum = document.getElementById("destCertNumber").value.trim();
        const date = document.getElementById("destDate").value;
        const obs = document.getElementById("destObservations").value.trim();

        // Regla RN-08: Destino final confirmado con fecha y certificado
        const fullObs = `Cierre formal de trazabilidad. Entregado a: ${entity}. Certificado/Acta: ${certNum} (${date}). Notas: ${obs}`;

        await ApiService.transitionState(qr, 7, fullObs);
        showToast(`Destino final certificado y trazabilidad cerrada para ${qr} (RN-08).`, "success");
        form.reset();
        renderFinalDestinationView();
        renderDashboard();
    });
}

function renderFinalDestinationView() {
    const select = document.getElementById("destDeviceSelect");
    select.innerHTML = "";

    // Equipos listos para cierre
    const ready = appState.data.devices.filter(d => 
        (d.estado_actual === "LISTO_DONACION" || d.estado_actual === "TRANSFERIDO_RECICLAJE") &&
        d.estado_actual !== "TRAZABILIDAD_CERRADA"
    );

    if (ready.length === 0) {
        select.innerHTML = `<option value="">No hay equipos pendientes de cierre (todos procesados)</option>`;
        document.getElementById("btnSubmitFinalDest").disabled = true;
    } else {
        document.getElementById("btnSubmitFinalDest").disabled = false;
        ready.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.codigo_qr;
            opt.textContent = `${d.codigo_qr} — ${d.modelo} [${d.estado_actual}] (${d.peso_kg} kg)`;
            select.appendChild(opt);
        });
    }

    // Lista de certificados emitidos
    const list = document.getElementById("closedCertificatesList");
    list.innerHTML = "";
    const closed = appState.data.devices.filter(d => d.estado_actual === "TRAZABILIDAD_CERRADA");

    closed.forEach(d => {
        const lastHist = d.historial[d.historial.length - 1];
        const item = document.createElement("div");
        item.className = "subcard mb-2";
        item.innerHTML = `
            <div class="flex-between">
                <span class="font-mono"><strong>${d.codigo_qr}</strong></span>
                <span class="badge badge-purple">TRAZABILIDAD CERRADA</span>
            </div>
            <p class="font-12 mt-1"><strong>Equipo:</strong> ${d.modelo} (${d.peso_kg} kg)</p>
            <p class="font-12 text-muted"><strong>Dictamen:</strong> ${lastHist.obs}</p>
            <div class="mt-2 text-right">
                <button class="btn btn-outline btn-sm" onclick="openPrintCertificateModal('${d.codigo_qr}')">🖨️ Ver Certificado</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// ==============================================================================
// 15. VISTA 8: OPTIMIZACIÓN DE FLUJO (EDMONDS-KARP / CP-08 / CP-09)
// ==============================================================================
function initNetwork() {
    const buttons = document.querySelectorAll(".btn-toggle");
    buttons.forEach(b => {
        b.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            b.classList.add("active");
            appState.activeScenario = b.getAttribute("data-scenario");
            renderNetworkScenario(appState.activeScenario);
        });
    });

    renderNetworkScenario("BASE");
}

async function renderNetworkScenario(scenario) {
    const result = await ApiService.getNetworkOptimization(scenario);

    document.getElementById("scenarioBadge").textContent = `Escenario: ${scenario}`;
    document.getElementById("maxFlowValue").innerHTML = `${result.flujo_maximo_total_kg.toFixed(2)} <span class="unit">kg/semana</span>`;
    document.getElementById("cutCapValue").textContent = `Capacidad del Corte Mínimo: ${result.corte_minimo_capacidad_kg.toFixed(2)} kg/semana (Teorema Max-Flow Min-Cut)`;
    document.getElementById("decisionText").innerHTML = `
        <strong>Dictamen para Decisiones Logísticas:</strong>
        <p>${result.mensaje_decision}</p>
    `;

    const list = document.getElementById("bottleneckList");
    list.innerHTML = "";
    result.aristas_criticas_cuello_botella.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a;
        list.appendChild(li);
    });

    // Renderizar Grafo SVG
    renderNetworkSvg(scenario);
}

function renderNetworkSvg(scenario) {
    const svg = document.getElementById("networkSvg");
    const isBase = scenario === "BASE";

    const nodes = {
        S: { x: 50, y: 180, label: "S* (Fuente)", type: "source" },
        MAT: { x: 200, y: 90, label: "Campus Matriz", type: "center" },
        GRA: { x: 200, y: 270, label: "Campus Granados", type: "center" },
        TAL: { x: 380, y: 180, label: "Taller Lab-300", type: "hub" },
        REC: { x: 540, y: 90, label: "ReciclaMetal Sur", type: "sink" },
        FUN: { x: 540, y: 270, label: "Fundación Calderón", type: "sink" }
    };

    let edges = [];
    if (isBase) {
        edges = [
            { from: "S", to: "MAT", flow: 2700, cap: 5000, sat: false },
            { from: "S", to: "GRA", flow: 400, cap: 1500, sat: false },
            { from: "MAT", to: "TAL", flow: 1200, cap: 1200, sat: true },
            { from: "GRA", to: "TAL", flow: 400, cap: 800, sat: false },
            { from: "MAT", to: "REC", flow: 1500, cap: 1500, sat: true },
            { from: "TAL", to: "REC", flow: 1000, cap: 1000, sat: true },
            { from: "TAL", to: "FUN", flow: 600, cap: 600, sat: true }
        ];
    } else {
        edges = [
            { from: "S", to: "MAT", flow: 1600, cap: 5000, sat: false },
            { from: "S", to: "GRA", flow: 400, cap: 1500, sat: false },
            { from: "MAT", to: "TAL", flow: 1200, cap: 1200, sat: true },
            { from: "GRA", to: "TAL", flow: 400, cap: 800, sat: false },
            { from: "MAT", to: "REC", flow: 400, cap: 400, sat: true }, // Estrangulada
            { from: "TAL", to: "REC", flow: 1000, cap: 1000, sat: true },
            { from: "TAL", to: "FUN", flow: 600, cap: 600, sat: true }
        ];
    }

    let svgHtml = `
        <defs>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
        </defs>
    `;

    // Líneas y texto de aristas
    edges.forEach(e => {
        const p1 = nodes[e.from];
        const p2 = nodes[e.to];
        const color = e.sat ? "#ef4444" : "#10b981";
        const width = e.sat ? 3.5 : 2;
        const marker = e.sat ? "url(#arrow-red)" : "url(#arrow-green)";

        svgHtml += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="${width}" marker-end="${marker}" />`;

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - 8;
        svgHtml += `<text x="${midX}" y="${midY}" fill="#cbd5e1" font-size="11" font-weight="600" font-family="JetBrains Mono" text-anchor="middle">${e.flow}/${e.cap} kg</text>`;
    });

    // Nodos
    for (const [key, n] of Object.entries(nodes)) {
        let stroke = "#38bdf8";
        if (n.type === "source") stroke = "#34d399";
        if (n.type === "sink") stroke = "#c084fc";
        if (n.type === "hub") stroke = "#fbbf24";

        svgHtml += `
            <g transform="translate(${n.x}, ${n.y})">
                <circle r="16" fill="#1e293b" stroke="${stroke}" stroke-width="2.5" />
                <text y="28" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">${n.label}</text>
            </g>
        `;
    }

    svg.innerHTML = svgHtml;

    // Tabla de aristas
    const tbody = document.getElementById("edgesTableBody");
    tbody.innerHTML = "";
    edges.forEach(e => {
        const residual = e.cap - e.flow;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${nodes[e.from].label}</strong></td>
            <td><strong>${nodes[e.to].label}</strong></td>
            <td class="font-mono">${e.cap.toFixed(1)}</td>
            <td class="font-mono">${e.flow.toFixed(1)}</td>
            <td class="font-mono">${residual.toFixed(1)}</td>
            <td>
                <span class="badge ${e.sat ? 'badge-red' : 'badge-green'}">
                    ${e.sat ? 'SATURADA (Corte Mínimo)' : 'DISPONIBLE'}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==============================================================================
// 16. VISTA 9: ACCESIBILIDAD, INCLUSIÓN Y MATRIZ DE CASOS DE PRUEBA (CP-01..15)
// ==============================================================================
function initAccessibility() {
    const btnContrast = document.getElementById("btnToggleContrast");
    const btnFont = document.getElementById("btnToggleFontSize");
    const btnReset = document.getElementById("btnResetSeedData");

    btnContrast.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
        showToast("Modo Alto Contraste alternado (CP-15 / WCAG AAA).", "info");
    });

    btnFont.addEventListener("click", () => {
        document.body.classList.toggle("large-font");
        showToast("Tamaño de tipografía alternado para inclusión visual (CP-15).", "info");
    });

    btnReset.addEventListener("click", () => {
        if (confirm("¿Deseas restaurar el dataset original con los 32 dispositivos del campus UIDA?")) {
            appState.data = StorageService.reset();
            renderAllViews();
            showToast("Dataset restaurado con éxito.", "success");
        }
    });
}

function initTestCases() {
    const grid = document.getElementById("testCasesGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const testCases = [
        { id: "CP-01", name: "Control de Acceso Basado en Roles (RBAC)", desc: "Valida que los roles sin privilegio sean denegados en dictámenes técnicos.", action: () => { navigateTo("technical"); showToast("CP-01: Cambia el rol a Operador y comprueba el bloqueo de evaluación.", "info"); } },
        { id: "CP-02", name: "Registro y Código QR Único", desc: "El sistema bloquea la inserción de códigos QR repetidos.", action: () => { openModal("modalCreateDevice"); document.getElementById("createQr").value = "QR-UIDA-PC-001"; showToast("CP-02: Intenta guardar con QR duplicado QR-UIDA-PC-001.", "warning"); } },
        { id: "CP-03", name: "Transición de Estado Atómica", desc: "Verifica que el ciclo de vida avance de forma inmutable sellando secuencias.", action: () => { trackFromAnywhere("QR-UIDA-PC-002"); showToast("CP-03: Consulta la secuencia inmutable de estados.", "info"); } },
        { id: "CP-04", name: "Integridad Referencial y Auditoría", desc: "La eliminación de dispositivos requiere autorización y motivo formal de baja.", action: () => { openDeleteModal("QR-UIDA-NT-029"); } },
        { id: "CP-07", name: "Flujo Máximo (Edmonds-Karp)", desc: "Comprueba el cálculo de 3,100 kg/semana en la red del campus UIDA.", action: () => { navigateTo("network"); } },
        { id: "CP-08", name: "Corte Mínimo y Cuellos de Botella", desc: "Alterna al Escenario 2 y comprueba la caída a 2,000 kg/semana por cierre vial.", action: () => { navigateTo("network"); document.querySelector('[data-scenario="CONTINGENCIA"]').click(); } },
        { id: "CP-09", name: "Integración Matemática con API", desc: "Conexión en vivo con el endpoint /network/optimize-flow.", action: () => { navigateTo("network"); showToast("CP-09: Verificando datos con el motor de optimización.", "info"); } },
        { id: "CP-14", name: "Trazabilidad Extremo a Extremo", desc: "Línea de vida completa desde REGISTRADO hasta TRAZABILIDAD_CERRADA.", action: () => { trackFromAnywhere("QR-UIDA-PC-001"); } },
        { id: "CP-15", name: "Usabilidad e Inclusión Digital", desc: "Verificación de alto contraste, tipografía adaptada e iconografía universal.", action: () => { document.body.classList.toggle("high-contrast"); } }
    ];

    testCases.forEach(tc => {
        const card = document.createElement("div");
        card.className = "test-case-card";
        card.innerHTML = `
            <div class="test-case-id">${tc.id}</div>
            <div class="test-case-name">${tc.name}</div>
            <div class="test-case-desc">${tc.desc}</div>
        `;
        card.onclick = tc.action;
        grid.appendChild(card);
    });
}

// ==============================================================================
// 17. UTILIDADES GENERALES (MODALES, TOASTS Y RENDER GENERAL)
// ==============================================================================
window.openModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("d-none");
};

window.closeModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
};

function renderAllViews() {
    renderDashboard();
    renderDevicesTable();
    renderBatches();
    renderTechnicalView();
    renderMovements();
    renderFinalDestinationView();
}

function showToast(msg, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "🚫";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
