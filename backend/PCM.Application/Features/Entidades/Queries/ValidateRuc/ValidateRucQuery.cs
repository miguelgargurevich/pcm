using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;

namespace PCM.Application.Features.Entidades.Queries.ValidateRuc;

public record ValidateRucQuery(string Ruc) : IRequest<Result<RucValidationResultDto>>;
