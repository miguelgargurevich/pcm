using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class Entidad
{
    public Guid EntidadId { get; set; }
    public string Ruc { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public Guid? UbigeoId { get; set; }
    public int? NivelGobiernoId { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public string? Web { get; set; }
    public int? SectorId { get; set; }
    
    // Mapeado a columna subclasificacion_id en BD via Fluent API
    public long? ClasificacionId { get; set; }
    
    public string? NombreAlcalde { get; set; }
    public string? ApePatAlcalde { get; set; }
    public string? ApeMatAlcalde { get; set; }
    public string? EmailAlcalde { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Ubigeo? Ubigeo { get; set; }
    public virtual Subclasificacion? Clasificacion { get; set; }
    public virtual NivelGobierno? NivelGobierno { get; set; }
    public virtual Sector? Sector { get; set; }
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
