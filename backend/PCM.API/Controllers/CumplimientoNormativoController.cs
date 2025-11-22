using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Commands.CreateCumplimiento;
using PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetAllCumplimientos;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetCumplimientoById;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.Runtime;

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
            var query = new GetAllCumplimientosQuery
            {
                CompromisoId = compromisoId,
                Estado = estado,
                EntidadId = entidadId
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
            var command = new CreateCumplimientoCommand
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                
                NroDni = request.NroDni,
                Nombres = request.Nombres,
                ApellidoPaterno = request.ApellidoPaterno,
                ApellidoMaterno = request.ApellidoMaterno,
                CorreoElectronico = request.CorreoElectronico,
                Telefono = request.Telefono,
                Rol = request.Rol,
                Cargo = request.Cargo,
                FechaInicio = request.FechaInicio,
                
                DocumentoUrl = request.DocumentoUrl,
                DocumentoNombre = request.DocumentoNombre,
                DocumentoTamano = request.DocumentoTamano,
                DocumentoTipo = request.DocumentoTipo,
                ValidacionResolucionAutoridad = request.ValidacionResolucionAutoridad,
                ValidacionLiderFuncionario = request.ValidacionLiderFuncionario,
                ValidacionDesignacionArticulo = request.ValidacionDesignacionArticulo,
                ValidacionFuncionesDefinidas = request.ValidacionFuncionesDefinidas,
                
                AceptaPoliticaPrivacidad = request.AceptaPoliticaPrivacidad,
                AceptaDeclaracionJurada = request.AceptaDeclaracionJurada,
                
                Estado = request.Estado
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
            var command = new UpdateCumplimientoCommand
            {
                CumplimientoId = id,
                
                NroDni = request.NroDni,
                Nombres = request.Nombres,
                ApellidoPaterno = request.ApellidoPaterno,
                ApellidoMaterno = request.ApellidoMaterno,
                CorreoElectronico = request.CorreoElectronico,
                Telefono = request.Telefono,
                Rol = request.Rol,
                Cargo = request.Cargo,
                FechaInicio = request.FechaInicio,
                
                DocumentoUrl = request.DocumentoUrl,
                DocumentoNombre = request.DocumentoNombre,
                DocumentoTamano = request.DocumentoTamano,
                DocumentoTipo = request.DocumentoTipo,
                ValidacionResolucionAutoridad = request.ValidacionResolucionAutoridad,
                ValidacionLiderFuncionario = request.ValidacionLiderFuncionario,
                ValidacionDesignacionArticulo = request.ValidacionDesignacionArticulo,
                ValidacionFuncionesDefinidas = request.ValidacionFuncionesDefinidas,
                
                AceptaPoliticaPrivacidad = request.AceptaPoliticaPrivacidad,
                AceptaDeclaracionJurada = request.AceptaDeclaracionJurada,
                
                Estado = request.Estado
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

            // Generar nombre único para el archivo
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";

            // Configurar S3 Client para Supabase Storage
            var bucketName = Environment.GetEnvironmentVariable("SUPABASE_S3_BUCKET_NAME") ?? "cumplimiento-documentos";
            var accessKey = Environment.GetEnvironmentVariable("SUPABASE_S3_ACCESS_KEY") ?? "f78de9bdc3c970c96fbe4d2256b1f834";
            var secretKey = Environment.GetEnvironmentVariable("SUPABASE_S3_SECRET_KEY") ?? "5003c01d4c235bb31f197e932bcf89528f180ba45b478d8d51dca1021fd86660";
            var endpoint = Environment.GetEnvironmentVariable("SUPABASE_S3_ENDPOINT") ?? "https://amzwfwfhllwhjffkqxhn.storage.supabase.co/storage/v1/s3";
            var regionName = Environment.GetEnvironmentVariable("SUPABASE_S3_REGION") ?? "us-east-1";

            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            var config = new AmazonS3Config
            {
                ServiceURL = endpoint,
                AuthenticationRegion = regionName,
                ForcePathStyle = true
            };

            using var s3Client = new AmazonS3Client(credentials, config);

            // Convertir IFormFile a Stream
            using var fileStream = file.OpenReadStream();

            // Subir archivo a Supabase Storage usando S3 API
            var putRequest = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = fileName,
                InputStream = fileStream,
                ContentType = file.ContentType
            };

            await s3Client.PutObjectAsync(putRequest);

            // Construir URL pública del archivo
            var publicUrl = $"https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/{bucketName}/{fileName}";

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
