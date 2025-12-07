namespace PCM.Domain.Entities;

/// <summary>
/// Portafolio de Proyectos de Entidad
/// Tabla: proyectos_entidades
/// </summary>
public class ProyectoEntidad
{
    public long ProyEntId { get; set; }
    public long ComEntidadId { get; set; }
    public string? NumeracionProy { get; set; }
    public string? Nombre { get; set; }
    public string? Alcance { get; set; }
    public string? Justificacion { get; set; }
    public string? TipoProy { get; set; }
    public string? AreaProy { get; set; }
    public string? AreaEjecuta { get; set; }
    public string? TipoBeneficiario { get; set; } // INTERNO, EXTERNO
    public string? EtapaProyecto { get; set; } // PLANIFICACIÓN, EJECUCIÓN, CIERRE, etc.
    public string? AmbitoProyecto { get; set; } // LOCAL, REGIONAL, NACIONAL
    public DateTime? FecIniProg { get; set; }
    public DateTime? FecFinProg { get; set; }
    public DateTime? FecIniReal { get; set; }
    public DateTime? FecFinReal { get; set; }
    public string? AlineadoPgd { get; set; }
    public string? ObjTranDig { get; set; }
    public string? ObjEst { get; set; }
    public string? AccEst { get; set; }
    public decimal? MontoInversion { get; set; }
    public bool EstadoProyecto { get; set; } = true;
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
