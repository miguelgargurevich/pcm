using MediatR;
using PCM.Application.Common;
using PCM.Application.Features.Com4PEI.Commands.CreateCom4PEI;

namespace PCM.Application.Features.Com4PEI.Queries.GetCom4PEI;

public class GetCom4PEIQuery : IRequest<Result<Com4PEIResponse?>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}
