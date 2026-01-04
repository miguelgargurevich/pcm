using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Dashboard;
using PCM.Application.Features.Dashboard.Queries.GetEntidadesStats;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Dashboard;

public class GetEntidadesStatsHandler : IRequestHandler<GetEntidadesStatsQuery, Result<EntidadesStatsDto>>
{
    private readonly PCMDbContext _context;

    public GetEntidadesStatsHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<EntidadesStatsDto>> Handle(GetEntidadesStatsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Obtener todas las entidades activas con su subclasificación
            var entidades = await _context.Entidades
                .Include(e => e.Sector)
                .Include(e => e.Clasificacion) // Clasificacion es realmente Subclasificacion
                .Where(e => e.Activo)
                .OrderBy(e => e.Nombre)
                .ToListAsync(cancellationToken);

            var entidadesStats = new List<EntidadStatsDto>();

            foreach (var entidad in entidades)
            {
                // Calcular el total de compromisos ASIGNADOS a la entidad según su subclasificación
                // usando la tabla AlcancesCompromisos
                int totalCompromisosAsignados = 21; // Valor por defecto
                
                if (entidad.ClasificacionId.HasValue)
                {
                    // Contar cuántos compromisos activos están asignados a esta subclasificación
                    totalCompromisosAsignados = await _context.AlcancesCompromisos
                        .Where(ac => ac.ClasificacionId == entidad.ClasificacionId.Value && ac.Activo)
                        .Select(ac => ac.CompromisoId)
                        .Distinct()
                        .CountAsync(cancellationToken);
                    
                    // Si no hay alcances definidos, usar valor por defecto
                    if (totalCompromisosAsignados == 0)
                    {
                        totalCompromisosAsignados = 21;
                    }
                }

                // Obtener compromisos de la entidad
                var compromisos = await _context.CumplimientosNormativos
                    .Where(c => c.EntidadId == entidad.EntidadId)
                    .ToListAsync(cancellationToken);

                // Contar por estado
                var pendientes = compromisos.Count(c => c.EstadoId == 1);
                var sinReportar = compromisos.Count(c => c.EstadoId == 2);
                var noExigible = compromisos.Count(c => c.EstadoId == 3);
                var enProceso = compromisos.Count(c => c.EstadoId == 4);
                var enviados = compromisos.Count(c => c.EstadoId == 5);
                var enRevision = compromisos.Count(c => c.EstadoId == 6);
                var observados = compromisos.Count(c => c.EstadoId == 7);
                var aceptados = compromisos.Count(c => c.EstadoId == 8);

                var totalActivos = compromisos.Count(c => c.EstadoId != 3);
                var totalCompromisosEsperados = totalCompromisosAsignados;
                var compromisosSinRegistro = Math.Max(0, totalCompromisosEsperados - compromisos.Count());
                
                var porcentaje = totalActivos > 0 
                    ? (byte)Math.Round((double)aceptados / totalActivos * 100) 
                    : (byte)0;

                var ultimaActualizacion = compromisos
                    .Where(c => c.UpdatedAt.HasValue)
                    .OrderByDescending(c => c.UpdatedAt)
                    .Select(c => c.UpdatedAt)
                    .FirstOrDefault();

                entidadesStats.Add(new EntidadStatsDto
                {
                    EntidadId = entidad.EntidadId,
                    Nombre = entidad.Nombre,
                    Ruc = entidad.Ruc,
                    SectorNombre = entidad.Sector?.Nombre,
                    ClasificacionNombre = entidad.Clasificacion?.Nombre,
                    Activo = entidad.Activo,
                    TotalCompromisos = Math.Max(totalCompromisosEsperados, compromisos.Count()),
                    Pendientes = pendientes,
                    SinReportar = sinReportar + compromisosSinRegistro,
                    NoExigible = noExigible,
                    EnProceso = enProceso,
                    Enviados = enviados,
                    EnRevision = enRevision,
                    Observados = observados,
                    Aceptados = aceptados,
                    PorcentajeCumplimiento = porcentaje,
                    UltimaActualizacion = ultimaActualizacion
                });
            }

            var result = new EntidadesStatsDto { Entidades = entidadesStats };
            return Result<EntidadesStatsDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<EntidadesStatsDto>.Failure(
                "Error al obtener estadísticas de entidades",
                new List<string> { ex.Message }
            );
        }
    }
}
