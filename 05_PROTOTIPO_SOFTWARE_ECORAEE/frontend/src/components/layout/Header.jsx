import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";

export const Header = ({ onNavigateToProfile }) => {
  const { currentUser, getInitials, getFullName, openLoginModal } = useAuth();
  const { backendOnline } = useData();
  const { contrastHigh, toggleContrast, largeFont, toggleLargeFont } = useTheme();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="logo-icon">
            <svg className="svg-icon-lg" viewBox="0 0 24 24">
              <path d="M4 12v-3a3 3 0 0 1 3-3h13m-3 -3l3 3l-3 3" />
              <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
            </svg>
          </div>
          <div>
            <h1>EcoRAEE Cloud</h1>
            <span className="subtitle">UIDE / Arizona State University — Trazabilidad Integral de RAEE</span>
          </div>
        </div>

        {/* Control de Sesión, Mínimo Privilegio (RBAC) y Accesibilidad */}
        <div className="user-session-bar">
          {/* Botones de accesibilidad WCAG 2.1 AAA */}
          <button
            type="button"
            className={`btn btn-outline btn-sm ${contrastHigh ? "btn-contrast-active" : ""}`}
            onClick={toggleContrast}
            title="Alternar modo de alto contraste (WCAG AAA)"
          >
            Alto Contraste
          </button>
          <button
            type="button"
            className={`btn btn-outline btn-sm ${largeFont ? "btn-font-active" : ""}`}
            onClick={toggleLargeFont}
            title="Aumentar tamaño tipográfico para legibilidad"
          >
            A+ Fuente
          </button>

          {/* Tarjeta de Sesión Activa */}
          <div
            className="session-profile-card"
            onClick={onNavigateToProfile}
            title="Ver mi perfil y editar mis datos personales"
            role="button"
            tabIndex={0}
          >
            <span className="user-avatar">{getInitials()}</span>
            <div className="session-user-details">
              <span className="session-user-name">{getFullName()}</span>
              <span className="session-user-role">{currentUser?.rolTitulo || "Operador de Acopio"}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={openLoginModal}
            title="Cambiar de usuario institucional con credenciales"
          >
            Cambiar Sesión
          </button>

          {/* Indicador de Estado del Sistema */}
          <div className={`system-status-badge ${backendOnline ? "online" : "local"}`}>
            <span className="status-dot"></span>
            <span>{backendOnline ? "Servidor Conectado" : "Sistema Activo (Modo Local)"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
