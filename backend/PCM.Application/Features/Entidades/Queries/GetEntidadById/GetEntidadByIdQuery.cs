using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;

namespace PCM.Application.Features.Entidades.Queries.GetEntidadById;

public record GetEntidadByIdQuery(Guid EntidadId) : IRequest<Result<EntidadDetailDto>>;
