namespace PCM.Application.Features.Com2CGTD.DTOs;

public class ComiteMiembroDto
{
    public long? MiembroId { get; set; }
    public string? Dni { get; set; }
    public string? Nombre { get; set; }
    public string? ApellidoPaterno { get; set; }
    public string? ApellidoMaterno { get; set; }
    public string? Cargo { get; set; }
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public DateTime? FechaInicio { get; set; }
    public bool? Activo { get; set; }
}
