using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Commands.CreateCumplimiento;
using PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetAllCumplimientos;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetCumplimientoById;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CumplimientoNormativoController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CumplimientoNormativoController> _logger;

    public CumplimientoNormativoController(IMediator mediator, ILogger<CumplimientoNormativoController> logger)
    {
        _mediator = mediator;
        _logger = logger;
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
            
            var command = new UpdateCumplimientoCommand
            {
                CumplimientoId = id,
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

            return Ok(new { isSuccess = true, data = result.Data, message = "Cumplimiento normativo actualizado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating cumplimiento normativo {CumplimientoId}", id);
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Sube un documento PDF a Supabase Storage
    /// </summary>
    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocument([FromForm] IFormFile file)
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

            // Generar nombre único para el archivo y sanitizar el nombre
            var originalFileName = Path.GetFileName(file.FileName);
            var sanitizedFileName = System.Text.RegularExpressions.Regex.Replace(originalFileName, @"[^a-zA-Z0-9._-]", "_");
            var fileName = $"{Guid.NewGuid()}_{sanitizedFileName}";
            var bucketName = Environment.GetEnvironmentVariable("SUPABASE_S3_BUCKET_NAME") ?? "cumplimiento-documentos";
            var supabaseUrl = "https://amzwfwfhllwhjffkqxhn.supabase.co";
            var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_KEY") ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtendmd2ZobGx3aGpmZmtxeGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4ODIyOSwiZXhwIjoyMDc3OTY0MjI5fQ.VZSvk3sxYB9mRjHaAu5McySAGQurO7c-eJIl6ET_MCQ";

            // Subir archivo usando Supabase Storage REST API
            using var httpClient = new HttpClient();
            
            // Convertir IFormFile a byte array
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();
            
            var content = new ByteArrayContent(fileBytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

            // Configurar headers de autenticación
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {supabaseKey}");
            httpClient.DefaultRequestHeaders.Add("apikey", supabaseKey);

            // Subir archivo (usar POST sin multipart)
            var uploadUrl = $"{supabaseUrl}/storage/v1/object/{bucketName}/{fileName}";
            var response = await httpClient.PostAsync(uploadUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error uploading to Supabase: {response.StatusCode} - {errorContent}");
            }

            // Construir URL pública del archivo
            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/{bucketName}/{fileName}";

            _logger.LogInformation("Documento subido exitosamente: {FileName}", fileName);

            return Ok(new
            {
                isSuccess = true,
                data = new
                {
                    url = publicUrl,
                    nombre = file.FileName,
                    tamano = file.Length,
                    tipo = file.ContentType
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
