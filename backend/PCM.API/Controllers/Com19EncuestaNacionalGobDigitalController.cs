using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com19EncuestaNacionalGobDigital.Commands.CreateCom19EncuestaNacionalGobDigital;
using PCM.Application.Features.Com19EncuestaNacionalGobDigital.Commands.UpdateCom19EncuestaNacionalGobDigital;
using PCM.Application.Features.Com19EncuestaNacionalGobDigital.Queries.GetCom19EncuestaNacionalGobDigital;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com19EncuestaNacionalGobDigitalController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com19EncuestaNacionalGobDigitalController> _logger;

    public Com19EncuestaNacionalGobDigitalController(IMediator mediator, ILogger<Com19EncuestaNacionalGobDigitalController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom19EncuestaNacionalGobDigitalQuery
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
            _logger.LogError(ex, "Error getting Com19EncuestaNacionalGobDigital");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom19EncuestaNacionalGobDigitalCommand command)
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
            _logger.LogError(ex, "Error creating Com19EncuestaNacionalGobDigital");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom19EncuestaNacionalGobDigitalCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            command.ComrenadEntId = id;
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
            _logger.LogError(ex, "Error updating Com19EncuestaNacionalGobDigital");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
