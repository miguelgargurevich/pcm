#!/usr/bin/env python3
"""
Script para generar todos los archivos CQRS necesarios para compromisos 11-21
"""
import os

# Configuración base
BASE_DIR = "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/backend"

# Definición de compromisos con información clave
COMPROMISOS = {
    11: {"name": "Com11AportacionGeoPeru", "pk": "ComagpEntId", "entity": "Com11AportacionGeoPeru"},
    12: {"name": "Com12ResponsableSoftwarePublico", "pk": "ComrspEntId", "entity": "Com12ResponsableSoftwarePublico"},
    13: {"name": "Com13InteroperabilidadPIDE", "pk": "ComipideEntId", "entity": "Com13InteroperabilidadPIDE"},
    14: {"name": "Com14OficialSeguridadDigital", "pk": "ComoscdEntId", "entity": "Com14OficialSeguridadDigital"},
    15: {"name": "Com15CSIRTInstitucional", "pk": "ComcsirtEntId", "entity": "Com15CSIRTInstitucional"},
    16: {"name": "Com16SistemaGestionSeguridad", "pk": "ComsgsiEntId", "entity": "Com16SistemaGestionSeguridad"},
    17: {"name": "Com17PlanTransicionIPv6", "pk": "Comptipv6EntId", "entity": "Com17PlanTransicionIPv6"},
    18: {"name": "Com18AccesoPortalTransparencia", "pk": "ComapteEntId", "entity": "Com18AccesoPortalTransparencia"},
    19: {"name": "Com19EncuestaNacionalGobDigital", "pk": "ComenadEntId", "entity": "Com19EncuestaNacionalGobDigital"},
    20: {"name": "Com20DigitalizacionServiciosFacilita", "pk": "ComdsfpEntId", "entity": "Com20DigitalizacionServiciosFacilita"},
    21: {"name": "Com21OficialGobiernoDatos", "pk": "ComogdEntId", "entity": "Com21OficialGobiernoDatos"},
}

def generate_create_command(num, info):
    """Genera el archivo CreateCommand"""
    name = info["name"]
    content = f'''using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.{name}.Commands.Create{name};

public class Create{name}Command : IRequest<Result<{name}Response>>
{{
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = "paso1";
    public string Estado {{ get; set; }} = "bandeja";
    public string? CriteriosEvaluados {{ get; set; }}
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public Guid? UsuarioRegistra {{ get; set; }}
}}

public class {name}Response
{{
    public long {info["pk"]} {{ get; set; }}
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = string.Empty;
    public string Estado {{ get; set; }} = string.Empty;
    public string? CriteriosEvaluados {{ get; set; }}
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public Guid UsuarioRegistra {{ get; set; }}
    public DateTime CreatedAt {{ get; set; }}
    public DateTime? UpdatedAt {{ get; set; }}
    public bool Activo {{ get; set; }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.Application/Features/{name}/Commands/Create{name}/Create{name}Command.cs"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created Create{name}Command.cs")

def generate_update_command(num, info):
    """Genera el archivo UpdateCommand"""
    name = info["name"]
    pk = info["pk"]
    content = f'''using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.{name}.Commands.Update{name};

public class Update{name}Command : IRequest<Result<{name}Response>>
{{
    public long {pk} {{ get; set; }}
    public long? CompromisoId {{ get; set; }}
    public Guid? EntidadId {{ get; set; }}
    public string? EtapaFormulario {{ get; set; }}
    public string? Estado {{ get; set; }}
    public string? CriteriosEvaluados {{ get; set; }}
    public bool? CheckPrivacidad {{ get; set; }}
    public bool? CheckDdjj {{ get; set; }}
    public Guid? UsuarioRegistra {{ get; set; }}
}}

public class {name}Response
{{
    public long {pk} {{ get; set; }}
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = string.Empty;
    public string Estado {{ get; set; }} = string.Empty;
    public string? CriteriosEvaluados {{ get; set; }}
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public Guid UsuarioRegistra {{ get; set; }}
    public DateTime CreatedAt {{ get; set; }}
    public DateTime? UpdatedAt {{ get; set; }}
    public bool Activo {{ get; set; }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.Application/Features/{name}/Commands/Update{name}/Update{name}Command.cs"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created Update{name}Command.cs")

def generate_get_query(num, info):
    """Genera el archivo GetQuery"""
    name = info["name"]
    pk = info["pk"]
    content = f'''using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.{name}.Queries.Get{name};

public class Get{name}Query : IRequest<Result<{name}Response>>
{{
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
}}

public class {name}Response
{{
    public long {pk} {{ get; set; }}
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = string.Empty;
    public string Estado {{ get; set; }} = string.Empty;
    public string? CriteriosEvaluados {{ get; set; }}
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public Guid UsuarioRegistra {{ get; set; }}
    public DateTime CreatedAt {{ get; set; }}
    public DateTime? UpdatedAt {{ get; set; }}
    public bool Activo {{ get; set; }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.Application/Features/{name}/Queries/Get{name}/Get{name}Query.cs"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created Get{name}Query.cs")

# Main execution
print("=== Generando archivos CQRS para Com11-Com21 ===\n")

for num, info in COMPROMISOS.items():
    if num == 11:  # Skip Com11 as it's already created
        print(f"Skipping Com{num} (already exists)")
        continue
    
    print(f"\n--- Procesando Com{num} ({info['name']}) ---")
    generate_create_command(num, info)
    generate_update_command(num, info)
    generate_get_query(num, info)

print("\n=== ¡Generación completada! ===")
