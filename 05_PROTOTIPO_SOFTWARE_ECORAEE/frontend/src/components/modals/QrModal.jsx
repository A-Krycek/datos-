import React from "react";

export const QrModal = ({ isOpen, onClose, device }) => {
  if (!isOpen || !device) return null;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: "450px", textAlign: "center" }}>
        <div className="modal-header">
          <h3>Código QR y Etiqueta de Trazabilidad</h3>
          <button type="button" className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="modal-body py-4">
          <div className="qr-box-container p-4 bg-white border rounded d-inline-block shadow-sm mb-3">
            {/* Generación vectorial del QR simulado con precisión */}
            <svg viewBox="0 0 100 100" width="180" height="180" className="d-block mx-auto">
              <rect width="100" height="100" fill="#ffffff" />
              {/* Esquinas QR */}
              <rect x="5" y="5" width="26" height="26" fill="#111827" />
              <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
              <rect x="13" y="13" width="10" height="10" fill="#111827" />

              <rect x="69" y="5" width="26" height="26" fill="#111827" />
              <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
              <rect x="77" y="13" width="10" height="10" fill="#111827" />

              <rect x="5" y="69" width="26" height="26" fill="#111827" />
              <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
              <rect x="13" y="77" width="10" height="10" fill="#111827" />

              {/* Patrones interiores */}
              <rect x="36" y="8" width="6" height="6" fill="#111827" />
              <rect x="46" y="8" width="6" height="6" fill="#111827" />
              <rect x="36" y="20" width="6" height="6" fill="#111827" />
              <rect x="56" y="20" width="6" height="6" fill="#111827" />
              <rect x="8" y="36" width="6" height="6" fill="#111827" />
              <rect x="20" y="36" width="6" height="6" fill="#111827" />
              <rect x="36" y="36" width="8" height="8" fill="#111827" />
              <rect x="48" y="36" width="8" height="8" fill="#111827" />
              <rect x="60" y="36" width="6" height="6" fill="#111827" />
              <rect x="72" y="36" width="8" height="8" fill="#111827" />
              <rect x="84" y="36" width="6" height="6" fill="#111827" />
              <rect x="36" y="48" width="8" height="8" fill="#111827" />
              <rect x="48" y="48" width="8" height="8" fill="#111827" />
              <rect x="68" y="48" width="8" height="8" fill="#111827" />
              <rect x="80" y="48" width="8" height="8" fill="#111827" />
              <rect x="36" y="60" width="6" height="6" fill="#111827" />
              <rect x="50" y="60" width="12" height="6" fill="#111827" />
              <rect x="70" y="60" width="8" height="6" fill="#111827" />
              <rect x="86" y="60" width="6" height="6" fill="#111827" />
              <rect x="36" y="72" width="8" height="8" fill="#111827" />
              <rect x="48" y="72" width="6" height="8" fill="#111827" />
              <rect x="60" y="72" width="10" height="8" fill="#111827" />
              <rect x="76" y="72" width="6" height="8" fill="#111827" />
              <rect x="88" y="72" width="6" height="8" fill="#111827" />
              <rect x="36" y="86" width="6" height="6" fill="#111827" />
              <rect x="48" y="86" width="8" height="6" fill="#111827" />
              <rect x="64" y="86" width="6" height="6" fill="#111827" />
              <rect x="76" y="86" width="12" height="6" fill="#111827" />
            </svg>
            <div className="font-mono font-bold font-14 mt-2 text-dark">{device.qr}</div>
            <div className="font-12 text-muted">{device.tipo} ({device.pesoKg} kg)</div>
          </div>

          {/* Código de barras simulado */}
          <div className="barcode-simulation p-2 bg-light border rounded">
            <div className="font-11 text-muted mb-1">CÓDIGO DE BARRAS INSTITUCIONAL (CODE128):</div>
            <div className="barcode-lines d-flex justify-content-center align-items-center" style={{ height: "35px", gap: "2px" }}>
              {[3,1,2,1,4,2,1,3,1,2,3,1,2,4,1,2,1,3,2,1,4,1,2,1,3,2,1,4,2,1,3,1].map((w, idx) => (
                <span key={idx} style={{ display: "inline-block", width: `${w * 1.5}px`, height: "100%", background: "#111827" }} />
              ))}
            </div>
            <div className="font-mono font-12 mt-1">{device.serial || device.qr}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Imprimir Etiqueta Física
          </button>
        </div>
      </div>
    </div>
  );
};
