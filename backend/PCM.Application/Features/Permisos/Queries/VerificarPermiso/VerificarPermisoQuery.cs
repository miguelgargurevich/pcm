using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Permisos;

namespace PCM.Application.Features.Permisos.Queries.VerificarPermiso;

public class VerificarPermisoQuery : IRequest<Result<VerificarPermisoResponse>>
{
    public int PerfilId { get; set; }
    public string CodigoModulo { get; set; } = string.Empty;
    public string? Accion { get; set; }
}
