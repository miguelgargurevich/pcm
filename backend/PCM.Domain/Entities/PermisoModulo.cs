namespace PCM.Domain.Entities;

public class PermisoModulo
{
    public int PermisoModuloId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? Ruta { get; set; }
    public string? Icono { get; set; }
    public int Orden { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navegación
    public virtual ICollection<PerfilPermiso> PerfilesPermisos { get; set; } = new List<PerfilPermiso>();
}
