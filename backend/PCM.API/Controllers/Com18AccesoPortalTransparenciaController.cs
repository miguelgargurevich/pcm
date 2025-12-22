using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com18AccesoPortalTransparencia.Commands.CreateCom18AccesoPortalTransparencia;
using PCM.Application.Features.Com18AccesoPortalTransparencia.Commands.UpdateCom18AccesoPortalTransparencia;
using PCM.Application.Features.Com18AccesoPortalTransparencia.Queries.GetCom18AccesoPortalTransparencia;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com18AccesoPortalTransparenciaController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com18AccesoPortalTransparenciaController> _logger;

    public Com18AccesoPortalTransparenciaController(IMediator mediator, ILogger<Com18AccesoPortalTransparenciaController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom18AccesoPortalTransparenciaQuery
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
            _logger.LogError(ex, "Error getting Com18AccesoPortalTransparencia");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom18AccesoPortalTransparenciaCommand command)
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
            _logger.LogError(ex, "Error creating Com18AccesoPortalTransparencia");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom18AccesoPortalTransparenciaCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            command.ComsapteEntId = id;
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
            _logger.LogError(ex, "Error updating Com18AccesoPortalTransparencia");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
