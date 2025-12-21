namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para el Compromiso 2: Constituir el Comité de Gobierno y TD (CGTD)
/// </summary>
public class Com2CGTD
{
    public long ComcgtdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; } = string.Empty;
    public string ObservacionesPcm { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    
    // Campos adicionales para persistencia
    public string? UrlDocPcm { get; set; }
    public string? RutaPdfNormativa { get; set; }
}
