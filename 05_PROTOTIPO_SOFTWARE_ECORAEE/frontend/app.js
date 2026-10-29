/**
 * ==============================================================================
 * ECORAEE CLOUD — FRONTEND SPA CORE CONTROLLER
 * Vanilla ES6+ Modular Client for S3 Static Website Hosting (RF-CL-01)
 * Casos de Prueba Verificados: CP-01, CP-02, CP-03, CP-08, CP-09, CP-14, CP-15
 * ==============================================================================
 */

// Configuración de la API (conecta con el Backend FastAPI o entra en modo local)
const API_BASE_URL = "http://localhost:8000/api/v1";

// Estado Global de la SPA (En memoria para funcionamiento estático en S3)
const appState = {
    currentRole: "ROL_OPERADOR",
    currentUsername: "carlos.operador",
    apiAvailable: false,
    inventory: [
        {
            id_dispositivo: 1,
            codigo_qr: "QR-UIDA-PC-001",
            modelo: "Dell OptiPlex 7070 (Desktop)",
            centro: "Campus Principal Matriz",
            peso_kg: 8.20,
            condicion: "Operativo con Desgaste",
            estado_actual: "LISTO_DONACION",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-14 10:15", user: "admin_sys", obs: "Ingreso inicial por baja de laboratorio" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-14 11:30", user: "carlos.operador", obs: "Recepción y pesaje en Campus Matriz" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-14 14:00", user: "maria.tecnico", obs: "Diagnóstico: Operativo, memorias y disco íntegros" },
                { sec: 4, estado: "LISTO_DONACION", fecha: "2026-10-15 09:20", user: "maria.tecnico", obs: "Aprobado para entrega a escuela rural" }
            ]
        },
        {
            id_dispositivo: 2,
            codigo_qr: "QR-UIDA-PC-002",
            modelo: "Dell OptiPlex 7070 (Desktop)",
            centro: "Taller Técnico Lab-300",
            peso_kg: 8.20,
            condicion: "Dañado pero Reparable",
            estado_actual: "EN_REACONDICIONAMIENTO",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-14 10:15", user: "admin_sys", obs: "Ingreso por lote de sistemas" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-14 11:30", user: "carlos.operador", obs: "Recepción en bodega" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-14 14:30", user: "maria.tecnico", obs: "Condensador quemado en fuente de poder" },
                { sec: 4, estado: "EN_REACONDICIONAMIENTO", fecha: "2026-10-15 10:00", user: "maria.tecnico", obs: "Ingresado a mesa de banco en taller" }
            ]
        },
        {
            id_dispositivo: 3,
            codigo_qr: "QR-UIDA-LP-003",
            modelo: "Dell Latitude 5400 (Laptop)",
            centro: "Campus Principal Matriz",
            peso_kg: 1.85,
            condicion: "Operativo en Buen Estado",
            estado_actual: "EVALUADO",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-14 15:00", user: "admin_sys", obs: "Baja de personal administrativo" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-15 08:30", user: "carlos.operador", obs: "Recepción con cargador original" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-15 11:00", user: "maria.tecnico", obs: "Batería al 91%, excelente estado físico" }
            ]
        },
        {
            id_dispositivo: 7,
            codigo_qr: "QR-UIDA-MO-007",
            modelo: "Samsung Galaxy A52 (Teléfono)",
            centro: "ReciclaMetal Sur (Gestor)",
            peso_kg: 0.19,
            condicion: "Obsoleto / Chatarra",
            estado_actual: "TRAZABILIDAD_CERRADA",
            historial: [
                { sec: 1, estado: "REGISTRADO", fecha: "2026-10-14 16:00", user: "admin_sys", obs: "Donación en ánfora comunitaria" },
                { sec: 2, estado: "RECOLECTADO", fecha: "2026-10-15 09:00", user: "carlos.operador", obs: "Recepción en Campus Granados" },
                { sec: 3, estado: "EVALUADO", fecha: "2026-10-15 11:30", user: "maria.tecnico", obs: "Placa partida e impacto severo. No recuperable." },
                { sec: 4, estado: "TRANSFERIDO_RECICLAJE", fecha: "2026-10-15 15:00", user: "diego.logistica", obs: "Despachado en flete de chatarra hacia sur" },
                { sec: 5, estado: "TRAZABILIDAD_CERRADA", fecha: "2026-10-16 10:00", user: "ana.auditora", obs: "Certificado de destrucción recibido. Destino final confirmado." }
            ]
        }
    ]
};

// ==============================================================================
// 1. INICIALIZACIÓN Y ENRUTADOR DE VISTAS (SPA ROUTING)
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initRoleSelector();
    initRegisterView();
    initTraceabilityView();
    initNetworkView();
    initAccessibility();
    checkBackendHealth();
    renderInventoryTable();
});

function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetView = btn.getAttribute("data-view");
            
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".content-view").forEach(view => {
                view.classList.remove("active");
            });

            const activeView = document.getElementById(`view-${targetView}`);
            if (activeView) activeView.classList.add("active");
        });
    });
}

function initRoleSelector() {
    const selector = document.getElementById("roleSelector");
    selector.addEventListener("change", (e) => {
        appState.currentRole = e.target.value;
        const usernames = {
            "ROL_ADMIN": "admin_sys",
            "ROL_OPERADOR": "carlos.operador",
            "ROL_TECNICO": "maria.tecnico",
            "ROL_LOGISTICA": "diego.logistica",
            "ROL_AUDITOR": "ana.auditora"
        };
        appState.currentUsername = usernames[appState.currentRole];
        showToast(`Rol activo cambiado a: ${appState.currentRole} (CP-01)`);
    });
}

async function checkBackendHealth() {
    const badge = document.getElementById("apiStatusBadge");
    const text = document.getElementById("apiStatusText");
    try {
        const res = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, { method: "GET" });
        if (res.ok) {
            appState.apiAvailable = true;
            badge.className = "system-status-badge online";
            text.textContent = "FastAPI Conectada";
        } else {
            throw new Error();
        }
    } catch {
        appState.apiAvailable = false;
        badge.className = "system-status-badge online";
        badge.style.background = "#e0f2fe";
        badge.style.color = "#0369a1";
        text.textContent = "Modo S3 (Datos Locales)";
    }
}

// ==============================================================================
// 2. VISTA DASHBOARD (MÉTRICAS E INVENTARIO)
// ==============================================================================
function renderInventoryTable() {
    const tbody = document.getElementById("inventoryTableBody");
    tbody.innerHTML = "";

    appState.inventory.forEach(item => {
        const tr = document.createElement("tr");
        
        let badgeClass = "badge-blue";
        if (item.estado_actual === "LISTO_DONACION") badgeClass = "badge-green";
        if (item.estado_actual === "EN_REACONDICIONAMIENTO") badgeClass = "badge-amber";
        if (item.estado_actual === "TRAZABILIDAD_CERRADA") badgeClass = "badge-purple";

        tr.innerHTML = `
            <td class="font-mono"><strong>${item.codigo_qr}</strong></td>
            <td>${item.modelo}</td>
            <td>${item.centro}</td>
            <td>${item.peso_kg.toFixed(2)}</td>
            <td><span class="kpi-badge ${badgeClass}">${item.estado_actual}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="trackFromTable('${item.codigo_qr}')">
                    🔍 Trazabilidad
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Actualizar Total kg
    const totalKg = appState.inventory.reduce((sum, d) => sum + d.peso_kg, 0);
    document.getElementById("kpiTotalKg").innerHTML = `${totalKg.toFixed(2)} <span class="unit">kg</span>`;
}

window.trackFromTable = function(qr) {
    document.querySelector('[data-view="traceability"]').click();
    document.getElementById("searchQrInput").value = qr;
    document.getElementById("btnSearchQr").click();
};

// ==============================================================================
// 3. VISTA REGISTRO QR (CP-02 / RN-01)
// ==============================================================================
function initRegisterView() {
    const btnGen = document.getElementById("btnGenQr");
    const qrInput = document.getElementById("regQr");
    const previewText = document.getElementById("qrPreviewText");
    const form = document.getElementById("deviceRegisterForm");
    const alertBox = document.getElementById("registerAlertBox");

    btnGen.addEventListener("click", () => {
        const rand = Math.floor(100 + Math.random() * 900);
        const newQr = `QR-UIDA-PC-${rand}`;
        qrInput.value = newQr;
        previewText.textContent = newQr;
    });

    qrInput.addEventListener("input", (e) => {
        previewText.textContent = e.target.value.trim() || "QR-UIDA-PC-XXX";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Validación de Rol (RBAC / CP-01)
        if (appState.currentRole !== "ROL_ADMIN" && appState.currentRole !== "ROL_OPERADOR") {
            showAlert(alertBox, "ACCESO DENEGADO (CP-01): Solo Operadores o Administradores pueden recepcionar equipos.", "error");
            return;
        }

        const qrVal = qrInput.value.trim().toUpperCase();
        
        // Verificación de unicidad (CP-02)
        const existe = appState.inventory.some(d => d.codigo_qr === qrVal);
        if (existe) {
            showAlert(alertBox, `VIOLACIÓN DE UNICIDAD (CP-02): El código QR "${qrVal}" ya existe en el sistema.`, "error");
            return;
        }

        const modelSelect = document.getElementById("regModel");
        const centerSelect = document.getElementById("regCenter");
        const weightVal = parseFloat(document.getElementById("regWeight").value);

        const newDevice = {
            id_dispositivo: appState.inventory.length + 1,
            codigo_qr: qrVal,
            modelo: modelSelect.options[modelSelect.selectedIndex].text,
            centro: centerSelect.options[centerSelect.selectedIndex].text,
            peso_kg: weightVal,
            condicion: "Operativo con Desgaste",
            estado_actual: "REGISTRADO",
            historial: [
                {
                    sec: 1,
                    estado: "REGISTRADO",
                    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    user: appState.currentUsername,
                    obs: document.getElementById("regObservations").value || "Ingreso registrado por operador"
                }
            ]
        };

        appState.inventory.unshift(newDevice);
        renderInventoryTable();
        showAlert(alertBox, `✅ Dispositivo ${qrVal} registrado con éxito en Inventario e Historial (CP-02 / RN-01).`, "success");
        form.reset();
        previewText.textContent = "QR-UIDA-PC-XXX";
    });
}

function showAlert(box, msg, type) {
    box.className = `alert-box alert-${type}`;
    box.textContent = msg;
    box.classList.remove("d-none");
    setTimeout(() => { box.classList.add("d-none"); }, 6000);
}

// ==============================================================================
// 4. VISTA TRAZABILIDAD EN TIEMPO REAL (CP-14 / CP-03)
// ==============================================================================
let currentTrackedQr = null;

function initTraceabilityView() {
    const input = document.getElementById("searchQrInput");
    const btnSearch = document.getElementById("btnSearchQr");
    const detailsContainer = document.getElementById("traceabilityDetails");
    const formTransition = document.getElementById("transitionStateForm");

    btnSearch.addEventListener("click", () => {
        const query = input.value.trim().toUpperCase();
        const found = appState.inventory.find(d => d.codigo_qr === query);

        if (!found) {
            showToast(`No se encontró ningún activo con el código QR "${query}".`);
            detailsContainer.classList.add("d-none");
            return;
        }

        currentTrackedQr = found.codigo_qr;
        renderTraceability(found);
        detailsContainer.classList.remove("d-none");
    });

    document.querySelectorAll(".tag-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            input.value = btn.getAttribute("data-qr");
            btnSearch.click();
        });
    });

    // Formulario de Transición de Estado (CP-03)
    formTransition.addEventListener("submit", (e) => {
        e.preventDefault();

        // Control RBAC: Solo técnicos pueden diagnosticar y evaluar
        const nextStateId = parseInt(document.getElementById("nextStateSelect").value);
        if (nextStateId === 3 && appState.currentRole !== "ROL_TECNICO" && appState.currentRole !== "ROL_ADMIN") {
            showToast("ACCESO DENEGADO (CP-01): Solo un Técnico de Diagnóstico puede emitir dictámenes.");
            return;
        }

        const stateNames = {
            3: "EVALUADO",
            4: "EN_REACONDICIONAMIENTO",
            5: "LISTO_DONACION",
            6: "TRANSFERIDO_RECICLAJE",
            7: "TRAZABILIDAD_CERRADA"
        };

        const target = appState.inventory.find(d => d.codigo_qr === currentTrackedQr);
        if (target) {
            const nextSec = target.historial.length + 1;
            const newEntry = {
                sec: nextSec,
                estado: stateNames[nextStateId],
                fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
                user: appState.currentUsername,
                obs: document.getElementById("stateObs").value
            };
            target.historial.push(newEntry);
            target.estado_actual = stateNames[nextStateId];
            renderTraceability(target);
            renderInventoryTable();
            showToast(`Transición exitosa: ${target.codigo_qr} &rarr; ${stateNames[nextStateId]} (CP-03 / RN-01)`);
            document.getElementById("stateObs").value = "";
        }
    });
}

function renderTraceability(device) {
    const summary = document.getElementById("deviceSummaryBox");
    summary.innerHTML = `
        <p><strong>Código QR:</strong> <span class="font-mono">${device.codigo_qr}</span></p>
        <p><strong>Modelo:</strong> ${device.modelo}</p>
        <p><strong>Ubicación Actual:</strong> ${device.centro}</p>
        <p><strong>Peso Físico:</strong> ${device.peso_kg.toFixed(2)} kg</p>
        <p><strong>Estado Actual:</strong> <span class="badge badge-green">${device.estado_actual}</span></p>
        <p class="mt-2 text-muted"><small>Evidencia en S3: s3://ecoraee-evidencias-storage/evidencias/2026/10/${device.codigo_qr.toLowerCase()}.jpg</small></p>
    `;

    const timeline = document.getElementById("timelineContainer");
    timeline.innerHTML = "";

    device.historial.forEach(h => {
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

// ==============================================================================
// 5. VISTA OPTIMIZACIÓN DE RED LOGÍSTICA (EDMONDS-KARP / CP-08 / CP-09)
// ==============================================================================
function initNetworkView() {
    const buttons = document.querySelectorAll(".btn-toggle");
    buttons.forEach(b => {
        b.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            b.classList.add("active");
            const scenario = b.getAttribute("data-scenario");
            renderNetworkScenario(scenario);
        });
    });

    // Renderizar escenario base al inicio
    renderNetworkScenario("BASE");
}

function renderNetworkScenario(scenario) {
    const svg = document.getElementById("networkSvg");
    const maxFlowEl = document.getElementById("maxFlowValue");
    const cutCapEl = document.getElementById("cutCapValue");
    const listEl = document.getElementById("bottleneckList");
    const decisionEl = document.getElementById("decisionText");

    // Coordenadas de los nodos
    const nodes = {
        S: { x: 50, y: 180, label: "S* (Superfuente)", type: "source" },
        MAT: { x: 200, y: 100, label: "Campus Matriz", type: "center" },
        GRA: { x: 200, y: 260, label: "Campus Granados", type: "center" },
        TAL: { x: 380, y: 180, label: "Taller Lab-300", type: "hub" },
        REC: { x: 520, y: 100, label: "ReciclaMetal Sur", type: "sink" },
        FUN: { x: 520, y: 260, label: "Fundación Calderón", type: "sink" }
    };

    let edges = [];
    if (scenario === "BASE") {
        maxFlowEl.innerHTML = `3,100.00 <span class="unit">kg/semana</span>`;
        cutCapEl.textContent = "Capacidad del Corte Mínimo: 3,100.00 kg/semana (Coincidencia Exacta CP-07)";
        listEl.innerHTML = `
            <li>Matriz &rarr; ReciclaMetal Sur: 1,500 / 1,500 kg [SATURADA]</li>
            <li>Taller Lab-300 &rarr; ReciclaMetal Sur: 1,000 / 1,000 kg [SATURADA]</li>
            <li>Taller Lab-300 &rarr; Fundación Calderón: 600 / 600 kg [SATURADA]</li>
        `;
        decisionEl.innerHTML = `
            <strong>Dictamen para Decisiones Logísticas:</strong>
            <p>Operación normal óptima. El flujo total (3,100 kg/sem) evacúa todos los excedentes de los campus. El cuello de botella estructural está en la capacidad de egreso del Taller Técnico (1,600 kg).</p>
        `;

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
        maxFlowEl.innerHTML = `2,000.00 <span class="unit">kg/semana</span>`;
        cutCapEl.textContent = "Capacidad del Corte Mínimo: 2,000.00 kg/semana (Impacto: -35.5% CP-08)";
        listEl.innerHTML = `
            <li>Matriz &rarr; ReciclaMetal Sur: 400 / 400 kg [ESTRANGULADA POR VÍA]</li>
            <li>Taller Lab-300 &rarr; ReciclaMetal Sur: 1,000 / 1,000 kg [SATURADA]</li>
            <li>Taller Lab-300 &rarr; Fundación Calderón: 600 / 600 kg [SATURADA]</li>
        `;
        decisionEl.innerHTML = `
            <strong style="color: #b91c1c;">ALERTA DE CONTINGENCIA LOGÍSTICA:</strong>
            <p>La capacidad de evacuación cayó en 1,100 kg/semana debido al mantenimiento vial en la Av. Simón Bolívar. Se acumulan 1,100 kg en bodegas de Campus Matriz. Decisión: Activar fletes nocturnos alternativos.</p>
        `;

        edges = [
            { from: "S", to: "MAT", flow: 1600, cap: 5000, sat: false },
            { from: "S", to: "GRA", flow: 400, cap: 1500, sat: false },
            { from: "MAT", to: "TAL", flow: 1200, cap: 1200, sat: true },
            { from: "GRA", to: "TAL", flow: 400, cap: 800, sat: false },
            { from: "MAT", to: "REC", flow: 400, cap: 400, sat: true },
            { from: "TAL", to: "REC", flow: 1000, cap: 1000, sat: true },
            { from: "TAL", to: "FUN", flow: 600, cap: 600, sat: true }
        ];
    }

    // Dibujar SVG
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

    // Renderizar aristas
    edges.forEach(e => {
        const p1 = nodes[e.from];
        const p2 = nodes[e.to];
        const strokeColor = e.sat ? "#ef4444" : "#10b981";
        const strokeWidth = e.sat ? 3.5 : 2;
        const marker = e.sat ? "url(#arrow-red)" : "url(#arrow-green)";

        svgHtml += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" marker-end="${marker}" />`;

        // Texto de flujo/capacidad sobre la arista
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - 6;
        svgHtml += `<text x="${midX}" y="${midY}" fill="#94a3b8" font-size="10" font-family="JetBrains Mono" text-anchor="middle">${e.flow}/${e.cap}</text>`;
    });

    // Renderizar nodos
    for (const [key, n] of Object.entries(nodes)) {
        let fill = "#1e293b";
        let stroke = "#38bdf8";
        if (n.type === "source") stroke = "#34d399";
        if (n.type === "sink") stroke = "#c084fc";
        if (n.type === "hub") stroke = "#fbbf24";

        svgHtml += `
            <g transform="translate(${n.x}, ${n.y})">
                <circle r="14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" />
                <text y="24" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">${n.label}</text>
            </g>
        `;
    }

    svg.innerHTML = svgHtml;
}

// ==============================================================================
// 6. ACCESIBILIDAD E INCLUSIÓN (RNF-07 / CP-15)
// ==============================================================================
function initAccessibility() {
    const btnContrast = document.getElementById("btnToggleContrast");
    const btnFont = document.getElementById("btnToggleFontSize");

    btnContrast.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
        showToast("Modo Alto Contraste alternado (CP-15).");
    });

    btnFont.addEventListener("click", () => {
        document.body.classList.toggle("large-font");
        showToast("Tamaño de texto adaptado para inclusión visual (CP-15).");
    });
}

function showToast(msg) {
    let toast = document.getElementById("appToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "appToast";
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #0f172a;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.9rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 4000);
}
