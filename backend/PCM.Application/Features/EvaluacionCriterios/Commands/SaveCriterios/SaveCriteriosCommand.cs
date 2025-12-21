using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.EvaluacionCriterios;

namespace PCM.Application.Features.EvaluacionCriterios.Commands.SaveCriterios;

/// <summary>
/// Command para guardar/actualizar los criterios evaluados de una entidad para un compromiso
/// </summary>
public class SaveCriteriosCommand : IRequest<Result<SaveCriteriosResponse>>
{
    public Guid EntidadId { get; set; }
    public long CompromisoId { get; set; }
    public List<CriterioEvaluadoDto> Criterios { get; set; } = new();
}
