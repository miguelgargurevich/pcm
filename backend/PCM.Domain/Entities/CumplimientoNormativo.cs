using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para gestionar el cumplimiento normativo de compromisos de gobierno digital por entidad.
/// Estructura adaptada a Supabase.
/// </summary>
public class CumplimientoNormativo
{
    public long CumplimientoId { get; set; }
    public Guid EntidadId { get; set; }
    public long CompromisoId { get; set; }
    public int EstadoId { get; set; } = 1; // 1=pendiente, 2=en_proceso, 3=completado
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // ============================================
    // RELACIONES DE NAVEGACIÓN
    // ============================================
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public Entidad Entidad { get; set; } = null!;
}
