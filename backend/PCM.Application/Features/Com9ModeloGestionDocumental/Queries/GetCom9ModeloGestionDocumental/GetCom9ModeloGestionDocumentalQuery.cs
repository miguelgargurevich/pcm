using MediatR;
using PCM.Application.Common;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.CreateCom9ModeloGestionDocumental;

namespace PCM.Application.Features.Com9ModeloGestionDocumental.Queries.GetCom9ModeloGestionDocumental
{
    public class GetCom9ModeloGestionDocumentalQuery : IRequest<Result<Com9ModeloGestionDocumentalResponse>>
    {
        public int CompromisoId { get; set; }
        public int EntidadId { get; set; }
    }
}
