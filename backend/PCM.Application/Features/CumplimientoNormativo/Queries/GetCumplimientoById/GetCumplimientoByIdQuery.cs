using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;

namespace PCM.Application.Features.CumplimientoNormativo.Queries.GetCumplimientoById;

public class GetCumplimientoByIdQuery : IRequest<Result<CumplimientoResponseDto>>
{
    public int CumplimientoId { get; set; }
}
