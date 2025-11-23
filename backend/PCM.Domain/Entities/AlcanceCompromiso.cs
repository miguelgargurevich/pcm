namespace PCM.Domain.Entities;

public class AlcanceCompromiso
{
    public long AlcanceCompromisoId { get; set; }
    public long CompromisoId { get; set; }
    public long ClasificacionId { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relaciones
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public Clasificacion Clasificacion { get; set; } = null!;
}
