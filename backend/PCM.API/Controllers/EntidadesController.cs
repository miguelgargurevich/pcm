using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Commands.CreateEntidad;
using PCM.Application.Features.Entidades.Commands.DeleteEntidad;
using PCM.Application.Features.Entidades.Commands.ToggleEntidadStatus;
using PCM.Application.Features.Entidades.Commands.UpdateEntidad;
using PCM.Application.Features.Entidades.Queries.GetAllEntidades;
using PCM.Application.Features.Entidades.Queries.GetEntidadById;
using PCM.Application.Features.Entidades.Queries.ValidateRuc;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EntidadesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<EntidadesController> _logger;

    public EntidadesController(IMediator mediator, ILogger<EntidadesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtener todas las entidades con filtros opcionales
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? ubigeoId,
        [FromQuery] int? clasificacionId,
        [FromQuery] int? nivelGobiernoId,
        [FromQuery] int? sectorId,
        [FromQuery] bool? activo,
        [FromQuery] string? searchTerm)
    {
        var query = new GetAllEntidadesQuery
        {
            UbigeoId = ubigeoId,
            ClasificacionId = clasificacionId,
            NivelGobiernoId = nivelGobiernoId,
            SectorId = sectorId,
            Activo = activo,
            SearchTerm = searchTerm
        };

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Obtener entidad por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetEntidadByIdQuery(id);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Crear nueva entidad
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEntidadDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new CreateEntidadCommand
        {
            Ruc = dto.Ruc,
            Nombre = dto.Nombre,
            Direccion = dto.Direccion,
            UbigeoId = dto.UbigeoId,
            Telefono = dto.Telefono,
            Email = dto.Email,
            Web = dto.Web,
            NivelGobiernoId = dto.NivelGobiernoId,
            SectorId = dto.SectorId,
            ClasificacionId = dto.ClasificacionId,
            NombreAlcalde = dto.NombreAlcalde,
            ApePatAlcalde = dto.ApePatAlcalde,
            ApeMatAlcalde = dto.ApeMatAlcalde,
            EmailAlcalde = dto.EmailAlcalde,
            Activo = dto.Activo
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Entidad creada: {Ruc} - {Nombre}", dto.Ruc, dto.Nombre);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.EntidadId }, result);
    }

    /// <summary>
    /// Actualizar entidad existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEntidadDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != dto.EntidadId)
        {
            return BadRequest(new { message = "El ID de la URL no coincide con el ID del body" });
        }

        var command = new UpdateEntidadCommand
        {
            EntidadId = dto.EntidadId,
            Ruc = dto.Ruc,
            Nombre = dto.Nombre,
            Direccion = dto.Direccion,
            UbigeoId = dto.UbigeoId,
            Telefono = dto.Telefono,
            Email = dto.Email,
            Web = dto.Web,
            NivelGobiernoId = dto.NivelGobiernoId,
            SectorId = dto.SectorId,
            ClasificacionId = dto.ClasificacionId,
            NombreAlcalde = dto.NombreAlcalde,
            ApePatAlcalde = dto.ApePatAlcalde,
            ApeMatAlcalde = dto.ApeMatAlcalde,
            EmailAlcalde = dto.EmailAlcalde,
            Activo = dto.Activo
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Entidad actualizada: {EntidadId}", id);
        return Ok(result);
    }

    /// <summary>
    /// Activar o desactivar entidad
    /// </summary>
    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        var command = new ToggleEntidadStatusCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Estado de entidad {EntidadId} cambiado", id);
        return Ok(result);
    }

    /// <summary>
    /// Validar RUC con SUNAT (validación básica por ahora)
    /// </summary>
    [HttpPost("validate-ruc")]
    public async Task<IActionResult> ValidateRuc([FromBody] ValidateRucDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var query = new ValidateRucQuery(dto.Ruc);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Eliminar entidad (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteEntidadCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Entidad eliminada: {EntidadId}", id);
        return Ok(result);
    }
}
