import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const CustodyView = ({ onOpenCertificate }) => {
  const { devices, certifyFinalDestination } = useData();
  const { currentUser, isAuditor, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [selectedQr, setSelectedQr] = useState("");
  const [entidad, setEntidad] = useState("Reciclaje Ambiental del Ecuador S.A. (RECICLA-EC)");
  const [manifiesto, setManifiesto] = useState("MAAE-2026-RAEE-0892");
  const [observaciones, setObservaciones] = useState("");

  const canCertify = isAuditor || isAdmin;

  // Dispositivos listos para certificación final
  const candidateDevices = devices.filter(d =>
    d.estadoId === "EST_RECICLAJE" || d.estadoId === "EST_DESPIECE"
  );

  // Dispositivos con ciclo de custodia cerrado
  const certifiedDevices = devices.filter(d => d.estadoId === "EST_CERRADO");

  const handleCertify = (e) => {
    e.preventDefault();

    if (!canCertify) {
      showToast("Acción denegada por Mínimo Privilegio (PoLP): La formalización de cadena de custodia requiere perfil de Auditor de Calidad (RN-08).", "error");
      return;
    }

    if (!selectedQr) {
      showToast("Debe seleccionar un dispositivo de la lista de candidatos.", "error");
      return;
    }

    const res = certifyFinalDestination(
      selectedQr,
      {
        entidad,
        manifiesto,
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
          <h2>Cadena de Custodia y Certificación Ambiental (RN-08)</h2>
          <p className="view-desc text-muted">
            Formalización de entrega a gestor calificado, verificación de manifiestos legales y sellado definitivo de trazabilidad.
          </p>
        </div>
        <div>
          <span className={`badge ${canCertify ? "badge-green" : "badge-amber"} font-12 py-1 px-3`}>
            {canCertify ? "Auditoría Habilitada (ROL_AUDITOR / ADMIN)" : "Modo Consulta (PoLP Activo)"}
          </span>
        </div>
      </div>

      {!canCertify && (
        <div className="alert alert-warning mb-4" role="alert">
          <strong>Restricción PoLP Activa:</strong> Su rol actual (<code>{currentUser?.rolTitulo}</code>) no tiene permisos de certificación legal. Inicie sesión como <strong>ana.auditora</strong> o <strong>admin_sys</strong> para sellar actas de destino final.
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de Certificación de Destino Final */}
        <div className="col-12 col-lg-5">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Sellado de Destino Final (RN-08)</h3>
            <form onSubmit={handleCertify}>
              <div className="form-group mb-3">
                <label htmlFor="custodyQr">Dispositivo en Proceso de Disposición:</label>
                <select
                  id="custodyQr"
                  className="form-select font-mono"
                  value={selectedQr}
                  onChange={e => setSelectedQr(e.target.value)}
                  disabled={!canCertify}
                  required
                >
                  <option value="">-- Seleccionar dispositivo a certificar --</option>
                  {candidateDevices.map(d => (
                    <option key={d.qr} value={d.qr}>
                      {d.qr} - {d.tipo} ({d.estadoNombre}) [{d.pesoKg} kg]
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="custodyEntidad">Gestor Ambiental Calificado MAAE:</label>
                <input
                  type="text"
                  id="custodyEntidad"
                  className="form-control"
                  value={entidad}
                  onChange={e => setEntidad(e.target.value)}
                  disabled={!canCertify}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="custodyManifiesto">Número de Manifiesto Ambiental Oficial:</label>
                <input
                  type="text"
                  id="custodyManifiesto"
                  className="form-control font-mono"
                  placeholder="MAAE-YYYY-RAEE-XXXX"
                  value={manifiesto}
                  onChange={e => setManifiesto(e.target.value)}
                  disabled={!canCertify}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="custodyObs">Dictamen de Auditoría y Declaración de Custodia:</label>
                <textarea
                  id="custodyObs"
                  className="form-control"
                  rows="3"
                  placeholder="Indique las condiciones de pesaje final, acta de entrega-recepción y firmas de descargo..."
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                  disabled={!canCertify}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={!canCertify || !selectedQr}
              >
                Sellar Acta y Cerrar Ciclo de Vida
              </button>
            </form>
          </div>
        </div>

        {/* Listado de Dispositivos con Cadena Cerrada */}
        <div className="col-12 col-lg-7">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Actas de Destino Final Selladas</h3>
            <div className="certified-list">
              {certifiedDevices.length === 0 ? (
                <p className="text-muted font-13 py-4 text-center">
                  Aún no existen activos con destino final cerrado en el repositorio.
                </p>
              ) : (
                certifiedDevices.map(dev => (
                  <div key={dev.qr} className="certified-item p-3 border rounded mb-3 bg-white shadow-sm">
                    <div className="flex-between mb-1">
                      <span className="font-mono font-bold text-dark">{dev.qr}</span>
                      <span className="badge badge-green">Ciclo Legal Cerrado</span>
                    </div>
                    <div className="font-13 font-medium">{dev.tipo} — {dev.marca} {dev.modelo} ({dev.pesoKg.toFixed(2)} kg)</div>
                    <div className="font-12 text-muted mb-2">
                      Último evento: {dev.historial[dev.historial.length - 1]?.observacion}
                    </div>

                    <div className="flex-between pt-2 border-top font-12">
                      <span className="font-mono text-muted">Auditor: {dev.historial[dev.historial.length - 1]?.responsable}</span>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => onOpenCertificate(dev)}
                      >
                        Ver Certificado Oficial
                      </button>
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
