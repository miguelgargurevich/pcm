using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.CreateCom16SistemaGestionSeguridad;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.UpdateCom16SistemaGestionSeguridad;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Queries.GetCom16SistemaGestionSeguridad;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com16SistemaGestionSeguridadController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com16SistemaGestionSeguridadController> _logger;

    public Com16SistemaGestionSeguridadController(IMediator mediator, ILogger<Com16SistemaGestionSeguridadController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom16SistemaGestionSeguridadQuery
            {
                CompromisoId = compromisoId,
                EntidadId = entidadId
            };

            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Com16SistemaGestionSeguridad");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom16SistemaGestionSeguridadCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Com16SistemaGestionSeguridad");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom16SistemaGestionSeguridadCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            command.ComsgsiEntId = id;
            command.UserId = userId;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Com16SistemaGestionSeguridad");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
