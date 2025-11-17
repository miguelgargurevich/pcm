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
            var totalUsuarios = await _context.Usuarios.CountAsync(cancellationToken);
            var totalEntidades = await _context.Entidades.CountAsync(cancellationToken);
            var totalMarcoNormativo = await _context.MarcosNormativos.CountAsync(cancellationToken);
            var totalCompromisos = await _context.CompromisosGobiernoDigital.CountAsync(cancellationToken);

            // Obtener activos
            var usuariosActivos = await _context.Usuarios.CountAsync(u => u.Activo, cancellationToken);
            var entidadesActivas = await _context.Entidades.CountAsync(e => e.Activo, cancellationToken);
            var compromisosActivos = await _context.CompromisosGobiernoDigital.CountAsync(c => c.Activo, cancellationToken);

            // Obtener compromisos por estado
            var compromisosPendientes = await _context.CompromisosGobiernoDigital
                .CountAsync(c => c.Activo && c.IdEstado == 1, cancellationToken); // Pendiente

            var compromisosCompletados = await _context.CompromisosGobiernoDigital
                .CountAsync(c => c.Activo && c.IdEstado == 3, cancellationToken); // Completado

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
