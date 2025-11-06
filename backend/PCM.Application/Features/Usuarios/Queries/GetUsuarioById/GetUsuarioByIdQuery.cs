using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;

namespace PCM.Application.Features.Usuarios.Queries.GetUsuarioById;

public record GetUsuarioByIdQuery(Guid UserId) : IRequest<Result<UsuarioDetailDto>>;
