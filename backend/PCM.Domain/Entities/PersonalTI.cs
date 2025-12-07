namespace PCM.Domain.Entities;

/// <summary>
/// Personal del Área de TI
/// Tabla: personal_ti
/// </summary>
public class PersonalTI
{
    public long PersonalId { get; set; }
    public long ComEntidadId { get; set; }
    public string? NombrePersona { get; set; }
    public string? Dni { get; set; }
    public string? Cargo { get; set; }
    public string? Rol { get; set; }
    public string? Especialidad { get; set; }
    public string? GradoInstruccion { get; set; }
    public string? Certificacion { get; set; }
    public string? Acreditadora { get; set; }
    public string? CodigoCertificacion { get; set; }
    public string? Colegiatura { get; set; }
    public string? EmailPersonal { get; set; }
    public string? Telefono { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
