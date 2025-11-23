using System;

namespace PCM.Domain.Entities;

public class CriterioEvaluacion
{
    public int CriterioEvaluacionId { get; set; }
    public long CompromisoId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int IdEstado { get; set; } = 1; // FK a estado_compromiso (1=pendiente por defecto)
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Relaciones
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
}
