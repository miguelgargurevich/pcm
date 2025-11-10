using System;

namespace PCM.Domain.Entities;

public class CriterioEvaluacion
{
    public int CriterioEvaluacionId { get; set; }
    public int CompromisoId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public string Estado { get; set; } = "pendiente"; // pendiente, en_proceso, completado, vencido
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Relaciones
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
}
