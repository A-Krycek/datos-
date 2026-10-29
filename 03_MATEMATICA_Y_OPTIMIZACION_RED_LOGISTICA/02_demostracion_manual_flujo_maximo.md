# DEMOSTRACIÓN MATEMÁTICA MANUAL Y VALIDACIÓN EXPERIMENTAL
**Asignatura:** Estructuras Matemáticas Discretas (5to Semestre)  
**Requisitos:** RF-MD-04 y RF-MD-05  
**Casos de Prueba Asociados:** CP-07 (Cálculo Manual vs. Algoritmo) y CP-08 (Corte Mínimo y Cuello de Botella)

---

## 1. Topología de la Red de Flujo Logístico

Definimos la red $\mathcal{N} = (V, E, c, s^*, t^*)$ con vértices:
* $V = \{s^*, \text{MATRIZ}, \text{GRANADOS}, \text{TALLER}, \text{RECICLADOR}, \text{BENEFICIARIO}, t^*\}$

Matriz de capacidades originales $c(u,v)$ en kilogramos por semana:
* $c(s^*, \text{MATRIZ}) = 5000\text{ kg}$
* $c(s^*, \text{GRANADOS}) = 1500\text{ kg}$
* $c(\text{MATRIZ}, \text{TALLER}) = 1200\text{ kg}$
* $c(\text{GRANADOS}, \text{TALLER}) = 800\text{ kg}$
* $c(\text{MATRIZ}, \text{RECICLADOR}) = 1500\text{ kg}$
* $c(\text{TALLER}, \text{RECICLADOR}) = 1000\text{ kg}$
* $c(\text{TALLER}, \text{BENEFICIARIO}) = 600\text{ kg}$
* $c(\text{RECICLADOR}, t^*) = 10000\text{ kg}$
* $c(\text{BENEFICIARIO}, t^*) = 1000\text{ kg}$

---

## 2. Demostración Manual Paso a Paso (Algoritmo Edmonds-Karp / BFS)

Edmonds-Karp selecciona en cada iteración el camino aumentante con el menor número de aristas (mediante BFS).

### Iteración 1:
* **Camino BFS encontrado:** $p_1 = s^* \longrightarrow \text{MATRIZ} \longrightarrow \text{RECICLADOR} \longrightarrow t^*$
* **Longitud de aristas:** 3
* **Capacidades disponibles:**
  $$\Delta_1 = \min \{c(s^*, \text{MATRIZ}), c(\text{MATRIZ}, \text{RECICLADOR}), c(\text{RECICLADOR}, t^*)\}$$
  $$\Delta_1 = \min \{5000, 1500, 10000\} = \mathbf{1500\text{ kg}}$$
* **Actualización residual:**
  * $f(\text{MATRIZ}, \text{RECICLADOR}) = 1500 \implies c_f(\text{MATRIZ}, \text{RECICLADOR}) = 0$ **(Arista Saturada)**
* **Flujo acumulado:** $|f| = 1500\text{ kg}$

---

### Iteración 2:
* **Camino BFS encontrado:** $p_2 = s^* \longrightarrow \text{MATRIZ} \longrightarrow \text{TALLER} \longrightarrow \text{RECICLADOR} \longrightarrow t^*$
* **Longitud de aristas:** 4
* **Capacidades disponibles:**
  $$\Delta_2 = \min \{c_f(s^*, \text{MATRIZ}), c_f(\text{MATRIZ}, \text{TALLER}), c_f(\text{TALLER}, \text{RECICLADOR}), c_f(\text{RECICLADOR}, t^*)\}$$
  $$\Delta_2 = \min \{3500, 1200, 1000, 8500\} = \mathbf{1000\text{ kg}}$$
* **Actualización residual:**
  * $f(\text{TALLER}, \text{RECICLADOR}) = 1000 \implies c_f(\text{TALLER}, \text{RECICLADOR}) = 0$ **(Arista Saturada)**
* **Flujo acumulado:** $|f| = 1500 + 1000 = 2500\text{ kg}$

---

### Iteración 3:
* **Camino BFS encontrado:** $p_3 = s^* \longrightarrow \text{MATRIZ} \longrightarrow \text{TALLER} \longrightarrow \text{BENEFICIARIO} \longrightarrow t^*$
* **Longitud de aristas:** 4
* **Capacidades disponibles:**
  $$\Delta_3 = \min \{c_f(s^*, \text{MATRIZ}), c_f(\text{MATRIZ}, \text{TALLER}), c_f(\text{TALLER}, \text{BENEFICIARIO}), c_f(\text{BENEFICIARIO}, t^*)\}$$
  $$\Delta_3 = \min \{2500, 200, 600, 1000\} = \mathbf{200\text{ kg}}$$
* **Actualización residual:**
  * $f(\text{MATRIZ}, \text{TALLER}) = 1200 \implies c_f(\text{MATRIZ}, \text{TALLER}) = 0$ **(Arista Saturada)**
* **Flujo acumulado:** $|f| = 2500 + 200 = 2700\text{ kg}$

---

### Iteración 4:
* **Camino BFS encontrado:** $p_4 = s^* \longrightarrow \text{GRANADOS} \longrightarrow \text{TALLER} \longrightarrow \text{BENEFICIARIO} \longrightarrow t^*$
* **Longitud de aristas:** 4
* **Capacidades disponibles:**
  $$\Delta_4 = \min \{c_f(s^*, \text{GRANADOS}), c_f(\text{GRANADOS}, \text{TALLER}), c_f(\text{TALLER}, \text{BENEFICIARIO}), c_f(\text{BENEFICIARIO}, t^*)\}$$
  $$\Delta_4 = \min \{1500, 800, 400, 800\} = \mathbf{400\text{ kg}}$$
* **Actualización residual:**
  * $f(\text{TALLER}, \text{BENEFICIARIO}) = 600 \implies c_f(\text{TALLER}, \text{BENEFICIARIO}) = 0$ **(Arista Saturada)**
* **Flujo acumulado:** $|f| = 2700 + 400 = \mathbf{3100\text{ kg}}$

---

### Iteración 5:
* Intento de búsqueda en anchura desde $s^*$:
  * Nodos alcanzables en grafo residual $G_f$:
    * $s^*$ alcanza a $\text{GRANADOS}$ ($c_f = 1100$).
    * $\text{GRANADOS}$ alcanza a $\text{TALLER}$ ($c_f = 400$).
    * Desde $\text{TALLER}$, todas las aristas hacia adelante están saturadas:
      * $c_f(\text{TALLER}, \text{RECICLADOR}) = 0$
      * $c_f(\text{TALLER}, \text{BENEFICIARIO}) = 0$
    * No existe ningún camino con capacidad residual estrictamente positiva hacia $t^*$.
* **CONDICIÓN DE PARADA:** El algoritmo termina exitosamente.

$$\mathbf{Flujo \; M\acute{a}ximo \; Obtenido: \; 3100.00 \; kg/semana}$$

---

## 3. Demostración del Teorema de Corte Mínimo (Min-Cut)

El conjunto de vértices alcanzables desde $s^*$ en el grafo residual final define la partición $S$:
$$S = \{s^*, \text{MATRIZ}, \text{GRANADOS}, \text{TALLER}\}$$
El conjunto de vértices no alcanzables define la partición $T$:
$$T = \{\text{RECICLADOR}, \text{BENEFICIARIO}, t^*\}$$

Las aristas dirigidas que cruzan la frontera de $S$ a $T$ son:
1. $(\text{MATRIZ}, \text{RECICLADOR})$ con capacidad $c = 1500\text{ kg}$
2. $(\text{TALLER}, \text{RECICLADOR})$ con capacidad $c = 1000\text{ kg}$
3. $(\text{TALLER}, \text{BENEFICIARIO})$ con capacidad $c = 600\text{ kg}$

**Capacidad del Corte Mínimo:**
$$C(S,T) = 1500 + 1000 + 600 = \mathbf{3100.00\text{ kg/semana}}$$

Por el **Teorema de Flujo Máximo / Corte Mínimo de Ford-Fulkerson**:
$$\max |f| = C(S,T) = 3100.00\text{ kg/semana} \quad \blacksquare$$

> [!NOTE]
> **Evidencia de Aceptación CP-07:**  
> El cálculo manual coincide de forma exacta con la salida del script en Python `math/edmonds_karp.py`, demostrando rigor matemático y consistencia con las entidades de la base de datos `NODO_RED` y `ARISTA_RED`.

---

## 4. Comparación de Escenarios (RF-MD-05 / CP-08)

| Métrica Logística | Escenario 1: Base Normal | Escenario 2: Contingencia Vial | Delta / Impacto Operativo |
| :--- | :---: | :---: | :---: |
| **Capacidad Arista Matriz $\to$ Reciclador** | $1500.00\text{ kg}$ | $400.00\text{ kg}$ | $-1100.00\text{ kg}$ $(-73.3\%)$ |
| **Flujo Máximo Transportable** | $\mathbf{3100.00\text{ kg/sem}}$ | $\mathbf{2000.00\text{ kg/sem}}$ | $\mathbf{-1100.00\text{ kg/sem}}$ $(\mathbf{-35.5\%})$ |
| **Cuello de Botella Identificado** | Taller Técnico y Vía Sur | Vía Sur Saturada | La capacidad del taller Lab-300 queda subutilizada |
| **Aristas del Corte Mínimo** | (Matriz $\to$ Reciclador), (Taller $\to$ Reciclador), (Taller $\to$ Beneficiario) | (Matriz $\to$ Reciclador [400kg]), (Taller $\to$ Reciclador), (Taller $\to$ Beneficiario) | Se reduce el margen de evacuación de chatarra del campus |
