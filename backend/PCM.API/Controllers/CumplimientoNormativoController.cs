using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Commands.CreateCumplimiento;
using PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetAllCumplimientos;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetCumplimientoById;
using PCM.Application.Interfaces;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CumplimientoNormativoController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CumplimientoNormativoController> _logger;
    private readonly IFileStorageService _fileStorageService;

    public CumplimientoNormativoController(
        IMediator mediator, 
        ILogger<CumplimientoNormativoController> logger,
        IFileStorageService fileStorageService)
    {
        _mediator = mediator;
        _logger = logger;
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Obtiene todos los cumplimientos normativos con filtros opcionales
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllCumplimientos(
        [FromQuery] int? compromisoId,
        [FromQuery] int? estado,
        [FromQuery] Guid? entidadId)
    {
        try
        {
            // Extraer UserId del JWT token
            var userIdClaim = User.FindFirst("UserId")?.Value;
            Guid? userId = null;
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            var query = new GetAllCumplimientosQuery
            {
                CompromisoId = compromisoId,
                Estado = estado,
                EntidadId = entidadId,
                UserId = userId
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
            _logger.LogError(ex, "Error getting cumplimientos normativos");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene un cumplimiento normativo específico por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCumplimientoById(int id)
    {
        try
        {
            var query = new GetCumplimientoByIdQuery { CumplimientoId = id };
            var result = await _mediator.Send(query);

            if (!result.IsSuccess)
            {
                return NotFound(new { isSuccess = false, message = result.Message });
            }

            return Ok(new { isSuccess = true, data = result.Data });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cumplimiento normativo {CumplimientoId}", id);
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Crea un nuevo cumplimiento normativo
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateCumplimiento([FromBody] CreateCumplimientoRequest request)
    {
        try
        {
            _logger.LogInformation("Recibiendo request - CompromisoId: {CompromisoId}, EntidadId: {EntidadId}", 
                request.CompromisoId, request.EntidadId);
            
            var command = new CreateCumplimientoCommand
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EstadoId = request.EstadoId,
                OperadorId = request.OperadorId,
                FechaAsignacion = request.FechaAsignacion,
                ObservacionPcm = request.ObservacionPcm
            };

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(new { isSuccess = false, message = result.Message });
            }

            return CreatedAtAction(
                nameof(GetCumplimientoById),
                new { id = result.Data!.CumplimientoId },
                new { isSuccess = true, data = result.Data, message = "Cumplimiento normativo creado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating cumplimiento normativo");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Actualiza un cumplimiento normativo existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCumplimiento(int id, [FromBody] UpdateCumplimientoRequest request)
    {
        try
        {
            _logger.LogInformation("Actualizando cumplimiento {Id} - EstadoId: {EstadoId}", 
                id, request.EstadoId);
            
            // Obtener UserId del JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Guid? userId = null;
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }
            
            var command = new UpdateCumplimientoCommand
            {
                CumplimientoId = id,
                EstadoId = request.EstadoId,
                OperadorId = request.OperadorId,
                FechaAsignacion = request.FechaAsignacion,
                ObservacionPcm = request.ObservacionPcm,
                UserId = userId
            };

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(new { isSuccess = false, message = result.Message });
            }

            return Ok(new { isSuccess = true, data = result.Data, message = "Cumplimiento normativo actualizado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating cumplimiento normativo {CumplimientoId}", id);
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Sube un documento PDF al almacenamiento local
    /// </summary>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDocument(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { isSuccess = false, message = "No se recibió ningún archivo" });
            }

            // Validar que sea PDF
            if (file.ContentType != "application/pdf")
            {
                return BadRequest(new { isSuccess = false, message = "Solo se permiten archivos PDF" });
            }

            // Validar tamaño (10MB máximo)
            if (file.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { isSuccess = false, message = "El archivo no puede superar los 10MB" });
            }

            // Subir archivo usando el servicio de almacenamiento local
            using var stream = file.OpenReadStream();
            var result = await _fileStorageService.UploadFileAsync(
                stream, 
                file.FileName, 
                file.ContentType, 
                "documentos"  // Carpeta para documentos de cumplimiento
            );

            if (!result.Success)
            {
                _logger.LogError("Error al subir documento: {Error}", result.ErrorMessage);
                return StatusCode(500, new { isSuccess = false, message = result.ErrorMessage });
            }

            _logger.LogInformation("Documento subido exitosamente: {FileName}", result.FileName);

            return Ok(new
            {
                isSuccess = true,
                data = new
                {
                    url = result.Url,
                    nombre = file.FileName,
                    tamano = result.Size,
                    tipo = result.ContentType
                },
                message = "Documento subido exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al subir documento");
            return StatusCode(500, new { isSuccess = false, message = $"Error al subir el documento: {ex.Message}" });
        }
    }
}
