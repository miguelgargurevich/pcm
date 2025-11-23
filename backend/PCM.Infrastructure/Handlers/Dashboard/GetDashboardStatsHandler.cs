using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Dashboard;
using PCM.Application.Features.Dashboard.Queries.GetDashboardStats;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Dashboard;

public class GetDashboardStatsHandler : IRequestHandler<GetDashboardStatsQuery, Result<DashboardStatsDto>>
{
    private readonly PCMDbContext _context;

    public GetDashboardStatsHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<DashboardStatsDto>> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Obtener totales
            int totalUsuarios;
            int totalEntidades;
            int usuariosActivos;
            int entidadesActivas;

            if (request.PerfilNombre == "Entidad" && request.EntidadId.HasValue)
            {
                totalUsuarios = await _context.Usuarios.CountAsync(u => u.EntidadId == request.EntidadId, cancellationToken);
                totalEntidades = 1;
                usuariosActivos = await _context.Usuarios.CountAsync(u => u.EntidadId == request.EntidadId && u.Activo, cancellationToken);
                entidadesActivas = 1;
            }
            else
            {
                totalUsuarios = await _context.Usuarios.CountAsync(cancellationToken);
                totalEntidades = await _context.Entidades.CountAsync(cancellationToken);
                usuariosActivos = await _context.Usuarios.CountAsync(u => u.Activo, cancellationToken);
                entidadesActivas = await _context.Entidades.CountAsync(e => e.Activo, cancellationToken);
            }

            var totalMarcoNormativo = await _context.MarcosNormativos.CountAsync(cancellationToken);
            var totalCompromisos = await _context.CompromisosGobiernoDigital.CountAsync(cancellationToken);
            var compromisosActivos = await _context.CompromisosGobiernoDigital.CountAsync(c => c.Activo, cancellationToken);

            // Obtener compromisos por estado
            var compromisosPendientes = await _context.CompromisosGobiernoDigital
                .CountAsync(c => c.Activo && c.Estado == 1, cancellationToken); // Pendiente

            var compromisosCompletados = await _context.CompromisosGobiernoDigital
                .CountAsync(c => c.Activo && c.Estado == 3, cancellationToken); // Completado

            var stats = new DashboardStatsDto
            {
                TotalUsuarios = totalUsuarios,
                TotalEntidades = totalEntidades,
                TotalMarcoNormativo = totalMarcoNormativo,
                TotalCompromisos = totalCompromisos,
                UsuariosActivos = usuariosActivos,
                EntidadesActivas = entidadesActivas,
                CompromisosActivos = compromisosActivos,
                CompromisosPendientes = compromisosPendientes,
                CompromisosCompletados = compromisosCompletados
            };

            return Result<DashboardStatsDto>.Success(stats);
        }
        catch (Exception ex)
        {
            return Result<DashboardStatsDto>.Failure(
                "Error al obtener estadísticas del dashboard",
                new List<string> { ex.Message }
            );
        }
    }
}
