using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com17PlanTransicionIPv6.Commands.CreateCom17PlanTransicionIPv6;
using PCM.Application.Features.Com17PlanTransicionIPv6.Commands.UpdateCom17PlanTransicionIPv6;
using PCM.Application.Features.Com17PlanTransicionIPv6.Queries.GetCom17PlanTransicionIPv6;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Com17PlanTransicionIPv6Controller : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<Com17PlanTransicionIPv6Controller> _logger;

    public Com17PlanTransicionIPv6Controller(IMediator mediator, ILogger<Com17PlanTransicionIPv6Controller> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom17PlanTransicionIPv6Query
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
            _logger.LogError(ex, "Error getting Com17PlanTransicionIPv6");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom17PlanTransicionIPv6Command command)
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
            _logger.LogError(ex, "Error creating Com17PlanTransicionIPv6");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom17PlanTransicionIPv6Command command)
    {
        try
        {
            command.Comptipv6EntId = id;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Com17PlanTransicionIPv6");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
