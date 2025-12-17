namespace PCM.Domain.Entities;

/// <summary>
/// Portafolio de Proyectos de Entidad
/// Tabla: proyectos_entidades
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// NOTA: Columna "alienado_pgd" (typo en BD, no alineado_pgd)
/// </summary>
public class ProyectoEntidad
{
    public long ProyEntId { get; set; }
    public long ComEntidadId { get; set; }
    public string NumeracionProy { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Alcance { get; set; } = string.Empty;
    public string Justificacion { get; set; } = string.Empty;
    public string TipoProy { get; set; } = string.Empty;
    public string AreaProy { get; set; } = string.Empty;
    public string AreaEjecuta { get; set; } = string.Empty;
    public string TipoBeneficiario { get; set; } = string.Empty; // INTERNO, EXTERNO
    public string EtapaProyecto { get; set; } = string.Empty; // PLANIFICACIÓN, EJECUCIÓN, CIERRE, etc.
    public string AmbitoProyecto { get; set; } = string.Empty; // LOCAL, REGIONAL, NACIONAL
    public DateTime FecIniProg { get; set; }
    public DateTime FecFinProg { get; set; }
    public DateTime FecIniReal { get; set; }
    public DateTime FecFinReal { get; set; }
    public string AlineadoPgd { get; set; } = string.Empty; // Columna en BD: alienado_pgd (typo)
    public string ObjTranDig { get; set; } = string.Empty;
    public string ObjEst { get; set; } = string.Empty;
    public string AccEst { get; set; } = string.Empty;
    public decimal? MontoInversion { get; set; }
    public bool EstadoProyecto { get; set; } = true;
    public short PorcentajeAvance { get; set; } = 0; // 0-100
    public bool InformoAvance { get; set; } = false;
    // NO tiene Activo ni CreatedAt en la BD
    
}
