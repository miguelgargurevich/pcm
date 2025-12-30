namespace PCM.Application.Interfaces;

/// <summary>
/// Interfaz para servicio de almacenamiento de archivos
/// </summary>
public interface IFileStorageService
{
    /// <summary>
    /// Sube un archivo al almacenamiento
    /// </summary>
    /// <param name="fileStream">Stream del archivo</param>
    /// <param name="fileName">Nombre del archivo</param>
    /// <param name="contentType">Tipo de contenido MIME</param>
    /// <param name="folder">Carpeta destino (opcional)</param>
    /// <returns>URL pública del archivo subido</returns>
    Task<FileUploadResult> UploadFileAsync(Stream fileStream, string fileName, string contentType, string? folder = null);

    /// <summary>
    /// Elimina un archivo del almacenamiento
    /// </summary>
    /// <param name="filePath">Ruta del archivo a eliminar</param>
    /// <returns>True si se eliminó exitosamente</returns>
    Task<bool> DeleteFileAsync(string filePath);

    /// <summary>
    /// Verifica si un archivo existe
    /// </summary>
    /// <param name="filePath">Ruta del archivo</param>
    /// <returns>True si el archivo existe</returns>
    Task<bool> FileExistsAsync(string filePath);

    /// <summary>
    /// Obtiene la URL pública de un archivo
    /// </summary>
    /// <param name="filePath">Ruta del archivo</param>
    /// <returns>URL pública del archivo</returns>
    string GetPublicUrl(string filePath);
}

/// <summary>
/// Resultado de subida de archivo
/// </summary>
public class FileUploadResult
{
    public bool Success { get; set; }
    public string? Url { get; set; }
    public string? FilePath { get; set; }
    public string? FileName { get; set; }
    public long Size { get; set; }
    public string? ContentType { get; set; }
    public string? ErrorMessage { get; set; }
}
