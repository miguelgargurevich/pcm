#!/usr/bin/env python3
"""
Mapeo de campos viejos a nuevos para actualizar frontend
"""

# Mapeo para Com11 (AportacionGeoPeru)
com11_mapping = {
    'comagpEntId': 'comageopEntId',
    'urlInformacionGeoespacial': 'fechaInicio',  # CAMPO COMPLETAMENTE DIFERENTE
    'tipoInformacionPublicada': 'fechaFin',       # CAMPO COMPLETAMENTE DIFERENTE
    'totalCapasPublicadas': 'serviciosDigitalizados',
    'fechaUltimaActualizacionAgp': 'serviciosTotal',
    'responsableAgp': 'porcentajeDigitalizacion',
    'cargoResponsableAgp': 'archivoPlan',
    'correoResponsableAgp': 'descripcion',
    'telefonoResponsableAgp': 'beneficiariosEstimados',
    'numeroNormaAprobacionAgp': None,  # NO EXISTE EN SQL
    'fechaAprobacionAgp': None,        # NO EXISTE EN SQL
    'informacionInteroperable': None,  # NO EXISTE EN SQL
    'observacionAgp': 'observacionesPCM',
    'rutaPdfAgp': None,                # NO EXISTE EN SQL
    'criteriosEvaluados': None,        # NO EXISTE EN SQL
}

# Nuevos campos SQL para Com11
com11_new_fields = [
    'fechaInicio',        # DateTime
    'fechaFin',           # DateTime
    'serviciosDigitalizados',  # int
    'serviciosTotal',     # int
    'porcentajeDigitalizacion',  # decimal
    'archivoPlan',        # string
    'descripcion',        # string
    'beneficiariosEstimados',  # int
]

# Mapeo para Com12 (ResponsableSoftwarePublico)
com12_new_fields = [
    'fechaElaboracion',   # DateTime
    'numeroDocumento',    # string
    'archivoDocumento',   # string
    'descripcion',        # string
    'requisitosSeguridad',  # string
    'requisitosPrivacidad',  # string
    'fechaVigencia',      # DateTime
]

# Mapeo para Com13 (InteroperabilidadPIDE)
com13_new_fields = [
    'fechaAprobacion',    # DateTime
    'numeroResolucion',   # string
    'archivoPlan',        # string
    'descripcion',        # string
    'riesgosIdentificados',  # string
    'estrategiasMitigacion',  # string
    'fechaRevision',      # DateTime
    'responsable',        # string
]

# Mapeo para Com14 (OficialSeguridadDigital)
com14_new_fields = [
    'fechaElaboracion',   # DateTime
    'numeroDocumento',    # string
    'archivoDocumento',   # string
    'descripcion',        # string
    'politicasSeguridad', # string
    'certificaciones',    # string
    'fechaVigencia',      # DateTime
]

# Mapeo para Com15 (CSIRTInstitucional)
com15_new_fields = [
    'fechaConformacion',  # DateTime
    'numeroResolucion',   # string
    'responsable',        # string
    'emailContacto',      # string
    'telefonoContacto',   # string
    'archivoProcedimientos',  # string
    'descripcion',        # string
]

# Mapeo para Com16 (SistemaGestionSeguridad)
com16_new_fields = [
    'fechaImplementacion',  # DateTime
    'normaAplicable',     # string
    'certificacion',      # string
    'fechaCertificacion', # DateTime
    'archivoCertificado', # string
    'descripcion',        # string
    'alcance',            # string
]

# Mapeo para Com17 (PlanTransicionIPv6)
com17_new_fields = [
    'fechaInicioTransicion',  # DateTime
    'fechaFinTransicion',  # DateTime
    'porcentajeAvance',   # decimal
    'sistemasMigrados',   # int
    'sistemasTotal',      # int
    'archivoPlan',        # string
    'descripcion',        # string
]

# Mapeo para Com18 (AccesoPortalTransparencia)
com18_new_fields = [
    'urlPlataforma',      # string
    'fechaImplementacion',  # DateTime
    'tramitesDisponibles',  # int
    'usuariosRegistrados',  # int
    'tramitesProcesados', # int
    'archivoEvidencia',   # string
    'descripcion',        # string
]

# Mapeo para Com19 (EncuestaNacionalGobDigital)
com19_new_fields = [
    'fechaConexion',      # DateTime
    'tipoConexion',       # string
    'anchoBanda',         # string
    'proveedor',          # string
    'archivoContrato',    # string
    'descripcion',        # string
]

# Mapeo para Com20 (DigitalizacionServiciosFacilita)
com20_new_fields = [
    'sistemasDocumentados',  # int
    'sistemasTotal',      # int
    'porcentajeDocumentacion',  # decimal
    'archivoRepositorio', # string
    'descripcion',        # string
]

# Mapeo para Com21 (OficialGobiernoDatos)
com21_new_fields = [
    'fechaElaboracion',   # DateTime
    'numeroDocumento',    # string
    'archivoDocumento',   # string
    'descripcion',        # string
    'procedimientos',     # string
    'responsables',       # string
    'fechaVigencia',      # DateTime
]

# Mapeo de PK names antiguos a nuevos
pk_mapping = {
    'comagpEntId': 'comageopEntId',
    'comrspEntId': 'comdrspEntId',
    'comipideEntId': 'compcpideEntId',
    'comoscdEntId': 'comdoscdEntId',
    'comcsirtEntId': 'comcsirtEntId',  # Sin cambio
    'comsgsiEntId': 'comsgsiEntId',    # Sin cambio
    'comptipv6EntId': 'comptipv6EntId',  # Sin cambio
    'comapteEntId': 'comsapteEntId',
    'comenadEntId': 'comrenadEntId',
    'comdsfpEntId': 'comdsfpeEntId',
    'comogdEntId': 'comdogdEntId',
}

print("=" * 80)
print("MAPEO DE CAMPOS - FRONTEND UPDATE")
print("=" * 80)
print("\n⚠️  NOTA IMPORTANTE:")
print("Los campos del frontend NO tienen correspondencia 1:1 con los nuevos campos SQL.")
print("Cada compromiso tiene campos completamente diferentes.")
print("Se requiere refactorización manual del frontend o regeneración completa de formularios.\n")

print("Campos SQL nuevos por compromiso:")
print("\nCom11 (AportacionGeoPeru):")
for field in com11_new_fields:
    print(f"  - {field}")

print("\nCom12 (ResponsableSoftwarePublico):")
for field in com12_new_fields:
    print(f"  - {field}")

print("\nCom13 (InteroperabilidadPIDE):")
for field in com13_new_fields:
    print(f"  - {field}")

print("\nCom14 (OficialSeguridadDigital):")
for field in com14_new_fields:
    print(f"  - {field}")

print("\nCom15 (CSIRTInstitucional):")
for field in com15_new_fields:
    print(f"  - {field}")

print("\nCom16 (SistemaGestionSeguridad):")
for field in com16_new_fields:
    print(f"  - {field}")

print("\nCom17 (PlanTransicionIPv6):")
for field in com17_new_fields:
    print(f"  - {field}")

print("\nCom18 (AccesoPortalTransparencia):")
for field in com18_new_fields:
    print(f"  - {field}")

print("\nCom19 (EncuestaNacionalGobDigital):")
for field in com19_new_fields:
    print(f"  - {field}")

print("\nCom20 (DigitalizacionServiciosFacilita):")
for field in com20_new_fields:
    print(f"  - {field}")

print("\nCom21 (OficialGobiernoDatos):")
for field in com21_new_fields:
    print(f"  - {field}")

print("\n" + "=" * 80)
print("RECOMENDACIÓN:")
print("El frontend necesita ser completamente refactorizado para usar estos campos.")
print("Los formularios actuales están diseñados para campos que ya no existen en SQL.")
print("=" * 80)
