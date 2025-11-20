using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Permisos;
using PCM.Application.Features.Permisos.Queries.GetPermisosByPerfil;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Permisos;

public class GetPermisosByPerfilHandler : IRequestHandler<GetPermisosByPerfilQuery, Result<PermisosPorPerfilResponse>>
{
    private readonly PCMDbContext _context;

    public GetPermisosByPerfilHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PermisosPorPerfilResponse>> Handle(GetPermisosByPerfilQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var perfil = await _context.Perfiles
                .FirstOrDefaultAsync(p => p.PerfilId == request.PerfilId, cancellationToken);

            if (perfil == null)
            {
                return Result<PermisosPorPerfilResponse>.Failure(
                    "Perfil no encontrado",
                    new List<string> { $"No se encontró el perfil con ID {request.PerfilId}" }
                );
            }

            var permisos = await _context.PerfilesPermisos
                .Include(pp => pp.PermisoModulo)
                .Where(pp => pp.PerfilId == request.PerfilId && pp.Activo)
                .OrderBy(pp => pp.PermisoModulo.Orden)
                .Select(pp => new PerfilPermisoDto
                {
                    PerfilPermisoId = pp.PerfilPermisoId,
                    PerfilId = pp.PerfilId,
                    PermisoModuloId = pp.PermisoModuloId,
                    CodigoModulo = pp.PermisoModulo.Codigo,
                    NombreModulo = pp.PermisoModulo.Nombre,
                    RutaModulo = pp.PermisoModulo.Ruta,
                    IconoModulo = pp.PermisoModulo.Icono,
                    TipoAcceso = pp.TipoAcceso,
                    PuedeCrear = pp.PuedeCrear,
                    PuedeEditar = pp.PuedeEditar,
                    PuedeEliminar = pp.PuedeEliminar,
                    PuedeConsultar = pp.PuedeConsultar,
                    Activo = pp.Activo
                })
                .ToListAsync(cancellationToken);

            var response = new PermisosPorPerfilResponse
            {
                PerfilId = perfil.PerfilId,
                NombrePerfil = perfil.Nombre,
                Permisos = permisos
            };

            return Result<PermisosPorPerfilResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<PermisosPorPerfilResponse>.Failure(
                "Error al obtener permisos del perfil",
                new List<string> { ex.Message }
            );
        }
    }
}
