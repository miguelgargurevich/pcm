using MediatR;
using PCM.Application.Common;
using PCM.Application.Features.Com10DatosAbiertos.Commands.CreateCom10DatosAbiertos;
using System;

namespace PCM.Application.Features.Com10DatosAbiertos.Queries.GetCom10DatosAbiertos
{
    public class GetCom10DatosAbiertosQuery : IRequest<Result<Com10DatosAbiertosResponse>>
    {
        public long CompromisoId { get; set; }
        public Guid EntidadId { get; set; }
    }
}
