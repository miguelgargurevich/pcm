using PCM.Application.Common;
using MediatR;
using PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;

namespace PCM.Application.Features.Com3EPGD.Queries.GetCom3EPGDByEntidad;

public class GetCom3EPGDByEntidadQuery : IRequest<Result<Com3EPGDResponse>>
{
    public int CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}
