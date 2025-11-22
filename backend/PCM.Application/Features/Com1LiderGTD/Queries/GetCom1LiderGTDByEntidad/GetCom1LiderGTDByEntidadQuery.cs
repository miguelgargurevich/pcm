using MediatR;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;
using PCM.Application.Common;

namespace PCM.Application.Features.Com1LiderGTD.Queries.GetCom1LiderGTDByEntidad;

public class GetCom1LiderGTDByEntidadQuery : IRequest<Result<Com1LiderGTDResponse?>>
{
    public int CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}
