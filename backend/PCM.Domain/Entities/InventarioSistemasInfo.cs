namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Sistemas de Información
/// Tabla: inventario_sistemas_info
/// </summary>
public class InventarioSistemasInfo
{
    public long InvSiId { get; set; }
    public long ComEntidadId { get; set; }
    public string? Codigo { get; set; }
    public string? NombreSistema { get; set; }
    public string? Descripcion { get; set; }
    public string? TipoSistema { get; set; }
    public string? LenguajeProgramacion { get; set; }
    public string? BaseDatos { get; set; }
    public string? Plataforma { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
