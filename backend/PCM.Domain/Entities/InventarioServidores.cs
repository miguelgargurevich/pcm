namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Servidores
/// Tabla: inventario_servidores
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class InventarioServidores
{
    public long InvSrvId { get; set; }
    public long ComEntidadId { get; set; }
    public string NombreEquipo { get; set; } = string.Empty;
    public string TipoEquipo { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Capa { get; set; } = string.Empty;
    public string Propiedad { get; set; } = string.Empty;
    public string Montaje { get; set; } = string.Empty;
    public string MarcaCpu { get; set; } = string.Empty;
    public string ModeloCpu { get; set; } = string.Empty;
    public decimal VelocidadGhz { get; set; }
    public long Nucleos { get; set; }
    public long MemoriaGb { get; set; }
    public string MarcaMemoria { get; set; } = string.Empty;
    public string ModeloMemoria { get; set; } = string.Empty;
    public long CantidadMemoria { get; set; }
    public decimal CostoMantenimientoAnual { get; set; }
    public string FrecuenciaBackup { get; set; } = string.Empty;
    // NO tiene Activo ni CreatedAt en la BD
}
