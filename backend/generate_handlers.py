#!/usr/bin/env python3
"""
Script para generar Handlers para compromisos 11-21
"""
import os

BASE_DIR = "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/backend"

COMPROMISOS = {
    11: {"name": "Com11AportacionGeoPeru", "pk": "ComagpEntId", "entity": "Com11AportacionGeoPeru", "dbset": "Com11AportacionGeoPeru"},
    12: {"name": "Com12ResponsableSoftwarePublico", "pk": "ComrspEntId", "entity": "Com12ResponsableSoftwarePublico", "dbset": "Com12ResponsableSoftwarePublico"},
    13: {"name": "Com13InteroperabilidadPIDE", "pk": "ComipideEntId", "entity": "Com13InteroperabilidadPIDE", "dbset": "Com13InteroperabilidadPIDE"},
    14: {"name": "Com14OficialSeguridadDigital", "pk": "ComoscdEntId", "entity": "Com14OficialSeguridadDigital", "dbset": "Com14OficialSeguridadDigital"},
    15: {"name": "Com15CSIRTInstitucional", "pk": "ComcsirtEntId", "entity": "Com15CSIRTInstitucional", "dbset": "Com15CSIRTInstitucional"},
    16: {"name": "Com16SistemaGestionSeguridad", "pk": "ComsgsiEntId", "entity": "Com16SistemaGestionSeguridad", "dbset": "Com16SistemaGestionSeguridad"},
    17: {"name": "Com17PlanTransicionIPv6", "pk": "Comptipv6EntId", "entity": "Com17PlanTransicionIPv6", "dbset": "Com17PlanTransicionIPv6"},
    18: {"name": "Com18AccesoPortalTransparencia", "pk": "ComapteEntId", "entity": "Com18AccesoPortalTransparencia", "dbset": "Com18AccesoPortalTransparencia"},
    19: {"name": "Com19EncuestaNacionalGobDigital", "pk": "ComenadEntId", "entity": "Com19EncuestaNacionalGobDigital", "dbset": "Com19EncuestaNacionalGobDigital"},
    20: {"name": "Com20DigitalizacionServiciosFacilita", "pk": "ComdsfpEntId", "entity": "Com20DigitalizacionServiciosFacilita", "dbset": "Com20DigitalizacionServiciosFacilita"},
    21: {"name": "Com21OficialGobiernoDatos", "pk": "ComogdEntId", "entity": "Com21OficialGobiernoDatos", "dbset": "Com21OficialGobiernoDatos"},
}

def generate_get_handler(num, info):
    """Genera GetHandler"""
    name = info["name"]
    pk = info["pk"]
    dbset = info["dbset"]
    
    content = f'''using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.{name}.Queries.Get{name};
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.{name};

public class Get{name}Handler : IRequestHandler<Get{name}Query, Result<{name}Response>>
{{
    private readonly PCMDbContext _context;
    private readonly ILogger<Get{name}Handler> _logger;

    public Get{name}Handler(PCMDbContext context, ILogger<Get{name}Handler> logger)
    {{
        _context = context;
        _logger = logger;
    }}

    public async Task<Result<{name}Response>> Handle(Get{name}Query request, CancellationToken cancellationToken)
    {{
        try
        {{
            _logger.LogInformation("Buscando {name} para CompromisoId: {{CompromisoId}}, EntidadId: {{EntidadId}}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.{dbset}
                .Where(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {{
                _logger.LogInformation("No se encontró registro {name}");
                return Result<{name}Response>.Failure("No se encontró registro");
            }}

            var response = new {name}Response
            {{
                {pk} = entity.{pk},
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                Activo = entity.Activo
            }};

            return Result<{name}Response>.Success(response);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al obtener {name}");
            return Result<{name}Response>.Failure($"Error al obtener registro: {{ex.Message}}");
        }}
    }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.Infrastructure/Handlers/{name}/Get{name}Handler.cs"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created Get{name}Handler.cs")

def generate_create_handler(num, info):
    """Genera CreateHandler"""
    name = info["name"]
    pk = info["pk"]
    entity = info["entity"]
    
    content = f'''using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.{name}.Commands.Create{name};
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using {name}Entity = PCM.Domain.Entities.{entity};

namespace PCM.Infrastructure.Handlers.{name};

public class Create{name}Handler : IRequestHandler<Create{name}Command, Result<{name}Response>>
{{
    private readonly PCMDbContext _context;
    private readonly ILogger<Create{name}Handler> _logger;

    public Create{name}Handler(PCMDbContext context, ILogger<Create{name}Handler> logger)
    {{
        _context = context;
        _logger = logger;
    }}

    public async Task<Result<{name}Response>> Handle(Create{name}Command request, CancellationToken cancellationToken)
    {{
        try
        {{
            _logger.LogInformation("Creando registro {name} para Compromiso {{CompromisoId}}, Entidad {{EntidadId}}", 
                request.CompromisoId, request.EntidadId);

            var entity = new {name}Entity
            {{
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                CriteriosEvaluados = request.CriteriosEvaluados,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                Activo = true
            }};

            _context.{info["dbset"]}.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new {name}Response
            {{
                {pk} = entity.{pk},
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                Activo = entity.Activo
            }};

            return Result<{name}Response>.Success(response);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al crear {name}");
            return Result<{name}Response>.Failure($"Error al crear registro: {{ex.Message}}");
        }}
    }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.Infrastructure/Handlers/{name}/Create{name}Handler.cs"
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created Create{name}Handler.cs")

def generate_update_handler(num, info):
    """Genera UpdateHandler"""
    name = info["name"]
    pk = info["pk"]
    
    content = f'''using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.{name}.Commands.Update{name};
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.{name};

public class Update{name}Handler : IRequestHandler<Update{name}Command, Result<{name}Response>>
{{
    private readonly PCMDbContext _context;
    private readonly ILogger<Update{name}Handler> _logger;

    public Update{name}Handler(PCMDbContext context, ILogger<Update{name}Handler> logger)
    {{
        _context = context;
        _logger = logger;
    }}

    public async Task<Result<{name}Response>> Handle(Update{name}Command request, CancellationToken cancellationToken)
    {{
        try
        {{
            _logger.LogInformation("Actualizando registro {name} con ID: {{{pk}}}", request.{pk});

            var entity = await _context.{info["dbset"]}
                .FirstOrDefaultAsync(x => x.{pk} == request.{pk}, cancellationToken);

            if (entity == null)
            {{
                _logger.LogWarning("No se encontró el registro {name} con ID: {{{pk}}}", request.{pk});
                return Result<{name}Response>.Failure("Registro no encontrado");
            }}

            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (request.EtapaFormulario != null) entity.EtapaFormulario = request.EtapaFormulario;
            if (request.Estado != null) entity.Estado = request.Estado;
            if (request.CriteriosEvaluados != null) entity.CriteriosEvaluados = request.CriteriosEvaluados;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            var response = new {name}Response
            {{
                {pk} = entity.{pk},
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                Activo = entity.Activo
            }};

            return Result<{name}Response>.Success(response);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al actualizar {name}");
            return Result<{name}Response>.Failure($"Error al actualizar registro: {{ex.Message}}");
        }}
    }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.Infrastructure/Handlers/{name}/Update{name}Handler.cs"
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created Update{name}Handler.cs")

print("=== Generando Handlers para Com11-Com21 ===\n")

for num, info in COMPROMISOS.items():
    print(f"\n--- Procesando Com{num} ({info['name']}) ---")
    generate_get_handler(num, info)
    generate_create_handler(num, info)
    generate_update_handler(num, info)

print("\n=== ¡Handlers generados! ===")
