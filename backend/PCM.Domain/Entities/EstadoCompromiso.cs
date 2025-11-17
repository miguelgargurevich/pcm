namespace PCM.Domain.Entities;

public class EstadoCompromiso
{
    public int EstadoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<CompromisoGobiernoDigital> Compromisos { get; set; } = new List<CompromisoGobiernoDigital>();
    public ICollection<CriterioEvaluacion> Criterios { get; set; } = new List<CriterioEvaluacion>();
}
