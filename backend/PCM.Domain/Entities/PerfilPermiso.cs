namespace PCM.Domain.Entities;

public class PerfilPermiso
{
    public int PerfilPermisoId { get; set; }
    public int PerfilId { get; set; }
    public int PermisoModuloId { get; set; }
    public char TipoAcceso { get; set; } = 'N'; // T=Total, C=Consulta, N=Sin acceso
    public bool PuedeCrear { get; set; }
    public bool PuedeEditar { get; set; }
    public bool PuedeEliminar { get; set; }
    public bool PuedeConsultar { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navegación
    public virtual Perfil Perfil { get; set; } = null!;
    public virtual PermisoModulo PermisoModulo { get; set; } = null!;
}
