using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Commands.UpdateCompromiso;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class UpdateCompromisoHandler : IRequestHandler<UpdateCompromisoCommand, Result<CompromisoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCompromisoHandler> _logger;

    public UpdateCompromisoHandler(PCMDbContext context, ILogger<UpdateCompromisoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CompromisoResponseDto>> Handle(UpdateCompromisoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var compromiso = await _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                .Include(c => c.CriteriosEvaluacion)
                .Include(c => c.AlcancesCompromisos)
                .FirstOrDefaultAsync(c => c.CompromisoId == request.CompromisoId, cancellationToken);

            if (compromiso == null)
            {
                return Result<CompromisoResponseDto>.Failure("Compromiso no encontrado");
            }

            // Update main properties
            compromiso.NombreCompromiso = request.NombreCompromiso;
            compromiso.Descripcion = request.Descripcion;
            compromiso.Alcances = string.Join(",", request.Alcances.Select(a => a.Trim()).Distinct(StringComparer.OrdinalIgnoreCase)); // Convert list to comma-separated string
            compromiso.FechaInicio = DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc);
            compromiso.FechaFin = DateTime.SpecifyKind(request.FechaFin, DateTimeKind.Utc);
            compromiso.Activo = request.Activo;
            compromiso.UpdatedAt = DateTime.UtcNow;
            
            // Mark specific properties as modified (not the entire entity to avoid updating CreatedAt)
            _context.Entry(compromiso).Property(c => c.NombreCompromiso).IsModified = true;
            _context.Entry(compromiso).Property(c => c.Descripcion).IsModified = true;
            _context.Entry(compromiso).Property(c => c.Alcances).IsModified = true;
            _context.Entry(compromiso).Property(c => c.FechaInicio).IsModified = true;
            _context.Entry(compromiso).Property(c => c.FechaFin).IsModified = true;
            _context.Entry(compromiso).Property(c => c.Activo).IsModified = true;
            _context.Entry(compromiso).Property(c => c.UpdatedAt).IsModified = true;

            // Update alcances - remove old ones first, then save, then add new ones
            if (compromiso.AlcancesCompromisos != null && compromiso.AlcancesCompromisos.Any())
            {
                _context.AlcancesCompromisos.RemoveRange(compromiso.AlcancesCompromisos);
                await _context.SaveChangesAsync(cancellationToken); // Save deletion first
            }

            if (request.Alcances != null && request.Alcances.Any())
            {
                var addedSubclasificacionIds = new HashSet<long>();
                
                foreach (var alcanceIdStr in request.Alcances)
                {
                    if (long.TryParse(alcanceIdStr, out long alcanceId))
                    {
                        // PRIMERO verificar si es un clasificacion_id (los alcances del frontend son clasificaciones)
                        var subclasificaciones = await _context.Subclasificaciones
                            .Where(s => s.ClasificacionId == (int)alcanceId && s.Activo)
                            .ToListAsync(cancellationToken);
                        
                        if (subclasificaciones.Any())
                        {
                            // Es un clasificacion_id - insertar todas sus subclasificaciones
                            foreach (var sub in subclasificaciones)
                            {
                                if (!addedSubclasificacionIds.Contains(sub.SubclasificacionId))
                                {
                                    var alcanceCompromiso = new AlcanceCompromiso
                                    {
                                        CompromisoId = compromiso.CompromisoId,
                                        ClasificacionId = sub.SubclasificacionId, // Mapea a subclasificacion_id en BD
                                        Activo = true,
                                        CreatedAt = DateTime.UtcNow
                                    };
                                    _context.AlcancesCompromisos.Add(alcanceCompromiso);
                                    addedSubclasificacionIds.Add(sub.SubclasificacionId);
                                }
                            }
                        }
                        else
                        {
                            // Si no es clasificacion, verificar si es un subclasificacion_id directo
                            var subclasificacion = await _context.Subclasificaciones
                                .FirstOrDefaultAsync(s => s.SubclasificacionId == alcanceId, cancellationToken);
                            
                            if (subclasificacion != null && !addedSubclasificacionIds.Contains(alcanceId))
                            {
                                var alcanceCompromiso = new AlcanceCompromiso
                                {
                                    CompromisoId = compromiso.CompromisoId,
                                    ClasificacionId = alcanceId, // Mapea a subclasificacion_id en BD
                                    Activo = true,
                                    CreatedAt = DateTime.UtcNow
                                };
                                _context.AlcancesCompromisos.Add(alcanceCompromiso);
                                addedSubclasificacionIds.Add(alcanceId);
                            }
                            else if (subclasificacion == null)
                            {
                                _logger.LogWarning("El ID {AlcanceId} no corresponde a ninguna clasificacion ni subclasificacion", alcanceId);
                            }
                        }
                    }
                }
            }

            // Update normativas - remove old ones and add new ones
            _context.CompromisosNormativas.RemoveRange(compromiso.Normativas);

            if (request.Normativas != null && request.Normativas.Any())
            {
                foreach (var normativaDto in request.Normativas)
                {
                    var normativa = new CompromisoNormativa
                    {
                        CompromisoId = compromiso.CompromisoId,
                        NormaId = normativaDto.NormaId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CompromisosNormativas.Add(normativa);
                }
            }

            // Update criterios de evaluacion - update/add/deactivate intelligently
            // NO eliminar criterios que tienen respuestas asociadas (foreign key constraint)
            var existingCriteriosIds = compromiso.CriteriosEvaluacion.Select(c => c.CriterioEvaluacionId).ToList();
            var newCriteriosIds = request.CriteriosEvaluacion?
                .Where(c => c.CriterioEvaluacionId.HasValue && c.CriterioEvaluacionId.Value > 0)
                .Select(c => c.CriterioEvaluacionId.Value)
                .ToList() ?? new List<int>();

            // 1. Desactivar criterios que ya no están en la petición SOLO si no tienen respuestas
            var criteriosToRemove = compromiso.CriteriosEvaluacion.Where(c => !newCriteriosIds.Contains(c.CriterioEvaluacionId)).ToList();
            foreach (var criterio in criteriosToRemove)
            {
                // Verificar si tiene respuestas asociadas
                var tieneRespuestas = await _context.EvaluacionRespuestasEntidad
                    .AnyAsync(r => r.CriterioEvaluacionId == criterio.CriterioEvaluacionId, cancellationToken);

                if (tieneRespuestas)
                {
                    // Si tiene respuestas, solo desactivarlo
                    _logger.LogWarning("Criterio {CriterioId} tiene respuestas asociadas. Se desactiva en lugar de eliminar.", criterio.CriterioEvaluacionId);
                    criterio.Activo = false;
                    criterio.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    // Si no tiene respuestas, se puede eliminar
                    _context.CriteriosEvaluacion.Remove(criterio);
                }
            }

            // 2. Actualizar criterios existentes
            if (request.CriteriosEvaluacion != null)
            {
                foreach (var criterioDto in request.CriteriosEvaluacion.Where(c => c.CriterioEvaluacionId.HasValue && c.CriterioEvaluacionId.Value > 0))
                {
                    var existingCriterio = compromiso.CriteriosEvaluacion.FirstOrDefault(c => c.CriterioEvaluacionId == criterioDto.CriterioEvaluacionId.Value);
                    if (existingCriterio != null)
                    {
                        existingCriterio.Descripcion = criterioDto.Descripcion;
                        existingCriterio.Activo = criterioDto.Activo;
                        existingCriterio.UpdatedAt = DateTime.UtcNow;
                    }
                }

                // 3. Agregar nuevos criterios (los que no tienen ID o tienen ID = 0 o null)
                foreach (var criterioDto in request.CriteriosEvaluacion.Where(c => !c.CriterioEvaluacionId.HasValue || c.CriterioEvaluacionId.Value == 0))
                {
                    var criterio = new CriterioEvaluacion
                    {
                        CompromisoId = compromiso.CompromisoId,
                        Descripcion = criterioDto.Descripcion,
                        IdEstado = 1, // Default pendiente
                        Activo = criterioDto.Activo,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = null
                    };
                    _context.CriteriosEvaluacion.Add(criterio);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Reload with related data
            var updated = await _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.TipoNorma)
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.NivelGobierno)
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.Sector)
                .Include(c => c.CriteriosEvaluacion)
                .FirstOrDefaultAsync(c => c.CompromisoId == compromiso.CompromisoId, cancellationToken);

            if (updated == null)
            {
                return Result<CompromisoResponseDto>.Failure("No se pudo recuperar el compromiso actualizado");
            }

            var response = MapToResponseDto(updated);

            _logger.LogInformation("Compromiso updated successfully: {CompromisoId}", compromiso.CompromisoId);
            return Result<CompromisoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? ex.Message;
            var fullMessage = ex.InnerException?.InnerException?.Message ?? innerMessage;
            _logger.LogError(ex, "Error updating compromiso {CompromisoId}. Inner: {InnerMessage}", request.CompromisoId, fullMessage);
            return Result<CompromisoResponseDto>.Failure($"Error al actualizar el compromiso: {fullMessage}");
        }
    }

    private CompromisoResponseDto MapToResponseDto(CompromisoGobiernoDigital compromiso)
    {
        return new CompromisoResponseDto
        {
            CompromisoId = compromiso.CompromisoId,
            NombreCompromiso = compromiso.NombreCompromiso,
            Descripcion = compromiso.Descripcion,
            Alcances = string.IsNullOrEmpty(compromiso.Alcances) 
                ? new List<string>() 
                : compromiso.Alcances.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(a => a.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList(),
            FechaInicio = compromiso.FechaInicio,
            FechaFin = compromiso.FechaFin,
            Estado = compromiso.Estado,
            Activo = compromiso.Activo,
            CreatedAt = compromiso.CreatedAt,
            UpdatedAt = compromiso.UpdatedAt,
            Normativas = compromiso.Normativas?.Select(n => new CompromisoNormativaResponseDto
            {
                CompromisoNormativaId = n.CompromisoNormativaId,
                CompromisoId = n.CompromisoId,
                NormaId = n.NormaId,
                NombreNorma = n.Norma?.NombreNorma ?? string.Empty,
                Numero = n.Norma?.Numero ?? string.Empty,
                TipoNormaId = n.Norma?.TipoNormaId,
                TipoNorma = n.Norma?.TipoNorma?.Nombre ?? string.Empty,
                NivelGobierno = n.Norma?.NivelGobierno?.Nombre ?? string.Empty,
                Sector = n.Norma?.Sector?.Nombre ?? string.Empty,
                FechaPublicacion = n.Norma?.FechaPublicacion,
                CreatedAt = n.CreatedAt
            }).ToList() ?? new List<CompromisoNormativaResponseDto>(),
            CriteriosEvaluacion = compromiso.CriteriosEvaluacion?.Select(c => new CriterioEvaluacionResponseDto
            {
                CriterioEvaluacionId = c.CriterioEvaluacionId,
                CompromisoId = c.CompromisoId,
                Descripcion = c.Descripcion,
                Estado = c.IdEstado,
                Activo = c.Activo,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList() ?? new List<CriterioEvaluacionResponseDto>()
        };
    }
}
