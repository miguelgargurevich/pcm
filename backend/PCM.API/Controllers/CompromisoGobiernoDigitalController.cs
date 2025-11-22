using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Commands.CreateCompromiso;
using PCM.Application.Features.CompromisosGobiernoDigital.Commands.DeleteCompromiso;
using PCM.Application.Features.CompromisosGobiernoDigital.Commands.UpdateCompromiso;
using PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetAllCompromisos;
using PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetCompromisoById;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompromisoGobiernoDigitalController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CompromisoGobiernoDigitalController> _logger;

    public CompromisoGobiernoDigitalController(IMediator mediator, ILogger<CompromisoGobiernoDigitalController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los compromisos de gobierno digital con filtros opcionales
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllCompromisos(
        [FromQuery] string? nombre,
        [FromQuery] string? alcance,
        [FromQuery] int? estado)
    {
        try
        {
            var query = new GetAllCompromisosQuery
            {
                Nombre = nombre,
                Alcance = alcance,
                Estado = estado
            };

            var result = await _mediator.Send(query);

            if (!result.IsSuccess)
            {
                return BadRequest(new { isSuccess = false, message = result.Message });
            }

            return Ok(new { isSuccess = true, data = result.Data });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting compromisos");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene un compromiso específico por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompromisoById(int id)
    {
        try
        {
            var query = new GetCompromisoByIdQuery { CompromisoId = id };
            var result = await _mediator.Send(query);

            if (!result.IsSuccess)
            {
                return NotFound(new { isSuccess = false, message = result.Message });
            }

            return Ok(new { isSuccess = true, data = result.Data });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting compromiso {CompromisoId}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Crea un nuevo compromiso de gobierno digital
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateCompromiso([FromBody] CreateCompromisoRequest request)
    {
        try
        {
            var command = new CreateCompromisoCommand
            {
                NombreCompromiso = request.NombreCompromiso,
                Descripcion = request.Descripcion,
                Alcances = request.Alcances,
                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin,
                Activo = request.Activo,
                Normativas = request.Normativas,
                CriteriosEvaluacion = request.CriteriosEvaluacion
            };

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(new { isSuccess = false, message = result.Message });
            }

            return CreatedAtAction(
                nameof(GetCompromisoById),
                new { id = result.Data!.CompromisoId },
                new { isSuccess = true, data = result.Data, message = "Compromiso creado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating compromiso");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Actualiza un compromiso existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCompromiso(int id, [FromBody] UpdateCompromisoRequest request)
    {
        try
        {
            var command = new UpdateCompromisoCommand
            {
                CompromisoId = id,
                NombreCompromiso = request.NombreCompromiso,
                Descripcion = request.Descripcion,
                Alcances = request.Alcances,
                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin,
                Activo = request.Activo,
                Normativas = request.Normativas,
                CriteriosEvaluacion = request.CriteriosEvaluacion
            };

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(new { isSuccess = false, message = result.Message });
            }

            return Ok(new { isSuccess = true, data = result.Data, message = "Compromiso actualizado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating compromiso {CompromisoId}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Elimina un compromiso
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompromiso(int id)
    {
        try
        {
            var command = new DeleteCompromisoCommand { CompromisoId = id };
            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(new { isSuccess = false, message = result.Message });
            }

            return Ok(new { isSuccess = true, message = "Compromiso eliminado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting compromiso {CompromisoId}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}
