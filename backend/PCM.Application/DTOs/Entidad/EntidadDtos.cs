namespace PCM.Application.DTOs.Entidad;

public record CreateEntidadDto
{
    public required string Ruc { get; init; }
    public required string Nombre { get; init; }
    public required string Direccion { get; init; }
    public required Guid UbigeoId { get; init; }
    public required string Telefono { get; init; }
    public required string Email { get; init; }
    public string? Web { get; init; }
    public required int NivelGobiernoId { get; init; }
    public required int SectorId { get; init; }
    public required long ClasificacionId { get; init; }
    public required string NombreAlcalde { get; init; }
    public required string ApePatAlcalde { get; init; }
    public required string ApeMatAlcalde { get; init; }
    public required string EmailAlcalde { get; init; }
    public bool Activo { get; init; } = true;
}

public record UpdateEntidadDto
{
    public required Guid EntidadId { get; init; }
    public required string Ruc { get; init; }
    public required string Nombre { get; init; }
    public required string Direccion { get; init; }
    public required Guid UbigeoId { get; init; }
    public required string Telefono { get; init; }
    public required string Email { get; init; }
    public string? Web { get; init; }
    public required int NivelGobiernoId { get; init; }
    public required int SectorId { get; init; }
    public required long ClasificacionId { get; init; }
    public required string NombreAlcalde { get; init; }
    public required string ApePatAlcalde { get; init; }
    public required string ApeMatAlcalde { get; init; }
    public required string EmailAlcalde { get; init; }
    public bool Activo { get; init; }
}

public record EntidadDetailDto
{
    public Guid EntidadId { get; init; }
    public string Ruc { get; init; } = string.Empty;
    public string Nombre { get; init; } = string.Empty;
    public string Direccion { get; init; } = string.Empty;
    public Guid UbigeoId { get; init; }
    public string UbigeoCodigo { get; init; } = string.Empty;
    public string Departamento { get; init; } = string.Empty;
    public string Provincia { get; init; } = string.Empty;
    public string Distrito { get; init; } = string.Empty;
    public string Telefono { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Web { get; init; }
    public int NivelGobiernoId { get; init; }
    public int SectorId { get; init; }
    public long ClasificacionId { get; init; }
    public string NombreClasificacion { get; init; } = string.Empty;
    public string NombreAlcalde { get; init; } = string.Empty;
    public string ApePatAlcalde { get; init; } = string.Empty;
    public string ApeMatAlcalde { get; init; } = string.Empty;
    public string EmailAlcalde { get; init; } = string.Empty;
    public bool Activo { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record EntidadListDto
{
    public Guid EntidadId { get; init; }
    public string Ruc { get; init; } = string.Empty;
    public string Nombre { get; init; } = string.Empty;
    public string Direccion { get; init; } = string.Empty;
    public Guid UbigeoId { get; init; }
    public string Departamento { get; init; } = string.Empty;
    public string Provincia { get; init; } = string.Empty;
    public string Distrito { get; init; } = string.Empty;
    public int NivelGobiernoId { get; init; }
    public string NivelGobierno { get; init; } = string.Empty;
    public int SectorId { get; init; }
    public string NombreSector { get; init; } = string.Empty;
    public long ClasificacionId { get; init; }
    public string NombreClasificacion { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Telefono { get; init; } = string.Empty;
    public string? Web { get; init; }
    public string NombreAlcalde { get; init; } = string.Empty;
    public string ApePatAlcalde { get; init; } = string.Empty;
    public string ApeMatAlcalde { get; init; } = string.Empty;
    public string EmailAlcalde { get; init; } = string.Empty;
    public bool Activo { get; init; }
}

public record ValidateRucDto
{
    public required string Ruc { get; init; }
}

public record RucValidationResultDto
{
    public bool IsValid { get; init; }
    public string? RazonSocial { get; init; }
    public string? Direccion { get; init; }
    public string? Estado { get; init; }
    public string? Message { get; init; }
}
