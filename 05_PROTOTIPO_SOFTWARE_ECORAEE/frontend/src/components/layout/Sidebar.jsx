import React from "react";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = ({ activeView, onViewChange }) => {
  const { currentUser, getInitials } = useAuth();

  const navSections = [
    {
      title: "MONITOREO Y GOBERNANZA",
      items: [
        {
          id: "dashboard",
          label: "Dashboard Ejecutivo",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          )
        }
      ]
    },
    {
      title: "GESTIÓN DE RESIDUOS (RAEE)",
      items: [
        {
          id: "inventory",
          label: "Inventario de Dispositivos",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          )
        },
        {
          id: "batches",
          label: "Lotes y Acopio",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          )
        },
        {
          id: "diagnosis",
          label: "Diagnóstico y Taller",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          )
        }
      ]
    },
    {
      title: "LOGÍSTICA Y DISPOSICIÓN",
      items: [
        {
          id: "logistics",
          label: "Despacho y Rutas (Edmonds-Karp)",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          )
        },
        {
          id: "custody",
          label: "Cadena de Custodia (RN-08)",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
            </svg>
          )
        }
      ]
    },
    {
      title: "ANÁLISIS Y HERRAMIENTAS",
      items: [
        {
          id: "reports",
          label: "Reportes e Impacto Ambiental",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          )
        },
        {
          id: "qr",
          label: "Escáner y Trazabilidad QR",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><line x1="14" y1="14" x2="17" y2="14" /><line x1="17" y1="17" x2="17" y2="21" /><line x1="21" y1="17" x2="17" y2="17" />
            </svg>
          )
        },
        {
          id: "tests",
          label: "Casos de Prueba (RF / RN)",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <circle cx="12" cy="4" r="2" /><path d="M12 7v8m-5 -5l10 0m-7 5l-2 5m6 -5l2 5" />
            </svg>
          )
        }
      ]
    },
    {
      title: "USUARIO Y CUENTA",
      items: [
        {
          id: "profile",
          label: "Mi Perfil / Mis Datos",
          icon: (
            <svg className="nav-svg" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {navSections.map((section, idx) => (
          <div key={idx} className="nav-section">
            <div className="nav-section-title">{section.title}</div>
            {section.items.map(item => (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${activeView === item.id ? "active" : ""}`}
                onClick={() => onViewChange(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div
          className="sidebar-user-info"
          onClick={() => onViewChange("profile")}
          title="Ver y editar mis datos de usuario"
          role="button"
          tabIndex={0}
        >
          <span className="user-avatar">{getInitials()}</span>
          <div>
            <div className="sidebar-username">{currentUser?.username || "carlos.operador"}</div>
            <div className="sidebar-role">{currentUser?.rolTitulo || "Operador de Acopio"}</div>
          </div>
        </div>
        <div className="sidebar-meta">
          <p><strong>Campus Quito (UIDE)</strong></p>
          <p className="text-muted">Gestión de RAEE Institucional</p>
        </div>
      </div>
    </aside>
  );
};
