using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.EvaluacionCriterios;
using PCM.Application.Features.EvaluacionCriterios.Commands.SaveCriterios;
using PCM.Application.Features.EvaluacionCriterios.Queries.GetCriteriosByEntidad;

namespace PCM.API.Controllers;

/// <summary>
/// Controller para gestionar las evaluaciones de criterios por entidad y compromiso.
/// Permite obtener y guardar las respuestas de criterios del Paso 2.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EvaluacionCriteriosController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<EvaluacionCriteriosController> _logger;

    public EvaluacionCriteriosController(IMediator mediator, ILogger<EvaluacionCriteriosController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene los criterios evaluados de una entidad para un compromiso específico.
    /// Devuelve todos los criterios del catálogo con el estado de cumplimiento de la entidad.
    /// </summary>
    /// <param name="entidadId">ID de la entidad (UUID)</param>
    /// <param name="compromisoId">ID del compromiso (1-21)</param>
    /// <returns>Lista de criterios con sus respuestas</returns>
    [HttpGet("{entidadId}/{compromisoId}")]
    public async Task<IActionResult> GetCriteriosByEntidad(Guid entidadId, long compromisoId)
    {
        _logger.LogInformation("GET /api/evaluacioncriterios/{EntidadId}/{CompromisoId}", entidadId, compromisoId);

        var query = new GetCriteriosByEntidadQuery
        {
            EntidadId = entidadId,
            CompromisoId = compromisoId
        };

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Message });
        }

        return Ok(new { success = true, data = result.Data });
    }

    /// <summary>
    /// Guarda o actualiza los criterios evaluados de una entidad para un compromiso.
    /// Si el criterio ya tiene una respuesta, la actualiza. Si no, la crea.
    /// </summary>
    /// <param name="request">Request con entidadId, compromisoId y lista de criterios</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPost]
    public async Task<IActionResult> SaveCriterios([FromBody] SaveCriteriosRequest request)
    {
        _logger.LogInformation("POST /api/evaluacioncriterios - EntidadId: {EntidadId}, CompromisoId: {CompromisoId}, Criterios: {Count}",
            request.EntidadId, request.CompromisoId, request.Criterios?.Count ?? 0);

        var command = new SaveCriteriosCommand
        {
            EntidadId = request.EntidadId,
            CompromisoId = request.CompromisoId,
            Criterios = request.Criterios ?? new List<CriterioEvaluadoDto>()
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Message });
        }

        return Ok(new { success = true, data = result.Data });
    }

    /// <summary>
    /// Alias PUT para actualizar criterios (mismo comportamiento que POST)
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> UpdateCriterios([FromBody] SaveCriteriosRequest request)
    {
        return await SaveCriterios(request);
    }
}
