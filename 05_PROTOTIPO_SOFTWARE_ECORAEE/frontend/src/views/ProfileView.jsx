import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const ProfileView = () => {
  const { currentUser, updateProfile, changePassword, getInitials, getFullName } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    departamento: ""
  });

  const [pwdData, setPwdData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        nombres: currentUser.nombres || "",
        apellidos: currentUser.apellidos || "",
        correo: currentUser.correo || "",
        telefono: currentUser.telefono || "",
        direccion: currentUser.direccion || "",
        departamento: currentUser.departamento || ""
      });
    }
  }, [currentUser]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const res = updateProfile(formData);
    if (res.success) {
      showToast("Datos personales y de contacto actualizados correctamente.", "success");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      showToast("La confirmación de contraseña no coincide con la nueva contraseña.", "error");
      return;
    }

    const res = changePassword(pwdData.currentPassword, pwdData.newPassword);
    if (res.success) {
      showToast("Contraseña actualizada exitosamente.", "success");
      setPwdData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      showToast(res.error || "No se pudo actualizar la contraseña.", "error");
    }
  };

  return (
    <div className="content-view active animate-fade-in">
      <div className="view-header flex-between mb-4">
        <div>
          <h2>Mi Perfil / Datos de Usuario Institucional</h2>
          <p className="view-desc text-muted">
            Consulta y edición de información de contacto personal, credenciales de acceso y matriz de Mínimo Privilegio (PoLP).
          </p>
        </div>
      </div>

      {/* Hero Banner del Perfil */}
      <div className="card p-4 mb-4 profile-hero">
        <div className="d-flex align-items-center gap-4">
          <div className="profile-avatar-lg">
            {getInitials()}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-3 mb-1">
              <h3 className="font-20 font-bold mb-0 text-dark">{getFullName()}</h3>
              <span className="badge badge-purple">{currentUser?.rolTitulo || "Operador de Acopio"}</span>
            </div>
            <p className="font-13 text-muted mb-1">
              Usuario: <code className="font-mono">{currentUser?.username}</code> | Cargo: <strong>{currentUser?.cargo}</strong>
            </p>
            <p className="font-12 text-muted mb-0">
              Departamento: {currentUser?.departamento} — Campus Quito (UIDE)
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulario de Datos Personales */}
        <div className="col-12 col-lg-7">
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Datos Personales y de Contacto</h3>
            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6 form-group">
                  <label htmlFor="profNombres">Nombres:</label>
                  <input
                    type="text"
                    id="profNombres"
                    className="form-control"
                    value={formData.nombres}
                    onChange={e => setFormData({ ...formData, nombres: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 form-group">
                  <label htmlFor="profApellidos">Apellidos:</label>
                  <input
                    type="text"
                    id="profApellidos"
                    className="form-control"
                    value={formData.apellidos}
                    onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 form-group">
                  <label htmlFor="profCorreo">Correo Institucional:</label>
                  <input
                    type="email"
                    id="profCorreo"
                    className="form-control"
                    value={formData.correo}
                    onChange={e => setFormData({ ...formData, correo: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 form-group">
                  <label htmlFor="profTelefono">Teléfono / Celular:</label>
                  <input
                    type="tel"
                    id="profTelefono"
                    className="form-control"
                    value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>

                <div className="col-12 form-group">
                  <label htmlFor="profDepto">Departamento / Facultad:</label>
                  <input
                    type="text"
                    id="profDepto"
                    className="form-control"
                    value={formData.departamento}
                    onChange={e => setFormData({ ...formData, departamento: e.target.value })}
                  />
                </div>

                <div className="col-12 form-group">
                  <label htmlFor="profDireccion">Ubicación / Sede Operativa:</label>
                  <input
                    type="text"
                    id="profDireccion"
                    className="form-control"
                    value={formData.direccion}
                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary">
                  Guardar Datos de Contacto
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Cambio de Contraseña y Seguridad */}
        <div className="col-12 col-lg-5">
          <div className="card p-4 mb-4">
            <h3 className="card-title font-16 mb-3">Seguridad y Credenciales</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="pwdCurrent">Contraseña Actual:</label>
                <input
                  type="password"
                  id="pwdCurrent"
                  className="form-control"
                  placeholder="Ingrese contraseña actual"
                  value={pwdData.currentPassword}
                  onChange={e => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="pwdNew">Nueva Contraseña:</label>
                <input
                  type="password"
                  id="pwdNew"
                  className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  value={pwdData.newPassword}
                  onChange={e => setPwdData({ ...pwdData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="pwdConfirm">Confirmar Nueva Contraseña:</label>
                <input
                  type="password"
                  id="pwdConfirm"
                  className="form-control"
                  placeholder="Repita la nueva contraseña"
                  value={pwdData.confirmPassword}
                  onChange={e => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-outline btn-primary w-100">
                Actualizar Contraseña
              </button>
            </form>
          </div>

          {/* Matriz de Privilegios Activos (PoLP) */}
          <div className="card p-4">
            <h3 className="card-title font-16 mb-3">Mínimo Privilegio Asignado (PoLP)</h3>

            <div className="mb-3">
              <span className="font-12 font-bold text-success d-block mb-1">CAPACIDADES AUTORIZADAS:</span>
              <ul className="list-unstyled font-12 text-muted mb-0">
                {currentUser?.permisos && currentUser.permisos.map((p, idx) => (
                  <li key={idx} className="mb-1 d-flex align-items-start gap-2">
                    <span className="text-success font-bold">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentUser?.restricciones && currentUser.restricciones.length > 0 && (
              <div>
                <span className="font-12 font-bold text-danger d-block mb-1">RESTRICCIONES OPERACIONALES (POLP):</span>
                <ul className="list-unstyled font-12 text-muted mb-0">
                  {currentUser.restricciones.map((r, idx) => (
                    <li key={idx} className="mb-1 d-flex align-items-start gap-2">
                      <span className="text-danger font-bold">-</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
