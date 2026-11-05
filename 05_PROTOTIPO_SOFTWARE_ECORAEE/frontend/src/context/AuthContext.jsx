import React, { createContext, useContext, useState, useEffect } from "react";
import { StorageService, STORAGE_KEYS, ApiService } from "../services/apiService";
import { INITIAL_USERS } from "../data/seedData";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState(() => {
    StorageService.initSeed();
    return StorageService.get(STORAGE_KEYS.USERS, INITIAL_USERS);
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return StorageService.get(STORAGE_KEYS.SESSION, INITIAL_USERS[1]); // carlos.operador por defecto
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      StorageService.set(STORAGE_KEYS.SESSION, currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.USERS, allUsers);
  }, [allUsers]);

  const login = async (username, password) => {
    const res = await ApiService.login(username, password);
    if (res.success) {
      const user = res.user || allUsers.find(u => u.username === username);
      if (user) {
        setCurrentUser(user);
        setIsLoginModalOpen(false);
        return { success: true, user };
      }
    }
    return { success: false, error: res.error || "Credenciales inválidas" };
  };

  const logout = () => {
    // Restaurar a usuario operador o por defecto
    const defaultUser = allUsers.find(u => u.username === "carlos.operador") || allUsers[0];
    setCurrentUser(defaultUser);
  };

  const updateProfile = (data) => {
    const updated = {
      ...currentUser,
      ...data
    };
    setCurrentUser(updated);

    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    return { success: true };
  };

  const changePassword = (currentPassword, newPassword) => {
    if (currentUser.password !== currentPassword) {
      return { success: false, error: "La contraseña actual no es correcta." };
    }
    if (newPassword.length < 6) {
      return { success: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
    }

    const updated = {
      ...currentUser,
      password: newPassword
    };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    return { success: true };
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Verificaciones de Mínimo Privilegio (PoLP)
  const role = currentUser?.rol || "ROL_OPERADOR";
  const isAdmin = role === "ROL_ADMIN";
  const isTech = role === "ROL_TECNICO";
  const isLogistics = role === "ROL_LOGISTICA";
  const isAuditor = role === "ROL_AUDITOR";
  const isOperator = role === "ROL_OPERADOR";

  const canDiagnose = isTech || isAdmin;
  const canDelete = isAdmin;
  const canDispatch = isLogistics || isAdmin;
  const canCertify = isAuditor || isAdmin;

  const getInitials = () => {
    if (!currentUser) return "US";
    const n = currentUser.nombres ? currentUser.nombres[0] : "";
    const a = currentUser.apellidos ? currentUser.apellidos[0] : "";
    return (n + a).toUpperCase() || "US";
  };

  const getFullName = () => {
    if (!currentUser) return "Usuario";
    return `${currentUser.nombres || ""} ${currentUser.apellidos || ""}`.trim();
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      allUsers,
      role,
      isAdmin,
      isTech,
      isLogistics,
      isAuditor,
      isOperator,
      canDiagnose,
      canDelete,
      canDispatch,
      canCertify,
      getInitials,
      getFullName,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      login,
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
