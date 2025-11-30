using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("subclasificacion")]
public class Subclasificacion
{
    [Key]
    [Column("subclasificacion_id")]
    public long SubclasificacionId { get; set; }
    
    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;
    
    [Column("descripcion")]
    public string? Descripcion { get; set; }
    
    [Column("activo")]
    public bool Activo { get; set; } = true;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("clasificacion_id")]
    public long? ClasificacionId { get; set; }

    // Navigation properties
    public virtual Clasificacion? Clasificacion { get; set; }
    public virtual ICollection<Entidad> Entidades { get; set; } = new List<Entidad>();
}
