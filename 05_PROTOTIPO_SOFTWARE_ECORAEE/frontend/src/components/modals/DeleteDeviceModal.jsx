import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const DeleteDeviceModal = ({ isOpen, onClose, device }) => {
  const { deleteDevice } = useData();
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [reason, setReason] = useState("");

  if (!isOpen || !device) return null;

  const handleDelete = (e) => {
    e.preventDefault();

    if (!isAdmin) {
      showToast("Acción denegada por Mínimo Privilegio (PoLP): Solo un Administrador General puede ejecutar bajas de inventario (CP-04).", "error");
      return;
    }

    if (!reason || reason.trim().length < 5) {
      showToast("Debe ingresar un motivo formal de baja para el registro de auditoría.", "error");
      return;
    }

    const res = deleteDevice(device.qr, reason, currentUser);
    if (res.success) {
      setReason("");
      onClose();
    }
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        <div className="modal-header">
          <h3>Confirmación de Baja en Inventario</h3>
          <button type="button" className="modal-close" onClick={onClose}>x</button>
        </div>

        <form onSubmit={handleDelete}>
          <div className="modal-body">
            <div className="alert alert-danger mb-3" role="alert">
              <strong>Advertencia de Seguridad (CP-04):</strong> Está a punto de dar de baja física el dispositivo <code>{device.qr}</code> ({device.tipo} - {device.marca} {device.modelo}). Esta acción es irreversible.
            </div>

            {!isAdmin && (
              <div className="alert alert-warning mb-3">
                <strong>Restricción PoLP Activa:</strong> Su rol actual (<code>{currentUser?.rolTitulo}</code>) no tiene permisos de baja. Para proceder, cambie a una sesión con rol <code>ROL_ADMIN</code>.
              </div>
            )}

            <div className="form-group mb-3">
              <label htmlFor="deleteReason">Motivo Técnico de la Baja (Obligatorio para Auditoría):</label>
              <textarea
                id="deleteReason"
                className="form-control"
                rows="3"
                placeholder="Ej: Destrucción por residuo peligroso calificado, error de ingreso físico original..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                disabled={!isAdmin}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-danger" disabled={!isAdmin}>
              Confirmar y Dar de Baja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
