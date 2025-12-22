using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com14OficialSeguridadDigital.Commands.CreateCom14OficialSeguridadDigital;
using PCM.Application.Features.Com14OficialSeguridadDigital.Commands.UpdateCom14OficialSeguridadDigital;
using PCM.Application.Features.Com14OficialSeguridadDigital.Queries.GetCom14OficialSeguridadDigital;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com14OficialSeguridadDigitalController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com14OficialSeguridadDigitalController> _logger;

    public Com14OficialSeguridadDigitalController(IMediator mediator, ILogger<Com14OficialSeguridadDigitalController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom14OficialSeguridadDigitalQuery
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
            _logger.LogError(ex, "Error getting Com14OficialSeguridadDigital");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom14OficialSeguridadDigitalCommand command)
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
            _logger.LogError(ex, "Error creating Com14OficialSeguridadDigital");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom14OficialSeguridadDigitalCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            command.ComdoscdEntId = id;
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
            _logger.LogError(ex, "Error updating Com14OficialSeguridadDigital");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
