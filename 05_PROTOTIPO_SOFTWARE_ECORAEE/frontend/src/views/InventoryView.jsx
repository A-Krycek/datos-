import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export const InventoryView = ({
  onOpenNewModal,
  onOpenEditModal,
  onOpenDetailModal,
  onOpenDeleteModal,
  onOpenQrModal
}) => {
  const { devices, centers } = useData();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [selectedCenter, setSelectedCenter] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");

  // Filtrado reactivo
  const filteredDevices = devices.filter(d => {
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      d.qr.toLowerCase().includes(term) ||
      d.serial.toLowerCase().includes(term) ||
      d.tipo.toLowerCase().includes(term) ||
      d.marca.toLowerCase().includes(term) ||
      d.modelo.toLowerCase().includes(term);

    const matchCat = selectedCat === "ALL" || d.categoria === selectedCat;
    const matchCenter = selectedCenter === "ALL" || d.centroId === selectedCenter;
    const matchState = selectedState === "ALL" || d.estadoId === selectedState;

    return matchSearch && matchCat && matchCenter && matchState;
  });

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

  const handleExportCsv = () => {
    const headers = ["QR", "Tipo", "Categoria", "Marca", "Modelo", "Serial", "PesoKg", "Centro", "Estado"];
    const rows = filteredDevices.map(d => [
      d.qr,
      `"${d.tipo}"`,
      `"${d.categoria}"`,
      `"${d.marca}"`,
      `"${d.modelo}"`,
      d.serial,
      d.pesoKg,
      `"${d.centroNombre}"`,
      `"${d.estadoNombre}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecoraee_inventario_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCat("ALL");
    setSelectedCenter("ALL");
    setSelectedState("ALL");
  };

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Inventario General y Trazabilidad RAEE</h2>
          <p className="view-desc text-muted">
            Gestión completa de dispositivos electrónicos, pesaje digital (RN-01) y trazabilidad por código QR (RN-06).
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-outline btn-sm me-2" onClick={handleExportCsv}>
            Exportar CSV
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onOpenNewModal}>
            Registrar Dispositivo (CP-02)
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por QR, Serial, Marca, Modelo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="Equipos de Informática y Telecomunicaciones">Informática y Telecomunicaciones</option>
              <option value="Aparatos Electrónicos de Consumo y Audio/Video">Audio, Video y Proyección</option>
              <option value="Equipos de Impresión y Copiado">Impresión y Copiado</option>
              <option value="Servidores y Redes de Alta Capacidad">Servidores y Redes</option>
            </select>
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select"
              value={selectedCenter}
              onChange={e => setSelectedCenter(e.target.value)}
            >
              <option value="ALL">Todos los Centros</option>
              {centers.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select"
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
            >
              <option value="ALL">Todos los Estados</option>
              <option value="EST_RECEP">Recepción en Bodega</option>
              <option value="EST_REPAR">En Reparación</option>
              <option value="EST_REUTIL">Reutilizable (Donación)</option>
              <option value="EST_DESPIECE">Canibalización</option>
              <option value="EST_RECICLAJE">Reciclaje Final</option>
              <option value="EST_CERRADO">Ciclo Cerrado</option>
            </select>
          </div>

          <div className="col-12 col-md-1 text-end">
            <button
              type="button"
              className="btn btn-secondary btn-sm w-100"
              onClick={handleResetFilters}
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Dispositivos */}
      <div className="card p-4">
        <div className="flex-between mb-3">
          <span className="font-14 text-muted">
            Mostrando <strong>{filteredDevices.length}</strong> de {devices.length} dispositivos registrados
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Código QR / Serial</th>
                <th>Dispositivo</th>
                <th>Categoría</th>
                <th>Peso (kg)</th>
                <th>Centro Custodia</th>
                <th>Estado del Ciclo</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No se encontraron dispositivos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredDevices.map(dev => (
                  <tr key={dev.qr}>
                    <td>
                      <div className="font-mono font-bold text-dark">{dev.qr}</div>
                      <div className="font-mono font-11 text-muted">SN: {dev.serial}</div>
                    </td>
                    <td>
                      <div className="font-medium">{dev.tipo}</div>
                      <div className="font-12 text-muted">{dev.marca} {dev.modelo}</div>
                    </td>
                    <td className="font-12">{dev.categoria}</td>
                    <td>
                      <span className="badge badge-gray font-mono">{dev.pesoKg.toFixed(2)} kg</span>
                    </td>
                    <td className="font-12">{dev.centroNombre}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(dev.estadoId)}`}>
                        {dev.estadoNombre}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => onOpenDetailModal(dev)}
                          title="Ver ficha técnica completa y trazabilidad"
                        >
                          Ficha
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => onOpenQrModal(dev)}
                          title="Ver código QR y código de barras"
                        >
                          QR
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => onOpenEditModal(dev)}
                          title="Editar especificaciones del dispositivo"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`btn btn-xs ${isAdmin ? "btn-outline-danger" : "btn-secondary text-muted"}`}
                          onClick={() => onOpenDeleteModal(dev)}
                          title={isAdmin ? "Dar de baja física (CP-04)" : "Baja restringida a ROL_ADMIN (PoLP)"}
                          disabled={!isAdmin}
                        >
                          Baja
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
