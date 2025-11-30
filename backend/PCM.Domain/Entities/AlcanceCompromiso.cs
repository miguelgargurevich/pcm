namespace PCM.Domain.Entities;

public class AlcanceCompromiso
{
    public long AlcanceCompromisoId { get; set; }
    public long CompromisoId { get; set; }
    public long ClasificacionId { get; set; } // Apunta a subclasificacion_id en la BD
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relaciones
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public Subclasificacion Clasificacion { get; set; } = null!; // Realmente es Subclasificacion
}
