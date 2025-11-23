using MediatR;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Catalogos.Queries;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogoController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CatalogoController> _logger;

    public CatalogoController(IMediator mediator, ILogger<CatalogoController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene los elementos de un catálogo específico
    /// </summary>
    /// <param name="nombreTabla">Nombre del catálogo (ej: ROL_FUNCIONARIO, ROL_COMITE, ALCANCE)</param>
    /// <returns>Lista de elementos del catálogo</returns>
    [HttpGet("{nombreTabla}")]
    public async Task<IActionResult> GetCatalogo(string nombreTabla)
    {
        try
        {
            _logger.LogInformation("Obteniendo catálogo: {NombreTabla}", nombreTabla);

            var query = new GetCatalogoQuery { NombreTabla = nombreTabla };
            var result = await _mediator.Send(query);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Catálogo no encontrado: {NombreTabla}", nombreTabla);
                return NotFound(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener catálogo: {NombreTabla}", nombreTabla);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }
}
