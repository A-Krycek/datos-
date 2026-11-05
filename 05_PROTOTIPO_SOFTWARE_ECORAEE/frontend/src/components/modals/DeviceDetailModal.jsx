import React from "react";

export const DeviceDetailModal = ({ isOpen, onClose, device, onOpenCertificate, onOpenQr }) => {
  if (!isOpen || !device) return null;

  const getBadgeClass = (estadoId) => {
    switch (estadoId) {
      case "EST_REUTIL": return "badge-green";
      case "EST_REPAR": return "badge-amber";
      case "EST_DESPIECE": return "badge-purple";
      case "EST_RECICLAJE": return "badge-red";
      case "EST_CERRADO": return "badge-blue";
      default: return "badge-blue";
    }
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: "700px" }}>
        <div className="modal-header">
          <h3>Ficha Técnica y Trazabilidad: {device.qr}</h3>
          <button type="button" className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="modal-body">
          <div className="device-spec-grid p-3 bg-light rounded mb-3">
            <div className="row g-2 font-13">
              <div className="col-6"><strong>Código QR:</strong> <span className="font-mono">{device.qr}</span></div>
              <div className="col-6"><strong>Estado Actual:</strong> <span className={`badge ${getBadgeClass(device.estadoId)}`}>{device.estadoNombre}</span></div>
              <div className="col-6"><strong>Tipo de Equipo:</strong> {device.tipo}</div>
              <div className="col-6"><strong>Marca y Modelo:</strong> {device.marca} {device.modelo}</div>
              <div className="col-6"><strong>Número de Serie:</strong> <span className="font-mono">{device.serial}</span></div>
              <div className="col-6"><strong>Peso Verificado:</strong> {device.pesoKg.toFixed(2)} kg</div>
              <div className="col-6"><strong>Centro Asignado:</strong> {device.centroNombre}</div>
              <div className="col-6"><strong>Lote:</strong> {device.loteCodigo || "Sin Lote Asignado"}</div>
            </div>
          </div>

          {/* Información de diagnóstico técnico si existe */}
          {device.diagnostico ? (
            <div className="diagnostic-summary-box p-3 border rounded mb-3">
              <div className="flex-between mb-2">
                <span className="font-13 font-bold text-primary">DICTAMEN TÉCNICO DE LABORATORIO (RN-02)</span>
                <span className="badge badge-purple font-bold">Grado {device.diagnostico.clasificacion}</span>
              </div>
              <p className="font-13 mb-1"><strong>Evaluador Técnico:</strong> {device.diagnostico.tecnico} ({device.diagnostico.fechaDiagnostico})</p>
              <p className="font-13 mb-1"><strong>Diagnóstico Funcional:</strong> Encendido: {device.diagnostico.encendido ? "Si" : "No"} | Operatividad: {device.diagnostico.funcional ? "Operativo" : "Requiere Intervención"} | Estética: {device.diagnostico.estetica}</p>
              <p className="font-13 mb-0"><strong>Apto para Donación:</strong> {device.diagnostico.aptoDonacion ? "Si (Aprobado)" : "No (Excluido por RN-04)"}</p>
              <p className="font-12 text-muted mt-1 mb-0"><strong>Observaciones:</strong> {device.diagnostico.observaciones}</p>
            </div>
          ) : (
            <div className="alert alert-info py-2 font-13 mb-3">
              Este equipo se encuentra en espera de evaluación técnica por el laboratorio Lab-302.
            </div>
          )}

          {/* Línea de tiempo de eventos */}
          <h4 className="font-14 font-bold mb-2">Cadena de Custodia y Eventos Cronológicos</h4>
          <div className="timeline-container">
            {device.historial && device.historial.map((hist, index) => (
              <div key={index} className="timeline-node">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="flex-between">
                    <span className="timeline-title font-bold">{hist.estado}</span>
                    <span className="timeline-date font-12 text-muted">{hist.fecha}</span>
                  </div>
                  <div className="timeline-meta font-12">Responsable: <code>{hist.responsable}</code></div>
                  <div className="timeline-desc font-12 mt-1">{hist.observacion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer flex-between">
          <div>
            <button
              type="button"
              className="btn btn-outline btn-sm me-2"
              onClick={() => {
                onClose();
                onOpenQr(device);
              }}
            >
              Ver Código QR
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                onClose();
                onOpenCertificate(device);
              }}
            >
              Generar Certificado
            </button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
