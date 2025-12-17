namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para el Compromiso 3: Estrategia de Participación en Gobierno Digital (EPGD)
/// Tabla principal: com3_epgd
/// NOTA: Columnas "estado_PCM" y "observaciones_PCM" tienen case mixto en BD
/// </summary>
public class Com3EPGD
{
    public long ComepgdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; } = string.Empty; // BD: estado_PCM
    public string ObservacionesPcm { get; set; } = string.Empty; // BD: observaciones_PCM
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime FechaReporte { get; set; } // NOT NULL en BD
    public string Sede { get; set; } = string.Empty; // NOT NULL en BD
    public string Observaciones { get; set; } = string.Empty; // NOT NULL en BD
    
    // Campos de Estructura Organizacional TI
    public string UbicacionAreaTi { get; set; } = string.Empty; // NOT NULL en BD
    public string OrganigramaTi { get; set; } = string.Empty; // NOT NULL en BD - URL del PDF del organigrama
    public string DependenciaAreaTi { get; set; } = string.Empty; // NOT NULL en BD
    public decimal CostoAnualTi { get; set; } // NOT NULL en BD
    public bool ExisteComisionGdTi { get; set; }
    public string? RutaPdfNormativa { get; set; } // NULLABLE en BD: rutaPDF_normativa
}
