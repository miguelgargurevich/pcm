using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Permisos.Queries.GetPermisosByPerfil;
using PCM.Application.Features.Permisos.Queries.VerificarPermiso;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PermisosController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PermisosController> _logger;

    public PermisosController(IMediator mediator, ILogger<PermisosController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtener todos los permisos de un perfil
    /// </summary>
    [HttpGet("perfil/{perfilId}")]
    public async Task<IActionResult> GetPermisosByPerfil(int perfilId)
    {
        var query = new GetPermisosByPerfilQuery { PerfilId = perfilId };
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Verificar si un perfil tiene permiso para acceder a un módulo y realizar una acción
    /// </summary>
    [HttpGet("verificar")]
    public async Task<IActionResult> VerificarPermiso(
        [FromQuery] int perfilId,
        [FromQuery] string codigoModulo,
        [FromQuery] string? accion = null)
    {
        var query = new VerificarPermisoQuery
        {
            PerfilId = perfilId,
            CodigoModulo = codigoModulo,
            Accion = accion
        };

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
