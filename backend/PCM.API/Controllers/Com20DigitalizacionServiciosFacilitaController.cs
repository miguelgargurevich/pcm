using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Commands.CreateCom20DigitalizacionServiciosFacilita;
using PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Commands.UpdateCom20DigitalizacionServiciosFacilita;
using PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Queries.GetCom20DigitalizacionServiciosFacilita;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com20DigitalizacionServiciosFacilitaController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com20DigitalizacionServiciosFacilitaController> _logger;

    public Com20DigitalizacionServiciosFacilitaController(IMediator mediator, ILogger<Com20DigitalizacionServiciosFacilitaController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom20DigitalizacionServiciosFacilitaQuery
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
            _logger.LogError(ex, "Error getting Com20DigitalizacionServiciosFacilita");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom20DigitalizacionServiciosFacilitaCommand command)
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
            _logger.LogError(ex, "Error creating Com20DigitalizacionServiciosFacilita");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom20DigitalizacionServiciosFacilitaCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            command.ComdsfpeEntId = id;
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
            _logger.LogError(ex, "Error updating Com20DigitalizacionServiciosFacilita");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
