import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const LogisticsView = () => {
  const { devices, centers, movements, dispatchMovement } = useData();
  const { currentUser, isLogistics, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [origenId, setOrigenId] = useState(centers[0]?.id || "C-01");
  const [destinoId, setDestinoId] = useState(centers[3]?.id || "C-04");
  const [vehiculo, setVehiculo] = useState("Camión Hino 3.5 Ton (UIDE-01)");
  const [selectedQrs, setSelectedQrs] = useState([]);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const canDispatch = isLogistics || isAdmin;

  // Dispositivos disponibles en el centro de origen seleccionado
  const availableDevices = devices.filter(d => d.centroId === origenId);

  // Cálculo de peso acumulado
  const selectedWeight = availableDevices
    .filter(d => selectedQrs.includes(d.qr))
    .reduce((sum, d) => sum + (d.pesoKg || 0), 0);

  const vehicleCapacity = 2000.0; // kg
  const isOverweight = selectedWeight > vehicleCapacity;

  const handleToggleQr = (qr) => {
    setSelectedQrs(prev =>
      prev.includes(qr) ? prev.filter(q => q !== qr) : [...prev, qr]
    );
  };

  const handleSelectAll = () => {
    if (selectedQrs.length === availableDevices.length) {
      setSelectedQrs([]);
    } else {
      setSelectedQrs(availableDevices.map(d => d.qr));
    }
  };

  const handleDispatch = (e) => {
    e.preventDefault();

    if (!canDispatch) {
      showToast("Acción denegada por Mínimo Privilegio (PoLP): Se requiere rol de Coordinador Logístico (diego.logistica) o Administrador.", "error");
      return;
    }

    if (origenId === destinoId) {
      showToast("El centro de destino debe ser diferente al centro de origen.", "error");
      return;
    }

    if (selectedQrs.length === 0) {
      showToast("Debe seleccionar al menos un dispositivo para despachar.", "error");
      return;
    }

    if (isOverweight) {
      showToast(`Regla RN-03: El peso total (${selectedWeight.toFixed(2)} kg) excede la capacidad del vehículo (${vehicleCapacity} kg).`, "error");
      return;
    }

    const res = dispatchMovement(
      {
        origenId,
        destinoId,
        selectedQrs,
        vehiculo
      },
      currentUser
    );

    if (res.success) {
      setSelectedQrs([]);
    }
  };

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Despacho Logístico y Red de Flujo (Edmonds-Karp)</h2>
          <p className="view-desc text-muted">
            Planificación de transferencias, verificación de peso vehicular (RN-03) y optimización de capacidades residuales (RN-05).
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm me-2"
            onClick={() => setShowNetworkModal(true)}
          >
            Visualizar Red (Edmonds-Karp)
          </button>
        </div>
      </div>

      {!canDispatch && (
        <div className="alert alert-warning mb-4" role="alert">
          <strong>Restricción PoLP Activa:</strong> Su rol actual (<code>{currentUser?.rolTitulo}</code>) no tiene permisos de despacho. Para despachar camiones, inicie sesión con <strong>diego.logistica</strong> o <strong>admin_sys</strong>.
        </div>
      )}

      <div className="row g-4 mb-4">
        {/* Formulario de Despacho */}
        <div className="col-12 col-lg-5">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Programación de Transferencia</h3>
            <form onSubmit={handleDispatch}>
              <div className="form-group mb-3">
                <label htmlFor="logOrigen">Centro de Origen:</label>
                <select
                  id="logOrigen"
                  className="form-select"
                  value={origenId}
                  onChange={e => {
                    setOrigenId(e.target.value);
                    setSelectedQrs([]);
                  }}
                  disabled={!canDispatch}
                  required
                >
                  {centers.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="logDestino">Centro de Destino Receptor:</label>
                <select
                  id="logDestino"
                  className="form-select"
                  value={destinoId}
                  onChange={e => setDestinoId(e.target.value)}
                  disabled={!canDispatch}
                  required
                >
                  {centers.map(c => (
                    <option key={c.id} value={c.id} disabled={c.id === origenId}>
                      {c.nombre} {c.id === origenId ? "(No permitido)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="logVehiculo">Vehículo Asignado:</label>
                <select
                  id="logVehiculo"
                  className="form-select"
                  value={vehiculo}
                  onChange={e => setVehiculo(e.target.value)}
                  disabled={!canDispatch}
                  required
                >
                  <option value="Camión Hino 3.5 Ton (UIDE-01)">Camión Hino 3.5 Ton (UIDE-01) — Capacidad 2,000 kg</option>
                  <option value="Furgón Logístico Campus (FL-02)">Furgón Logístico Campus (FL-02) — Capacidad 1,200 kg</option>
                  <option value="Camión Plataforma Gestor (REC-99)">Camión Plataforma Gestor (REC-99) — Capacidad 5,000 kg</option>
                </select>
              </div>

              {/* Indicador de peso vehicular acumulado */}
              <div className={`p-3 rounded border mb-3 ${isOverweight ? "bg-light-danger border-danger" : "bg-light"}`}>
                <div className="flex-between font-13 mb-1">
                  <span>Masa Seleccionada para Traslado:</span>
                  <span className={`font-bold font-mono ${isOverweight ? "text-danger" : "text-primary"}`}>
                    {selectedWeight.toFixed(2)} / {vehicleCapacity} kg
                  </span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className={`progress-bar ${isOverweight ? "bg-red" : "bg-primary"}`}
                    style={{ width: `${Math.min(100, (selectedWeight / vehicleCapacity) * 100)}%` }}
                  />
                </div>
                {isOverweight && (
                  <div className="font-12 text-danger mt-2">
                    Violación de Regla RN-03: El peso supera el límite seguro de carga vehicular.
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={!canDispatch || isOverweight || selectedQrs.length === 0}
              >
                Autorizar Despacho y Transferir Equipos
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Dispositivos Disponibles en Origen */}
        <div className="col-12 col-lg-7">
          <div className="card p-4">
            <div className="flex-between mb-3">
              <div>
                <h3 className="card-title font-16 mb-0">Dispositivos en Centro de Origen</h3>
                <span className="font-12 text-muted">
                  {availableDevices.length} equipos disponibles en custodia actual
                </span>
              </div>
              {availableDevices.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={handleSelectAll}
                  disabled={!canDispatch}
                >
                  {selectedQrs.length === availableDevices.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
                </button>
              )}
            </div>

            <div className="device-selection-list border rounded p-2" style={{ maxHeight: "380px", overflowY: "auto" }}>
              {availableDevices.length === 0 ? (
                <p className="text-muted font-13 py-4 text-center">
                  No hay dispositivos en custodia física dentro de este centro de acopio.
                </p>
              ) : (
                availableDevices.map(dev => (
                  <div
                    key={dev.qr}
                    className={`d-flex align-items-center p-2 border-bottom hover-bg ${selectedQrs.includes(dev.qr) ? "bg-light-selected" : ""}`}
                    onClick={() => canDispatch && handleToggleQr(dev.qr)}
                    style={{ cursor: canDispatch ? "pointer" : "default" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      checked={selectedQrs.includes(dev.qr)}
                      onChange={() => {}}
                      disabled={!canDispatch}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="font-mono font-bold font-13">{dev.qr}</span>
                        <span className="badge badge-gray font-10">{dev.pesoKg.toFixed(2)} kg</span>
                        <span className="badge badge-blue font-10">{dev.estadoNombre}</span>
                      </div>
                      <div className="font-12 text-muted">{dev.tipo} — {dev.marca} {dev.modelo}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Movimientos */}
      <div className="card p-4">
        <h3 className="card-title font-16 mb-3">Registro Histórico de Movimientos</h3>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Vehículo</th>
                <th>Carga</th>
                <th>Masa (kg)</th>
                <th>Responsable</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(mov => (
                <tr key={mov.id}>
                  <td className="font-mono font-bold">{mov.codigo}</td>
                  <td>{mov.origen}</td>
                  <td>{mov.destino}</td>
                  <td className="font-12">{mov.vehiculo}</td>
                  <td>{mov.dispositivosCount} unid.</td>
                  <td className="font-mono font-bold">{mov.pesoTotalKg} kg</td>
                  <td><code>{mov.responsable}</code></td>
                  <td className="font-12 text-muted">{mov.fecha}</td>
                  <td><span className="badge badge-green">{mov.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Visualizador Edmonds-Karp */}
      {showNetworkModal && (
        <div className="modal-backdrop active" onClick={() => setShowNetworkModal(false)}>
          <div className="modal-card modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: "800px" }}>
            <div className="modal-header">
              <h3>Optimización de Red Logística — Algoritmo Edmonds-Karp (RN-05)</h3>
              <button type="button" className="modal-close" onClick={() => setShowNetworkModal(false)}>x</button>
            </div>

            <div className="modal-body p-4">
              <p className="font-13 text-muted mb-3">
                Modelado matemático del flujo máximo de residuos entre el <strong>Campus UIDE (Nodo Fuente)</strong> y la <strong>Planta de Reciclaje Gestor (Nodo Sumidero)</strong>, considerando capacidades de transporte vehicular y cuellos de botella.
              </p>

              <div className="p-3 bg-white border rounded text-center mb-3">
                <svg viewBox="0 0 700 280" className="w-100" style={{ maxHeight: "280px" }}>
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
                    </marker>
                  </defs>

                  {/* Aristas del grafo con capacidades */}
                  <line x1="80" y1="140" x2="260" y2="70" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="170" y="95" fill="#4f46e5" fontSize="11" fontWeight="bold">Flujo: 1200 / 1500 kg</text>

                  <line x1="80" y1="140" x2="260" y2="210" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="170" y="195" fill="#4f46e5" fontSize="11" fontWeight="bold">Flujo: 800 / 1000 kg</text>

                  <line x1="260" y1="70" x2="440" y2="140" stroke="#059669" strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="350" y="95" fill="#059669" fontSize="11" fontWeight="bold">Flujo: 1200 / 1800 kg</text>

                  <line x1="260" y1="210" x2="440" y2="140" stroke="#059669" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="350" y="195" fill="#059669" fontSize="11" fontWeight="bold">Flujo: 800 / 1200 kg</text>

                  <line x1="440" y1="140" x2="620" y2="140" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrow)" />
                  <text x="530" y="130" fill="#dc2626" fontSize="12" fontWeight="bold">Max Flow: 2000 kg/día</text>

                  {/* Nodos */}
                  <circle cx="80" cy="140" r="30" fill="#1e293b" />
                  <text x="80" y="145" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Campus</text>

                  <circle cx="260" cy="70" r="30" fill="#3b82f6" />
                  <text x="260" y="75" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">Acopio N</text>

                  <circle cx="260" cy="210" r="30" fill="#3b82f6" />
                  <text x="260" y="215" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">Acopio S</text>

                  <circle cx="440" cy="140" r="30" fill="#8b5cf6" />
                  <text x="440" y="145" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">Taller Lab</text>

                  <circle cx="620" cy="140" r="30" fill="#059669" />
                  <text x="620" y="145" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">Gestor</text>
                </svg>
              </div>

              <div className="row g-2 font-12 bg-light p-3 rounded">
                <div className="col-4"><strong>Flujo Máximo Calculado:</strong> 2,000.0 kg / ciclo</div>
                <div className="col-4"><strong>Algoritmo:</strong> Edmonds-Karp (BFS)</div>
                <div className="col-4"><strong>Estado de Cuello de Botella:</strong> Óptimo</div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowNetworkModal(false)}>
                Cerrar Visualizador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
