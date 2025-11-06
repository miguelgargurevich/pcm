using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.Usuario;
using PCM.Application.Features.Usuarios.Commands.CreateUsuario;
using PCM.Application.Features.Usuarios.Commands.ToggleUsuarioStatus;
using PCM.Application.Features.Usuarios.Commands.UpdateUsuario;
using PCM.Application.Features.Usuarios.Queries.GetAllUsuarios;
using PCM.Application.Features.Usuarios.Queries.GetUsuarioById;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UsuariosController> _logger;

    public UsuariosController(IMediator mediator, ILogger<UsuariosController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtener todos los usuarios con filtros opcionales
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? entidadId, [FromQuery] int? perfilId, [FromQuery] bool? activo)
    {
        var query = new GetAllUsuariosQuery
        {
            EntidadId = entidadId,
            PerfilId = perfilId,
            Activo = activo
        };

        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Obtener usuario por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetUsuarioByIdQuery(id);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Crear nuevo usuario
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUsuarioDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new CreateUsuarioCommand
        {
            Email = dto.Email,
            Password = dto.Password,
            NumDni = dto.NumDni,
            Nombres = dto.Nombres,
            ApePaterno = dto.ApePaterno,
            ApeMaterno = dto.ApeMaterno,
            Direccion = dto.Direccion,
            EntidadId = dto.EntidadId,
            PerfilId = dto.PerfilId
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Usuario creado: {Email}", dto.Email);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.UserId }, result);
    }

    /// <summary>
    /// Actualizar usuario existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUsuarioDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != dto.UserId)
        {
            return BadRequest(new { message = "El ID de la URL no coincide con el ID del body" });
        }

        var command = new UpdateUsuarioCommand
        {
            UserId = dto.UserId,
            Email = dto.Email,
            NumDni = dto.NumDni,
            Nombres = dto.Nombres,
            ApePaterno = dto.ApePaterno,
            ApeMaterno = dto.ApeMaterno,
            Direccion = dto.Direccion,
            EntidadId = dto.EntidadId,
            PerfilId = dto.PerfilId
        };

        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Usuario actualizado: {UserId}", id);
        return Ok(result);
    }

    /// <summary>
    /// Activar o desactivar usuario
    /// </summary>
    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        var command = new ToggleUsuarioStatusCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        _logger.LogInformation("Estado de usuario {UserId} cambiado", id);
        return Ok(result);
    }
}
