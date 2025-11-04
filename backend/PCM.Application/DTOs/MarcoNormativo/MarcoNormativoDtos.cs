namespace PCM.Application.DTOs.MarcoNormativo;

public record CreateMarcoNormativoDto
{
    public required string Titulo { get; init; }
    public required string NumeroNorma { get; init; }
    public required int TipoNormaId { get; init; }
    public required DateTime FechaPublicacion { get; init; }
    public string? FechaVigencia { get; init; }
    public required string Entidad { get; init; }
    public string? Descripcion { get; init; }
    public string? UrlDocumento { get; init; }
}

public record UpdateMarcoNormativoDto
{
    public required int MarcoNormativoId { get; init; }
    public required string Titulo { get; init; }
    public required string NumeroNorma { get; init; }
    public required int TipoNormaId { get; init; }
    public required DateTime FechaPublicacion { get; init; }
    public string? FechaVigencia { get; init; }
    public required string Entidad { get; init; }
    public string? Descripcion { get; init; }
    public string? UrlDocumento { get; init; }
}

public record MarcoNormativoDetailDto
{
    public int MarcoNormativoId { get; init; }
    public string Titulo { get; init; } = string.Empty;
    public string NumeroNorma { get; init; } = string.Empty;
    public int TipoNormaId { get; init; }
    public string TipoNorma { get; init; } = string.Empty;
    public DateTime FechaPublicacion { get; init; }
    public string? FechaVigencia { get; init; }
    public string Entidad { get; init; } = string.Empty;
    public string? Descripcion { get; init; }
    public string? UrlDocumento { get; init; }
    public bool Activo { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record MarcoNormativoListDto
{
    public int MarcoNormativoId { get; init; }
    public string Titulo { get; init; } = string.Empty;
    public string NumeroNorma { get; init; } = string.Empty;
    public string TipoNorma { get; init; } = string.Empty;
    public DateTime FechaPublicacion { get; init; }
    public string Entidad { get; init; } = string.Empty;
    public bool Activo { get; init; }
}
