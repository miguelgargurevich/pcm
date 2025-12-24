using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Maestro de Indicadores CEDA
/// Tabla Supabase: ceda_indicadores
/// </summary>
[Table("ceda_indicadores")]
public class CedaIndicadores
{
    [Key]
    [Column("indicador_id")]
    public long IndicadorId { get; set; }

    [Column("numero_orden")]
    public int NumeroOrden { get; set; }

    [Column("nombre_indicador")]
    [StringLength(255)]
    [Required]
    public string NombreIndicador { get; set; } = string.Empty;

    [Column("descripcion_indicador")]
    public string? DescripcionIndicador { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
