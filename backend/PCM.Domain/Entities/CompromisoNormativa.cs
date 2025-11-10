using System;

namespace PCM.Domain.Entities;

public class CompromisoNormativa
{
    public int CompromisoNormativaId { get; set; }
    public int CompromisoId { get; set; }
    public int NormaId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relaciones
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public MarcoNormativo Norma { get; set; } = null!;
}
