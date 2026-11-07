import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [contrastHigh, setContrastHigh] = useState(() => {
    return localStorage.getItem("ecoraee_high_contrast") === "true";
  });

  const [largeFont, setLargeFont] = useState(() => {
    return localStorage.getItem("ecoraee_large_font") === "true";
  });

  useEffect(() => {
    if (contrastHigh) {
      document.body.classList.add("contrast-high");
    } else {
      document.body.classList.remove("contrast-high");
    }
    localStorage.setItem("ecoraee_high_contrast", contrastHigh);
  }, [contrastHigh]);

  useEffect(() => {
    if (largeFont) {
      document.body.classList.add("font-large");
    } else {
      document.body.classList.remove("font-large");
    }
    localStorage.setItem("ecoraee_large_font", largeFont);
  }, [largeFont]);

  const toggleContrast = () => setContrastHigh(prev => !prev);
  const toggleLargeFont = () => setLargeFont(prev => !prev);
  const resetAccessibility = () => {
    setContrastHigh(false);
    setLargeFont(false);
  };

  return (
    <ThemeContext.Provider value={{
      contrastHigh,
      largeFont,
      toggleContrast,
      toggleLargeFont,
      resetAccessibility
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe ser utilizado dentro de un ThemeProvider");
  }
  return context;
};
