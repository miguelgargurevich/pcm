using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para gestionar el cumplimiento normativo de compromisos de gobierno digital por entidad.
/// Registra las evaluaciones realizadas por operadores PCM (OBSERVADO/ACEPTADO).
/// </summary>
public class CumplimientoNormativo
{
    public long CumplimientoId { get; set; }
    public Guid EntidadId { get; set; }
    public long CompromisoId { get; set; }
    public int EstadoId { get; set; } = 1; // FK a estado_cumplimiento (7=OBSERVADO, 8=ACEPTADO)
    public Guid? OperadorId { get; set; } // ID del operador PCM que realizó la evaluación
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; } // Observaciones del evaluador
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // ============================================
    // RELACIONES DE NAVEGACIÓN
    // ============================================
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public Entidad Entidad { get; set; } = null!;
}
