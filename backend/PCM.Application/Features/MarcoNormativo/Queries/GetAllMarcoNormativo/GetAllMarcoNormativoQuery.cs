using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;

namespace PCM.Application.Features.MarcoNormativo.Queries.GetAllMarcoNormativo;

public record GetAllMarcoNormativoQuery : IRequest<Result<List<MarcoNormativoListDto>>>
{
    public Guid? UserId { get; init; }
    public int? TipoNormaId { get; init; }
    public bool? Activo { get; init; }
    public string? SearchTerm { get; init; }
    public DateTime? FechaDesde { get; init; }
    public DateTime? FechaHasta { get; init; }
}
