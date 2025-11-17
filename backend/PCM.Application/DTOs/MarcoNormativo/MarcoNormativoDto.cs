namespace PCM.Application.DTOs.MarcoNormativo;

public class MarcoNormativoDto
{
    public int NormaId { get; set; }
    public int TipoNormaId { get; set; }
    public string TipoNormaNombre { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string NombreNorma { get; set; } = string.Empty;
    public int NivelGobiernoId { get; set; }
    public string NivelGobiernoNombre { get; set; } = string.Empty;
    public int SectorId { get; set; }
    public string SectorNombre { get; set; } = string.Empty;
    public DateTime FechaPublicacion { get; set; }
    public string? Descripcion { get; set; }
    public string? Url { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
