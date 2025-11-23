using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com6MigracionGobPe.Commands.CreateCom6MigracionGobPe;
using PCM.Application.Features.Com6MigracionGobPe.Commands.UpdateCom6MigracionGobPe;
using PCM.Application.Features.Com6MigracionGobPe.Queries.GetCom6MigracionGobPe;
using System.Security.Claims;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class Com6MigracionGobPeController : ControllerBase
{
    private readonly IMediator _mediator;

    public Com6MigracionGobPeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        var query = new GetCom6MigracionGobPeQuery
        {
            CompromisoId = compromisoId,
            EntidadId = entidadId
        };

        var result = await _mediator.Send(query);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom6MigracionGobPeCommand command)
    {
        var entidadIdClaim = User.FindFirst("entidad_id")?.Value;
        if (string.IsNullOrEmpty(entidadIdClaim) || !Guid.TryParse(entidadIdClaim, out var entidadId))
        {
            return Unauthorized(new { success = false, message = "Token inválido o sin entidad_id" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { success = false, message = "Token inválido o sin user_id" });
        }

        command.EntidadId = entidadId;
        command.UsuarioRegistra = userId;

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom6MigracionGobPeCommand command)
    {
        command.CommpgobpeEntId = id;

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
