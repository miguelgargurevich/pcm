using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Permisos;

namespace PCM.Application.Features.Permisos.Queries.GetPermisosByPerfil;

public class GetPermisosByPerfilQuery : IRequest<Result<PermisosPorPerfilResponse>>
{
    public int PerfilId { get; set; }
}
