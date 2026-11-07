"""
===============================================================================
PROYECTO INTEGRADOR: ECORAEE CLOUD
ASIGNATURA: ESTRUCTURAS MATEMÁTICAS DISCRETAS (5TO SEMESTRE)
ARCHIVO: edmonds_karp.py
REQUISITOS: RF-MD-04 (Algoritmo de Flujo Máximo y Corte Mínimo)
            RF-MD-05 (Comparación de Escenarios de Capacidad)
CASOS DE PRUEBA ASOCIADOS: CP-07 (Validación Manual) y CP-08 (Cuellos de Botella)
===============================================================================
"""

from collections import deque
from typing import Dict, List, Tuple, Set

class EdmondsKarpFlowNetwork:
    """
    Representación matemática de una red de flujo dirigida N = (V, E, c, s, t)
    utilizando el algoritmo de Edmonds-Karp (búsqueda en anchura / BFS).
    """

    def __init__(self):
        self.nodes: Set[str] = set()
        # Matriz/Grafo de capacidades originales: c(u,v)
        self.capacity: Dict[str, Dict[str, float]] = {}
        # Matriz de flujo asignado: f(u,v)
        self.flow: Dict[str, Dict[str, float]] = {}
        # Lista de adyacencia (incluye aristas directas e inversas para grafo residual)
        self.adj: Dict[str, List[str]] = {}

    def add_edge(self, u: str, v: str, cap: float):
        """Agrega una arista dirigida (u, v) con capacidad cap."""
        self.nodes.add(u)
        self.nodes.add(v)

        if u not in self.adj:
            self.adj[u] = []
            self.capacity[u] = {}
            self.flow[u] = {}
        if v not in self.adj:
            self.adj[v] = []
            self.capacity[v] = {}
            self.flow[v] = {}

        if v not in self.adj[u]:
            self.adj[u].append(v)
            self.capacity[u][v] = cap
            self.flow[u][v] = 0.0

        # Arista residual inversa con capacidad inicial 0
        if u not in self.adj[v]:
            self.adj[v].append(u)
            self.capacity[v][u] = 0.0
            self.flow[v][u] = 0.0

    def _bfs_augmenting_path(self, source: str, sink: str, parent: Dict[str, str]) -> float:
        """
        Encuentra el camino de aumento más corto en número de aristas (BFS).
        Retorna la capacidad residual mínima (cuello de botella del camino).
        """
        visited = {node: False for node in self.nodes}
        queue = deque([source])
        visited[source] = True

        while queue:
            curr = queue.popleft()
            if curr == sink:
                break

            for neighbor in self.adj.get(curr, []):
                residual_cap = self.capacity[curr][neighbor] - self.flow[curr][neighbor]
                if not visited[neighbor] and residual_cap > 1e-9:
                    visited[neighbor] = True
                    parent[neighbor] = curr
                    queue.append(neighbor)

        if not visited[sink]:
            return 0.0

        # Calcular cuello de botella del camino encontrado
        bottleneck = float('inf')
        curr = sink
        while curr != source:
            prev = parent[curr]
            residual_cap = self.capacity[prev][curr] - self.flow[prev][curr]
            bottleneck = min(bottleneck, residual_cap)
            curr = prev

        return bottleneck

    def compute_max_flow(self, source: str, sink: str) -> Tuple[float, List[Dict]]:
        """
        Ejecuta el algoritmo de Edmonds-Karp hasta que no existan más caminos aumentantes.
        Retorna: (flujo_maximo, historial_pasos)
        """
        # Reiniciar flujos
        for u in self.nodes:
            for v in self.adj.get(u, []):
                self.flow[u][v] = 0.0

        max_flow = 0.0
        parent = {}
        steps = []
        step_num = 1

        while True:
            parent.clear()
            pushed_flow = self._bfs_augmenting_path(source, sink, parent)
            if pushed_flow <= 1e-9:
                break

            # Reconstruir camino
            path = []
            curr = sink
            while curr != source:
                path.append(curr)
                curr = parent[curr]
            path.append(source)
            path.reverse()

            # Actualizar flujos a lo largo del camino
            curr = sink
            while curr != source:
                prev = parent[curr]
                self.flow[prev][curr] += pushed_flow
                self.flow[curr][prev] -= pushed_flow
                curr = prev

            max_flow += pushed_flow
            steps.append({
                "paso": step_num,
                "camino": " -> ".join(path),
                "flujo_aumentado_kg": pushed_flow,
                "flujo_acumulado_kg": max_flow
            })
            step_num += 1

        return max_flow, steps

    def compute_min_cut(self, source: str) -> Tuple[Set[str], Set[str], List[Tuple[str, str, float]]]:
        """
        Calcula el corte mínimo (S, T) encontrando los nodos alcanzables desde la fuente
        en el grafo residual. Identifica las aristas saturadas que forman el corte.
        """
        visited = set()
        queue = deque([source])
        visited.add(source)

        while queue:
            curr = queue.popleft()
            for neighbor in self.adj.get(curr, []):
                residual_cap = self.capacity[curr][neighbor] - self.flow[curr][neighbor]
                if neighbor not in visited and residual_cap > 1e-9:
                    visited.add(neighbor)
                    queue.append(neighbor)

        set_s = visited
        set_t = self.nodes - visited

        # Aristas que cruzan de S a T y están saturadas: f(u, v) == c(u, v)
        cut_edges = []
        for u in set_s:
            for v in self.adj.get(u, []):
                if v in set_t and self.capacity[u][v] > 0:
                    if abs(self.flow[u][v] - self.capacity[u][v]) < 1e-9:
                        cut_edges.append((u, v, self.capacity[u][v]))

        return set_s, set_t, cut_edges


# =============================================================================
# DEFINICIÓN DE LOS ESCENARIOS DEL PROYECTO INTEGRADOR UIDA
# =============================================================================

def build_network_base() -> EdmondsKarpFlowNetwork:
    """
    Escenario 1: Red Base Operativa Normal (Valores de BD en ARISTA_RED).
    Nodos:
      S* (Superfuente)
      1: N_CAMPUS_MATRIZ
      2: N_CAMPUS_GRANADOS
      3: N_TALLER_LAB300
      4: N_GESTOR_RECICLAJE
      5: N_FUNDACION_SOCIAL
      T* (Supersumidero)
    """
    net = EdmondsKarpFlowNetwork()
    
    # Conexiones virtuales Superfuente hacia campus generadores
    net.add_edge("SUPER_FUENTE", "CAMPUS_MATRIZ", 5000.0)
    net.add_edge("SUPER_FUENTE", "CAMPUS_GRANADOS", 1500.0)

    # Rutas logísticas reales
    net.add_edge("CAMPUS_MATRIZ", "TALLER_LAB300", 1200.0)
    net.add_edge("CAMPUS_GRANADOS", "TALLER_LAB300", 800.0)
    net.add_edge("CAMPUS_MATRIZ", "GESTOR_RECICLAJE", 1500.0)
    net.add_edge("TALLER_LAB300", "GESTOR_RECICLAJE", 1000.0)
    net.add_edge("TALLER_LAB300", "FUNDACION_SOCIAL", 600.0)

    # Conexiones virtuales hacia Supersumidero
    net.add_edge("GESTOR_RECICLAJE", "SUPER_SUMIDERO", 10000.0)
    net.add_edge("FUNDACION_SOCIAL", "SUPER_SUMIDERO", 1000.0)

    return net


def build_network_contingency() -> EdmondsKarpFlowNetwork:
    """
    Escenario 2: Contingencia Vial hacia el Sur (Mantenimiento de Av. Simón Bolívar).
    La ruta directa CAMPUS_MATRIZ -> GESTOR_RECICLAJE se reduce drásticamente de 1500 kg a 400 kg.
    """
    net = build_network_base()
    # Modificar capacidad de la arista afectada
    net.capacity["CAMPUS_MATRIZ"]["GESTOR_RECICLAJE"] = 400.0
    return net


def run_experiment():
    print("=" * 80)
    print("ECORAEE CLOUD — EXPERIMENTACIÓN Y VALIDACIÓN MATEMÁTICA (EDMONDS-KARP)")
    print("=" * 80)

    # --- ESCENARIO 1: CONDICIONES NORMALES (CP-07) ---
    print("\n>>> ESCENARIO 1: OPERACIÓN NORMAL BASE")
    net1 = build_network_base()
    max_flow_1, steps_1 = net1.compute_max_flow("SUPER_FUENTE", "SUPER_SUMIDERO")
    s1, t1, cut_edges_1 = net1.compute_min_cut("SUPER_FUENTE")

    print(f"\nFlujo Máximo Alcanzado: {max_flow_1:.2f} kg/semana")
    print("\nPasos de Aumento de Flujo (Cálculo Paso a Paso):")
    for s in steps_1:
        print(f"  Paso {s['paso']}: {s['camino']} | Cuello botella: +{s['flujo_aumentado_kg']:.2f} kg | Acumulado: {s['flujo_acumulado_kg']:.2f} kg")

    print("\nFlujo Asignado por Arista:")
    for u in sorted(net1.nodes):
        for v in sorted(net1.adj.get(u, [])):
            if net1.capacity[u][v] > 0:
                print(f"  ({u:15s} -> {v:16s}): {net1.flow[u][v]:8.2f} / {net1.capacity[u][v]:8.2f} kg {'[SATURADA]' if abs(net1.flow[u][v] - net1.capacity[u][v]) < 1e-9 else ''}")

    print("\nCorte Mínimo (Cuello de Botella Estructural):")
    print(f"  Partición S (Fuente): {s1}")
    print(f"  Partición T (Sumidero): {t1}")
    print(f"  Aristas que definen el corte mínimo:")
    cap_corte_1 = 0
    for u, v, cap in cut_edges_1:
        cap_corte_1 += cap
        print(f"    * ({u} -> {v}) con capacidad: {cap:.2f} kg")
    print(f"  Capacidad Total del Corte Mínimo: {cap_corte_1:.2f} kg (Coincide con Max Flow = {max_flow_1:.2f} kg)")

    # --- ESCENARIO 2: CONTINGENCIA VIAL (CP-08) ---
    print("\n" + "=" * 80)
    print(">>> ESCENARIO 2: CONTINGENCIA VIAL (Ruta Matriz -> Reciclador reducida a 400 kg)")
    net2 = build_network_contingency()
    max_flow_2, steps_2 = net2.compute_max_flow("SUPER_FUENTE", "SUPER_SUMIDERO")
    s2, t2, cut_edges_2 = net2.compute_min_cut("SUPER_FUENTE")

    print(f"\nFlujo Máximo Alcanzado en Contingencia: {max_flow_2:.2f} kg/semana")
    print(f"Pérdida de Capacidad por Contingencia: {max_flow_1 - max_flow_2:.2f} kg/semana (-{((max_flow_1 - max_flow_2)/max_flow_1)*100:.1f}%)")
    
    print("\nAristas Críticas del Corte en Contingencia:")
    for u, v, cap in cut_edges_2:
        print(f"    * ({u} -> {v}) con capacidad: {cap:.2f} kg")

    print("\n" + "=" * 80)
    print("INTERPRETACIÓN DE RESULTADOS PARA LA TOMA DE DECISIONES LOGÍSTICAS:")
    print("1. En condiciones normales, el cuello de botella está limitado por:")
    print("   - La capacidad de procesamiento del Taller Técnico (1600 kg máx de salida).")
    print("   - La arista directa Matriz -> Reciclador (1500 kg).")
    print("2. El flujo total máximo base es de 3100.00 kg/semana.")
    print("3. Durante la contingencia, el flujo colapsa a 2000.00 kg/semana debido a la saturación vial.")
    print("4. Recomendación operativa: Incrementar turnos en Taller Lab-300 para mitigar contingencias.")
    print("=" * 80)


if __name__ == "__main__":
    run_experiment()
