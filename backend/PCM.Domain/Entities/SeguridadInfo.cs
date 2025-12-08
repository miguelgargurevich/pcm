namespace PCM.Domain.Entities;

/// <summary>
/// Seguridad de la Información
/// Tabla: seguridad_info
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class SeguridadInfo
{
    public long SeginfoId { get; set; }
    public long ComEntidadId { get; set; }
    
    // Parte A - Evaluación General
    public bool PlanSgsi { get; set; }
    public bool ComiteSeguridad { get; set; }
    public bool OficialSeguridadEnOrganigrama { get; set; }
    public bool PoliticaSeguridad { get; set; }
    public bool InventarioActivos { get; set; }
    public bool AnalisisRiesgos { get; set; }
    public bool MetodologiaRiesgos { get; set; }
    public bool PlanContinuidad { get; set; }
    public bool ProgramaAuditorias { get; set; }
    public bool InformesDireccion { get; set; }
    public bool CertificacionIso27001 { get; set; }
    public string Observaciones { get; set; } = string.Empty;
    
    // NO tiene Activo ni CreatedAt en la BD
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
    public virtual ICollection<CapacitacionSeginfo>? Capacitaciones { get; set; }
}
