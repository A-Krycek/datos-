"""
Modelos de Entidades y Dominio para EcoRAEE Cloud.
Arquitectura desacoplada sin dependencias externas de ORM (SQLAlchemy).
Las operaciones de base de datos se ejecutan mediante consultas SQL nativas sobre SQLite.
"""

class BaseEntity:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

class AristaRed(BaseEntity):
    pass

class NodoRed(BaseEntity):
    pass

class Dispositivo(BaseEntity):
    pass

class HistorialEstado(BaseEntity):
    pass

class Inventario(BaseEntity):
    pass

class CentroAcopio(BaseEntity):
    pass

class Lote(BaseEntity):
    pass

class ModeloDispositivo(BaseEntity):
    pass

class CategoriaDispositivo(BaseEntity):
    pass

class CondicionDispositivo(BaseEntity):
    pass

class EstadoDispositivo(BaseEntity):
    pass

class ClasificacionTecnica(BaseEntity):
    pass
