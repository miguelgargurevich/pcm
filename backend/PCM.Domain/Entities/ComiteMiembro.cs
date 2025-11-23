namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para los miembros del Comité de Gobierno y TD
/// Se relaciona con Com2CGTD
/// </summary>
public class ComiteMiembro
{
    public long MiembroId { get; set; }
    public long? ComEntidadId { get; set; }  // FK a Com2CGTD.ComcgtdEntId
    public string? Dni { get; set; }
    public string? Nombre { get; set; }
    public string? ApellidoPaterno { get; set; }
    public string? ApellidoMaterno { get; set; }
    public string? Cargo { get; set; }
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public bool? Activo { get; set; }
    public DateTime? CreatedAt { get; set; }
}
