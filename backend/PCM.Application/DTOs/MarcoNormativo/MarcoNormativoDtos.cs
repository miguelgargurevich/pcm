namespace PCM.Application.DTOs.MarcoNormativo;

public record CreateMarcoNormativoDto
{
    public required string NombreNorma { get; init; }
    public required string Numero { get; init; }
    public required int TipoNormaId { get; init; }
    public required int NivelGobiernoId { get; init; }
    public required int SectorId { get; init; }
    public required DateTime FechaPublicacion { get; init; }
    public string? Descripcion { get; init; }
    public string? Url { get; init; }
}

public record UpdateMarcoNormativoDto
{
    public required int NormaId { get; init; }
    public required string NombreNorma { get; init; }
    public required string Numero { get; init; }
    public required int TipoNormaId { get; init; }
    public required int NivelGobiernoId { get; init; }
    public required int SectorId { get; init; }
    public required DateTime FechaPublicacion { get; init; }
    public string? Descripcion { get; init; }
    public string? Url { get; init; }
}

public record MarcoNormativoDetailDto
{
    public int NormaId { get; init; }
    public string NombreNorma { get; init; } = string.Empty;
    public string Numero { get; init; } = string.Empty;
    public int TipoNormaId { get; init; }
    public string TipoNorma { get; init; } = string.Empty;
    public int NivelGobiernoId { get; init; }
    public string NivelGobierno { get; init; } = string.Empty;
    public int SectorId { get; init; }
    public string Sector { get; init; } = string.Empty;
    public DateTime FechaPublicacion { get; init; }
    public string? Descripcion { get; init; }
    public string? Url { get; init; }
    public bool Activo { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public record MarcoNormativoListDto
{
    public int NormaId { get; init; }
    public string NombreNorma { get; init; } = string.Empty;
    public string Numero { get; init; } = string.Empty;
    public int TipoNormaId { get; init; }
    public string TipoNorma { get; init; } = string.Empty;
    public int NivelGobiernoId { get; init; }
    public string NivelGobierno { get; init; } = string.Empty;
    public int SectorId { get; init; }
    public string Sector { get; init; } = string.Empty;
    public DateTime FechaPublicacion { get; init; }
    public string? Descripcion { get; init; }
    public string? Url { get; init; }
    public bool Activo { get; init; }
}
