using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;

namespace PCM.Application.Features.MarcoNormativo.Commands.UpdateMarcoNormativo;

public record UpdateMarcoNormativoCommand : IRequest<Result<MarcoNormativoDetailDto>>
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
