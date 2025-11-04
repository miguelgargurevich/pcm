using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class Ubigeo
{
    public Guid UbigeoId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public string Provincia { get; set; } = string.Empty;
    public string Distrito { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Entidad> Entidades { get; set; } = new List<Entidad>();
}
