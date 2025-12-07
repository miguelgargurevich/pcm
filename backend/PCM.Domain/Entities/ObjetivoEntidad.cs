namespace PCM.Domain.Entities;

/// <summary>
/// Objetivos de Entidad (Estratégicos y de Gobierno Digital)
/// Tabla: objetivos_entidades
/// tipo_obj: 'E' = Estratégico, 'G' = Gobierno Digital
/// </summary>
public class ObjetivoEntidad
{
    public long ObjEntId { get; set; }
    public long ComEntidadId { get; set; }
    public string TipoObj { get; set; } = "E"; // 'E' = Estratégico, 'G' = Gobierno Digital
    public string? NumeracionObj { get; set; } // Ej: "OE-01", "OGD-01"
    public string? DescripcionObjetivo { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
    public virtual ICollection<AccionObjetivoEntidad>? Acciones { get; set; }
}
