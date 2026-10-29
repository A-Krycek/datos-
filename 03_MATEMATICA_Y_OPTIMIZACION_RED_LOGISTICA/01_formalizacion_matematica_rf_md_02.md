# FORMALIZACIÓN MATEMÁTICA DEL ECOSISTEMA ECORAEE CLOUD
**Universidad Internacional del Ecuador (UIDE) / Arizona State University (ASU)**  
**Asignatura:** Estructuras Matemáticas Discretas — Quinto Semestre  
**Requisitos Abordados:** RF-MD-02 (Conjuntos, Relaciones y Funciones) y RF-MD-03 (Modelado de Grafos)

---

## 1. Definición Formal de Conjuntos Nucleares (RF-MD-02)

El dominio del sistema de gestión y trazabilidad de residuos electrónicos se modela rigurosamente sobre el universo discursivo $\mathcal{U}$, definiendo los siguientes conjuntos fundamentales:

### 1.1. Conjunto de Actores del Ecosistema ($A$)
Sea $A$ el conjunto finito de todos los actores humanos o institucionales registrados en la plataforma:
$$A = A_{gen} \cup A_{int} \cup A_{ext}$$
Donde:
* $A_{gen} = \{a \in A \mid \text{rol}(a) \in \{\text{GENERADOR\_INSTITUCIONAL}, \text{GENERADOR\_COMUNITARIO}\}\}$
* $A_{int} = \{a \in A \mid \text{rol}(a) \in \{\text{ADMIN}, \text{OPERADOR}, \text{TECNICO}, \text{LOGISTICA}, \text{AUDITOR}\}\}$
* $A_{ext} = \{a \in A \mid \text{rol}(a) \in \{\text{GESTOR\_RECICLAJE}, \text{BENEFICIARIO\_SOCIAL}\}\}$
* Con la condición de partición disjunta: $A_{gen} \cap A_{int} = \emptyset$, $A_{int} \cap A_{ext} = \emptyset$.

### 1.2. Conjunto de Dispositivos Electrónicos ($D$)
Sea $D = \{d_1, d_2, \dots, d_n\}$ el conjunto finito de todos los dispositivos RAEE captados en el sistema. Cada dispositivo $d \in D$ se caracteriza por una tupla:
$$d = \langle \text{id}_d, \text{qr}_d, \text{modelo}_d, \text{peso}_d \rangle, \quad \text{donde } \text{peso}_d \in \mathbb{R}^+$$

### 1.3. Conjunto de Categorías de Hardware ($H$)
$$H = \{\text{COMPUTADORA}, \text{MONITOR}, \text{TABLET}, \text{TELEFONO}, \text{ROUTER}, \text{OTROS}\}$$

### 1.4. Conjunto de Centros Físicos y Puntos de Red ($C$)
$$C = \{c_1, c_2, \dots, c_m\}$$
Instanciado en el caso académico UIDA como:
$$C = \{\text{MATRIZ}, \text{GRANADOS}, \text{TALLER\_LAB300}, \text{RECICLAMETAL\_SUR}, \text{FUNDACION\_CALDERON}\}$$

### 1.5. Conjunto de Clasificaciones Técnicas ($K$)
$$K = \{\text{REUTILIZABLE}, \text{REPARABLE}, \text{RECICLABLE}, \text{NO\_RECUPERABLE}\}$$
Particionado en función de viabilidad de entrega comunitaria:
* $K_{social} = \{\text{REUTILIZABLE}, \text{REPARABLE}\}$ (Permite donación)
* $K_{industrial} = \{\text{RECICLABLE}, \text{NO\_RECUPERABLE}\}$ (Prohibida la donación - Chatarra / Peligroso)
* Propiedad: $K = K_{social} \cup K_{industrial} \quad \land \quad K_{social} \cap K_{industrial} = \emptyset$

### 1.6. Conjunto de Estados del Ciclo de Vida ($S$)
$$S = \{s_0, s_1, s_2, s_3, s_4, s_5, s_6\}$$
Con:
* $s_0 = \text{REGISTRADO}$
* $s_1 = \text{RECOLECTADO}$
* $s_2 = \text{EVALUADO}$
* $s_3 = \text{EN\_REACONDICIONAMIENTO}$
* $s_4 = \text{LISTO\_DONACION}$
* $s_5 = \text{TRANSFERIDO\_RECICLAJE}$
* $s_6 = \text{TRAZABILIDAD\_CERRADA}$ (Estado terminal)

---

## 2. Relaciones Binarias y Propiedades Algebraicas

### 2.1. Relación de Equivalencia: Partición por Categoría de Hardware
Definimos la relación binaria $\sim_{cat} \subseteq D \times D$:
$$d_i \sim_{cat} d_j \iff \text{categoria}(d_i) = \text{categoria}(d_j)$$

**Demostración de Propiedades de Equivalencia:**
1. **Reflexiva:** $\forall d \in D, \; \text{categoria}(d) = \text{categoria}(d) \implies d \sim_{cat} d$.
2. **Simétrica:** $d_i \sim_{cat} d_j \implies \text{categoria}(d_i) = \text{categoria}(d_j) \implies \text{categoria}(d_j) = \text{categoria}(d_i) \implies d_j \sim_{cat} d_i$.
3. **Transitiva:** Si $d_i \sim_{cat} d_j$ y $d_j \sim_{cat} d_k$, entonces $\text{categoria}(d_i) = \text{categoria}(d_j) = \text{categoria}(d_k) \implies d_i \sim_{cat} d_k$.

$\therefore$ La relación $\sim_{cat}$ induce un conjunto cociente o partición estricta sobre $D$:
$$D / \sim_{cat} = \{D_{COMPUTADORA}, D_{MONITOR}, D_{TABLET}, D_{TELEFONO}, D_{ROUTER}, D_{OTROS}\}$$
Cumpliendo:
$$\bigcup_{h \in H} D_h = D \quad \land \quad \forall h_i \neq h_j: D_{h_i} \cap D_{h_j} = \emptyset$$

### 2.2. Relación de Orden Parcial: Flujo Temporal de Estados $(S, \preceq)$
El ciclo de vida de un residuo electrónico está gobernado por una relación de orden parcial débil $\preceq$ sobre el conjunto de estados $S$:
$$s_i \preceq s_j \iff \text{el estado } s_i \text{ es predecesor o idéntico a } s_j \text{ en la línea temporal de trazabilidad}$$

**Diagrama de Hasse del Ciclo de Vida:**
```
            s6 (TRAZABILIDAD_CERRADA)
                 /            \
                /              \
     s4 (LISTO_DONACION)   s5 (TRANSFERIDO_RECICLAJE)
             |                 |
     s3 (EN_REACOND)           |
             \                 /
              \               /
               s2 (EVALUADO)
                     |
              s1 (RECOLECTADO)
                     |
              s0 (REGISTRADO)
```

**Propiedades Formales:**
1. **Reflexiva:** $\forall s \in S, \; s \preceq s$.
2. **Antisimétrica:** Si $s_i \preceq s_j \land s_j \preceq s_i \implies s_i = s_j$ (no se permiten bucles de regresión de ciclo terminal).
3. **Transitiva:** Si $s_i \preceq s_j \land s_j \preceq s_k \implies s_i \preceq s_k$.
$\therefore (S, \preceq)$ constituye un Conjunto Parcialmente Ordenado (POSET).

---

## 3. Funciones Matemáticas del Dominio

### 3.1. Función de Evaluación Técnica ($f_{eval}$)
Función sobreyectiva parcial que mapea dispositivos evaluados a su dictamen técnico:
$$f_{eval}: D_{eval} \to K, \quad D_{eval} \subseteq D$$
$$\forall d \in D_{eval}, \; \exists ! k \in K \text{ tal que } f_{eval}(d) = k$$

* **Restricción de Negocio Formal (RN-04 en notación funcional):**
Sea $g_{dest}: D_{cerrado} \to T$ la función que asigna el destino final:
$$\forall d \in D_{cerrado}, \quad g_{dest}(d) \in T_{social} \implies f_{eval}(d) \in K_{social}$$
Por contraposición lógica:
$$f_{eval}(d) \in K_{industrial} \implies g_{dest}(d) \notin T_{social}$$

### 3.2. Función de Localización Instantánea en Inventario ($f_{inv}$)
Función unívoca que garantiza el principio de exclusión física atómica: un dispositivo físico no puede existir en dos lugares a la vez (`RN-06`):
$$f_{inv}: D_{activo} \to C$$
$$\forall d \in D_{activo}, \quad \text{si } f_{inv}(d) = c_1 \land f_{inv}(d) = c_2 \implies c_1 = c_2$$

---

## 4. Modelado del Grafo de Flujo y Transporte Logístico (RF-MD-03)

La red logística para el transporte y disposición de RAEE se define formalmente como una red de flujo dirigida:
$$\mathcal{N} = (V, E, c, s^*, t^*)$$

Donde:
* **$V$ (Vértices o Nodos):** Representan las instalaciones físicas del ecosistema más la Superfuente $s^*$ y el Supersumidero $t^*$:
  $$V = \{s^*, t^*\} \cup C$$
  $$V = \{s^*, \text{MATRIZ}, \text{GRANADOS}, \text{TALLER}, \text{RECICLADOR}, \text{BENEFICIARIO}, t^*\}$$
* **$E$ (Aristas Dirigidas):** Conjunto de rutas de transporte transitables $E \subseteq V \times V$, con $(u,v) \in E \implies u \neq v$ (grafo simple sin lazos).
* **$c: E \to \mathbb{R}^+$ (Función de Capacidad):** Asigna a cada arista $(u,v)$ su capacidad máxima de carga en kilogramos por semana:
  $$c(u,v) \ge 0, \quad \forall (u,v) \in E$$
* **$s^*$ (Superfuente):** Nodo origen virtual donde se origina la masa total de residuos.
* **$t^*$ (Supersumidero):** Nodo destino virtual donde se consolidan todos los tratamientos finales.

### 4.1. Definición Formal de Flujo Válido
Una función de flujo $f: V \times V \to \mathbb{R}$ es válida en la red $\mathcal{N}$ si y solo si satisface las tres condiciones fundamentales:
1. **Restricción de Capacidad:**
   $$0 \le f(u,v) \le c(u,v), \quad \forall (u,v) \in E$$
2. **Conservación de Flujo:**
   $$\sum_{v \in V} f(u,v) = \sum_{v \in V} f(v,u), \quad \forall u \in V \setminus \{s^*, t^*\}$$
   *(El flujo total que ingresa a cualquier nodo intermedio es exactamente igual al flujo que sale de él).*
3. **No Negatividad y Antisimimetría:**
   $$f(u,v) = -f(v,u)$$

### 4.2. Teorema de Flujo Máximo y Corte Mínimo (Max-Flow Min-Cut)
El valor del flujo total que sale de la fuente es:
$$|f| = \sum_{v \in V} f(s^*, v)$$
Un corte $(S, T)$ es una partición de $V$ tal que $s^* \in S$ y $t^* \in T$ con $S \cup T = V$ y $S \cap T = \emptyset$.
La capacidad del corte es:
$$C(S,T) = \sum_{u \in S} \sum_{v \in T} c(u,v)$$
Por el **Teorema de Ford-Fulkerson**:
$$\max |f| = \min C(S,T)$$
Las aristas $(u,v)$ con $u \in S$, $v \in T$ tales que $f(u,v) = c(u,v)$ representan las **aristas saturadas** y constituyen los **cuellos de botella estructurales** de la logística del campus.
