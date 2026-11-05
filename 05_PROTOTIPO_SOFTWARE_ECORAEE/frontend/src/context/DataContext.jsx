import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { StorageService, STORAGE_KEYS, ApiService } from "../services/apiService";
import { INITIAL_DEVICES, INITIAL_BATCHES, INITIAL_CENTERS, INITIAL_MOVEMENTS } from "../data/seedData";
import { useToast } from "./ToastContext";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { showToast } = useToast();

  const [devices, setDevices] = useState(() => {
    return StorageService.get(STORAGE_KEYS.DEVICES, INITIAL_DEVICES);
  });

  const [batches, setBatches] = useState(() => {
    return StorageService.get(STORAGE_KEYS.BATCHES, INITIAL_BATCHES);
  });

  const [centers, setCenters] = useState(() => {
    return StorageService.get(STORAGE_KEYS.CENTERS, INITIAL_CENTERS);
  });

  const [movements, setMovements] = useState(() => {
    return StorageService.get(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  });

  const [backendOnline, setBackendOnline] = useState(false);

  // Sincronización con localStorage
  useEffect(() => {
    StorageService.set(STORAGE_KEYS.DEVICES, devices);
  }, [devices]);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.BATCHES, batches);
  }, [batches]);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.CENTERS, centers);
  }, [centers]);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.MOVEMENTS, movements);
  }, [movements]);

  // Chequeo periódico de salud de la API backend
  const checkHealth = useCallback(async () => {
    const isOnline = await ApiService.checkBackendHealth();
    setBackendOnline(isOnline);
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Registro de nuevo dispositivo (RN-01, RN-06)
  const registerDevice = (deviceData, currentUser) => {
    if (!deviceData.qr || !deviceData.tipo || !deviceData.pesoKg) {
      showToast("Debe completar los campos obligatorios: Código QR, Tipo y Peso.", "error");
      return { success: false, error: "Campos incompletos" };
    }

    // Regla RN-06: Unicidad de QR
    const exists = devices.some(d => d.qr.trim().toUpperCase() === deviceData.qr.trim().toUpperCase());
    if (exists) {
      showToast(`Violación de Regla RN-06: El código QR ${deviceData.qr} ya se encuentra registrado.`, "error");
      return { success: false, error: "Código QR duplicado" };
    }

    const targetCenter = centers.find(c => c.id === deviceData.centroId) || centers[0];
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newDevice = {
      qr: deviceData.qr.trim().toUpperCase(),
      tipo: deviceData.tipo,
      categoria: deviceData.categoria || "Equipos de Informática y Telecomunicaciones",
      marca: deviceData.marca || "Genérico",
      modelo: deviceData.modelo || "S/M",
      serial: deviceData.serial || `SN-${Date.now().toString().slice(-6)}`,
      pesoKg: parseFloat(deviceData.pesoKg),
      estadoId: "EST_RECEP",
      estadoNombre: "Recepción en Bodega",
      centroId: targetCenter.id,
      centroNombre: targetCenter.nombre,
      loteCodigo: deviceData.loteCodigo || "",
      diagnostico: null,
      historial: [
        {
          fecha: now,
          estado: "Recepción en Bodega",
          responsable: currentUser?.username || "carlos.operador",
          observacion: `Recepción inicial y pesaje digital verificado (${deviceData.pesoKg} kg). Cumple RN-01.`
        }
      ]
    };

    setDevices(prev => [newDevice, ...prev]);
    showToast(`Dispositivo ${newDevice.qr} registrado correctamente en inventario.`, "success");
    return { success: true, device: newDevice };
  };

  // Actualización de dispositivo
  const updateDevice = (qr, updatedFields, reason, currentUser) => {
    const target = devices.find(d => d.qr === qr);
    if (!target) return { success: false, error: "Dispositivo no encontrado" };

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updatedHistory = [
      ...target.historial,
      {
        fecha: now,
        estado: target.estadoNombre,
        responsable: currentUser?.username || "usuario",
        observacion: `Actualización de ficha técnica: ${reason || "Modificación de datos por control de inventario"}.`
      }
    ];

    const updated = {
      ...target,
      ...updatedFields,
      historial: updatedHistory
    };

    setDevices(prev => prev.map(d => d.qr === qr ? updated : d));
    showToast(`Ficha técnica del dispositivo ${qr} actualizada exitosamente.`, "success");
    return { success: true, device: updated };
  };

  // Eliminación de dispositivo (Exclusivo Administrador PoLP)
  const deleteDevice = (qr, reason, currentUser) => {
    if (currentUser?.rol !== "ROL_ADMIN") {
      showToast("Acción denegada por Mínimo Privilegio (PoLP): Solo un Administrador General puede dar de baja activos (CP-04).", "error");
      return { success: false, error: "No autorizado" };
    }

    if (!reason || reason.trim().length < 5) {
      showToast("Debe ingresar una justificación técnica válida para la baja.", "error");
      return { success: false, error: "Justificación requerida" };
    }

    setDevices(prev => prev.filter(d => d.qr !== qr));
    showToast(`Dispositivo ${qr} dado de baja del sistema. Justificación registrada.`, "warning");
    return { success: true };
  };

  // Creación de nuevo lote
  const createBatch = (batchData) => {
    if (!batchData.codigo || !batchData.nombreLote || !batchData.capacidadKg) {
      showToast("Debe ingresar código de lote, nombre y capacidad máxima en kg.", "error");
      return { success: false, error: "Datos incompletos" };
    }

    const exists = batches.some(b => b.codigo.trim().toUpperCase() === batchData.codigo.trim().toUpperCase());
    if (exists) {
      showToast(`El código de lote ${batchData.codigo} ya existe.`, "error");
      return { success: false, error: "Lote duplicado" };
    }

    const targetCenter = centers.find(c => c.id === batchData.centroId) || centers[0];
    const newBatch = {
      id: Date.now(),
      codigo: batchData.codigo.trim().toUpperCase(),
      nombreLote: batchData.nombreLote,
      categoria: batchData.categoria,
      centroId: targetCenter.id,
      centroNombre: targetCenter.nombre,
      capacidadKg: parseFloat(batchData.capacidadKg),
      estado: "Abierto para consolidación",
      fechaCreacion: new Date().toISOString().substring(0, 10)
    };

    setBatches(prev => [newBatch, ...prev]);
    showToast(`Lote ${newBatch.codigo} consolidado con éxito.`, "success");
    return { success: true, batch: newBatch };
  };

  // Dictamen de evaluación técnica (RN-02, RN-04)
  const submitDiagnostic = (qr, diagnosticData, currentUser) => {
    // Validación PoLP: Exclusivo Técnico o Admin
    if (currentUser?.rol !== "ROL_TECNICO" && currentUser?.rol !== "ROL_ADMIN") {
      showToast("Acceso denegado por Mínimo Privilegio: Solo personal técnico autorizado puede emitir diagnósticos (RN-02).", "error");
      return { success: false, error: "Privilegio insuficiente" };
    }

    const target = devices.find(d => d.qr === qr);
    if (!target) return { success: false, error: "Dispositivo no encontrado" };

    // Regla RN-04: No donar equipos C o D
    if (diagnosticData.aptoDonacion && (diagnosticData.clasificacion === "C" || diagnosticData.clasificacion === "D")) {
      showToast("Violación de Regla RN-04: Dispositivos clasificados en Grado C o D no son aptos para donación comunitaria.", "error");
      return { success: false, error: "Regla RN-04 violada" };
    }

    let nextStateId = "EST_REPAR";
    let nextStateName = "En Reparación / Reacondicionamiento";

    if (diagnosticData.aptoDonacion && diagnosticData.clasificacion === "A") {
      nextStateId = "EST_REUTIL";
      nextStateName = "Reutilizable (Apto para Donación)";
    } else if (diagnosticData.clasificacion === "C") {
      nextStateId = "EST_DESPIECE";
      nextStateName = "Desensamble y Canibalización de Partes";
    } else if (diagnosticData.clasificacion === "D") {
      nextStateId = "EST_RECICLAJE";
      nextStateName = "Reciclaje / Disposición Final";
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newDiagnostic = {
      clasificacion: diagnosticData.clasificacion,
      encendido: diagnosticData.encendido,
      funcional: diagnosticData.funcional,
      estetica: diagnosticData.estetica,
      observaciones: diagnosticData.observaciones || "Evaluación técnica de laboratorio completada.",
      aptoDonacion: diagnosticData.aptoDonacion || false,
      fechaDiagnostico: now,
      tecnico: currentUser?.username || "maria.tecnico"
    };

    const newHistory = [
      ...target.historial,
      {
        fecha: now,
        estado: nextStateName,
        responsable: currentUser?.username || "maria.tecnico",
        observacion: `Diagnóstico Grado ${diagnosticData.clasificacion}: ${diagnosticData.observaciones || "Inspección técnica finalizada"}. Cumple RN-02.`
      }
    ];

    const updated = {
      ...target,
      estadoId: nextStateId,
      estadoNombre: nextStateName,
      diagnostico: newDiagnostic,
      historial: newHistory
    };

    setDevices(prev => prev.map(d => d.qr === qr ? updated : d));
    showToast(`Diagnóstico técnico registrado para ${qr}. Estado actualizado a ${nextStateName}.`, "success");
    return { success: true, device: updated };
  };

  // Despacho Logístico (RN-03, RN-05)
  const dispatchMovement = (movementData, currentUser) => {
    if (currentUser?.rol !== "ROL_LOGISTICA" && currentUser?.rol !== "ROL_ADMIN") {
      showToast("Acción denegada por PoLP: Solo el Coordinador Logístico puede despachar transferencias (RN-03).", "error");
      return { success: false, error: "No autorizado" };
    }

    const { origenId, destinoId, selectedQrs, vehiculo } = movementData;
    if (!origenId || !destinoId || !selectedQrs || selectedQrs.length === 0) {
      showToast("Debe seleccionar origen, destino y al menos un dispositivo para el despacho.", "error");
      return { success: false, error: "Datos incompletos" };
    }

    if (origenId === destinoId) {
      showToast("El centro de destino debe ser diferente al centro de origen.", "error");
      return { success: false, error: "Origen y destino idénticos" };
    }

    const originCenter = centers.find(c => c.id === origenId);
    const destCenter = centers.find(c => c.id === destinoId);

    // Calcular peso acumulado
    const selectedDevices = devices.filter(d => selectedQrs.includes(d.qr));
    const totalKg = selectedDevices.reduce((sum, d) => sum + (d.pesoKg || 0), 0);

    // Regla RN-03: Capacidad máxima
    const maxCapacity = 2000.0; // Límite nominal de vehículo de transporte
    if (totalKg > maxCapacity) {
      showToast(`Violación de Regla RN-03: El peso total (${totalKg.toFixed(2)} kg) sobrepasa el límite del vehículo (${maxCapacity} kg).`, "error");
      return { success: false, error: "Exceso de capacidad" };
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const movCode = `MOV-2026-${String(movements.length + 1).padStart(3, "0")}`;

    const newMov = {
      id: Date.now(),
      codigo: movCode,
      origen: originCenter?.nombre || "Origen",
      origenId,
      destino: destCenter?.nombre || "Destino",
      destinoId,
      fecha: now,
      responsable: currentUser?.username || "diego.logistica",
      dispositivosCount: selectedDevices.length,
      pesoTotalKg: parseFloat(totalKg.toFixed(2)),
      vehiculo: vehiculo || "Camión Hino 3.5 Ton (UIDE-01)",
      qrs: selectedQrs,
      estado: "Completado y Recibido"
    };

    // Actualizar ubicación y añadir trazabilidad a los dispositivos
    setDevices(prev => prev.map(d => {
      if (selectedQrs.includes(d.qr)) {
        return {
          ...d,
          centroId: destCenter?.id || d.centroId,
          centroNombre: destCenter?.nombre || d.centroNombre,
          historial: [
            ...d.historial,
            {
              fecha: now,
              estado: `Transferencia a ${destCenter?.nombre}`,
              responsable: currentUser?.username || "diego.logistica",
              observacion: `Despacho logístico ${movCode} en ${newMov.vehiculo}. Peso lote: ${totalKg.toFixed(2)} kg (RN-03, RN-05).`
            }
          ]
        };
      }
      return d;
    }));

    setMovements(prev => [newMov, ...prev]);
    showToast(`Transferencia ${movCode} autorizada y registrada. ${selectedDevices.length} dispositivos reubicados.`, "success");
    return { success: true, movement: newMov };
  };

  // Cierre de cadena de custodia y acta de destino final (RN-08)
  const certifyFinalDestination = (qr, data, currentUser) => {
    if (currentUser?.rol !== "ROL_AUDITOR" && currentUser?.rol !== "ROL_ADMIN") {
      showToast("Acceso denegado por Mínimo Privilegio: Solo la Auditoría de Calidad puede certificar el destino final (RN-08).", "error");
      return { success: false, error: "No autorizado" };
    }

    const target = devices.find(d => d.qr === qr);
    if (!target) return { success: false, error: "Dispositivo no encontrado" };

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newHistory = [
      ...target.historial,
      {
        fecha: now,
        estado: "Certificado de Destino Final Sellado",
        responsable: currentUser?.username || "ana.auditora",
        observacion: `Certificación oficial de cierre de ciclo de vida. Gestor Ambiental: ${data.entidad}. Manifiesto MAAE: ${data.manifiesto}. Cumple RN-08.`
      }
    ];

    const updated = {
      ...target,
      estadoId: "EST_CERRADO",
      estadoNombre: "Destino Final Certificado (Ciclo Cerrado)",
      historial: newHistory
    };

    setDevices(prev => prev.map(d => d.qr === qr ? updated : d));
    showToast(`Cadena de custodia sellada legalmente para ${qr} (RN-08).`, "success");
    return { success: true, device: updated };
  };

  // Transición manual con auditoría
  const updateDeviceState = (qr, newStateId, newStateName, observation, currentUser) => {
    const target = devices.find(d => d.qr === qr);
    if (!target) return { success: false, error: "Dispositivo no encontrado" };

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newHistory = [
      ...target.historial,
      {
        fecha: now,
        estado: newStateName,
        responsable: currentUser?.username || "operador",
        observacion: observation || "Transición de estado por control operativo de trazabilidad."
      }
    ];

    const updated = {
      ...target,
      estadoId: newStateId,
      estadoNombre: newStateName,
      historial: newHistory
    };

    setDevices(prev => prev.map(d => d.qr === qr ? updated : d));
    showToast(`Estado de ${qr} actualizado a ${newStateName}.`, "info");
    return { success: true, device: updated };
  };

  return (
    <DataContext.Provider value={{
      devices,
      batches,
      centers,
      movements,
      backendOnline,
      registerDevice,
      updateDevice,
      deleteDevice,
      createBatch,
      submitDiagnostic,
      dispatchMovement,
      certifyFinalDestination,
      updateDeviceState
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
};
