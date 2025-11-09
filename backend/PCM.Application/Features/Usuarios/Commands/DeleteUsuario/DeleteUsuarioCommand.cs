using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Usuarios.Commands.DeleteUsuario;

public class DeleteUsuarioCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }

    public DeleteUsuarioCommand(Guid userId)
    {
        UserId = userId;
    }
}
