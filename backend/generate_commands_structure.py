#!/usr/bin/env python3
"""
Script para actualizar Commands/Queries/Responses de Com11-21 según estructura SQL
"""

# Estructura de campos específicos según SQL
com_specific_fields = {
    "Com11": [
        ("DateTime?", "FechaInicio"),
        ("DateTime?", "FechaFin"),
        ("int?", "ServiciosDigitalizados"),
        ("int?", "ServiciosTotal"),
        ("decimal?", "PorcentajeDigitalizacion"),
        ("string?", "ArchivoPlan"),
        ("string?", "Descripcion"),
        ("int?", "BeneficiariosEstimados"),
    ],
    "Com12": [
        ("DateTime?", "FechaElaboracion"),
        ("string?", "NumeroDocumento"),
        ("string?", "ArchivoDocumento"),
        ("string?", "Descripcion"),
        ("string?", "RequisitosSeguridad"),
        ("string?", "RequisitosPrivacidad"),
        ("DateTime?", "FechaVigencia"),
    ],
    "Com13": [
        ("DateTime?", "FechaAprobacion"),
        ("string?", "NumeroResolucion"),
        ("string?", "ArchivoPlan"),
        ("string?", "Descripcion"),
        ("string?", "RiesgosIdentificados"),
        ("string?", "EstrategiasMitigacion"),
        ("DateTime?", "FechaRevision"),
        ("string?", "Responsable"),
    ],
    "Com14": [
        ("DateTime?", "FechaElaboracion"),
        ("string?", "NumeroDocumento"),
        ("string?", "ArchivoDocumento"),
        ("string?", "Descripcion"),
        ("string?", "PoliticasSeguridad"),
        ("string?", "Certificaciones"),
        ("DateTime?", "FechaVigencia"),
    ],
    "Com15": [
        ("DateTime?", "FechaConformacion"),
        ("string?", "NumeroResolucion"),
        ("string?", "Responsable"),
        ("string?", "EmailContacto"),
        ("string?", "TelefonoContacto"),
        ("string?", "ArchivoProcedimientos"),
        ("string?", "Descripcion"),
    ],
    "Com16": [
        ("DateTime?", "FechaImplementacion"),
        ("string?", "NormaAplicable"),
        ("string?", "Certificacion"),
        ("DateTime?", "FechaCertificacion"),
        ("string?", "ArchivoCertificado"),
        ("string?", "Descripcion"),
        ("string?", "Alcance"),
    ],
    "Com17": [
        ("DateTime?", "FechaInicioTransicion"),
        ("DateTime?", "FechaFinTransicion"),
        ("decimal?", "PorcentajeAvance"),
        ("int?", "SistemasMigrados"),
        ("int?", "SistemasTotal"),
        ("string?", "ArchivoPlan"),
        ("string?", "Descripcion"),
    ],
    "Com18": [
        ("string?", "UrlPlataforma"),
        ("DateTime?", "FechaImplementacion"),
        ("int?", "TramitesDisponibles"),
        ("int?", "UsuariosRegistrados"),
        ("int?", "TramitesProcesados"),
        ("string?", "ArchivoEvidencia"),
        ("string?", "Descripcion"),
    ],
    "Com19": [
        ("DateTime?", "FechaConexion"),
        ("string?", "TipoConexion"),
        ("string?", "AnchoBanda"),
        ("string?", "Proveedor"),
        ("string?", "ArchivoContrato"),
        ("string?", "Descripcion"),
    ],
    "Com20": [
        ("int?", "SistemasDocumentados"),
        ("int?", "SistemasTotal"),
        ("decimal?", "PorcentajeDocumentacion"),
        ("string?", "ArchivoRepositorio"),
        ("string?", "Descripcion"),
    ],
    "Com21": [
        ("DateTime?", "FechaElaboracion"),
        ("string?", "NumeroDocumento"),
        ("string?", "ArchivoDocumento"),
        ("string?", "Descripcion"),
        ("string?", "Procedimientos"),
        ("string?", "Responsables"),
        ("DateTime?", "FechaVigencia"),
    ],
}

# Mapeo de nombres de entidad a sufijos de PK
pk_names = {
    "Com11": "ComageopEntId",
    "Com12": "ComdrspEntId",
    "Com13": "CompcpideEntId",
    "Com14": "ComdoscdEntId",
    "Com15": "ComcsirtEntId",
    "Com16": "ComsgsiEntId",
    "Com17": "Comptipv6EntId",
    "Com18": "ComsapteEntId",
    "Com19": "ComrenadEntId",
    "Com20": "ComdsfpeEntId",
    "Com21": "ComdogdEntId",
}

# Nombres completos de entidades
entity_names = {
    "Com11": "AportacionGeoPeru",
    "Com12": "ResponsableSoftwarePublico",
    "Com13": "InteroperabilidadPIDE",
    "Com14": "OficialSeguridadDigital",
    "Com15": "CSIRTInstitucional",
    "Com16": "SistemaGestionSeguridad",
    "Com17": "PlanTransicionIPv6",
    "Com18": "AccesoPortalTransparencia",
    "Com19": "EncuestaNacionalGobDigital",
    "Com20": "DigitalizacionServiciosFacilita",
    "Com21": "OficialGobiernoDatos",
}

print("Generando campos específicos para Commands y Responses...")
print("=" * 80)

for com_num in range(11, 22):
    com_key = f"Com{com_num}"
    entity_name = entity_names[com_key]
    pk_name = pk_names[com_key]
    fields = com_specific_fields[com_key]
    
    print(f"\n// {com_key}{entity_name}")
    print(f"// Command fields (solo específicos):")
    for field_type, field_name in fields:
        print(f"    public {field_type} {field_name} {{ get; set; }}")
    
    print(f"\n// Response PK:")
    print(f"    public long {pk_name} {{ get; set; }}")

print("\n" + "=" * 80)
print("Completado!")
