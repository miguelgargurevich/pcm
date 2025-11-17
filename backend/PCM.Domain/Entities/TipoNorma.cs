namespace PCM.Domain.Entities;

public class TipoNorma
{
    public int TipoNormaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<MarcoNormativo> MarcosNormativos { get; set; } = new List<MarcoNormativo>();
}
