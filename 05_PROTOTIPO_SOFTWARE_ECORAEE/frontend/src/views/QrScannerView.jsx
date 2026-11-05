import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const QrScannerView = ({ onOpenDetailModal, onOpenCertificateModal }) => {
  const { devices, updateDeviceState } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [inputQuery, setInputQuery] = useState("");
  const [foundDevice, setFoundDevice] = useState(null);
  const [newStateId, setNewStateId] = useState("EST_REPAR");
  const [observation, setObservation] = useState("");

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim().toLowerCase();

    if (!query) {
      showToast("Ingrese un código QR o número de serie para buscar.", "warning");
      return;
    }

    const dev = devices.find(d =>
      d.qr.toLowerCase() === query || d.serial.toLowerCase() === query
    );

    if (dev) {
      setFoundDevice(dev);
      showToast(`Dispositivo ${dev.qr} localizado exitosamente.`, "success");
    } else {
      setFoundDevice(null);
      showToast(`No se encontró ningún activo con el identificador "${inputQuery}".`, "error");
    }
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!foundDevice) return;

    let stateName = "En Reparación / Reacondicionamiento";
    if (newStateId === "EST_REUTIL") stateName = "Reutilizable (Apto para Donación)";
    else if (newStateId === "EST_DESPIECE") stateName = "Desensamble y Canibalización de Partes";
    else if (newStateId === "EST_RECICLAJE") stateName = "Reciclaje / Disposición Final";

    const res = updateDeviceState(
      foundDevice.qr,
      newStateId,
      stateName,
      observation,
      currentUser
    );

    if (res.success) {
      // Refrescar el dispositivo encontrado
      setFoundDevice(res.device);
      setObservation("");
    }
  };

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Búsqueda, Escaneo y Trazabilidad de Código QR</h2>
          <p className="view-desc text-muted">
            Consulta inmediata del pasaporte digital de cualquier residuo electrónico mediante su código QR o serie (RF-INT-04).
          </p>
        </div>
      </div>

      {/* Buscador de QR */}
      <div className="card p-4 mb-4">
        <form onSubmit={handleSearch}>
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-8">
              <label htmlFor="qrInputSearch" className="font-13 font-bold mb-1 d-block">
                Escanear con Lector Óptico o Ingresar Código QR / Serie:
              </label>
              <input
                type="text"
                id="qrInputSearch"
                className="form-control form-control-lg font-mono"
                placeholder="Ej: RAEE-UIDE-2026-001 o DL-5490-882194"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="col-12 col-md-4 mt-auto">
              <button type="submit" className="btn btn-primary btn-lg w-100">
                Localizar Dispositivo
              </button>
            </div>
          </div>
        </form>

        <div className="mt-3 font-12 text-muted">
          <span>Ejemplos rápidos: </span>
          {devices.slice(0, 4).map(d => (
            <button
              key={d.qr}
              type="button"
              className="btn btn-link btn-xs font-mono p-0 me-3"
              onClick={() => {
                setInputQuery(d.qr);
                const dev = devices.find(x => x.qr === d.qr);
                if (dev) setFoundDevice(dev);
              }}
            >
              {d.qr}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado de Búsqueda */}
      {foundDevice && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="card p-4">
              <div className="flex-between mb-3">
                <span className="font-mono font-bold font-18 text-primary">{foundDevice.qr}</span>
                <span className="badge badge-green font-12">{foundDevice.estadoNombre}</span>
              </div>

              <div className="row g-3 font-13 mb-4">
                <div className="col-6"><strong>Tipo:</strong> {foundDevice.tipo}</div>
                <div className="col-6"><strong>Marca y Modelo:</strong> {foundDevice.marca} {foundDevice.modelo}</div>
                <div className="col-6"><strong>Número de Serie:</strong> <span className="font-mono">{foundDevice.serial}</span></div>
                <div className="col-6"><strong>Masa en Báscula:</strong> {foundDevice.pesoKg.toFixed(2)} kg</div>
                <div className="col-6"><strong>Custodia Actual:</strong> {foundDevice.centroNombre}</div>
                <div className="col-6"><strong>Lote:</strong> {foundDevice.loteCodigo || "Sin Lote"}</div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onOpenDetailModal(foundDevice)}
                >
                  Ver Ficha Completa
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onOpenCertificateModal(foundDevice)}
                >
                  Imprimir Certificado
                </button>
              </div>

              <hr className="my-4" />

              <h4 className="font-14 font-bold mb-3">Línea de Vida y Trazabilidad Registrada</h4>
              <div className="timeline-container">
                {foundDevice.historial.map((hist, idx) => (
                  <div key={idx} className="timeline-node">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="flex-between">
                        <span className="timeline-title font-bold">{hist.estado}</span>
                        <span className="timeline-date font-12 text-muted">{hist.fecha}</span>
                      </div>
                      <div className="timeline-meta font-12">Por: <code>{hist.responsable}</code></div>
                      <div className="timeline-desc font-12 mt-1">{hist.observacion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card p-4">
              <h3 className="card-title font-16 mb-3">Actualizar Estado Operativo</h3>
              <form onSubmit={handleUpdateStatus}>
                <div className="form-group mb-3">
                  <label htmlFor="nextStateSelect">Nuevo Estado del Ciclo:</label>
                  <select
                    id="nextStateSelect"
                    className="form-select"
                    value={newStateId}
                    onChange={e => setNewStateId(e.target.value)}
                    required
                  >
                    <option value="EST_REPAR">En Reparación / Reacondicionamiento</option>
                    <option value="EST_REUTIL">Reutilizable (Apto para Donación)</option>
                    <option value="EST_DESPIECE">Desensamble y Canibalización de Partes</option>
                    <option value="EST_RECICLAJE">Reciclaje / Disposición Final</option>
                  </select>
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="stateObs">Nota / Justificación del Cambio:</label>
                  <textarea
                    id="stateObs"
                    className="form-control"
                    rows="3"
                    placeholder="Indique la justificación del cambio de estado..."
                    value={observation}
                    onChange={e => setObservation(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Registrar Transición en Trazabilidad
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
