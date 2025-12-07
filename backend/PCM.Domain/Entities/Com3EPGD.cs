namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para el Compromiso 3: Estrategia de Participación en Gobierno Digital (EPGD)
/// Tabla principal: com3_epgd
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
    public string EstadoPcm { get; set; } = string.Empty;
    public string ObservacionesPcm { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaReporte { get; set; }
    public string? Sede { get; set; }
    public string? Observaciones { get; set; }
    
    // Campos de Estructura Organizacional TI
    public string? UbicacionAreaTi { get; set; }
    public string? OrganigramaTi { get; set; } // URL del PDF del organigrama
    public string? DependenciaAreaTi { get; set; }
    public decimal? CostoAnualTi { get; set; }
    public bool ExisteComisionGdTi { get; set; }
    
    // Relaciones de navegación
    public virtual ICollection<PersonalTI>? PersonalTI { get; set; }
    public virtual ICollection<InventarioSoftware>? InventariosSoftware { get; set; }
    public virtual ICollection<InventarioSistemasInfo>? InventariosSistemas { get; set; }
    public virtual ICollection<InventarioRed>? InventariosRed { get; set; }
    public virtual ICollection<InventarioServidores>? InventariosServidores { get; set; }
    public virtual SeguridadInfo? SeguridadInfo { get; set; }
    public virtual ICollection<ObjetivoEntidad>? Objetivos { get; set; }
    public virtual ICollection<ProyectoEntidad>? Proyectos { get; set; }
}
