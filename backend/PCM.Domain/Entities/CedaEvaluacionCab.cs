using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Cabecera de Evaluación CEDA
/// Tabla Supabase: ceda_evaluacion_cab
/// </summary>
[Table("ceda_evaluacion_cab")]
public class CedaEvaluacionCab
{
    [Key]
    [Column("eval_cab_id")]
    public long EvalCabId { get; set; }

    [Column("compnda_ent_id")]
    [Required]
    public long CompndaEntId { get; set; } // FK a com10_pnda

    [Column("indicador_id")]
    [Required]
    public long IndicadorId { get; set; }

    [Column("estado_indicador")]
    [StringLength(20)]
    public string? EstadoIndicador { get; set; }

    [Column("url_evidencia")]
    public string? UrlEvidencia { get; set; }

    [Column("numero_resolucion")]
    [StringLength(100)]
    public string? NumeroResolucion { get; set; }

    [Column("fecha_resolucion")]
    public DateTime? FechaResolucion { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}
