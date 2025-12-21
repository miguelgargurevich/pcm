using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para el historial de cambios de estado de cumplimiento de compromisos.
/// Registra cada transición de estado (entidad enviando, operador aprobando/observando).
/// El campo datos_snapshot almacena un JSON con la "foto" de los datos del compromiso en ese momento.
/// </summary>
[Table("cumplimiento_historial")]
public class CumplimientoHistorial
{
    [Key]
    [Column("historial_id")]
    public long HistorialId { get; set; }
    
    /// <summary>
    /// ID del cumplimiento normativo asociado
    /// </summary>
    [Column("cumplimiento_id")]
    public long CumplimientoId { get; set; }
    
    /// <summary>
    /// Estado anterior (null si es la primera vez)
    /// </summary>
    [Column("estado_anterior_id")]
    public int? EstadoAnteriorId { get; set; }
    
    /// <summary>
    /// Nuevo estado al que transiciona
    /// </summary>
    [Column("estado_nuevo_id")]
    public int EstadoNuevoId { get; set; }
    
    /// <summary>
    /// Usuario que realizó la acción (entidad o operador PCM)
    /// </summary>
    [Column("usuario_responsable_id")]
    public Guid UsuarioResponsableId { get; set; }
    
    /// <summary>
    /// Observación del operador PCM (si aplica)
    /// </summary>
    [Column("observacion_snapshot")]
    public string? ObservacionSnapshot { get; set; }
    
    /// <summary>
    /// JSON con snapshot de datos del compromiso al momento del cambio.
    /// Estructura semi-estructurada para permitir diferentes formatos por compromiso.
    /// </summary>
    [Column("datos_snapshot", TypeName = "jsonb")]
    public string? DatosSnapshot { get; set; }
    
    /// <summary>
    /// Fecha y hora del cambio de estado
    /// </summary>
    [Column("fecha_cambio")]
    public DateTime FechaCambio { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual CumplimientoNormativo? Cumplimiento { get; set; }
    public virtual Usuario? UsuarioResponsable { get; set; }
}
