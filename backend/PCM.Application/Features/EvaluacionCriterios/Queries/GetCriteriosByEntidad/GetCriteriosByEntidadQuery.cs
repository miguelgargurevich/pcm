using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.EvaluacionCriterios;

namespace PCM.Application.Features.EvaluacionCriterios.Queries.GetCriteriosByEntidad;

/// <summary>
/// Query para obtener los criterios evaluados de una entidad para un compromiso
/// </summary>
public class GetCriteriosByEntidadQuery : IRequest<Result<CriteriosEvaluadosResponse>>
{
    public Guid EntidadId { get; set; }
    public long CompromisoId { get; set; }
}
