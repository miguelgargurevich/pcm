using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Dashboard.Queries.GetDashboardStats;
using PCM.Application.Features.Dashboard.Queries.GetEntidadesStats;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var entidadIdClaim = User.FindFirst("entidad_id")?.Value;
        Guid? entidadId = string.IsNullOrEmpty(entidadIdClaim) ? null : Guid.Parse(entidadIdClaim);
        var perfilNombre = User.FindFirst("perfil_nombre")?.Value;

        var result = await _mediator.Send(new GetDashboardStatsQuery(entidadId, perfilNombre));
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet("entidades-stats")]
    public async Task<IActionResult> GetEntidadesStats()
    {
        var result = await _mediator.Send(new GetEntidadesStatsQuery());
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}
