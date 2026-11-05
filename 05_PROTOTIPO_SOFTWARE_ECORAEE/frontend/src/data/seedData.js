// Seed data institucional para EcoRAEE Cloud (UIDE / ASU)
// 0 Emojis - Arquitectura de Mínimo Privilegio (PoLP) y Trazabilidad Integral

export const INITIAL_USERS = [
  {
    id: 1,
    username: "admin_sys",
    password: "admin123",
    nombres: "Administrador",
    apellidos: "General",
    correo: "admin.ecoraee@uide.edu.ec",
    telefono: "0991234567",
    direccion: "Campus UIDE, Av. Simón Bolívar, Bloque Administrativo",
    cargo: "Administrador de Plataforma Cloud",
    departamento: "Tecnologías de la Información",
    rol: "ROL_ADMIN",
    rolTitulo: "Administrador General",
    permisos: [
      "Acceso total a gobernanza, reportería y configuración",
      "Autorización y ejecución de bajas físicas en inventario (CP-04)",
      "Gestión de cuentas de usuario y políticas de seguridad RBAC",
      "Monitoreo global de la red logística y cálculo de Edmonds-Karp"
    ],
    restricciones: []
  },
  {
    id: 2,
    username: "carlos.operador",
    password: "password123",
    nombres: "Carlos",
    apellidos: "Mendoza",
    correo: "carlos.operador@uide.edu.ec",
    telefono: "0987654321",
    direccion: "Bodega General de Activos, Campus Matriz Bloque A",
    cargo: "Operador de Centro de Acopio",
    departamento: "Bodega y Logística de Entrada",
    rol: "ROL_OPERADOR",
    rolTitulo: "Operador de Acopio",
    permisos: [
      "Recepción física y pesaje de lotes entregados",
      "Registro de dispositivos y generación de códigos QR únicos (CP-02)",
      "Impresión de etiquetas físicas y asignación de estantería inicial",
      "Consulta general de activos en tránsito"
    ],
    restricciones: [
      "Restricción PoLP: No puede emitir dictámenes ni clasificaciones técnicas en taller (RN-02)",
      "Restricción PoLP: No puede autorizar donaciones sociales a escuelas (RN-04)",
      "Restricción PoLP: No puede dar de baja activos del sistema (CP-04)",
      "Restricción PoLP: No puede formalizar ni sellar certificados de destino final (RN-08)"
    ]
  },
  {
    id: 3,
    username: "maria.tecnico",
    password: "password123",
    nombres: "María",
    apellidos: "Salazar",
    correo: "maria.tecnico@uide.edu.ec",
    telefono: "0976543210",
    direccion: "Laboratorio de Hardware y Taller Lab-302",
    cargo: "Técnico Especialista de Diagnóstico",
    departamento: "Facultad de Ingeniería / Taller de Hardware",
    rol: "ROL_TECNICO",
    rolTitulo: "Técnico de Diagnóstico",
    permisos: [
      "Evaluación técnica y diagnóstico funcional en taller (RN-02)",
      "Clasificación jerárquica A/B/C/D y desensamble de partes útiles",
      "Validación de viabilidad de reacondicionamiento para donación (RN-04)",
      "Registro de componentes recuperados (memorias, discos, fuentes)"
    ],
    restricciones: [
      "Restricción PoLP: No puede dar de baja activos del inventario (CP-04)",
      "Restricción PoLP: No puede autorizar rutas ni transferencias de camiones (RN-03)",
      "Restricción PoLP: No puede alterar manifiestos legales de gestores ambientales (RN-08)"
    ]
  },
  {
    id: 4,
    username: "diego.logistica",
    password: "password123",
    nombres: "Diego",
    apellidos: "Andrade",
    correo: "diego.logistica@uide.edu.ec",
    telefono: "0965432109",
    direccion: "Patio Logístico y Despachos, Estación Carga 1",
    cargo: "Coordinador Logístico de Transferencias",
    departamento: "Operaciones y Flota de Transporte",
    rol: "ROL_LOGISTICA",
    rolTitulo: "Coordinador Logístico",
    permisos: [
      "Planificación y despacho de rutas de transferencia entre centros",
      "Control de pesos y cumplimiento de capacidad vehicular (RN-03, RN-05)",
      "Supervisión del modelo de optimización de red (Edmonds-Karp)",
      "Confirmación de recepción y descargo físico de unidades en destino"
    ],
    restricciones: [
      "Restricción PoLP: No puede cambiar dictámenes técnicos ni clasificaciones (RN-02)",
      "Restricción PoLP: No puede dar de baja activos del sistema (CP-04)",
      "Restricción PoLP: No puede firmar actas de donación comunitaria (RN-04)"
    ]
  },
  {
    id: 5,
    username: "ana.auditora",
    password: "password123",
    nombres: "Ana",
    apellidos: "Paredes",
    correo: "ana.auditora@uide.edu.ec",
    telefono: "0954321098",
    direccion: "Edificio de Auditoría y Aseguramiento de Calidad",
    cargo: "Auditora de Cumplimiento y Calidad",
    departamento: "Gestión Ambiental y Auditoría Interna",
    rol: "ROL_AUDITOR",
    rolTitulo: "Auditor de Calidad",
    permisos: [
      "Inspección de cadena de custodia y trazabilidad de principio a fin (RN-08)",
      "Verificación de actas de donación y certificados de reciclador autorizado",
      "Auditoría de cumplimiento de reglas de negocio RN-01 a RN-08",
      "Emisión y sellado de certificados institucionales de disposición final"
    ],
    restricciones: [
      "Restricción PoLP: Modo estrictamente consultivo e inspector; no puede modificar registros operativos",
      "Restricción PoLP: No puede registrar pesajes ni alterar clasificaciones técnicas en taller"
    ]
  }
];

export const INITIAL_CENTERS = [
  { id: "C-01", nombre: "Centro Acopio Campus Matriz (UIDE)", tipo: "Acopio Primario", capacidadKg: 2500, ubicacion: "Bloque A - Planta Baja" },
  { id: "C-02", nombre: "Centro Acopio Norte (Quito)", tipo: "Acopio Secundario", capacidadKg: 1800, ubicacion: "Sector Carcelén Industrial" },
  { id: "C-03", nombre: "Centro Acopio Sur (Quito)", tipo: "Acopio Secundario", capacidadKg: 1500, ubicacion: "Sector Guamaní" },
  { id: "C-04", nombre: "Taller Central de Reacondicionamiento", tipo: "Taller Técnico", capacidadKg: 3000, ubicacion: "Edificio de Laboratorios Lab-302" },
  { id: "C-05", nombre: "Planta de Reciclaje Gestor Autorizado", tipo: "Gestor Certificado", capacidadKg: 10000, ubicacion: "Parque Industrial Pifo" }
];

export const INITIAL_BATCHES = [
  {
    id: 1,
    codigo: "LOTE-COM-2026-001",
    nombreLote: "Equipos Informáticos Computo y Servidores 2026-A",
    categoria: "Equipos de Informática y Telecomunicaciones",
    centroId: "C-01",
    centroNombre: "Centro Acopio Campus Matriz (UIDE)",
    capacidadKg: 500.0,
    estado: "Abierto para consolidación",
    fechaCreacion: "2026-01-15"
  },
  {
    id: 2,
    codigo: "LOTE-AUD-2026-002",
    nombreLote: "Pantallas, Proyectores y Audio Aulas UIDE",
    categoria: "Aparatos Electrónicos de Consumo y Audio/Video",
    centroId: "C-01",
    centroNombre: "Centro Acopio Campus Matriz (UIDE)",
    capacidadKg: 350.0,
    estado: "Abierto para consolidación",
    fechaCreacion: "2026-01-20"
  },
  {
    id: 3,
    codigo: "LOTE-IMP-2026-003",
    nombreLote: "Impresoras y Fotocopiadoras Departamentales",
    categoria: "Equipos de Impresión y Copiado",
    centroId: "C-02",
    centroNombre: "Centro Acopio Norte (Quito)",
    capacidadKg: 400.0,
    estado: "Abierto para consolidación",
    fechaCreacion: "2026-02-01"
  },
  {
    id: 4,
    codigo: "LOTE-OBS-2026-004",
    nombreLote: "Equipos Obsoletos para Desensamble y Partes",
    categoria: "Equipos de Informática y Telecomunicaciones",
    centroId: "C-04",
    centroNombre: "Taller Central de Reacondicionamiento",
    capacidadKg: 600.0,
    estado: "Sellado para taller",
    fechaCreacion: "2026-02-10"
  }
];

export const INITIAL_DEVICES = [
  {
    qr: "RAEE-UIDE-2026-001",
    tipo: "Laptop Institucional",
    categoria: "Equipos de Informática y Telecomunicaciones",
    marca: "Dell",
    modelo: "Latitude 5490 Core i5",
    serial: "DL-5490-882194",
    pesoKg: 1.65,
    estadoId: "EST_REUTIL",
    estadoNombre: "Reutilizable (Apto para Donación)",
    centroId: "C-04",
    centroNombre: "Taller Central de Reacondicionamiento",
    loteCodigo: "LOTE-COM-2026-001",
    diagnostico: {
      clasificacion: "A",
      encendido: true,
      funcional: true,
      estetica: "Bueno",
      observaciones: "Batería operativa al 88%. Disco SSD testeado sin sectores defectuosos. Memoria RAM 16GB OK. Apta para programa de donación a escuelas rurales.",
      aptoDonacion: true,
      fechaDiagnostico: "2026-02-12 10:30",
      tecnico: "maria.tecnico"
    },
    historial: [
      { fecha: "2026-01-15 09:15", estado: "Recepción en Bodega", responsable: "carlos.operador", observacion: "Recepción inicial y pesaje verificado de 1.65 kg (CP-02)." },
      { fecha: "2026-01-22 14:00", estado: "Transferencia a Taller", responsable: "diego.logistica", observacion: "Despacho a laboratorio Lab-302 según capacidad vehicular." },
      { fecha: "2026-02-12 10:30", estado: "Reutilizable (Apto para Donación)", responsable: "maria.tecnico", observacion: "Evaluación técnica aprobada Grado A. Lista para donación (RN-02, RN-04)." }
    ]
  },
  {
    qr: "RAEE-UIDE-2026-002",
    tipo: "Computador de Escritorio All-in-One",
    categoria: "Equipos de Informática y Telecomunicaciones",
    marca: "HP",
    modelo: "ProOne 400 G4",
    serial: "HP-400G4-99120",
    pesoKg: 5.70,
    estadoId: "EST_REPAR",
    estadoNombre: "En Reparación / Reacondicionamiento",
    centroId: "C-04",
    centroNombre: "Taller Central de Reacondicionamiento",
    loteCodigo: "LOTE-COM-2026-001",
    diagnostico: {
      clasificacion: "B",
      encendido: true,
      funcional: false,
      estetica: "Aceptable",
      observaciones: "Requiere reemplazo de fuente de poder interna y limpieza térmica. Placa madre y pantalla operativas al 100%.",
      aptoDonacion: false,
      fechaDiagnostico: "2026-02-14 11:20",
      tecnico: "maria.tecnico"
    },
    historial: [
      { fecha: "2026-01-16 11:00", estado: "Recepción en Bodega", responsable: "carlos.operador", observacion: "Ingreso desde laboratorio de cómputo B-201." },
      { fecha: "2026-02-14 11:20", estado: "En Reparación / Reacondicionamiento", responsable: "maria.tecnico", observacion: "Fallo menor en fuente. Programada sustitución de partes útiles." }
    ]
  },
  {
    qr: "RAEE-UIDE-2026-003",
    tipo: "Monitor LED 24 pulgadas",
    categoria: "Aparatos Electrónicos de Consumo y Audio/Video",
    marca: "Samsung",
    modelo: "S24F350FHL",
    serial: "SM-24-33419",
    pesoKg: 3.20,
    estadoId: "EST_DESPIECE",
    estadoNombre: "Desensamble y Canibalización de Partes",
    centroId: "C-04",
    centroNombre: "Taller Central de Reacondicionamiento",
    loteCodigo: "LOTE-AUD-2026-002",
    diagnostico: {
      clasificacion: "C",
      encendido: false,
      funcional: false,
      estetica: "Dañado",
      observaciones: "Panel LCD fisurado con derrame de cristal líquido. Se recupera placa controladora lógica, retroiluminación LED y transformador externo.",
      aptoDonacion: false,
      fechaDiagnostico: "2026-02-15 15:45",
      tecnico: "maria.tecnico"
    },
    historial: [
      { fecha: "2026-01-20 16:30", estado: "Recepción en Bodega", responsable: "carlos.operador", observacion: "Recepción desde auditorio general." },
      { fecha: "2026-02-15 15:45", estado: "Desensamble y Canibalización de Partes", responsable: "maria.tecnico", observacion: "No viable para donación (RN-04). Autorizado para desensamble de repuestos." }
    ]
  },
  {
    qr: "RAEE-UIDE-2026-004",
    tipo: "Servidor Rack 2U",
    categoria: "Equipos de Informática y Telecomunicaciones",
    marca: "Lenovo",
    modelo: "ThinkSystem SR650",
    serial: "LN-SR650-01992",
    pesoKg: 18.50,
    estadoId: "EST_RECICLAJE",
    estadoNombre: "Reciclaje / Disposición Final",
    centroId: "C-05",
    centroNombre: "Planta de Reciclaje Gestor Autorizado",
    loteCodigo: "LOTE-OBS-2026-004",
    diagnostico: {
      clasificacion: "D",
      encendido: false,
      funcional: false,
      estetica: "Obsoleto",
      observaciones: "Placa lógica principal con condensadores quemados. Chasis metálico y disipadores de cobre pesados para valorización material con gestor certificado.",
      aptoDonacion: false,
      fechaDiagnostico: "2026-02-16 09:00",
      tecnico: "maria.tecnico"
    },
    historial: [
      { fecha: "2026-01-10 08:30", estado: "Recepción en Bodega", responsable: "carlos.operador", observacion: "Desincorporación del Data Center central." },
      { fecha: "2026-02-16 09:00", estado: "Diagnóstico Final Grado D", responsable: "maria.tecnico", observacion: "Clasificado como chatarra electrónica no recuperable (RN-04)." },
      { fecha: "2026-02-18 16:00", estado: "Transferencia a Gestor Ambiental", responsable: "diego.logistica", observacion: "Despacho a Planta Pifo con manifiesto de transporte ambiental." },
      { fecha: "2026-02-20 12:00", estado: "Reciclaje / Disposición Final", responsable: "ana.auditora", observacion: "Acta de custodia sellada. Manifiesto MAAE-2026-8819 verificado (RN-08)." }
    ]
  },
  {
    qr: "RAEE-UIDE-2026-005",
    tipo: "Impresora Láser Multifunción",
    categoria: "Equipos de Impresión y Copiado",
    marca: "Kyocera",
    modelo: "ECOSYS M3145idn",
    serial: "KC-M3145-55112",
    pesoKg: 19.80,
    estadoId: "EST_RECEP",
    estadoNombre: "Recepción en Bodega",
    centroId: "C-02",
    centroNombre: "Centro Acopio Norte (Quito)",
    loteCodigo: "LOTE-IMP-2026-003",
    diagnostico: null,
    historial: [
      { fecha: "2026-02-01 10:00", estado: "Recepción en Bodega", responsable: "carlos.operador", observacion: "Ingreso por recambio tecnológico de Decanatos." }
    ]
  },
  {
    qr: "RAEE-UIDE-2026-006",
    tipo: "Smartphone Android para Pruebas",
    categoria: "Equipos de Informática y Telecomunicaciones",
    marca: "Samsung",
    modelo: "Galaxy A52",
    serial: "SM-A52-771129",
    pesoKg: 0.19,
    estadoId: "EST_REUTIL",
    estadoNombre: "Reutilizable (Apto para Donación)",
    centroId: "C-04",
    centroNombre: "Taller Central de Reacondicionamiento",
    loteCodigo: "LOTE-COM-2026-001",
    diagnostico: {
      clasificacion: "A",
      encendido: true,
      funcional: true,
      estetica: "Excelente",
      observaciones: "Equipo en estado óptimo. Batería al 94%. Restaurado de fábrica sin cuentas vinculadas.",
      aptoDonacion: true,
      fechaDiagnostico: "2026-02-19 14:10",
      tecnico: "maria.tecnico"
    },
    historial: [
      { fecha: "2026-02-05 11:20", estado: "Recepción en Bodega", responsable: "carlos.operador", observacion: "Entrega de laboratorio de aplicaciones móviles." },
      { fecha: "2026-02-19 14:10", estado: "Reutilizable (Apto para Donación)", responsable: "maria.tecnico", observacion: "Testeo integral superado. Destinado a programa de inclusión digital." }
    ]
  }
];

export const INITIAL_MOVEMENTS = [
  {
    id: 1,
    codigo: "MOV-2026-001",
    origen: "Centro Acopio Campus Matriz (UIDE)",
    origenId: "C-01",
    destino: "Taller Central de Reacondicionamiento",
    destinoId: "C-04",
    fecha: "2026-01-22 14:00",
    responsable: "diego.logistica",
    dispositivosCount: 2,
    pesoTotalKg: 7.35,
    vehiculo: "Camión Hino 3.5 Ton (UIDE-01)",
    qrs: ["RAEE-UIDE-2026-001", "RAEE-UIDE-2026-002"],
    estado: "Completado y Recibido"
  },
  {
    id: 2,
    codigo: "MOV-2026-002",
    origen: "Taller Central de Reacondicionamiento",
    origenId: "C-04",
    destino: "Planta de Reciclaje Gestor Autorizado",
    destinoId: "C-05",
    fecha: "2026-02-18 16:00",
    responsable: "diego.logistica",
    dispositivosCount: 1,
    pesoTotalKg: 18.50,
    vehiculo: "Camión Plataforma Gestor (REC-99)",
    qrs: ["RAEE-UIDE-2026-004"],
    estado: "Completado y Recibido"
  }
];

export const BUSINESS_RULES = [
  { id: "RN-01", nombre: "Pesaje y Codificación Obligatoria", detalle: "Ningún RAEE ingresa al inventario sin código QR único y pesaje verificado en báscula digital." },
  { id: "RN-02", nombre: "Diagnóstico Exclusivo por Rol Técnico", detalle: "Solamente los perfiles ROL_TECNICO o ROL_ADMIN pueden registrar clasificación y dictamen técnico en taller." },
  { id: "RN-03", nombre: "Capacidad Máxima de Transporte", detalle: "El peso acumulado en un despacho no debe superar la capacidad nominal del vehículo asignado ni del centro receptor." },
  { id: "RN-04", nombre: "Restricción Estricta de Donación", detalle: "Se prohíbe donar equipos con dictamen C o D (chatarra o piezas). Solo equipos A o B operativos pueden ser donados." },
  { id: "RN-05", nombre: "Rutas Optimizadas de Flujo Máximo", detalle: "Los traslados interinstitucionales deben regirse por las capacidades residuales del algoritmo Edmonds-Karp." },
  { id: "RN-06", nombre: "Unicidad Global de Serial y QR", detalle: "No pueden existir dos dispositivos con el mismo código QR o número de serie en la plataforma." },
  { id: "RN-07", nombre: "Control de Acceso de Mínimo Privilegio (PoLP)", detalle: "Cada funcionario cuenta con los permisos estrictamente necesarios para su labor, reduciendo el riesgo operacional." },
  { id: "RN-08", nombre: "Sellado de Cadena de Custodia Legal", detalle: "Todo destino final de chatarra debe cerrarse con número de manifiesto ambiental MAAE y firma de auditoría." }
];

export const TEST_CASES_SPEC = [
  { id: "CP-01", titulo: "Registro de lote y control de peso", criterio: "El peso real calculado debe coincidir con la sumatoria exacta de los dispositivos vinculados.", regla: "RN-01" },
  { id: "CP-02", titulo: "Generación y unicidad de QR", criterio: "El formato debe cumplir la máscara RAEE-UIDE-YYYY-XXX y rechazar duplicados en tiempo real.", regla: "RN-06" },
  { id: "CP-03", titulo: "Validación de diagnóstico técnico", criterio: "Solo ROL_TECNICO o ROL_ADMIN pueden enviar dictámenes de laboratorio; ROL_OPERADOR debe ser rechazado.", regla: "RN-02" },
  { id: "CP-04", titulo: "Eliminación controlada de activos", criterio: "La baja física requiere obligatoriamente rol Administrador y justificación técnica registrada.", regla: "RN-07" },
  { id: "CP-05", titulo: "Capacidad máxima de transporte", criterio: "El sistema bloquea transferencias cuyo peso acumulado sobrepase el límite vehicular.", regla: "RN-03" },
  { id: "CP-06", titulo: "Restricción de donación de chatarra", criterio: "El sistema impide marcar como 'Apto para Donación' dispositivos clasificados C o D.", regla: "RN-04" },
  { id: "CP-07", titulo: "Optimización de red (Edmonds-Karp)", criterio: "Calcula el flujo máximo alcanzable entre campus y gestor sin saturar los centros intermedios.", regla: "RN-05" },
  { id: "CP-08", titulo: "Cierre de cadena de custodia", criterio: "Exige manifiesto ambiental MAAE válido y número de acta oficial para cerrar el ciclo de vida.", regla: "RN-08" },
  { id: "CP-09", titulo: "Mínimo Privilegio (PoLP)", criterio: "Verifica que cada usuario institucional cuente con accesos segregados según su rol sin elevación no autorizada.", regla: "RN-07" },
  { id: "CP-10", titulo: "Accesibilidad WCAG 2.1 AAA", criterio: "Permite alternar modo alto contraste y tipografía ampliada sin romper la maquetación visual.", regla: "Accesibilidad" }
];
