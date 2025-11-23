using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.CreateCom13InteroperabilidadPIDE;
using PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.UpdateCom13InteroperabilidadPIDE;
using PCM.Application.Features.Com13InteroperabilidadPIDE.Queries.GetCom13InteroperabilidadPIDE;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com13InteroperabilidadPIDEController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com13InteroperabilidadPIDEController> _logger;

    public Com13InteroperabilidadPIDEController(IMediator mediator, ILogger<Com13InteroperabilidadPIDEController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom13InteroperabilidadPIDEQuery
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
            _logger.LogError(ex, "Error getting Com13InteroperabilidadPIDE");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom13InteroperabilidadPIDECommand command)
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
            _logger.LogError(ex, "Error creating Com13InteroperabilidadPIDE");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom13InteroperabilidadPIDECommand command)
    {
        try
        {
            command.CompcpideEntId = id;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Com13InteroperabilidadPIDE");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
