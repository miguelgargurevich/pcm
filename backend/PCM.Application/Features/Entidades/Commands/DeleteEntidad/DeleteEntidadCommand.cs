using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Entidades.Commands.DeleteEntidad;

public class DeleteEntidadCommand : IRequest<Result<bool>>
{
    public Guid EntidadId { get; set; }

    public DeleteEntidadCommand(Guid entidadId)
    {
        EntidadId = entidadId;
    }
}
