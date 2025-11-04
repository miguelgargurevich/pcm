using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;

namespace PCM.Application.Features.Usuarios.Queries.GetAllUsuarios;

public record GetAllUsuariosQuery : IRequest<Result<List<UsuarioListDto>>>
{
    public int? EntidadId { get; init; }
    public int? PerfilId { get; init; }
    public bool? Activo { get; init; }
}
