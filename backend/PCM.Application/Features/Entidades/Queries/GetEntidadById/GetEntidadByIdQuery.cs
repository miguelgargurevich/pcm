using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;

namespace PCM.Application.Features.Entidades.Queries.GetEntidadById;

public record GetEntidadByIdQuery(int EntidadId) : IRequest<Result<EntidadDetailDto>>;
