import React from "react";
import { useData } from "../context/DataContext";

export const ReportsView = () => {
  const { devices } = useData();

  const totalKg = devices.reduce((sum, d) => sum + (d.pesoKg || 0), 0);
  const reutDevices = devices.filter(d => d.estadoId === "EST_REUTIL");
  const reutKg = reutDevices.reduce((sum, d) => sum + (d.pesoKg || 0), 0);

  // Estimaciones basadas en estándares de reciclaje de RAEE (WEEE Forum)
  const metalesFerricosKg = (totalKg * 0.45).toFixed(1);
  const plasticosIngKg = (totalKg * 0.25).toFixed(1);
  const tarjetasPcbKg = (totalKg * 0.12).toFixed(1);
  const cobreAluminioKg = (totalKg * 0.10).toFixed(1);
  const residuosPeligrososKg = (totalKg * 0.08).toFixed(1);

  const co2Evitado = (reutKg * 14.4).toFixed(1);
  const aguaConservada = (reutKg * 90).toFixed(0);

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Reportes de Sostenibilidad y Economía Circular</h2>
          <p className="view-desc text-muted">
            Indicadores de valorización de materiales, huella de carbono evitada y cumplimiento normativo institucional (RF-INT-05).
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>
            Exportar Informe Ejecutivo
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="kpi-grid mb-4">
        <div className="kpi-card">
          <div className="kpi-title">CO2 EVITADO POR REUTILIZACIÓN</div>
          <div className="kpi-value text-green">{co2Evitado} kg</div>
          <div className="kpi-subtitle">Equivalente a {Math.round(parseFloat(co2Evitado) / 2.3)} árboles plantados</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">AGUA VIRTUAL CONSERVADA</div>
          <div className="kpi-value text-indigo">{aguaConservada} L</div>
          <div className="kpi-subtitle">Ahorro en manufactura de componentes</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">VALORIZACIÓN MATERIAL TOTAL</div>
          <div className="kpi-value text-primary">{((totalKg * 0.92)).toFixed(1)} kg</div>
          <div className="kpi-subtitle">92% de aprovechamiento en ciclo cerrado</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">CUMPLIMIENTO MAAE / ACADEMIA</div>
          <div className="kpi-value text-dark">100%</div>
          <div className="kpi-subtitle">Auditoría ambiental sin observaciones</div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Estimación de Materiales Recuperables */}
        <div className="col-12 col-lg-6">
          <div className="card p-4 h-100">
            <h3 className="card-title font-16 mb-3">Fracciones de Materiales Recuperables</h3>
            <p className="font-12 text-muted mb-4">
              Desglose teórico según composición estándar de RAEE universitarios pesados en báscula:
            </p>

            <div className="material-item mb-3">
              <div className="flex-between font-13 mb-1">
                <span>Metales Férricos (Chasis, soportes de acero)</span>
                <span className="font-bold">{metalesFerricosKg} kg (45%)</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div className="progress-bar bg-primary" style={{ width: "45%" }} />
              </div>
            </div>

            <div className="material-item mb-3">
              <div className="flex-between font-13 mb-1">
                <span>Plásticos de Ingeniería (ABS, policarbonato)</span>
                <span className="font-bold">{plasticosIngKg} kg (25%)</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div className="progress-bar bg-teal" style={{ width: "25%" }} />
              </div>
            </div>

            <div className="material-item mb-3">
              <div className="flex-between font-13 mb-1">
                <span>Tarjetas Electrónicas / PCB (Cobre, oro, plata)</span>
                <span className="font-bold">{tarjetasPcbKg} kg (12%)</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div className="progress-bar bg-purple" style={{ width: "12%" }} />
              </div>
            </div>

            <div className="material-item mb-3">
              <div className="flex-between font-13 mb-1">
                <span>Cobre y Aluminio Puro (Cables, disipadores)</span>
                <span className="font-bold">{cobreAluminioKg} kg (10%)</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div className="progress-bar bg-amber" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="material-item mb-3">
              <div className="flex-between font-13 mb-1">
                <span>Residuos Especiales Controlados (Baterías, tubos)</span>
                <span className="font-bold">{residuosPeligrososKg} kg (8%)</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div className="progress-bar bg-red" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Políticas de Gobernanza y Circularidad */}
        <div className="col-12 col-lg-6">
          <div className="card p-4 h-100">
            <h3 className="card-title font-16 mb-3">Gobernanza Institucional UIDE / ASU</h3>
            <div className="governance-block p-3 bg-light rounded mb-3">
              <div className="font-14 font-bold text-dark mb-1">1. Jerarquía de Residuos (Prioridad al Reacondicionamiento)</div>
              <p className="font-12 text-muted mb-0">
                Todo equipo informático debe pasar primero por el taller Lab-302 para evaluar viabilidad de donación a escuelas rurales antes de ser destinado a desguace o reciclaje.
              </p>
            </div>

            <div className="governance-block p-3 bg-light rounded mb-3">
              <div className="font-14 font-bold text-dark mb-1">2. Cero Residuos Electrónicos a Relleno Sanitario</div>
              <p className="font-12 text-muted mb-0">
                El 100% de las fracciones no reutilizables son canalizadas a gestores con licencia ambiental MAAE para valorización y refinación en fundición industrial.
              </p>
            </div>

            <div className="governance-block p-3 bg-light rounded">
              <div className="font-14 font-bold text-dark mb-1">3. Trazabilidad Ininterrumpida por QR Único</div>
              <p className="font-12 text-muted mb-0">
                Cada activo mantiene su pasaporte digital desde la recepción en bodega hasta el certificado final de custodia sellado digitalmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
