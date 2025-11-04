using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Entidades.Commands.ToggleEntidadStatus;

public record ToggleEntidadStatusCommand(int EntidadId) : IRequest<Result>;
