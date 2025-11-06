using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Usuarios.Commands.ToggleUsuarioStatus;

public record ToggleUsuarioStatusCommand(Guid UserId) : IRequest<Result>;
