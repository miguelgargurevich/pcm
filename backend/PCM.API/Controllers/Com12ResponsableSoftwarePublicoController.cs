using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com12ResponsableSoftwarePublico.Commands.CreateCom12ResponsableSoftwarePublico;
using PCM.Application.Features.Com12ResponsableSoftwarePublico.Commands.UpdateCom12ResponsableSoftwarePublico;
using PCM.Application.Features.Com12ResponsableSoftwarePublico.Queries.GetCom12ResponsableSoftwarePublico;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com12ResponsableSoftwarePublicoController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com12ResponsableSoftwarePublicoController> _logger;

    public Com12ResponsableSoftwarePublicoController(IMediator mediator, ILogger<Com12ResponsableSoftwarePublicoController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom12ResponsableSoftwarePublicoQuery
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
            _logger.LogError(ex, "Error getting Com12ResponsableSoftwarePublico");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom12ResponsableSoftwarePublicoCommand command)
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
            _logger.LogError(ex, "Error creating Com12ResponsableSoftwarePublico");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom12ResponsableSoftwarePublicoCommand command)
    {
        try
        {
            command.ComdrspEntId = id;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Com12ResponsableSoftwarePublico");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
