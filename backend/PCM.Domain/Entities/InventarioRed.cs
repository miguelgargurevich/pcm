namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Equipos de Red
/// Tabla: inventario_red
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class InventarioRed
{
    public long InvRedId { get; set; }
    public long ComEntidadId { get; set; }
    public string TipoEquipo { get; set; } = string.Empty;
    public long Cantidad { get; set; }
    public long PuertosOperativos { get; set; }
    public long PuertosInoperativos { get; set; }
    public long TotalPuertos { get; set; }
    public decimal CostoMantenimientoAnual { get; set; }
    public string Observaciones { get; set; } = string.Empty;
    // NO tiene Activo ni CreatedAt en la BD
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
