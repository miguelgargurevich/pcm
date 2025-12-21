using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("exigibilidad")]
public class Exigibilidad
{
    [Key]
    [Column("exigibilidad_id")]
    public long ExigibilidadId { get; set; }
    
    [Column("subclasificacion_id")]
    public long SubclasificacionId { get; set; }
    
    [Column("compromiso_id")]
    public long CompromisoId { get; set; }
    
    [Column("nivel_exigibilidad")]
    [Required]
    public string NivelExigibilidad { get; set; } = string.Empty; // OBLIGATORIO, OPCIONAL, NO_EXIGIBLE
    
    [Column("activo")]
    public bool Activo { get; set; } = true;
    
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Subclasificacion? Subclasificacion { get; set; }
    public virtual CompromisoGobiernoDigital? Compromiso { get; set; }
}
