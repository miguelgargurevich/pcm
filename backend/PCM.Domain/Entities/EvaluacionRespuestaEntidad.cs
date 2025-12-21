using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para las respuestas de criterios de evaluación por entidad.
/// Tabla: evaluacion_respuestas_entidad
/// Guarda qué criterios cumple cada entidad para cada compromiso.
/// </summary>
[Table("evaluacion_respuestas_entidad")]
public class EvaluacionRespuestaEntidad
{
    [Key]
    [Column("respuesta_id")]
    public int RespuestaId { get; set; }

    [Required]
    [Column("entidad_id")]
    public Guid EntidadId { get; set; }

    [Required]
    [Column("criterio_evaluacion_id")]
    public int CriterioEvaluacionId { get; set; }

    [Required]
    [Column("cumple")]
    public bool Cumple { get; set; } = false;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Navegación
    [ForeignKey("CriterioEvaluacionId")]
    public CriterioEvaluacion? CriterioEvaluacion { get; set; }

    [ForeignKey("EntidadId")]
    public Entidad? Entidad { get; set; }
}
