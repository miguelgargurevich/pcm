using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Maestro de Criterios por Indicador CEDA
/// Tabla Supabase: ceda_criterios
/// </summary>
[Table("ceda_criterios")]
public class CedaCriterios
{
    [Key]
    [Column("criterio_id")]
    public long CriterioId { get; set; }

    [Column("indicador_id")]
    public long IndicadorId { get; set; }

    [Column("descripcion_criterio")]
    [Required]
    public string DescripcionCriterio { get; set; } = string.Empty;

    [Column("orden_visual")]
    public int? OrdenVisual { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
