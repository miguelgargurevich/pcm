using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;

namespace PCM.Application.Features.Entidades.Queries.GetAllEntidades;

public record GetAllEntidadesQuery : IRequest<Result<List<EntidadListDto>>>
{
    public Guid? UbigeoId { get; init; }
    public int? ClasificacionId { get; init; }
    public int? NivelGobiernoId { get; init; }
    public int? SectorId { get; init; }
    public bool? Activo { get; init; }
    public string? SearchTerm { get; init; }
}
