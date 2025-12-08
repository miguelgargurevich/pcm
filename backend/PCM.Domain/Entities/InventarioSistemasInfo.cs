namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Sistemas de Información
/// Tabla: inventario_sistemas_info
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class InventarioSistemasInfo
{
    public long InvSiId { get; set; }
    public long ComEntidadId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string NombreSistema { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string TipoSistema { get; set; } = string.Empty;
    public string LenguajeProgramacion { get; set; } = string.Empty;
    public string BaseDatos { get; set; } = string.Empty;
    public string Plataforma { get; set; } = string.Empty;
    // NO tiene Activo ni CreatedAt en la BD
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
