using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class Clasificacion
{
    public long ClasificacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    // Las entidades ahora se relacionan con Subclasificacion, no directamente con Clasificacion
    public virtual ICollection<Subclasificacion> Subclasificaciones { get; set; } = new List<Subclasificacion>();
}
