namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para los miembros del Comité de Gobierno y TD
/// Se relaciona con Com2CGTD
/// </summary>
public class ComiteMiembro
{
    public long MiembroId { get; set; }
    public long ComEntidadId { get; set; }  // FK a Com2CGTD.ComcgtdEntId
    public long NumMiembro { get; set; }    // Número de orden del miembro
    public string Dni { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public DateTime FechaInicio { get; set; }
    public bool Activo { get; set; }
}
