import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await login(username.trim(), password);
    setLoading(false);

    if (res.success) {
      showToast(`Sesión iniciada como ${res.user.nombres} ${res.user.apellidos} (${res.user.rolTitulo}).`, "success");
      setUsername("");
      setPassword("");
    } else {
      setErrorMsg(res.error || "Credenciales incorrectas. Verifique usuario y contraseña.");
      showToast("Error de autenticación: Verifique sus credenciales institucionales.", "error");
    }
  };

  const handleQuickFill = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg("");
  };

  return (
    <div className="modal-backdrop active" onClick={closeLoginModal}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        <div className="modal-header">
          <h3>Autenticación Institucional EcoRAEE</h3>
          <button type="button" className="modal-close" onClick={closeLoginModal}>x</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="font-14 text-muted mb-3">
              Inicie sesión con su cuenta institucional para aplicar la política de <strong>Mínimo Privilegio (PoLP / RBAC)</strong> conforme a los procesos de trazabilidad de RAEE.
            </p>

            {errorMsg && (
              <div className="alert alert-danger mb-3" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="form-group mb-3">
              <label htmlFor="loginUsername">Usuario Institucional:</label>
              <input
                type="text"
                id="loginUsername"
                className="form-control font-mono"
                placeholder="Ej: carlos.operador, maria.tecnico, admin_sys"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="loginPassword">Contraseña:</label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="quick-roles-panel p-3 bg-light rounded mt-3">
              <span className="font-12 font-bold text-muted d-block mb-2">ACCESO RÁPIDO PARA EVALUACIÓN DOCENTE:</span>
              <div className="btn-group-wrap">
                <button
                  type="button"
                  className="btn btn-outline btn-sm font-12"
                  onClick={() => handleQuickFill("carlos.operador", "password123")}
                >
                  Carlos (Operador)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm font-12"
                  onClick={() => handleQuickFill("maria.tecnico", "password123")}
                >
                  María (Técnico)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm font-12"
                  onClick={() => handleQuickFill("diego.logistica", "password123")}
                >
                  Diego (Logística)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm font-12"
                  onClick={() => handleQuickFill("ana.auditora", "password123")}
                >
                  Ana (Auditora)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm font-12"
                  onClick={() => handleQuickFill("admin_sys", "admin123")}
                >
                  Admin (Sistemas)
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeLoginModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Validando..." : "Ingresar al Sistema"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
