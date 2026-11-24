import sys
import os
from pathlib import Path

# Agregar path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir.parent))
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def run_tests():
    print("=" * 70)
    print("EJECUCIÓN DE PRUEBAS AUTOMATIZADAS — PLAN DE MEJORA API REST")
    print("=" * 70)

    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. GET /health -> 200 OK")

    # 2. Login
    login_data = {"username": "admin_sys", "password": "admin123"}
    res = client.post("/api/v1/auth/login", data=login_data)
    assert res.status_code == 200, f"Login failed: {res.status_code} {res.text}"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[PASS] 2. POST /api/v1/auth/login -> 200 OK (Token JWT emitido)")

    # 3. GET /auth/me
    res = client.get("/api/v1/auth/me", headers=headers)
    assert res.status_code == 200, f"Auth me failed: {res.status_code}"
    assert res.json()["username"] == "admin_sys"
    print(f"[PASS] 3. GET /api/v1/auth/me -> 200 OK (Usuario: admin_sys)")

    # 4. GET /devices (Listado retrocompatible array plano)
    res = client.get("/api/v1/devices", headers=headers)
    assert res.status_code == 200, f"List devices failed: {res.status_code}"
    assert isinstance(res.json(), list), "Expected list response for backward compatibility"
    print(f"[PASS] 4. GET /api/v1/devices (Retrocompatible) -> 200 OK (Total items: {len(res.json())})")

    # 5. GET /devices?paginated=true (Listado paginado con metadatos)
    res = client.get("/api/v1/devices?paginated=true&limit=2&offset=0", headers=headers)
    assert res.status_code == 200, f"Paginated list failed: {res.status_code}"
    page = res.json()
    assert "items" in page and "total" in page and "limit" in page and "offset" in page
    assert page["limit"] == 2
    print(f"[PASS] 5. GET /api/v1/devices?paginated=true -> 200 OK (total={page['total']}, items={len(page['items'])})")

    # 6. POST /devices (Creación de dispositivo con Location header)
    test_qr = f"QR-TEST-{int(os.urandom(3).hex(), 16)}"
    new_dev_payload = {
        "codigo_qr": test_qr,
        "numero_serie": "SN-TEST-8899",
        "id_modelo": 1,
        "id_lote": 1,
        "id_condicion": 1,
        "peso_kg": 6.75,
        "observaciones": "Equipo de prueba automatizada",
        "id_centro_inicial": 1
    }
    res = client.post("/api/v1/devices", json=new_dev_payload, headers=headers)
    assert res.status_code == 201, f"Create device failed: {res.status_code} {res.text}"
    new_dev = res.json()
    new_id = new_dev["id_dispositivo"]
    location_header = res.headers.get("Location")
    assert location_header == f"/api/v1/devices/{new_id}", f"Invalid Location header: {location_header}"
    print(f"[PASS] 6. POST /api/v1/devices -> 201 Created (ID={new_id}, Location='{location_header}')")

    # 7. POST /devices con QR duplicado -> 409 Conflict
    res_dup = client.post("/api/v1/devices", json=new_dev_payload, headers=headers)
    assert res_dup.status_code == 409, f"Expected 409 conflict, got: {res_dup.status_code}"
    print(f"[PASS] 7. POST /api/v1/devices (QR duplicado) -> 409 Conflict")

    # 8. GET /devices/id/{id} (Consulta directa por ID numérico PK)
    res_id = client.get(f"/api/v1/devices/id/{new_id}", headers=headers)
    assert res_id.status_code == 200, f"Get by ID failed: {res_id.status_code}"
    assert res_id.json()["id_dispositivo"] == new_id
    print(f"[PASS] 8. GET /api/v1/devices/id/{new_id} -> 200 OK (Dispositivo obtenido por PK)")

    # 9. GET /devices/id/999999 -> 404 Not Found
    res_404 = client.get("/api/v1/devices/id/999999", headers=headers)
    assert res_404.status_code == 404, f"Expected 404, got: {res_404.status_code}"
    print(f"[PASS] 9. GET /api/v1/devices/id/999999 -> 404 Not Found")

    # 10. GET /devices/{identifier} (Consulta por código QR)
    res_qr = client.get(f"/api/v1/devices/{test_qr}", headers=headers)
    assert res_qr.status_code == 200, f"Get by QR failed: {res_qr.status_code}"
    assert res_qr.json()["codigo_qr"] == test_qr
    print(f"[PASS] 10. GET /api/v1/devices/{test_qr} -> 200 OK (Dispositivo obtenido por QR)")

    # 11. GET /devices/{identifier}/traceability (Historial inmutable de eventos)
    res_trace = client.get(f"/api/v1/devices/{test_qr}/traceability", headers=headers)
    assert res_trace.status_code == 200, f"Get traceability failed: {res_trace.status_code}"
    trace_data = res_trace.json()
    assert trace_data["id_dispositivo"] == new_id
    assert trace_data["total_eventos"] >= 1
    print(f"[PASS] 11. GET /api/v1/devices/{test_qr}/traceability -> 200 OK (Eventos: {trace_data['total_eventos']})")

    # 12. PATCH /devices/{identifier} (Modificación parcial de campos permitidos)
    patch_payload = {
        "observaciones": "Observación actualizada por PATCH",
        "peso_kg": 7.10
    }
    res_patch = client.patch(f"/api/v1/devices/{new_id}", json=patch_payload, headers=headers)
    assert res_patch.status_code == 200, f"Patch failed: {res_patch.status_code} {res_patch.text}"
    patched_dev = res_patch.json()
    assert patched_dev["observaciones"] == "Observación actualizada por PATCH"
    assert abs(patched_dev["peso_kg"] - 7.10) < 0.01
    print(f"[PASS] 12. PATCH /api/v1/devices/{new_id} -> 200 OK (Campos actualizados correctamente)")

    # 13. PATCH vacío -> 422 Unprocessable Entity
    res_patch_empty = client.patch(f"/api/v1/devices/{new_id}", json={}, headers=headers)
    assert res_patch_empty.status_code == 422, f"Expected 422, got: {res_patch_empty.status_code}"
    print(f"[PASS] 13. PATCH /api/v1/devices/{new_id} vacío -> 422 Unprocessable Entity")

    # 14. DELETE /devices/{identifier} -> 204 No Content (Baja lógica con preservación de historial)
    res_del = client.delete(f"/api/v1/devices/{test_qr}", headers=headers)
    assert res_del.status_code == 204, f"Delete failed: {res_del.status_code}"
    print(f"[PASS] 14. DELETE /api/v1/devices/{test_qr} -> 204 No Content (Baja Lógica Exitosa)")

    # 15. Verificar que el dispositivo dado de baja lógica:
    #     a) NO aparece en el listado de activos normales
    res_list_activos = client.get(f"/api/v1/devices?search={test_qr}&solo_activos=true", headers=headers)
    assert len(res_list_activos.json()) == 0, "Dispositivo dado de baja no debe aparecer en solo_activos=true"
    #     b) AÚN existe y conserva su historial inmutable de trazabilidad (RN-07 / RN-08)
    res_baja_det = client.get(f"/api/v1/devices/{test_qr}", headers=headers)
    assert res_baja_det.status_code == 200, "Dispositivo debe ser consultable para trazabilidad histórica"
    assert res_baja_det.json()["activo"] is False, "El dispositivo debe estar marcado como activo=False"
    historial = res_baja_det.json()["historial"]
    assert any(h["id_estado"] == 8 for h in historial), "Debe existir evento de baja técnica en historial"
    print(f"[PASS] 15. Verificación de Integridad Histórica: Dispositivo preservado con activo=False y evento de baja registrado")

    # 16. Optimización de red Edmonds-Karp
    res_net = client.get("/api/v1/network/optimize-flow?escenario=BASE", headers=headers)
    assert res_net.status_code == 200, f"Network opt failed: {res_net.status_code}"
    net_data = res_net.json()
    assert "flujo_maximo_total_kg" in net_data
    assert "corte_minimo_capacidad_kg" in net_data
    print(f"[PASS] 16. GET /api/v1/network/optimize-flow -> 200 OK (Flujo Máximo: {net_data['flujo_maximo_total_kg']} kg/sem)")

    print("=" * 70)
    print("TODAS LAS 16 PRUEBAS PASARON EXITOSAMENTE AL 100%")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
