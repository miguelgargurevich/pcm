using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.MarcoNormativo.Commands.ToggleMarcoNormativoStatus;

public record ToggleMarcoNormativoStatusCommand(int MarcoNormativoId) : IRequest<Result>;
