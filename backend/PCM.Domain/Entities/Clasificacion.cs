using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class Clasificacion
{
    public int ClasificacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Entidad> Entidades { get; set; } = new List<Entidad>();
}
