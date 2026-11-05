import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const DeviceFormModal = ({ isOpen, onClose, deviceToEdit = null }) => {
  const { centers, batches, registerDevice, updateDevice } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const isEditing = !!deviceToEdit;

  const [formData, setFormData] = useState({
    qr: "",
    tipo: "Laptop Institucional",
    categoria: "Equipos de Informática y Telecomunicaciones",
    marca: "",
    modelo: "",
    serial: "",
    pesoKg: "",
    centroId: centers[0]?.id || "C-01",
    loteCodigo: "",
    editReason: ""
  });

  useEffect(() => {
    if (deviceToEdit) {
      setFormData({
        qr: deviceToEdit.qr,
        tipo: deviceToEdit.tipo,
        categoria: deviceToEdit.categoria,
        marca: deviceToEdit.marca,
        modelo: deviceToEdit.modelo,
        serial: deviceToEdit.serial,
        pesoKg: deviceToEdit.pesoKg.toString(),
        centroId: deviceToEdit.centroId,
        loteCodigo: deviceToEdit.loteCodigo || "",
        editReason: ""
      });
    } else {
      setFormData({
        qr: "",
        tipo: "Laptop Institucional",
        categoria: "Equipos de Informática y Telecomunicaciones",
        marca: "",
        modelo: "",
        serial: "",
        pesoKg: "",
        centroId: centers[0]?.id || "C-01",
        loteCodigo: "",
        editReason: ""
      });
    }
  }, [deviceToEdit, centers, isOpen]);

  if (!isOpen) return null;

  const generateRandomQr = () => {
    const year = 2026;
    const rand = Math.floor(100 + Math.random() * 900);
    setFormData(prev => ({ ...prev, qr: `RAEE-UIDE-${year}-${rand}` }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const weightNum = parseFloat(formData.pesoKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      showToast("Regla RN-01: El peso debe ser un valor numérico mayor a cero.", "error");
      return;
    }

    if (isEditing) {
      const res = updateDevice(
        deviceToEdit.qr,
        {
          tipo: formData.tipo,
          categoria: formData.categoria,
          marca: formData.marca,
          modelo: formData.modelo,
          serial: formData.serial,
          pesoKg: weightNum,
          centroId: formData.centroId,
          centroNombre: centers.find(c => c.id === formData.centroId)?.nombre || deviceToEdit.centroNombre,
          loteCodigo: formData.loteCodigo
        },
        formData.editReason,
        currentUser
      );
      if (res.success) onClose();
    } else {
      const res = registerDevice(
        {
          qr: formData.qr,
          tipo: formData.tipo,
          categoria: formData.categoria,
          marca: formData.marca,
          modelo: formData.modelo,
          serial: formData.serial,
          pesoKg: weightNum,
          centroId: formData.centroId,
          loteCodigo: formData.loteCodigo
        },
        currentUser
      );
      if (res.success) onClose();
    }
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: "650px" }}>
        <div className="modal-header">
          <h3>{isEditing ? `Modificar Dispositivo: ${deviceToEdit.qr}` : "Registrar Dispositivo en Inventario (CP-02)"}</h3>
          <button type="button" className="modal-close" onClick={onClose}>x</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devQr">Código QR Identificador (RN-06):</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="devQr"
                    className="form-control font-mono"
                    placeholder="RAEE-UIDE-2026-XXX"
                    value={formData.qr}
                    onChange={e => setFormData({ ...formData, qr: e.target.value })}
                    disabled={isEditing}
                    required
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={generateRandomQr}
                    >
                      Autogenerar
                    </button>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devTipo">Tipo de Dispositivo:</label>
                <input
                  type="text"
                  id="devTipo"
                  className="form-control"
                  placeholder="Ej: Laptop Institucional, Monitor LED"
                  value={formData.tipo}
                  onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devCat">Categoría de RAEE:</label>
                <select
                  id="devCat"
                  className="form-select"
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                  required
                >
                  <option value="Equipos de Informática y Telecomunicaciones">Equipos de Informática y Telecomunicaciones</option>
                  <option value="Aparatos Electrónicos de Consumo y Audio/Video">Aparatos Electrónicos de Consumo y Audio/Video</option>
                  <option value="Equipos de Impresión y Copiado">Equipos de Impresión y Copiado</option>
                  <option value="Servidores y Redes de Alta Capacidad">Servidores y Redes de Alta Capacidad</option>
                  <option value="Pequeños Electrodomésticos y Accesorios">Pequeños Electrodomésticos y Accesorios</option>
                </select>
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devPeso">Peso Verificado en Báscula (kg - RN-01):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="devPeso"
                  className="form-control"
                  placeholder="Ej: 2.45"
                  value={formData.pesoKg}
                  onChange={e => setFormData({ ...formData, pesoKg: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devMarca">Marca:</label>
                <input
                  type="text"
                  id="devMarca"
                  className="form-control"
                  placeholder="Ej: Dell, HP, Lenovo, Apple"
                  value={formData.marca}
                  onChange={e => setFormData({ ...formData, marca: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devModelo">Modelo:</label>
                <input
                  type="text"
                  id="devModelo"
                  className="form-control"
                  placeholder="Ej: Latitude 5490"
                  value={formData.modelo}
                  onChange={e => setFormData({ ...formData, modelo: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devSerial">Número de Serie (S/N):</label>
                <input
                  type="text"
                  id="devSerial"
                  className="form-control font-mono"
                  placeholder="Ej: SN-9988112"
                  value={formData.serial}
                  onChange={e => setFormData({ ...formData, serial: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6 form-group">
                <label htmlFor="devCentro">Centro de Recepción Inicial:</label>
                <select
                  id="devCentro"
                  className="form-select"
                  value={formData.centroId}
                  onChange={e => setFormData({ ...formData, centroId: e.target.value })}
                  required
                >
                  {centers.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 form-group">
                <label htmlFor="devLote">Asignar a Lote (Opcional):</label>
                <select
                  id="devLote"
                  className="form-select"
                  value={formData.loteCodigo}
                  onChange={e => setFormData({ ...formData, loteCodigo: e.target.value })}
                >
                  <option value="">-- Sin asignar a lote --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.codigo}>{b.codigo} - {b.nombreLote}</option>
                  ))}
                </select>
              </div>

              {isEditing && (
                <div className="col-12 form-group">
                  <label htmlFor="devReason">Justificación / Motivo del Cambio (Auditoría):</label>
                  <textarea
                    id="devReason"
                    className="form-control"
                    rows="2"
                    placeholder="Describa el motivo de la modificación técnica..."
                    value={formData.editReason}
                    onChange={e => setFormData({ ...formData, editReason: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Guardar Modificaciones" : "Registrar Dispositivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
