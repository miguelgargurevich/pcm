using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;
using PCM.Application.Features.Com1LiderGTD.Commands.UpdateCom1LiderGTD;
using PCM.Application.Features.Com1LiderGTD.Queries.GetCom1LiderGTDByEntidad;
using System.Security.Claims;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class Com1LiderGTDController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com1LiderGTDController> _logger;

    public Com1LiderGTDController(IMediator mediator, ILogger<Com1LiderGTDController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene el registro del Compromiso 1 para una entidad
    /// </summary>
    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(int compromisoId, Guid entidadId)
    {
        var query = new GetCom1LiderGTDByEntidadQuery
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
    /// Crea un nuevo registro de Compromiso 1
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom1LiderGTDCommand command)
    {
        // Obtener el UserId del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Usuario no autenticado" });
        }

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
    /// Actualiza un registro de Compromiso 1
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom1LiderGTDCommand command)
    {
        command.ComlgtdEntId = id;

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(new { message = "Registro actualizado exitosamente" });
    }
}
