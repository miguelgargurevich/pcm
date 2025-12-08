namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Software
/// Tabla: inventario_software
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class InventarioSoftware
{
    public long InvSoftId { get; set; }
    public long ComEntidadId { get; set; }
    public string CodProducto { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string TipoSoftware { get; set; } = string.Empty;
    public long CantidadInstalaciones { get; set; }
    public long CantidadLicencias { get; set; }
    public long ExcesoDeficiencia { get; set; }
    public decimal CostoLicencias { get; set; }
    // NO tiene Activo ni CreatedAt en la BD
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
