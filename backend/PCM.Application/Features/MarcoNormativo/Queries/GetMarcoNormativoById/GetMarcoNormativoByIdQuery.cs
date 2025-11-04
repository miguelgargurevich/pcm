using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;

namespace PCM.Application.Features.MarcoNormativo.Queries.GetMarcoNormativoById;

public record GetMarcoNormativoByIdQuery(int MarcoNormativoId) : IRequest<Result<MarcoNormativoDetailDto>>;
