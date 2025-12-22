using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com15CSIRTInstitucional.Commands.CreateCom15CSIRTInstitucional;
using PCM.Application.Features.Com15CSIRTInstitucional.Commands.UpdateCom15CSIRTInstitucional;
using PCM.Application.Features.Com15CSIRTInstitucional.Queries.GetCom15CSIRTInstitucional;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com15CSIRTInstitucionalController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com15CSIRTInstitucionalController> _logger;

    public Com15CSIRTInstitucionalController(IMediator mediator, ILogger<Com15CSIRTInstitucionalController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom15CSIRTInstitucionalQuery
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
            _logger.LogError(ex, "Error getting Com15CSIRTInstitucional");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom15CSIRTInstitucionalCommand command)
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
            _logger.LogError(ex, "Error creating Com15CSIRTInstitucional");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom15CSIRTInstitucionalCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            command.ComcsirtEntId = id;
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
            _logger.LogError(ex, "Error updating Com15CSIRTInstitucional");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
