using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;

namespace PCM.Application.Features.MarcoNormativo.Commands.UpdateMarcoNormativo;

public record UpdateMarcoNormativoCommand : IRequest<Result<MarcoNormativoDetailDto>>
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
