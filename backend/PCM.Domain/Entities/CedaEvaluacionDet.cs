using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Detalle de Evaluación CEDA (Checks por criterio)
/// Tabla Supabase: ceda_evaluacion_det
/// </summary>
[Table("ceda_evaluacion_det")]
public class CedaEvaluacionDet
{
    [Key]
    [Column("eval_det_id")]
    public long EvalDetId { get; set; }

    [Column("eval_cab_id")]
    [Required]
    public long EvalCabId { get; set; }

    [Column("criterio_id")]
    [Required]
    public long CriterioId { get; set; }

    [Column("cumple_criterio")]
    public bool CumpleCriterio { get; set; } = false;
}
