#!/usr/bin/env python3
"""
Script para regenerar todos los Commands, Queries y Handlers de Com11-21
basados en la estructura SQL de la base de datos
"""

import os
from pathlib import Path

# Estructura de campos específicos según SQL
com_specific_fields = {
    11: [
        ("DateTime?", "FechaInicio", "fecha_inicio"),
        ("DateTime?", "FechaFin", "fecha_fin"),
        ("int?", "ServiciosDigitalizados", "servicios_digitalizados"),
        ("int?", "ServiciosTotal", "servicios_total"),
        ("decimal?", "PorcentajeDigitalizacion", "porcentaje_digitalizacion"),
        ("string?", "ArchivoPlan", "archivo_plan"),
        ("string?", "Descripcion", "descripcion"),
        ("int?", "BeneficiariosEstimados", "beneficiarios_estimados"),
    ],
    12: [
        ("DateTime?", "FechaElaboracion", "fecha_elaboracion"),
        ("string?", "NumeroDocumento", "numero_documento"),
        ("string?", "ArchivoDocumento", "archivo_documento"),
        ("string?", "Descripcion", "descripcion"),
        ("string?", "RequisitosSeguridad", "requisitos_seguridad"),
        ("string?", "RequisitosPrivacidad", "requisitos_privacidad"),
        ("DateTime?", "FechaVigencia", "fecha_vigencia"),
    ],
    13: [
        ("DateTime?", "FechaAprobacion", "fecha_aprobacion"),
        ("string?", "NumeroResolucion", "numero_resolucion"),
        ("string?", "ArchivoPlan", "archivo_plan"),
        ("string?", "Descripcion", "descripcion"),
        ("string?", "RiesgosIdentificados", "riesgos_identificados"),
        ("string?", "EstrategiasMitigacion", "estrategias_mitigacion"),
        ("DateTime?", "FechaRevision", "fecha_revision"),
        ("string?", "Responsable", "responsable"),
    ],
    14: [
        ("DateTime?", "FechaElaboracion", "fecha_elaboracion"),
        ("string?", "NumeroDocumento", "numero_documento"),
        ("string?", "ArchivoDocumento", "archivo_documento"),
        ("string?", "Descripcion", "descripcion"),
        ("string?", "PoliticasSeguridad", "politicas_seguridad"),
        ("string?", "Certificaciones", "certificaciones"),
        ("DateTime?", "FechaVigencia", "fecha_vigencia"),
    ],
    15: [
        ("DateTime?", "FechaConformacion", "fecha_conformacion"),
        ("string?", "NumeroResolucion", "numero_resolucion"),
        ("string?", "Responsable", "responsable"),
        ("string?", "EmailContacto", "email_contacto"),
        ("string?", "TelefonoContacto", "telefono_contacto"),
        ("string?", "ArchivoProcedimientos", "archivo_procedimientos"),
        ("string?", "Descripcion", "descripcion"),
    ],
    16: [
        ("DateTime?", "FechaImplementacion", "fecha_implementacion"),
        ("string?", "NormaAplicable", "norma_aplicable"),
        ("string?", "Certificacion", "certificacion"),
        ("DateTime?", "FechaCertificacion", "fecha_certificacion"),
        ("string?", "ArchivoCertificado", "archivo_certificado"),
        ("string?", "Descripcion", "descripcion"),
        ("string?", "Alcance", "alcance"),
    ],
    17: [
        ("DateTime?", "FechaInicioTransicion", "fecha_inicio_transicion"),
        ("DateTime?", "FechaFinTransicion", "fecha_fin_transicion"),
        ("decimal?", "PorcentajeAvance", "porcentaje_avance"),
        ("int?", "SistemasMigrados", "sistemas_migrados"),
        ("int?", "SistemasTotal", "sistemas_total"),
        ("string?", "ArchivoPlan", "archivo_plan"),
        ("string?", "Descripcion", "descripcion"),
    ],
    18: [
        ("string?", "UrlPlataforma", "url_plataforma"),
        ("DateTime?", "FechaImplementacion", "fecha_implementacion"),
        ("int?", "TramitesDisponibles", "tramites_disponibles"),
        ("int?", "UsuariosRegistrados", "usuarios_registrados"),
        ("int?", "TramitesProcesados", "tramites_procesados"),
        ("string?", "ArchivoEvidencia", "archivo_evidencia"),
        ("string?", "Descripcion", "descripcion"),
    ],
    19: [
        ("DateTime?", "FechaConexion", "fecha_conexion"),
        ("string?", "TipoConexion", "tipo_conexion"),
        ("string?", "AnchoBanda", "ancho_banda"),
        ("string?", "Proveedor", "proveedor"),
        ("string?", "ArchivoContrato", "archivo_contrato"),
        ("string?", "Descripcion", "descripcion"),
    ],
    20: [
        ("int?", "SistemasDocumentados", "sistemas_documentados"),
        ("int?", "SistemasTotal", "sistemas_total"),
        ("decimal?", "PorcentajeDocumentacion", "porcentaje_documentacion"),
        ("string?", "ArchivoRepositorio", "archivo_repositorio"),
        ("string?", "Descripcion", "descripcion"),
    ],
    21: [
        ("DateTime?", "FechaElaboracion", "fecha_elaboracion"),
        ("string?", "NumeroDocumento", "numero_documento"),
        ("string?", "ArchivoDocumento", "archivo_documento"),
        ("string?", "Descripcion", "descripcion"),
        ("string?", "Procedimientos", "procedimientos"),
        ("string?", "Responsables", "responsables"),
        ("DateTime?", "FechaVigencia", "fecha_vigencia"),
    ],
}

# Mapeo de nombres
entity_names = {
    11: "AportacionGeoPeru",
    12: "ResponsableSoftwarePublico",
    13: "InteroperabilidadPIDE",
    14: "OficialSeguridadDigital",
    15: "CSIRTInstitucional",
    16: "SistemaGestionSeguridad",
    17: "PlanTransicionIPv6",
    18: "AccesoPortalTransparencia",
    19: "EncuestaNacionalGobDigital",
    20: "DigitalizacionServiciosFacilita",
    21: "OficialGobiernoDatos",
}

pk_names = {
    11: "ComageopEntId",
    12: "ComdrspEntId",
    13: "CompcpideEntId",
    14: "ComdoscdEntId",
    15: "ComcsirtEntId",
    16: "ComsgsiEntId",
    17: "Comptipv6EntId",
    18: "ComsapteEntId",
    19: "ComrenadEntId",
    20: "ComdsfpeEntId",
    21: "ComdogdEntId",
}

def generate_create_command(com_num):
    entity_name = entity_names[com_num]
    fields = com_specific_fields[com_num]
    
    # Campos comunes
    common_fields = """    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }"""
    
    # Campos específicos
    specific_fields = "\n    // Campos específicos\n"
    for field_type, field_name, _ in fields:
        specific_fields += f"    public {field_type} {field_name} {{ get; set; }}\n"
    
    return f"""using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com{com_num}{entity_name}.Commands.CreateCom{com_num}{entity_name};

public class CreateCom{com_num}{entity_name}Command : IRequest<Result<Com{com_num}{entity_name}Response>>
{{
{common_fields}
{specific_fields}}}

public class Com{com_num}{entity_name}Response
{{
    public long {pk_names[com_num]} {{ get; set; }}
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = string.Empty;
    public string Estado {{ get; set; }} = string.Empty;
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public string EstadoPCM {{ get; set; }} = string.Empty;
    public string ObservacionesPCM {{ get; set; }} = string.Empty;
    public DateTime CreatedAt {{ get; set; }}
    public DateTime FecRegistro {{ get; set; }}
    public Guid UsuarioRegistra {{ get; set; }}
    public bool Activo {{ get; set; }}
{specific_fields}}}
"""

def generate_update_command(com_num):
    entity_name = entity_names[com_num]
    pk_name = pk_names[com_num]
    fields = com_specific_fields[com_num]
    
    # Campos comunes (nullable para update)
    common_fields = f"""    public long {pk_name} {{ get; set; }}
    public long? CompromisoId {{ get; set; }}
    public Guid? EntidadId {{ get; set; }}
    public string? EtapaFormulario {{ get; set; }}
    public string? Estado {{ get; set; }}
    public bool? CheckPrivacidad {{ get; set; }}
    public bool? CheckDdjj {{ get; set; }}
    public Guid? UsuarioRegistra {{ get; set; }}"""
    
    # Campos específicos (ya son nullable)
    specific_fields = "\n    // Campos específicos\n"
    for field_type, field_name, _ in fields:
        specific_fields += f"    public {field_type} {field_name} {{ get; set; }}\n"
    
    # Response reutiliza la misma estructura que Create
    response_fields = ""
    for field_type, field_name, _ in fields:
        response_fields += f"    public {field_type} {field_name} {{ get; set; }}\n"
    
    return f"""using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com{com_num}{entity_name}.Commands.UpdateCom{com_num}{entity_name};

public class UpdateCom{com_num}{entity_name}Command : IRequest<Result<Com{com_num}{entity_name}Response>>
{{
{common_fields}
{specific_fields}}}

public class Com{com_num}{entity_name}Response
{{
    public long {pk_name} {{ get; set; }}
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = string.Empty;
    public string Estado {{ get; set; }} = string.Empty;
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public string EstadoPCM {{ get; set; }} = string.Empty;
    public string ObservacionesPCM {{ get; set; }} = string.Empty;
    public DateTime CreatedAt {{ get; set; }}
    public DateTime FecRegistro {{ get; set; }}
    public Guid UsuarioRegistra {{ get; set; }}
    public bool Activo {{ get; set; }}
{response_fields}}}
"""

def generate_get_query(com_num):
    entity_name = entity_names[com_num]
    pk_name = pk_names[com_num]
    fields = com_specific_fields[com_num]
    
    response_fields = ""
    for field_type, field_name, _ in fields:
        response_fields += f"    public {field_type} {field_name} {{ get; set; }}\n"
    
    return f"""using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com{com_num}{entity_name}.Queries.GetCom{com_num}{entity_name};

public class GetCom{com_num}{entity_name}Query : IRequest<Result<Com{com_num}{entity_name}Response>>
{{
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
}}

public class Com{com_num}{entity_name}Response
{{
    public long {pk_name} {{ get; set; }}
    public long CompromisoId {{ get; set; }}
    public Guid EntidadId {{ get; set; }}
    public string EtapaFormulario {{ get; set; }} = string.Empty;
    public string Estado {{ get; set; }} = string.Empty;
    public bool CheckPrivacidad {{ get; set; }}
    public bool CheckDdjj {{ get; set; }}
    public string EstadoPCM {{ get; set; }} = string.Empty;
    public string ObservacionesPCM {{ get; set; }} = string.Empty;
    public DateTime CreatedAt {{ get; set; }}
    public DateTime FecRegistro {{ get; set; }}
    public Guid UsuarioRegistra {{ get; set; }}
    public bool Activo {{ get; set; }}
{response_fields}}}
"""

def generate_create_handler(com_num):
    entity_name = entity_names[com_num]
    pk_name = pk_names[com_num]
    fields = com_specific_fields[com_num]
    
    # Campos específicos para entity
    entity_fields = ""
    for _, field_name, _ in fields:
        entity_fields += f"                {field_name} = request.{field_name},\n"
    
    # Campos específicos para response
    response_fields = ""
    for _, field_name, _ in fields:
        response_fields += f"                {field_name} = entity.{field_name},\n"
    
    return f"""using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com{com_num}{entity_name}.Commands.CreateCom{com_num}{entity_name};
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com{com_num}{entity_name}Entity = PCM.Domain.Entities.Com{com_num}{entity_name};

namespace PCM.Infrastructure.Handlers.Com{com_num}{entity_name};

public class CreateCom{com_num}{entity_name}Handler : IRequestHandler<CreateCom{com_num}{entity_name}Command, Result<Com{com_num}{entity_name}Response>>
{{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom{com_num}{entity_name}Handler> _logger;

    public CreateCom{com_num}{entity_name}Handler(PCMDbContext context, ILogger<CreateCom{com_num}{entity_name}Handler> logger)
    {{
        _context = context;
        _logger = logger;
    }}

    public async Task<Result<Com{com_num}{entity_name}Response>> Handle(CreateCom{com_num}{entity_name}Command request, CancellationToken cancellationToken)
    {{
        try
        {{
            _logger.LogInformation("Creando registro Com{com_num}{entity_name} para Compromiso {{CompromisoId}}, Entidad {{EntidadId}}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com{com_num}{entity_name}Entity
            {{
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                EstadoPCM = "",
                ObservacionesPCM = "",
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                Activo = true,
{entity_fields}            }};

            _context.Com{com_num}{entity_name}.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com{com_num}{entity_name}Response
            {{
                {pk_name} = entity.{pk_name},
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
{response_fields}            }};

            return Result<Com{com_num}{entity_name}Response>.Success(response);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al crear Com{com_num}{entity_name}");
            return Result<Com{com_num}{entity_name}Response>.Failure($"Error al crear registro: {{ex.Message}}");
        }}
    }}
}}
"""

def generate_update_handler(com_num):
    entity_name = entity_names[com_num]
    pk_name = pk_names[com_num]
    fields = com_specific_fields[com_num]
    
    # Campos específicos para actualización
    update_fields = ""
    for field_type, field_name, _ in fields:
        if "string" in field_type:
            update_fields += f"            if (!string.IsNullOrEmpty(request.{field_name})) entity.{field_name} = request.{field_name};\n"
        else:
            update_fields += f"            if (request.{field_name}.HasValue) entity.{field_name} = request.{field_name};\n"
    
    # Campos específicos para response
    response_fields = ""
    for _, field_name, _ in fields:
        response_fields += f"                {field_name} = entity.{field_name},\n"
    
    return f"""using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com{com_num}{entity_name}.Commands.UpdateCom{com_num}{entity_name};
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com{com_num}{entity_name};

public class UpdateCom{com_num}{entity_name}Handler : IRequestHandler<UpdateCom{com_num}{entity_name}Command, Result<Com{com_num}{entity_name}Response>>
{{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom{com_num}{entity_name}Handler> _logger;

    public UpdateCom{com_num}{entity_name}Handler(PCMDbContext context, ILogger<UpdateCom{com_num}{entity_name}Handler> logger)
    {{
        _context = context;
        _logger = logger;
    }}

    public async Task<Result<Com{com_num}{entity_name}Response>> Handle(UpdateCom{com_num}{entity_name}Command request, CancellationToken cancellationToken)
    {{
        try
        {{
            _logger.LogInformation("Actualizando registro Com{com_num}{entity_name} {{Id}}", request.{pk_name});

            var entity = await _context.Com{com_num}{entity_name}
                .FirstOrDefaultAsync(x => x.{pk_name} == request.{pk_name}, cancellationToken);

            if (entity == null)
            {{
                return Result<Com{com_num}{entity_name}Response>.Failure($"Registro con ID {{request.{pk_name}}} no encontrado");
            }}

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos
{update_fields}
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com{com_num}{entity_name}Response
            {{
                {pk_name} = entity.{pk_name},
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
{response_fields}            }};

            return Result<Com{com_num}{entity_name}Response>.Success(response);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al actualizar Com{com_num}{entity_name}");
            return Result<Com{com_num}{entity_name}Response>.Failure($"Error al actualizar registro: {{ex.Message}}");
        }}
    }}
}}
"""

def generate_get_handler(com_num):
    entity_name = entity_names[com_num]
    pk_name = pk_names[com_num]
    fields = com_specific_fields[com_num]
    
    response_fields = ""
    for _, field_name, _ in fields:
        response_fields += f"                {field_name} = entity.{field_name},\n"
    
    return f"""using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com{com_num}{entity_name}.Queries.GetCom{com_num}{entity_name};
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com{com_num}{entity_name};

public class GetCom{com_num}{entity_name}Handler : IRequestHandler<GetCom{com_num}{entity_name}Query, Result<Com{com_num}{entity_name}Response>>
{{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom{com_num}{entity_name}Handler> _logger;

    public GetCom{com_num}{entity_name}Handler(PCMDbContext context, ILogger<GetCom{com_num}{entity_name}Handler> logger)
    {{
        _context = context;
        _logger = logger;
    }}

    public async Task<Result<Com{com_num}{entity_name}Response>> Handle(GetCom{com_num}{entity_name}Query request, CancellationToken cancellationToken)
    {{
        try
        {{
            _logger.LogInformation("Obteniendo Com{com_num}{entity_name} para Compromiso {{CompromisoId}}, Entidad {{EntidadId}}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com{com_num}{entity_name}
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {{
                return Result<Com{com_num}{entity_name}Response>.Failure("Registro no encontrado");
            }}

            var response = new Com{com_num}{entity_name}Response
            {{
                {pk_name} = entity.{pk_name},
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
{response_fields}            }};

            return Result<Com{com_num}{entity_name}Response>.Success(response);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al obtener Com{com_num}{entity_name}");
            return Result<Com{com_num}{entity_name}Response>.Failure($"Error al obtener registro: {{ex.Message}}");
        }}
    }}
}}
"""

# Directorio base
base_dir = Path(__file__).parent

# Generar todos los archivos
for com_num in range(11, 22):
    entity_name = entity_names[com_num]
    
    print(f"Generando archivos para Com{com_num}{entity_name}...")
    
    # Commands
    create_cmd_path = base_dir / f"PCM.Application/Features/Com{com_num}{entity_name}/Commands/CreateCom{com_num}{entity_name}/CreateCom{com_num}{entity_name}Command.cs"
    create_cmd_path.parent.mkdir(parents=True, exist_ok=True)
    create_cmd_path.write_text(generate_create_command(com_num))
    
    update_cmd_path = base_dir / f"PCM.Application/Features/Com{com_num}{entity_name}/Commands/UpdateCom{com_num}{entity_name}/UpdateCom{com_num}{entity_name}Command.cs"
    update_cmd_path.parent.mkdir(parents=True, exist_ok=True)
    update_cmd_path.write_text(generate_update_command(com_num))
    
    # Queries
    get_query_path = base_dir / f"PCM.Application/Features/Com{com_num}{entity_name}/Queries/GetCom{com_num}{entity_name}/GetCom{com_num}{entity_name}Query.cs"
    get_query_path.parent.mkdir(parents=True, exist_ok=True)
    get_query_path.write_text(generate_get_query(com_num))
    
    # Handlers
    create_handler_path = base_dir / f"PCM.Infrastructure/Handlers/Com{com_num}{entity_name}/CreateCom{com_num}{entity_name}Handler.cs"
    create_handler_path.parent.mkdir(parents=True, exist_ok=True)
    create_handler_path.write_text(generate_create_handler(com_num))
    
    update_handler_path = base_dir / f"PCM.Infrastructure/Handlers/Com{com_num}{entity_name}/UpdateCom{com_num}{entity_name}Handler.cs"
    update_handler_path.parent.mkdir(parents=True, exist_ok=True)
    update_handler_path.write_text(generate_update_handler(com_num))
    
    get_handler_path = base_dir / f"PCM.Infrastructure/Handlers/Com{com_num}{entity_name}/GetCom{com_num}{entity_name}Handler.cs"
    get_handler_path.parent.mkdir(parents=True, exist_ok=True)
    get_handler_path.write_text(generate_get_handler(com_num))
    
    print(f"  ✓ Commands, Queries y Handlers generados")

print("\n" + "=" * 80)
print("✅ Todos los archivos generados correctamente!")
print("=" * 80)
