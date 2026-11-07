import React from "react";
import { useData } from "../context/DataContext";

export const DashboardView = ({ onNavigateToView, onOpenNewDeviceModal }) => {
  const { devices, batches, centers, movements } = useData();

  // Cálculo de KPIs
  const totalUnits = devices.length;
  const totalKg = devices.reduce((acc, d) => acc + (d.pesoKg || 0), 0);

  const reutilizables = devices.filter(d => d.estadoId === "EST_REUTIL").length;
  const reciclaje = devices.filter(d => d.estadoId === "EST_RECICLAJE" || d.estadoId === "EST_CERRADO").length;

  const reutRate = totalUnits > 0 ? ((reutilizables / totalUnits) * 100).toFixed(1) : 0;
  const recicRate = totalUnits > 0 ? ((reciclaje / totalUnits) * 100).toFixed(1) : 0;

  // Impacto ambiental estimado: 1 kg de RAEE reacondicionado evita aprox 14.4 kg de CO2eq y 90 litros de agua
  const co2Evitado = (reutilizables * 14.4).toFixed(1);
  const aguaAhorrada = (reutilizables * 90).toFixed(0);

  // Distribución por categorías
  const categoriesMap = {};
  devices.forEach(d => {
    categoriesMap[d.categoria] = (categoriesMap[d.categoria] || 0) + 1;
  });

  // Distribución por estados
  const statusMap = {};
  devices.forEach(d => {
    statusMap[d.estadoNombre] = (statusMap[d.estadoNombre] || 0) + 1;
  });

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Panel de Métricas y Gobernanza Circular</h2>
          <p className="view-desc text-muted">
            Monitoreo en tiempo real del flujo de RAEE en el campus universitario de Quito (RF-INT-05).
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenNewDeviceModal}
          >
            Nuevo Dispositivo
          </button>
        </div>
      </div>

      {/* Grid de KPIs principales */}
      <div className="kpi-grid mb-4">
        <div className="kpi-card">
          <div className="kpi-title">TOTAL DISPOSITIVOS</div>
          <div className="kpi-value text-primary">{totalUnits}</div>
          <div className="kpi-subtitle">Unidades inventariadas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">MASA TOTAL ACOPIADA</div>
          <div className="kpi-value text-indigo">{totalKg.toFixed(2)} kg</div>
          <div className="kpi-subtitle">Pesaje verificado en báscula</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">TASA DE REUTILIZACIÓN</div>
          <div className="kpi-value text-green">{reutRate}%</div>
          <div className="kpi-subtitle">{reutilizables} equipos salvados para donación</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">TASA DE RECICLAJE</div>
          <div className="kpi-value text-amber">{recicRate}%</div>
          <div className="kpi-subtitle">{reciclaje} unidades con gestor calificado</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">LOTES CONSOLIDADOS</div>
          <div className="kpi-value text-dark">{batches.length}</div>
          <div className="kpi-subtitle">Agrupaciones activas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">HUELLA DE CO2 EVITADA</div>
          <div className="kpi-value text-green">{co2Evitado} kg</div>
          <div className="kpi-subtitle">{aguaAhorrada} litros de agua conservados</div>
        </div>
      </div>

      {/* Distribución por Categorías y Estados */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100 p-4">
            <h3 className="card-title font-16 mb-3">Distribución por Categorías de RAEE</h3>
            <div className="category-bars-list">
              {Object.entries(categoriesMap).map(([cat, count]) => {
                const pct = totalUnits > 0 ? ((count / totalUnits) * 100).toFixed(0) : 0;
                return (
                  <div key={cat} className="mb-3">
                    <div className="flex-between font-13 mb-1">
                      <span className="font-medium">{cat}</span>
                      <span className="text-muted">{count} unid. ({pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100 p-4">
            <h3 className="card-title font-16 mb-3">Estado del Ciclo de Vida</h3>
            <div className="status-bars-list">
              {Object.entries(statusMap).map(([status, count]) => {
                const pct = totalUnits > 0 ? ((count / totalUnits) * 100).toFixed(0) : 0;
                return (
                  <div key={status} className="mb-3">
                    <div className="flex-between font-13 mb-1">
                      <span className="font-medium">{status}</span>
                      <span className="text-muted">{count} unid. ({pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-teal" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Capacidad de Centros de Acopio */}
      <div className="card p-4 mb-4">
        <h3 className="card-title font-16 mb-3">Ocupación y Capacidad de Centros de Acopio</h3>
        <div className="row g-3">
          {centers.map(center => {
            const devsInCenter = devices.filter(d => d.centroId === center.id);
            const currentKg = devsInCenter.reduce((acc, d) => acc + (d.pesoKg || 0), 0);
            const occPct = Math.min(100, Math.round((currentKg / center.capacidadKg) * 100));

            return (
              <div key={center.id} className="col-12 col-md-4">
                <div className="center-stat-card p-3 border rounded bg-light">
                  <div className="font-14 font-bold text-dark mb-1">{center.nombre}</div>
                  <div className="font-12 text-muted mb-2">{center.ubicacion} ({center.tipo})</div>
                  <div className="flex-between font-12 mb-1">
                    <span>Ocupación: {currentKg.toFixed(1)} / {center.capacidadKg} kg</span>
                    <span className="font-bold">{occPct}%</span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className={`progress-bar ${occPct > 80 ? "bg-red" : occPct > 50 ? "bg-amber" : "bg-green"}`}
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                  <div className="font-11 text-muted mt-2">{devsInCenter.length} dispositivos en custodia</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Movimientos Recientes */}
      <div className="card p-4">
        <div className="flex-between mb-3">
          <h3 className="card-title font-16 mb-0">Últimos Movimientos de Transferencia</h3>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigateToView("logistics")}
          >
            Ver Red Logística
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Dispositivos</th>
                <th>Peso (kg)</th>
                <th>Responsable</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, 5).map(mov => (
                <tr key={mov.id}>
                  <td className="font-mono font-bold">{mov.codigo}</td>
                  <td>{mov.origen}</td>
                  <td>{mov.destino}</td>
                  <td>{mov.dispositivosCount} unid.</td>
                  <td>{mov.pesoTotalKg} kg</td>
                  <td><code>{mov.responsable}</code></td>
                  <td className="font-12 text-muted">{mov.fecha}</td>
                  <td><span className="badge badge-green">{mov.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
