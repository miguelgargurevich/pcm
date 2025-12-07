namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Equipos de Red
/// Tabla: inventario_red
/// </summary>
public class InventarioRed
{
    public long InvRedId { get; set; }
    public long ComEntidadId { get; set; }
    public string? TipoEquipo { get; set; }
    public int Cantidad { get; set; }
    public int PuertosOperativos { get; set; }
    public int PuertosInoperativos { get; set; }
    public int TotalPuertos { get; set; }
    public decimal CostoMantenimientoAnual { get; set; }
    public string? Observaciones { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
