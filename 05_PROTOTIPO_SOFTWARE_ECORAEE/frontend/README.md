# EcoRAEE Cloud — Frontend Single Page Application (SPA)
**Universidad Internacional del Ecuador (UIDE) / Arizona State University (ASU)**  
**Proyecto Integrador — Quinto Semestre**

Aplicación web cliente Single Page Application (SPA) ligera, accesible y reactiva, diseñada para operar alojada directamente sobre **Amazon S3 Static Website Hosting** con costo cero ($0.00 USD/mes).

---

## 1. Características Técnicas y Arquitectura
* **Zero-Build Architecture:** Construida en HTML5 semántico, CSS3 moderno (con variables y sistema de diseño responsivo) y JavaScript Vanilla (ES6+ modular).
* **Despliegue Cloud en Amazon S3 (`RF-CL-01`):** Al no requerir servidor Node.js ni compilación previa, los archivos estáticos (`index.html`, `styles.css`, `app.js`) se cargan directamente en un bucket S3 configurado como Static Website, eliminando costos de instancias de cómputo frontend.
* **Trazabilidad Visual (`CP-14` / `RN-01`):** Renderizado de una línea de vida vertical (Timeline) con secuencias de estados, responsables y evidencias fotográficas asociadas.
* **Simulador Gráfico de Flujo Logístico (`CP-08` / `CP-09`):** Renderizado dinámico en SVG interactivo del grafo logístico, destacando visualmente en rojo las aristas saturadas (cuellos de botella del Corte Mínimo de Edmonds-Karp).
* **Inclusión y Accesibilidad (`RNF-07` / `CP-15`):** Soporta modo de alto contraste para operadores de bodega y escalado dinámico de tipografía.

---

## 2. Instrucciones de Ejecución

### Opción A: Ejecución Local Inmediata (Sin Servidor)
Simplemente haz doble clic sobre el archivo [`frontend/index.html`](file:///c:/Users/airy/Downloads/Carpeta%20con%20todos%20los%20avances%20y%20contexto%20actual%20de%20proyecto/frontend/index.html) o ábrelo en Google Chrome, Edge o Firefox. La SPA detecta automáticamente si el backend FastAPI está activo; si no lo está, opera en modo demostración autónoma con los datos sintéticos del campus UIDA.

### Opción B: Servido a través de FastAPI
Si el backend está en ejecución, se puede configurar para servir la carpeta `frontend/` mediante `StaticFiles`.

### Opción C: Despliegue en Amazon S3 (`RF-CL-01`)
1. Crear un bucket en S3 (por ejemplo, `ecoraee-frontend-storage`).
2. Habilitar la opción **Static website hosting** en las propiedades del bucket, indicando `index.html` como documento de índice.
3. Subir los archivos `index.html`, `styles.css` y `app.js` al bucket.
4. La aplicación estará accesible globalmente en la URL del endpoint web de S3:  
   `http://ecoraee-frontend-storage.s3-website-us-east-1.amazonaws.com`

---

## 3. Matriz de Casos de Prueba Verificados en el Frontend

| Caso de Prueba Oficial | Componente en la SPA | Criterio de Verificación Demostrado |
| :---: | :--- | :--- |
| **CP-01** | Selector de Rol Superior | Simula el cambio dinámico entre Operador, Técnico, Logística y Admin; valida que Operadores no puedan dictaminar evaluaciones. |
| **CP-02** | Formulario de Registro QR | Autogenera y valida códigos QR únicos; bloquea registros duplicados emitiendo alerta visual. |
| **CP-03** | Transición de Estado | Permite avanzar el ciclo de vida inmutable de un dispositivo validando permisos de rol. |
| **CP-08** | Cuellos de Botella SVG | Ilumina en rojo las aristas saturadas del corte mínimo al alternar entre Escenario Normal y Contingencia. |
| **CP-09** | Integración Matemática | Conecta con el endpoint `/network/optimize-flow` o ejecuta el modelo de grafos localmente. |
| **CP-14** | Módulo de Trazabilidad | Muestra la línea de tiempo ininterrumpida completa desde `REGISTRADO` hasta `TRAZABILIDAD_CERRADA`. |
| **CP-15** | Panel de Accesibilidad | Demuestra botones de alto contraste y tamaño de fuente ampliado para personal operativo de bodega. |
