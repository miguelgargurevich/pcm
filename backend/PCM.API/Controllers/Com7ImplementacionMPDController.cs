using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com7ImplementacionMPD.Commands.CreateCom7ImplementacionMPD;
using PCM.Application.Features.Com7ImplementacionMPD.Commands.UpdateCom7ImplementacionMPD;
using PCM.Application.Features.Com7ImplementacionMPD.Queries.GetCom7ImplementacionMPD;
using System.Security.Claims;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class Com7ImplementacionMPDController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com7ImplementacionMPDController> _logger;

    public Com7ImplementacionMPDController(IMediator mediator, ILogger<Com7ImplementacionMPDController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            _logger.LogInformation("GET Com7ImplementacionMPD - CompromisoId: {CompromisoId}, EntidadId: {EntidadId}", compromisoId, entidadId);

            var query = new GetCom7ImplementacionMPDQuery
            {
                CompromisoId = compromisoId,
                EntidadId = entidadId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com7ImplementacionMPD");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom7ImplementacionMPDCommand command)
    {
        try
        {
            _logger.LogInformation("POST Com7ImplementacionMPD - Creando nuevo registro");

            var result = await _mediator.Send(command);

            if (result.IsSuccess)
                return Ok(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com7ImplementacionMPD");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom7ImplementacionMPDCommand command)
    {
        try
        {
            _logger.LogInformation("PUT Com7ImplementacionMPD - ID: {Id}", id);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }
            
            command.ComimpdEntId = id;
            command.UserId = userId;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
                return Ok(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com7ImplementacionMPD");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }
}
