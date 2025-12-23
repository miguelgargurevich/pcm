using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;
using PCM.Application.Features.Com3EPGD.Commands.UpdateCom3EPGD;
using PCM.Application.Features.Com3EPGD.Queries.GetCom3EPGDByEntidad;
using System.Security.Claims;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class Com3EPGDController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com3EPGDController> _logger;

    public Com3EPGDController(IMediator mediator, ILogger<Com3EPGDController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene el registro del Compromiso 3 para una entidad
    /// </summary>
    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(int compromisoId, Guid entidadId)
    {
        var query = new GetCom3EPGDByEntidadQuery
        {
            CompromisoId = compromisoId,
            EntidadId = entidadId
        };

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        if (result.Data == null)
        {
            return NotFound(new { message = "No se encontró registro para esta entidad" });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Crea un nuevo registro de Compromiso 3
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom3EPGDCommand command)
    {
        // Obtener user_id del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Usuario no autenticado" });
        }

        // Obtener entidad_id del claim del token JWT
        var entidadIdClaim = User.FindFirst("entidad_id")?.Value;
        if (string.IsNullOrEmpty(entidadIdClaim) || !Guid.TryParse(entidadIdClaim, out var entidadId))
        {
            return BadRequest(new { message = "Usuario sin entidad asignada" });
        }
        
        command.EntidadId = entidadId;
        command.UsuarioRegistra = userId;

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return CreatedAtAction(
            nameof(GetByEntidad),
            new { compromisoId = result.Data!.CompromisoId, entidadId = result.Data.EntidadId },
            result.Data
        );
    }

    /// <summary>
    /// Actualiza un registro de Compromiso 3
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom3EPGDCommand command)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Usuario no autenticado" });
        }
        
        command.ComepgdEntId = id;
        command.UserId = userId;

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result);
    }
}
