using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Permisos;
using PCM.Application.Features.Permisos.Queries.VerificarPermiso;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Permisos;

public class VerificarPermisoHandler : IRequestHandler<VerificarPermisoQuery, Result<VerificarPermisoResponse>>
{
    private readonly PCMDbContext _context;

    public VerificarPermisoHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VerificarPermisoResponse>> Handle(VerificarPermisoQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var permiso = await _context.PerfilesPermisos
                .Include(pp => pp.PermisoModulo)
                .FirstOrDefaultAsync(pp => 
                    pp.PerfilId == request.PerfilId && 
                    pp.PermisoModulo.Codigo == request.CodigoModulo &&
                    pp.Activo,
                    cancellationToken);

            if (permiso == null)
            {
                return Result<VerificarPermisoResponse>.Success(new VerificarPermisoResponse
                {
                    TieneAcceso = false,
                    TipoAcceso = 'N',
                    PuedeCrear = false,
                    PuedeEditar = false,
                    PuedeEliminar = false,
                    PuedeConsultar = false,
                    Mensaje = "No tiene permisos para acceder a este módulo"
                });
            }

            bool tieneAcceso = permiso.TipoAcceso != 'N';
            bool puedeRealizarAccion = true;

            // Verificar acción específica si se proporciona
            if (!string.IsNullOrWhiteSpace(request.Accion))
            {
                puedeRealizarAccion = request.Accion.ToLower() switch
                {
                    "crear" => permiso.PuedeCrear,
                    "editar" => permiso.PuedeEditar,
                    "eliminar" => permiso.PuedeEliminar,
                    "consultar" => permiso.PuedeConsultar,
                    _ => false
                };

                if (!puedeRealizarAccion)
                {
                    return Result<VerificarPermisoResponse>.Success(new VerificarPermisoResponse
                    {
                        TieneAcceso = tieneAcceso,
                        TipoAcceso = permiso.TipoAcceso,
                        PuedeCrear = permiso.PuedeCrear,
                        PuedeEditar = permiso.PuedeEditar,
                        PuedeEliminar = permiso.PuedeEliminar,
                        PuedeConsultar = permiso.PuedeConsultar,
                        Mensaje = $"No tiene permisos para {request.Accion} en este módulo"
                    });
                }
            }

            return Result<VerificarPermisoResponse>.Success(new VerificarPermisoResponse
            {
                TieneAcceso = tieneAcceso,
                TipoAcceso = permiso.TipoAcceso,
                PuedeCrear = permiso.PuedeCrear,
                PuedeEditar = permiso.PuedeEditar,
                PuedeEliminar = permiso.PuedeEliminar,
                PuedeConsultar = permiso.PuedeConsultar,
                Mensaje = "Acceso permitido"
            });
        }
        catch (Exception ex)
        {
            return Result<VerificarPermisoResponse>.Failure(
                "Error al verificar permisos",
                new List<string> { ex.Message }
            );
        }
    }
}
