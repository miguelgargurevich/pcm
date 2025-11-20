namespace PCM.Application.DTOs.Permisos;

public class PermisoModuloDto
{
    public int PermisoModuloId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? Ruta { get; set; }
    public string? Icono { get; set; }
    public int Orden { get; set; }
    public bool Activo { get; set; }
}

public class PerfilPermisoDto
{
    public int PerfilPermisoId { get; set; }
    public int PerfilId { get; set; }
    public int PermisoModuloId { get; set; }
    public string CodigoModulo { get; set; } = string.Empty;
    public string NombreModulo { get; set; } = string.Empty;
    public string? RutaModulo { get; set; }
    public string? IconoModulo { get; set; }
    public char TipoAcceso { get; set; } // T, C, N
    public bool PuedeCrear { get; set; }
    public bool PuedeEditar { get; set; }
    public bool PuedeEliminar { get; set; }
    public bool PuedeConsultar { get; set; }
    public bool Activo { get; set; }
}

public class VerificarPermisoRequest
{
    public int PerfilId { get; set; }
    public string CodigoModulo { get; set; } = string.Empty;
    public string? Accion { get; set; } // crear, editar, eliminar, consultar
}

public class VerificarPermisoResponse
{
    public bool TieneAcceso { get; set; }
    public char TipoAcceso { get; set; } // T, C, N
    public bool PuedeCrear { get; set; }
    public bool PuedeEditar { get; set; }
    public bool PuedeEliminar { get; set; }
    public bool PuedeConsultar { get; set; }
    public string Mensaje { get; set; } = string.Empty;
}

public class PermisosPorPerfilResponse
{
    public int PerfilId { get; set; }
    public string NombrePerfil { get; set; } = string.Empty;
    public List<PerfilPermisoDto> Permisos { get; set; } = new();
}
