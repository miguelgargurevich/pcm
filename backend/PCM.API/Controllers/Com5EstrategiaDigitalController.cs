using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com5EstrategiaDigital.Commands;
using PCM.Application.Features.Com5EstrategiaDigital.Queries;
using PCM.Infrastructure.Handlers.Com5EstrategiaDigital;
using System.Security.Claims;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/com5-estrategia-digital")]
public class Com5EstrategiaDigitalController : ControllerBase
{
    private readonly CreateCom5EstrategiaDigitalHandler _createHandler;
    private readonly UpdateCom5EstrategiaDigitalHandler _updateHandler;
    private readonly GetCom5EstrategiaDigitalHandler _getHandler;
    private readonly ILogger<Com5EstrategiaDigitalController> _logger;

    public Com5EstrategiaDigitalController(
        CreateCom5EstrategiaDigitalHandler createHandler,
        UpdateCom5EstrategiaDigitalHandler updateHandler,
        GetCom5EstrategiaDigitalHandler getHandler,
        ILogger<Com5EstrategiaDigitalController> logger)
    {
        _createHandler = createHandler;
        _updateHandler = updateHandler;
        _getHandler = getHandler;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene el registro Com5 por compromisoId y entidadId
    /// </summary>
    [HttpGet("{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
    {
        try
        {
            var query = new GetCom5EstrategiaDigitalQuery
            {
                CompromisoId = compromisoId,
                EntidadId = entidadId
            };

            var result = await _getHandler.Handle(query);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            // Si no hay datos, retornar 200 OK con Success(null) para permitir crear nuevo registro
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com5 Estrategia Digital");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Crea un nuevo registro Com5 Estrategia Digital
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCom5EstrategiaDigitalCommand command)
    {
        try
        {
            // Extraer entidad_id y usuario_id del JWT (parsear a Guid UUID)
            var entidadIdClaim = User.FindFirst("entidad_id")?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(entidadIdClaim) || string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Token inválido o incompleto" });
            }

            if (!Guid.TryParse(entidadIdClaim, out var entidadId) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Token con formato inválido" });
            }

            command.EntidadId = entidadId;
            command.UsuarioRegistra = userId;

            var result = await _createHandler.Handle(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com5 Estrategia Digital");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Actualiza un registro Com5 Estrategia Digital existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCom5EstrategiaDigitalCommand command)
    {
        try
        {
            // Extraer entidad_id y usuario_id del JWT (parsear a Guid UUID)
            var entidadIdClaim = User.FindFirst("entidad_id")?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(entidadIdClaim) || string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Token inválido o incompleto" });
            }

            if (!Guid.TryParse(entidadIdClaim, out var entidadId) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Token con formato inválido" });
            }

            command.ComdedEntId = id;
            command.EntidadId = entidadId;
            command.UsuarioRegistra = userId;

            var result = await _updateHandler.Handle(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com5 Estrategia Digital");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}
