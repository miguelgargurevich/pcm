using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.MarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Commands.CreateMarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Commands.DeleteMarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Commands.ToggleMarcoNormativoStatus;
using PCM.Application.Features.MarcoNormativo.Commands.UpdateMarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Queries.GetAllMarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Queries.GetMarcoNormativoById;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MarcoNormativoController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<MarcoNormativoController> _logger;

    public MarcoNormativoController(IMediator mediator, ILogger<MarcoNormativoController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtener todas las normas con filtros opcionales
    /// Filtra automáticamente por el nivel de gobierno de la entidad del usuario
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? tipoNormaId,
        [FromQuery] bool? activo,
        [FromQuery] string? searchTerm,
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta)
    {
        // Obtener UserId del usuario autenticado
        var userIdClaim = User.FindFirst("UserId")?.Value;
        Guid? userId = null;
        if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        var query = new GetAllMarcoNormativoQuery
        {
            UserId = userId,
            TipoNormaId = tipoNormaId,
            Activo = activo,
            SearchTerm = searchTerm,
            FechaDesde = fechaDesde,
            FechaHasta = fechaHasta
        };

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Obtener norma por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetMarcoNormativoByIdQuery(id);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Crear nueva norma
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMarcoNormativoDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new CreateMarcoNormativoCommand
        {
            NombreNorma = dto.NombreNorma,
            Numero = dto.Numero,
            TipoNormaId = dto.TipoNormaId,
            NivelGobiernoId = dto.NivelGobiernoId,
            SectorId = dto.SectorId,
            FechaPublicacion = dto.FechaPublicacion,
            Descripcion = dto.Descripcion,
            Url = dto.Url
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Marco normativo creado: {Numero}", dto.Numero);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.NormaId }, result);
    }

    /// <summary>
    /// Actualizar norma existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMarcoNormativoDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != dto.NormaId)
        {
            return BadRequest(new { message = "El ID de la URL no coincide con el ID del body" });
        }

        var command = new UpdateMarcoNormativoCommand
        {
            NormaId = dto.NormaId,
            NombreNorma = dto.NombreNorma,
            Numero = dto.Numero,
            TipoNormaId = dto.TipoNormaId,
            NivelGobiernoId = dto.NivelGobiernoId,
            SectorId = dto.SectorId,
            FechaPublicacion = dto.FechaPublicacion,
            Descripcion = dto.Descripcion,
            Url = dto.Url
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Marco normativo actualizado: {NormaId}", id);
        return Ok(result);
    }

    /// <summary>
    /// Activar o desactivar norma
    /// </summary>
    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var command = new ToggleMarcoNormativoStatusCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Estado de marco normativo {MarcoNormativoId} cambiado", id);
        return Ok(result);
    }

    /// <summary>
    /// Eliminar norma (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var command = new DeleteMarcoNormativoCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Marco normativo eliminado: {NormaId}", id);
        return Ok(result);
    }
}
