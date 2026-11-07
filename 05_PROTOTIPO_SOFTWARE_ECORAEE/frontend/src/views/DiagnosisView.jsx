import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const DiagnosisView = () => {
  const { devices, submitDiagnostic } = useData();
  const { currentUser, canDiagnose, isTech, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [selectedQr, setSelectedQr] = useState("");
  const [clasificacion, setClasificacion] = useState("A");
  const [encendido, setEncendido] = useState(true);
  const [funcional, setFuncional] = useState(true);
  const [estetica, setEstetica] = useState("Bueno");
  const [aptoDonacion, setAptoDonacion] = useState(true);
  const [observaciones, setObservaciones] = useState("");

  // Dispositivos pendientes de evaluación o en reparación
  const pendingDevices = devices.filter(d =>
    d.estadoId === "EST_RECEP" || d.estadoId === "EST_REPAR" || !d.diagnostico
  );

  // Equipos evaluados recientemente
  const evaluatedDevices = devices.filter(d => d.diagnostico !== null);

  const handleClasificacionChange = (val) => {
    setClasificacion(val);
    if (val === "C" || val === "D") {
      setAptoDonacion(false);
    } else if (val === "A") {
      setAptoDonacion(true);
    }
  };

  const handleSubmitDiagnostic = (e) => {
    e.preventDefault();

    if (!canDiagnose) {
      showToast("Acción denegada por Mínimo Privilegio (PoLP): Su rol actual no tiene autorización para emitir diagnósticos técnicos (RN-02).", "error");
      return;
    }

    if (!selectedQr) {
      showToast("Debe seleccionar un dispositivo de la lista de pendientes.", "error");
      return;
    }

    // Regla RN-04
    if (aptoDonacion && (clasificacion === "C" || clasificacion === "D")) {
      showToast("Violación de Regla RN-04: Dispositivos en Grado C o D no pueden ser autorizados para donación social.", "error");
      return;
    }

    const res = submitDiagnostic(
      selectedQr,
      {
        clasificacion,
        encendido,
        funcional,
        estetica,
        aptoDonacion,
        observaciones
      },
      currentUser
    );

    if (res.success) {
      setSelectedQr("");
      setObservaciones("");
    }
  };

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Taller Técnico de Diagnóstico y Reacondicionamiento</h2>
          <p className="view-desc text-muted">
            Evaluación funcional en laboratorio Lab-302, clasificación de viabilidad y control de donación social (RN-02, RN-04).
          </p>
        </div>
        <div>
          <span className={`badge ${canDiagnose ? "badge-green" : "badge-amber"} font-12 py-1 px-3`}>
            {canDiagnose ? "Módulo Habilitado (ROL_TECNICO / ADMIN)" : "Modo Solo Lectura (PoLP Activo)"}
          </span>
        </div>
      </div>

      {!canDiagnose && (
        <div className="alert alert-warning mb-4" role="alert">
          <strong>Restricción de Mínimo Privilegio (RN-02):</strong> Su sesión actual (<code>{currentUser?.rolTitulo}</code>) no tiene permisos para emitir dictámenes técnicos en el taller. Para registrar evaluaciones, inicie sesión con una cuenta de <strong>Técnico de Diagnóstico (`maria.tecnico`)</strong> o <strong>Administrador General</strong>.
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de Evaluación Técnica */}
        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Ficha de Evaluación Técnica (RN-02)</h3>
            <form onSubmit={handleSubmitDiagnostic}>
              <div className="form-group mb-3">
                <label htmlFor="diagQr">Dispositivo a Evaluar:</label>
                <select
                  id="diagQr"
                  className="form-select font-mono"
                  value={selectedQr}
                  onChange={e => setSelectedQr(e.target.value)}
                  disabled={!canDiagnose}
                  required
                >
                  <option value="">-- Seleccionar dispositivo pendiente --</option>
                  {pendingDevices.map(d => (
                    <option key={d.qr} value={d.qr}>
                      {d.qr} - {d.tipo} ({d.marca} {d.modelo}) [{d.pesoKg} kg]
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="diagClass">Clasificación Técnica / Jerarquía de Recuperación:</label>
                <select
                  id="diagClass"
                  className="form-select"
                  value={clasificacion}
                  onChange={e => handleClasificacionChange(e.target.value)}
                  disabled={!canDiagnose}
                  required
                >
                  <option value="A">Grado A — Operativo al 100% (Apto para Donación Comunitaria)</option>
                  <option value="B">Grado B — Requiere Mantenimiento / Reparación Menor</option>
                  <option value="C">Grado C — Daño Severo (Canibalización de Repuestos Útiles)</option>
                  <option value="D">Grado D — Chatarra Electrónica (Reciclaje y Disposición Final)</option>
                </select>
              </div>

              {/* Checklist de pruebas de hardware */}
              <div className="checklist-box p-3 bg-light rounded mb-3">
                <span className="font-12 font-bold text-muted d-block mb-2">CHECKLIST DE LABORATORIO:</span>

                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    id="chkBoot"
                    className="form-check-input"
                    checked={encendido}
                    onChange={e => setEncendido(e.target.checked)}
                    disabled={!canDiagnose}
                  />
                  <label htmlFor="chkBoot" className="form-check-label font-13">
                    Prueba de Encendido (POST / Boot Test exitoso)
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    id="chkFunc"
                    className="form-check-input"
                    checked={funcional}
                    onChange={e => setFuncional(e.target.checked)}
                    disabled={!canDiagnose}
                  />
                  <label htmlFor="chkFunc" className="form-check-label font-13">
                    Operatividad general de placa madre, puertos y memoria
                  </label>
                </div>

                <div className="mt-2">
                  <label htmlFor="diagEstetica" className="font-13">Estado Estético y Chasis:</label>
                  <select
                    id="diagEstetica"
                    className="form-select form-select-sm"
                    value={estetica}
                    onChange={e => setEstetica(e.target.value)}
                    disabled={!canDiagnose}
                  >
                    <option value="Excelente">Excelente (Sin rayones ni golpes)</option>
                    <option value="Bueno">Bueno (Desgaste estético menor)</option>
                    <option value="Aceptable">Aceptable (Marcas de uso evidentes)</option>
                    <option value="Dañado">Dañado (Carcasa rota o panel fisurado)</option>
                    <option value="Obsoleto">Obsoleto / Inservible</option>
                  </select>
                </div>
              </div>

              {/* Control de Regla RN-04: Donación */}
              <div className={`p-3 rounded border mb-3 ${clasificacion === "C" || clasificacion === "D" ? "bg-light-danger border-danger" : "bg-light"}`}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="chkDonation"
                    className="form-check-input"
                    checked={aptoDonacion}
                    onChange={e => setAptoDonacion(e.target.checked)}
                    disabled={!canDiagnose || clasificacion === "C" || clasificacion === "D"}
                  />
                  <label htmlFor="chkDonation" className="form-check-label font-13 font-bold">
                    Autorizar para Programa de Donación Social a Escuelas (RN-04)
                  </label>
                </div>
                {(clasificacion === "C" || clasificacion === "D") && (
                  <div className="font-12 text-danger mt-1">
                    Bloqueado por Regla RN-04: Los equipos clasificados en Grado C (repuestos) o D (chatarra) tienen estrictamente prohibida la donación.
                  </div>
                )}
              </div>

              <div className="form-group mb-4">
                <label htmlFor="diagObs">Observaciones Técnicas y Componentes Recuperables:</label>
                <textarea
                  id="diagObs"
                  className="form-control"
                  rows="3"
                  placeholder="Detalle el estado de disco, memorias, condensadores o piezas canibalizadas..."
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                  disabled={!canDiagnose}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={!canDiagnose || !selectedQr}
              >
                Registrar Dictamen de Laboratorio
              </button>
            </form>
          </div>
        </div>

        {/* Historial de Evaluaciones Técnicas */}
        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Historial de Dispositivos Diagnosticados</h3>
            <div className="evaluated-list">
              {evaluatedDevices.length === 0 ? (
                <p className="text-muted font-13 py-4 text-center">
                  Aún no se han completado diagnósticos técnicos en esta sesión.
                </p>
              ) : (
                evaluatedDevices.map(dev => (
                  <div key={dev.qr} className="diagnostic-card-item p-3 border rounded mb-3 bg-white shadow-sm">
                    <div className="flex-between mb-1">
                      <span className="font-mono font-bold text-dark">{dev.qr}</span>
                      <span className="badge badge-purple">Grado {dev.diagnostico?.clasificacion}</span>
                    </div>
                    <div className="font-13 font-medium">{dev.tipo} — {dev.marca} {dev.modelo}</div>
                    <div className="font-12 text-muted mb-2">Evaluado por: <code>{dev.diagnostico?.tecnico}</code> ({dev.diagnostico?.fechaDiagnostico})</div>

                    <div className="font-12 bg-light p-2 rounded mb-2">
                      <strong>Dictamen:</strong> {dev.diagnostico?.observaciones}
                    </div>

                    <div className="flex-between font-12">
                      <span className="text-muted">Apto Donación: {dev.diagnostico?.aptoDonacion ? "Si (Aprobado)" : "No"}</span>
                      <span className="badge badge-blue">{dev.estadoNombre}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
