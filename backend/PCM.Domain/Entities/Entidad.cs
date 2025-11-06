using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class Entidad
{
    public Guid EntidadId { get; set; }
    public string Ruc { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public Guid UbigeoId { get; set; }
    public int NivelGobiernoId { get; set; }
    public string? Telefono { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Web { get; set; }
    public int SectorId { get; set; }
    public int ClasificacionId { get; set; }
    public string NombreAlcalde { get; set; } = string.Empty;
    public string ApePatAlcalde { get; set; } = string.Empty;
    public string ApeMatAlcalde { get; set; } = string.Empty;
    public string EmailAlcalde { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Ubigeo Ubigeo { get; set; } = null!;
    public virtual Clasificacion Clasificacion { get; set; } = null!;
    public virtual NivelGobierno NivelGobierno { get; set; } = null!;
    public virtual Sector Sector { get; set; } = null!;
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
