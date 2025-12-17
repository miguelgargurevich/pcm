namespace PCM.Domain.Entities;

/// <summary>
/// Capacitaciones en Seguridad de la Información
/// Tabla: capacitaciones_seginfo
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class CapacitacionSeginfo
{
    public long CapsegId { get; set; }
    public long ComEntidadId { get; set; }
    public string Curso { get; set; } = string.Empty;
    public long CantidadPersonas { get; set; }
    // NO tiene Activo ni CreatedAt en la BD
}
