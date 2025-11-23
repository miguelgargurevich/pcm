#!/usr/bin/env python3
"""
Script para generar archivos CQRS para compromisos 11-21
"""

compromisos = {
    11: {
        "name": "Com11AportacionGeoPeru",
        "pk": "ComagpEntId",
        "table": "com11_agp",
        "suffix": "Agp",
        "description": "Aportación a Geo Perú"
    },
    12: {
        "name": "Com12ResponsableSoftwarePublico",
        "pk": "ComrspEntId",
        "table": "com12_rsp",
        "suffix": "Rsp",
        "description": "Responsable de Software Público"
    },
}

print("Generador de archivos CQRS listo")
print(f"Total compromisos: {len(compromisos)}")
