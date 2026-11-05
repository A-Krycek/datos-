import React from "react";

export const PrintCertificateModal = ({ isOpen, onClose, device }) => {
  if (!isOpen || !device) return null;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: "780px" }}>
        <div className="modal-header">
          <h3>Certificado Institucional de Trazabilidad y Gestión RAEE</h3>
          <button type="button" className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="modal-body p-4" id="printableCertificate">
          <div className="certificate-border p-4 border border-2 border-dark rounded">
            {/* Encabezado del Certificado */}
            <div className="text-center mb-4">
              <h4 className="text-uppercase tracking-wide font-bold mb-1">Universidad Internacional del Ecuador — UIDE</h4>
              <h5 className="text-muted font-14 mb-1">Facultad de Ingeniería y Ciencias Aplicadas | Alianza Arizona State University</h5>
              <div className="badge badge-blue font-12 py-1 px-3 mt-2">CERTIFICADO OFICIAL DE TRAZABILIDAD Y DISPOSICIÓN CIRCULAR</div>
              <p className="font-mono font-12 text-muted mt-2">NÚMERO DE CERTIFICADO: <strong>CERT-RAEE-2026-{device.qr.split("-").pop() || "001"}</strong></p>
            </div>

            <hr className="my-3" />

            {/* Datos Técnicos */}
            <div className="row g-3 mb-4 font-13">
              <div className="col-6"><strong>Código QR Único:</strong> <span className="font-mono">{device.qr}</span></div>
              <div className="col-6"><strong>Número de Serie:</strong> <span className="font-mono">{device.serial}</span></div>
              <div className="col-6"><strong>Tipo de Dispositivo:</strong> {device.tipo}</div>
              <div className="col-6"><strong>Marca y Modelo:</strong> {device.marca} {device.modelo}</div>
              <div className="col-6"><strong>Categoría Ambiental:</strong> {device.categoria}</div>
              <div className="col-6"><strong>Peso Verificado en Báscula:</strong> {device.pesoKg.toFixed(2)} kg</div>
              <div className="col-6"><strong>Centro de Custodia:</strong> {device.centroNombre}</div>
              <div className="col-6"><strong>Estado Actual del Ciclo:</strong> <strong>{device.estadoNombre}</strong></div>
            </div>

            {/* Diagnóstico */}
            {device.diagnostico && (
              <div className="bg-light p-3 rounded mb-4 font-12">
                <strong>DICTAMEN TÉCNICO DE LABORATORIO (Lab-302):</strong>
                <p className="mb-1 mt-1">Clasificación: Grado {device.diagnostico.clasificacion} | Evaluador: {device.diagnostico.tecnico} | Fecha: {device.diagnostico.fechaDiagnostico}</p>
                <p className="mb-0">Observaciones Técnicas: {device.diagnostico.observaciones}</p>
              </div>
            )}

            {/* Firmas de Autoridad */}
            <div className="row text-center mt-5 pt-3">
              <div className="col-4">
                <div className="border-top pt-2 font-11">
                  <strong>Responsable de Acopio</strong><br />
                  <span>Carlos Mendoza</span><br />
                  <span className="text-muted font-10">Recepción y Pesaje (RN-01)</span>
                </div>
              </div>
              <div className="col-4">
                <div className="border-top pt-2 font-11">
                  <strong>Especialista Técnico</strong><br />
                  <span>Ing. María Salazar</span><br />
                  <span className="text-muted font-10">Dictamen y Taller (RN-02)</span>
                </div>
              </div>
              <div className="col-4">
                <div className="border-top pt-2 font-11">
                  <strong>Auditoría de Calidad</strong><br />
                  <span>Msc. Ana Paredes</span><br />
                  <span className="text-muted font-10">Sello de Cadena de Custodia (RN-08)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Imprimir Certificado Institucional
          </button>
        </div>
      </div>
    </div>
  );
};
