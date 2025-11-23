#!/usr/bin/env python3
"""
Script para generar Controllers para compromisos 11-21
"""
import os

BASE_DIR = "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/backend"

COMPROMISOS = {
    11: {"name": "Com11AportacionGeoPeru", "pk": "ComagpEntId", "route": "com11-aportacion-geoperu"},
    12: {"name": "Com12ResponsableSoftwarePublico", "pk": "ComrspEntId", "route": "com12-responsable-software-publico"},
    13: {"name": "Com13InteroperabilidadPIDE", "pk": "ComipideEntId", "route": "com13-interoperabilidad-pide"},
    14: {"name": "Com14OficialSeguridadDigital", "pk": "ComoscdEntId", "route": "com14-oficial-seguridad-digital"},
    15: {"name": "Com15CSIRTInstitucional", "pk": "ComcsirtEntId", "route": "com15-csirt-institucional"},
    16: {"name": "Com16SistemaGestionSeguridad", "pk": "ComsgsiEntId", "route": "com16-sistema-gestion-seguridad"},
    17: {"name": "Com17PlanTransicionIPv6", "pk": "Comptipv6EntId", "route": "com17-plan-transicion-ipv6"},
    18: {"name": "Com18AccesoPortalTransparencia", "pk": "ComapteEntId", "route": "com18-acceso-portal-transparencia"},
    19: {"name": "Com19EncuestaNacionalGobDigital", "pk": "ComenadEntId", "route": "com19-encuesta-nacional-gob-digital"},
    20: {"name": "Com20DigitalizacionServiciosFacilita", "pk": "ComdsfpEntId", "route": "com20-digitalizacion-servicios-facilita"},
    21: {"name": "Com21OficialGobiernoDatos", "pk": "ComogdEntId", "route": "com21-oficial-gobierno-datos"},
}

def generate_controller(num, info):
    """Genera Controller"""
    name = info["name"]
    pk = info["pk"]
    route = info["route"]
    
    content = f'''using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.{name}.Commands.Create{name};
using PCM.Application.Features.{name}.Commands.Update{name};
using PCM.Application.Features.{name}.Queries.Get{name};

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class {name}Controller : ControllerBase
{{
    private readonly IMediator _mediator;
    private readonly ILogger<{name}Controller> _logger;

    public {name}Controller(IMediator mediator, ILogger<{name}Controller> logger)
    {{
        _mediator = mediator;
        _logger = logger;
    }}

    [HttpGet("{{compromisoId}}/entidad/{{entidadId}}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {{
        try
        {{
            var query = new Get{name}Query
            {{
                CompromisoId = compromisoId,
                EntidadId = entidadId
            }};

            var result = await _mediator.Send(query);

            if (!result.IsSuccess)
            {{
                return NotFound(new {{ message = result.Error }});
            }}

            return Ok(result.Value);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al obtener {name}");
            return StatusCode(500, new {{ message = "Error interno del servidor" }});
        }}
    }}

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Create{name}Command command)
    {{
        try
        {{
            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {{
                return BadRequest(new {{ message = result.Error }});
            }}

            return CreatedAtAction(nameof(GetByEntidad), 
                new {{ compromisoId = result.Value.CompromisoId, entidadId = result.Value.EntidadId }}, 
                result.Value);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al crear {name}");
            return StatusCode(500, new {{ message = "Error interno del servidor" }});
        }}
    }}

    [HttpPut("{{id}}")]
    public async Task<IActionResult> Update(long id, [FromBody] Update{name}Command command)
    {{
        try
        {{
            if (id != command.{pk})
            {{
                return BadRequest(new {{ message = "El ID no coincide" }});
            }}

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {{
                return BadRequest(new {{ message = result.Error }});
            }}

            return Ok(result.Value);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error al actualizar {name}");
            return StatusCode(500, new {{ message = "Error interno del servidor" }});
        }}
    }}
}}
'''
    
    path = f"{BASE_DIR}/PCM.API/Controllers/{name}Controller.cs"
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created {name}Controller.cs")

print("=== Generando Controllers para Com11-Com21 ===\n")

for num, info in COMPROMISOS.items():
    print(f"Procesando Com{num} ({info['name']})...")
    generate_controller(num, info)

print("\n=== ¡Controllers generados! ===")
