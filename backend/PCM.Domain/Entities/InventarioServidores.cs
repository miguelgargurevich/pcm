namespace PCM.Domain.Entities;

/// <summary>
/// Inventario de Servidores
/// Tabla: inventario_servidores
/// </summary>
public class InventarioServidores
{
    public long InvSrvId { get; set; }
    public long ComEntidadId { get; set; }
    public string? NombreEquipo { get; set; }
    public string? TipoEquipo { get; set; }
    public string? Estado { get; set; }
    public string? Capa { get; set; }
    public string? Propiedad { get; set; }
    public string? Montaje { get; set; }
    public string? MarcaCpu { get; set; }
    public string? ModeloCpu { get; set; }
    public decimal? VelocidadGhz { get; set; }
    public int? Nucleos { get; set; }
    public int? MemoriaGb { get; set; }
    public string? MarcaMemoria { get; set; }
    public string? ModeloMemoria { get; set; }
    public int? CantidadMemoria { get; set; }
    public decimal CostoMantenimientoAnual { get; set; }
    public string? Observaciones { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual Com3EPGD? Com3EPGD { get; set; }
}
