using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.EvaluacionCriterios;
using PCM.Application.Features.EvaluacionCriterios.Commands.SaveCriterios;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.EvaluacionCriterios;

/// <summary>
/// Handler para guardar/actualizar criterios evaluados de una entidad
/// </summary>
public class SaveCriteriosHandler : IRequestHandler<SaveCriteriosCommand, Result<SaveCriteriosResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<SaveCriteriosHandler> _logger;

    public SaveCriteriosHandler(PCMDbContext context, ILogger<SaveCriteriosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<SaveCriteriosResponse>> Handle(SaveCriteriosCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Guardando criterios para Entidad {EntidadId}, Compromiso {CompromisoId}",
                request.EntidadId, request.CompromisoId);

            // Validar que la entidad existe
            var entidadExists = await _context.Entidades
                .AnyAsync(e => e.EntidadId == request.EntidadId, cancellationToken);

            if (!entidadExists)
            {
                return Result<SaveCriteriosResponse>.Failure($"La entidad {request.EntidadId} no existe");
            }

            // Obtener los criterios válidos para este compromiso
            var criteriosValidos = await _context.CriteriosEvaluacion
                .Where(c => c.CompromisoId == request.CompromisoId && c.Activo)
                .Select(c => c.CriterioEvaluacionId)
                .ToListAsync(cancellationToken);

            if (!criteriosValidos.Any())
            {
                return Result<SaveCriteriosResponse>.Failure($"No hay criterios definidos para el compromiso {request.CompromisoId}");
            }

            // Obtener respuestas existentes para esta entidad y compromiso
            var respuestasExistentes = await _context.EvaluacionRespuestasEntidad
                .Where(r => r.EntidadId == request.EntidadId &&
                           criteriosValidos.Contains(r.CriterioEvaluacionId))
                .ToListAsync(cancellationToken);

            var now = DateTime.UtcNow;
            var criteriosGuardados = 0;

            foreach (var criterioDto in request.Criterios)
            {
                // Validar que el criterio pertenece al compromiso
                if (!criteriosValidos.Contains(criterioDto.CriterioId))
                {
                    _logger.LogWarning("Criterio {CriterioId} no pertenece al compromiso {CompromisoId}",
                        criterioDto.CriterioId, request.CompromisoId);
                    continue;
                }

                var respuestaExistente = respuestasExistentes
                    .FirstOrDefault(r => r.CriterioEvaluacionId == criterioDto.CriterioId);

                if (respuestaExistente != null)
                {
                    // Actualizar respuesta existente
                    respuestaExistente.Cumple = criterioDto.Cumple;
                    respuestaExistente.UpdatedAt = now;
                    _context.EvaluacionRespuestasEntidad.Update(respuestaExistente);
                }
                else
                {
                    // Crear nueva respuesta
                    var nuevaRespuesta = new EvaluacionRespuestaEntidad
                    {
                        EntidadId = request.EntidadId,
                        CriterioEvaluacionId = criterioDto.CriterioId,
                        Cumple = criterioDto.Cumple,
                        CreatedAt = now,
                        UpdatedAt = now
                    };
                    await _context.EvaluacionRespuestasEntidad.AddAsync(nuevaRespuesta, cancellationToken);
                }

                criteriosGuardados++;
            }

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("✅ {Count} criterios guardados para Entidad {EntidadId}, Compromiso {CompromisoId}",
                criteriosGuardados, request.EntidadId, request.CompromisoId);

            return Result<SaveCriteriosResponse>.Success(new SaveCriteriosResponse
            {
                Success = true,
                Message = $"{criteriosGuardados} criterios guardados exitosamente",
                TotalCriteriosGuardados = criteriosGuardados,
                UpdatedAt = now
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al guardar criterios para Entidad {EntidadId}, Compromiso {CompromisoId}",
                request.EntidadId, request.CompromisoId);
            return Result<SaveCriteriosResponse>.Failure($"Error al guardar criterios: {ex.Message}");
        }
    }
}
