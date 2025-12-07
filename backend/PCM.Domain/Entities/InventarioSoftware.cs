namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Software
/// Tabla: inventario_software
/// </summary>
public class InventarioSoftware
{
    public long InvSoftId { get; set; }
    public long ComEntidadId { get; set; }
    public string? CodProducto { get; set; }
    public string? NombreProducto { get; set; }
    public string? Version { get; set; }
    public string? TipoSoftware { get; set; }
    public int CantidadInstalaciones { get; set; }
    public int CantidadLicencias { get; set; }
    public int ExcesoDeficiencia { get; set; }
    public decimal CostoLicencias { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
