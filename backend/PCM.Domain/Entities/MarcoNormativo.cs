using System;

namespace PCM.Domain.Entities;

public class MarcoNormativo
{
    public int NormaId { get; set; }
    public int TipoNormaId { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string NombreNorma { get; set; } = string.Empty;
    public int NivelGobiernoId { get; set; }
    public int SectorId { get; set; }
    public DateTime FechaPublicacion { get; set; }
    public string? Descripcion { get; set; }
    public string? Url { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public TipoNorma? TipoNorma { get; set; }
    public NivelGobierno? NivelGobierno { get; set; }
    public Sector? Sector { get; set; }
}
