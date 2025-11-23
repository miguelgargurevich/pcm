#!/usr/bin/env python3
"""
Script to regenerate Controllers for Com11-Com21 with correct Result pattern
"""

compromisos = [
    {
        "number": "11",
        "name": "AportacionGeoPeru",
        "full_name": "Com11AportacionGeoPeru",
        "id_field": "ComagpEntId"
    },
    {
        "number": "12",
        "name": "ResponsableSoftwarePublico",
        "full_name": "Com12ResponsableSoftwarePublico",
        "id_field": "ComrspEntId"
    },
    {
        "number": "13",
        "name": "InteroperabilidadPIDE",
        "full_name": "Com13InteroperabilidadPIDE",
        "id_field": "ComipideEntId"
    },
    {
        "number": "14",
        "name": "OficialSeguridadDigital",
        "full_name": "Com14OficialSeguridadDigital",
        "id_field": "ComoscdEntId"
    },
    {
        "number": "15",
        "name": "CSIRTInstitucional",
        "full_name": "Com15CSIRTInstitucional",
        "id_field": "ComcsirtEntId"
    },
    {
        "number": "16",
        "name": "SistemaGestionSeguridad",
        "full_name": "Com16SistemaGestionSeguridad",
        "id_field": "ComsgsiEntId"
    },
    {
        "number": "17",
        "name": "PlanTransicionIPv6",
        "full_name": "Com17PlanTransicionIPv6",
        "id_field": "Comptipv6EntId"
    },
    {
        "number": "18",
        "name": "AccesoPortalTransparencia",
        "full_name": "Com18AccesoPortalTransparencia",
        "id_field": "ComapteEntId"
    },
    {
        "number": "19",
        "name": "EncuestaNacionalGobDigital",
        "full_name": "Com19EncuestaNacionalGobDigital",
        "id_field": "ComenadEntId"
    },
    {
        "number": "20",
        "name": "DigitalizacionServiciosFacilita",
        "full_name": "Com20DigitalizacionServiciosFacilita",
        "id_field": "ComdsfpEntId"
    },
    {
        "number": "21",
        "name": "OficialGobiernoDatos",
        "full_name": "Com21OficialGobiernoDatos",
        "id_field": "ComogdEntId"
    }
]

def generate_controller(comp):
    return f"""using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.{comp['full_name']}.Commands.Create{comp['full_name']};
using PCM.Application.Features.{comp['full_name']}.Commands.Update{comp['full_name']};
using PCM.Application.Features.{comp['full_name']}.Queries.Get{comp['full_name']};

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class {comp['full_name']}Controller : ControllerBase
{{
    private readonly IMediator _mediator;
    private readonly ILogger<{comp['full_name']}Controller> _logger;

    public {comp['full_name']}Controller(IMediator mediator, ILogger<{comp['full_name']}Controller> logger)
    {{
        _mediator = mediator;
        _logger = logger;
    }}

    [HttpGet("{{compromisoId}}/entidad/{{entidadId}}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {{
        try
        {{
            var query = new Get{comp['full_name']}Query
            {{
                CompromisoId = compromisoId,
                EntidadId = entidadId
            }};

            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {{
                return Ok(result);
            }}

            return BadRequest(result);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error getting {comp['full_name']}");
            return StatusCode(500, "Error interno del servidor");
        }}
    }}

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Create{comp['full_name']}Command command)
    {{
        try
        {{
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {{
                return Ok(result);
            }}

            return BadRequest(result);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error creating {comp['full_name']}");
            return StatusCode(500, "Error interno del servidor");
        }}
    }}

    [HttpPut("{{id}}")]
    public async Task<IActionResult> Update(long id, [FromBody] Update{comp['full_name']}Command command)
    {{
        try
        {{
            command.{comp['id_field']} = id;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {{
                return Ok(result);
            }}

            return BadRequest(result);
        }}
        catch (Exception ex)
        {{
            _logger.LogError(ex, "Error updating {comp['full_name']}");
            return StatusCode(500, "Error interno del servidor");
        }}
    }}
}}
"""

def main():
    import os
    
    base_path = "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/backend/PCM.API/Controllers"
    
    for comp in compromisos:
        file_path = os.path.join(base_path, f"{comp['full_name']}Controller.cs")
        content = generate_controller(comp)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated {comp['full_name']}Controller.cs")

if __name__ == "__main__":
    main()
    print("\n✅ All controllers updated successfully!")
