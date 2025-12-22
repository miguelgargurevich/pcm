using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com8PublicacionTUPA.Commands.CreateCom8PublicacionTUPA;
using PCM.Application.Features.Com8PublicacionTUPA.Commands.UpdateCom8PublicacionTUPA;
using PCM.Application.Features.Com8PublicacionTUPA.Queries.GetCom8PublicacionTUPA;
using System.Security.Claims;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class Com8PublicacionTUPAController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com8PublicacionTUPAController> _logger;

    public Com8PublicacionTUPAController(IMediator mediator, ILogger<Com8PublicacionTUPAController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            _logger.LogInformation("GET Com8PublicacionTUPA - CompromisoId: {CompromisoId}, EntidadId: {EntidadId}", compromisoId, entidadId);

            var query = new GetCom8PublicacionTUPAQuery
            {
                CompromisoId = compromisoId,
                EntidadId = entidadId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com8PublicacionTUPA");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom8PublicacionTUPACommand command)
    {
        try
        {
            _logger.LogInformation("POST Com8PublicacionTUPA - Creando nuevo registro");

            var result = await _mediator.Send(command);

            if (result.IsSuccess)
                return Ok(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com8PublicacionTUPA");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom8PublicacionTUPACommand command)
    {
        try
        {
            _logger.LogInformation("PUT Com8PublicacionTUPA - ID: {Id}", id);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }
            
            command.ComptupaEntId = id;
            command.UserId = userId;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
                return Ok(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com8PublicacionTUPA");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }
}
