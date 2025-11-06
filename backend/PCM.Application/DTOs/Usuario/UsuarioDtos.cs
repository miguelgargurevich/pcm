namespace PCM.Application.DTOs.Usuario;

public record CreateUsuarioDto
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string NumDni { get; init; }
    public required string Nombres { get; init; }
    public required string ApePaterno { get; init; }
    public required string ApeMaterno { get; init; }
    public string? Direccion { get; init; }
    public required Guid? EntidadId { get; init; }
    public required int PerfilId { get; init; }
}

public record UpdateUsuarioDto
{
    public required Guid UserId { get; init; }
    public required string Email { get; init; }
    public required string NumDni { get; init; }
    public required string Nombres { get; init; }
    public required string ApePaterno { get; init; }
    public required string ApeMaterno { get; init; }
    public string? Direccion { get; init; }
    public required Guid? EntidadId { get; init; }
    public required int PerfilId { get; init; }
}

public record UsuarioDetailDto
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string NumDni { get; init; } = string.Empty;
    public string Nombres { get; init; } = string.Empty;
    public string ApePaterno { get; init; } = string.Empty;
    public string ApeMaterno { get; init; } = string.Empty;
    public string NombreCompleto { get; init; } = string.Empty;
    public string? Direccion { get; init; }
    public Guid? EntidadId { get; init; }
    public string NombreEntidad { get; init; } = string.Empty;
    public string RucEntidad { get; init; } = string.Empty;
    public int PerfilId { get; init; }
    public string NombrePerfil { get; init; } = string.Empty;
    public bool Activo { get; init; }
    public DateTime? LastLogin { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record UsuarioListDto
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string NombreCompleto { get; init; } = string.Empty;
    public string NumDni { get; init; } = string.Empty;
    public string NombreEntidad { get; init; } = string.Empty;
    public string NombrePerfil { get; init; } = string.Empty;
    public bool Activo { get; init; }
    public DateTime? LastLogin { get; init; }
}
