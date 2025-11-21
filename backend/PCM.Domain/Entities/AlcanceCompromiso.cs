namespace PCM.Domain.Entities;

public class AlcanceCompromiso
{
    public int AlcanceCompromisoId { get; set; }
    public int CompromisoId { get; set; }
    public int ClasificacionId { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relaciones
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public Clasificacion Clasificacion { get; set; } = null!;
}
