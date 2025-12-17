namespace PCM.Domain.Entities;

/// <summary>
/// Personal del Área de TI
/// Tabla: personal_ti
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class PersonalTI
{
    public long PersonalId { get; set; }
    public long ComEntidadId { get; set; }
    public string NombrePersona { get; set; } = string.Empty;
    public string Dni { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public string Especialidad { get; set; } = string.Empty;
    public string GradoInstruccion { get; set; } = string.Empty;
    public string Certificacion { get; set; } = string.Empty;
    public string Acreditadora { get; set; } = string.Empty;
    public string CodigoCertificacion { get; set; } = string.Empty;
    public string Colegiatura { get; set; } = string.Empty;
    public string EmailPersonal { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    // NO tiene Activo ni CreatedAt en la BD
}
