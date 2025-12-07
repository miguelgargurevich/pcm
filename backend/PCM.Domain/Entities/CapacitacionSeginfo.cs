namespace PCM.Domain.Entities;

/// <summary>
/// Capacitaciones en Seguridad de la Información
/// Tabla: capacitaciones_seginfo
/// </summary>
public class CapacitacionSeginfo
{
    public long CapsegId { get; set; }
    public long ComEntidadId { get; set; }
    public string? Curso { get; set; }
    public int CantidadPersonas { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual SeguridadInfo? SeguridadInfo { get; set; }
}
