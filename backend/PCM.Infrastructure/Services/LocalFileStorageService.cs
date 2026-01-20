using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.Interfaces;

namespace PCM.Infrastructure.Services;

/// <summary>
/// Servicio de almacenamiento de archivos en sistema local
/// Reemplaza Supabase Storage para ambientes on-premise
/// </summary>
public class LocalFileStorageService : IFileStorageService
{
    private readonly ILogger<LocalFileStorageService> _logger;
    private readonly string _basePath;
    private readonly string _baseUrl;
    private readonly string[] _allowedExtensions;

    public LocalFileStorageService(
        IConfiguration configuration,
        ILogger<LocalFileStorageService> logger)
    {
        _logger = logger;

        // Configuración de almacenamiento
        _basePath = configuration["FileStorage:BasePath"] 
            ?? Path.Combine(Directory.GetCurrentDirectory(), "storage");
        _baseUrl = configuration["FileStorage:BaseUrl"] ?? "/api/files";
        _allowedExtensions = (configuration["FileStorage:AllowedExtensions"] ?? ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png")
            .Split(',', StringSplitOptions.RemoveEmptyEntries);

        // Asegurar que el directorio base existe
        EnsureDirectoryExists(_basePath);

        _logger.LogInformation("📁 LocalFileStorageService inicializado");
        _logger.LogInformation("   BasePath: {BasePath}", _basePath);
        _logger.LogInformation("   BaseUrl: {BaseUrl}", _baseUrl);
        _logger.LogInformation("   Sin límite de tamaño de archivo");
    }

    public async Task<FileUploadResult> UploadFileAsync(Stream fileStream, string fileName, string contentType, string? folder = null)
    {
        try
        {
            // Validar extensión
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                return new FileUploadResult
                {
                    Success = false,
                    ErrorMessage = $"Extensión no permitida: {extension}"
                };
            }

            // Sin validación de tamaño - archivos de cualquier tamaño permitidos

            // Sanitizar nombre de archivo
            var sanitizedFileName = SanitizeFileName(fileName);
            var uniqueFileName = $"{Guid.NewGuid()}_{sanitizedFileName}";

            // Construir ruta completa
            var targetFolder = string.IsNullOrEmpty(folder) 
                ? _basePath 
                : Path.Combine(_basePath, folder);
            
            EnsureDirectoryExists(targetFolder);

            var filePath = Path.Combine(targetFolder, uniqueFileName);
            var relativePath = string.IsNullOrEmpty(folder)
                ? uniqueFileName
                : Path.Combine(folder, uniqueFileName);

            // Guardar archivo
            using (var fileStreamOutput = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                await fileStream.CopyToAsync(fileStreamOutput);
            }

            var publicUrl = GetPublicUrl(relativePath);

            _logger.LogInformation("✅ Archivo guardado: {FilePath}", filePath);
            _logger.LogInformation("   URL: {Url}", publicUrl);

            return new FileUploadResult
            {
                Success = true,
                Url = publicUrl,
                FilePath = relativePath,
                FileName = sanitizedFileName,
                Size = fileStream.Length,
                ContentType = contentType
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al guardar archivo: {FileName}", fileName);
            return new FileUploadResult
            {
                Success = false,
                ErrorMessage = $"Error al guardar archivo: {ex.Message}"
            };
        }
    }

    public Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_basePath, filePath);
            
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                _logger.LogInformation("🗑️ Archivo eliminado: {FilePath}", fullPath);
                return Task.FromResult(true);
            }

            _logger.LogWarning("⚠️ Archivo no encontrado para eliminar: {FilePath}", fullPath);
            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al eliminar archivo: {FilePath}", filePath);
            return Task.FromResult(false);
        }
    }

    public Task<bool> FileExistsAsync(string filePath)
    {
        var fullPath = Path.Combine(_basePath, filePath);
        return Task.FromResult(File.Exists(fullPath));
    }

    public string GetPublicUrl(string filePath)
    {
        // Normalizar separadores de ruta para URL
        var urlPath = filePath.Replace(Path.DirectorySeparatorChar, '/');
        return $"{_baseUrl}/{urlPath}";
    }

    /// <summary>
    /// Obtiene la ruta física completa de un archivo
    /// </summary>
    public string GetPhysicalPath(string relativePath)
    {
        return Path.Combine(_basePath, relativePath);
    }

    private void EnsureDirectoryExists(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
            _logger.LogInformation("📂 Directorio creado: {Path}", path);
        }
    }

    private static string SanitizeFileName(string fileName)
    {
        // Obtener solo el nombre del archivo
        var name = Path.GetFileName(fileName);
        
        // Reemplazar caracteres no válidos
        var invalidChars = Path.GetInvalidFileNameChars();
        foreach (var c in invalidChars)
        {
            name = name.Replace(c, '_');
        }
        
        // Reemplazar espacios y otros caracteres problemáticos
        name = System.Text.RegularExpressions.Regex.Replace(name, @"[^a-zA-Z0-9._-]", "_");
        
        return name;
    }
}
