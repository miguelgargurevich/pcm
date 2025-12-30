using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Services;

namespace PCM.API.Controllers;

/// <summary>
/// Controlador para servir archivos del almacenamiento local
/// </summary>
[ApiController]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly ILogger<FilesController> _logger;
    private readonly IFileStorageService _fileStorageService;

    public FilesController(
        ILogger<FilesController> logger,
        IFileStorageService fileStorageService)
    {
        _logger = logger;
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Obtiene un archivo del almacenamiento
    /// </summary>
    [HttpGet("{*filePath}")]
    public async Task<IActionResult> GetFile(string filePath)
    {
        try
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return BadRequest(new { message = "Ruta de archivo no especificada" });
            }

            // Validar que el archivo existe
            if (!await _fileStorageService.FileExistsAsync(filePath))
            {
                return NotFound(new { message = "Archivo no encontrado" });
            }

            // Obtener ruta física del archivo
            var localStorageService = _fileStorageService as LocalFileStorageService;
            if (localStorageService == null)
            {
                return StatusCode(500, new { message = "Servicio de almacenamiento no compatible" });
            }

            var physicalPath = localStorageService.GetPhysicalPath(filePath);

            // Determinar tipo de contenido
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            var contentType = extension switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };

            _logger.LogInformation("📥 Sirviendo archivo: {FilePath}", filePath);

            // Devolver el archivo
            var fileStream = new FileStream(physicalPath, FileMode.Open, FileAccess.Read);
            return File(fileStream, contentType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al obtener archivo: {FilePath}", filePath);
            return StatusCode(500, new { message = $"Error al obtener el archivo: {ex.Message}" });
        }
    }
}
