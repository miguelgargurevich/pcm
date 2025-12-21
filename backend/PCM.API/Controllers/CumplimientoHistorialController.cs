using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.CumplimientoHistorial;
using PCM.Application.Interfaces;

namespace PCM.API.Controllers;

/// <summary>
/// Controlador para gestionar el historial de cambios de estado de cumplimiento.
/// Permite consultar el historial de transiciones de estado de los compromisos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CumplimientoHistorialController : ControllerBase
{
    private readonly ICumplimientoHistorialService _historialService;
    private readonly ILogger<CumplimientoHistorialController> _logger;

    public CumplimientoHistorialController(
        ICumplimientoHistorialService historialService,
        ILogger<CumplimientoHistorialController> logger)
    {
        _historialService = historialService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene el historial de un cumplimiento específico.
    /// </summary>
    /// <param name="cumplimientoId">ID del cumplimiento</param>
    /// <returns>Lista de registros de historial</returns>
    [HttpGet("cumplimiento/{cumplimientoId:long}")]
    public async Task<IActionResult> GetByCumplimiento(long cumplimientoId)
    {
        try
        {
            var historial = await _historialService.ObtenerHistorialPorCumplimientoAsync(cumplimientoId);
            return Ok(new { success = true, data = historial });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener historial del cumplimiento {CumplimientoId}", cumplimientoId);
            return StatusCode(500, new { success = false, message = "Error al obtener historial" });
        }
    }

    /// <summary>
    /// Obtiene el historial de una entidad para todos sus compromisos.
    /// </summary>
    /// <param name="entidadId">ID de la entidad</param>
    /// <returns>Lista de registros de historial</returns>
    [HttpGet("entidad/{entidadId:guid}")]
    public async Task<IActionResult> GetByEntidad(Guid entidadId)
    {
        try
        {
            var historial = await _historialService.ObtenerHistorialPorEntidadAsync(entidadId);
            return Ok(new { success = true, data = historial });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener historial de la entidad {EntidadId}", entidadId);
            return StatusCode(500, new { success = false, message = "Error al obtener historial" });
        }
    }

    /// <summary>
    /// Obtiene el historial filtrado y paginado.
    /// </summary>
    /// <param name="filtro">Filtros de búsqueda</param>
    /// <returns>Respuesta paginada con registros de historial</returns>
    [HttpGet]
    public async Task<IActionResult> GetFiltered([FromQuery] CumplimientoHistorialFilterDto filtro)
    {
        try
        {
            var resultado = await _historialService.ObtenerHistorialFiltradoAsync(filtro);
            return Ok(new { success = true, data = resultado });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener historial filtrado");
            return StatusCode(500, new { success = false, message = "Error al obtener historial" });
        }
    }

    /// <summary>
    /// Obtiene un registro de historial específico por ID.
    /// </summary>
    /// <param name="historialId">ID del historial</param>
    /// <returns>Registro de historial detallado</returns>
    [HttpGet("{historialId:long}")]
    public async Task<IActionResult> GetById(long historialId)
    {
        try
        {
            var historial = await _historialService.ObtenerPorIdAsync(historialId);
            
            if (historial == null)
            {
                return NotFound(new { success = false, message = "Registro de historial no encontrado" });
            }

            return Ok(new { success = true, data = historial });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener historial {HistorialId}", historialId);
            return StatusCode(500, new { success = false, message = "Error al obtener historial" });
        }
    }

    /// <summary>
    /// Genera un snapshot de datos para previsualización (sin guardar).
    /// Útil para debug o vista previa antes de enviar.
    /// </summary>
    /// <param name="compromisoId">ID del compromiso</param>
    /// <param name="entidadId">ID de la entidad</param>
    /// <param name="cumplimientoId">ID del cumplimiento</param>
    /// <returns>Snapshot de datos</returns>
    [HttpGet("preview-snapshot")]
    public async Task<IActionResult> PreviewSnapshot(
        [FromQuery] long compromisoId,
        [FromQuery] Guid entidadId,
        [FromQuery] long cumplimientoId)
    {
        try
        {
            var snapshot = await _historialService.GenerarSnapshotAsync(
                compromisoId, entidadId, cumplimientoId, "PREVIEW");
            
            return Ok(new { success = true, data = snapshot });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al generar preview de snapshot");
            return StatusCode(500, new { success = false, message = "Error al generar snapshot" });
        }
    }
}
