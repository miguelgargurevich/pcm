using MediatR;
using PCM.Application.Common;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.CreateCom9ModeloGestionDocumental;
using System;

namespace PCM.Application.Features.Com9ModeloGestionDocumental.Queries.GetCom9ModeloGestionDocumental
{
    public class GetCom9ModeloGestionDocumentalQuery : IRequest<Result<Com9ModeloGestionDocumentalResponse>>
    {
        public long CompromisoId { get; set; }
        public Guid EntidadId { get; set; }
    }
}
