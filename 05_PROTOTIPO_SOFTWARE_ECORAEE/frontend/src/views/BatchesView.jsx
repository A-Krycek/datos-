import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

export const BatchesView = ({ onSelectBatchToFilter }) => {
  const { batches, devices, centers, createBatch } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    codigo: "",
    nombreLote: "",
    categoria: "Equipos de Informática y Telecomunicaciones",
    centroId: centers[0]?.id || "C-01",
    capacidadKg: "500"
  });

  const generateBatchCode = () => {
    let prefix = "LOTE-COM";
    if (formData.categoria.includes("Audio")) prefix = "LOTE-AUD";
    else if (formData.categoria.includes("Impresión")) prefix = "LOTE-IMP";
    else if (formData.categoria.includes("Servidores")) prefix = "LOTE-SRV";

    const num = String(batches.length + 1).padStart(3, "0");
    setFormData(prev => ({ ...prev, codigo: `${prefix}-2026-${num}` }));
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();

    if (!formData.codigo) {
      showToast("Debe ingresar o generar un código de lote.", "error");
      return;
    }

    const res = createBatch(formData);
    if (res.success) {
      setFormData({
        codigo: "",
        nombreLote: "",
        categoria: "Equipos de Informática y Telecomunicaciones",
        centroId: centers[0]?.id || "C-01",
        capacidadKg: "500"
      });
    }
  };

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Gestión y Consolidación de Lotes RAEE</h2>
          <p className="view-desc text-muted">
            Agrupación volumétrica de dispositivos por categoría para optimización de logística y pesaje acumulado (CP-01).
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulario de creación de lote */}
        <div className="col-12 col-lg-4">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Nuevo Lote de Acopio</h3>
            <form onSubmit={handleCreateBatch}>
              <div className="form-group mb-3">
                <label htmlFor="batchCode">Código del Lote:</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="batchCode"
                    className="form-control font-mono"
                    placeholder="LOTE-XXX-2026-XXX"
                    value={formData.codigo}
                    onChange={e => setFormData({ ...formData, codigo: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={generateBatchCode}
                  >
                    Generar
                  </button>
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="batchName">Nombre / Descripción:</label>
                <input
                  type="text"
                  id="batchName"
                  className="form-control"
                  placeholder="Ej: Lote Monitores Aulas Sur"
                  value={formData.nombreLote}
                  onChange={e => setFormData({ ...formData, nombreLote: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="batchCat">Categoría de RAEE:</label>
                <select
                  id="batchCat"
                  className="form-select"
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                  required
                >
                  <option value="Equipos de Informática y Telecomunicaciones">Equipos de Informática y Telecomunicaciones</option>
                  <option value="Aparatos Electrónicos de Consumo y Audio/Video">Aparatos Electrónicos de Consumo y Audio/Video</option>
                  <option value="Equipos de Impresión y Copiado">Equipos de Impresión y Copiado</option>
                  <option value="Servidores y Redes de Alta Capacidad">Servidores y Redes de Alta Capacidad</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="batchCap">Capacidad Máxima (kg - CP-01):</label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  id="batchCap"
                  className="form-control"
                  placeholder="Ej: 500"
                  value={formData.capacidadKg}
                  onChange={e => setFormData({ ...formData, capacidadKg: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="batchCenter">Centro de Acopio Asignado:</label>
                <select
                  id="batchCenter"
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

              <button type="submit" className="btn btn-primary w-100">
                Consolidar Nuevo Lote
              </button>
            </form>
          </div>
        </div>

        {/* Listado y Monitoreo de Lotes */}
        <div className="col-12 col-lg-8">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Lotes Activos en el Sistema</h3>
            <div className="row g-3">
              {batches.map(batch => {
                const devsInBatch = devices.filter(d => d.loteCodigo === batch.codigo);
                const currentWeight = devsInBatch.reduce((sum, d) => sum + (d.pesoKg || 0), 0);
                const progressPct = Math.min(100, Math.round((currentWeight / batch.capacidadKg) * 100));

                return (
                  <div key={batch.id} className="col-12 col-md-6">
                    <div className="batch-card p-3 border rounded bg-white shadow-sm h-100 flex-column justify-content-between d-flex">
                      <div>
                        <div className="flex-between mb-2">
                          <span className="font-mono font-bold text-primary font-14">{batch.codigo}</span>
                          <span className="badge badge-green font-11">{batch.estado}</span>
                        </div>
                        <h4 className="font-14 font-bold text-dark mb-1">{batch.nombreLote}</h4>
                        <div className="font-12 text-muted mb-2">{batch.categoria}</div>
                        <div className="font-12 text-muted mb-3">Ubicación: <strong>{batch.centroNombre}</strong></div>

                        <div className="flex-between font-12 mb-1">
                          <span>Masa Acumulada: <strong>{currentWeight.toFixed(2)} kg</strong></span>
                          <span>Límite: {batch.capacidadKg} kg ({progressPct}%)</span>
                        </div>
                        <div className="progress mb-2" style={{ height: "7px" }}>
                          <div
                            className={`progress-bar ${progressPct > 90 ? "bg-red" : progressPct > 60 ? "bg-amber" : "bg-primary"}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex-between pt-2 border-top mt-3 font-12">
                        <span className="text-muted">{devsInBatch.length} dispositivos contenidos</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => onSelectBatchToFilter(batch.codigo)}
                        >
                          Ver Equipos
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
