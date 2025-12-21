using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.EvaluacionCriterios;
using PCM.Application.Features.EvaluacionCriterios.Queries.GetCriteriosByEntidad;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.EvaluacionCriterios;

/// <summary>
/// Handler para obtener los criterios evaluados de una entidad para un compromiso
/// </summary>
public class GetCriteriosByEntidadHandler : IRequestHandler<GetCriteriosByEntidadQuery, Result<CriteriosEvaluadosResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCriteriosByEntidadHandler> _logger;

    public GetCriteriosByEntidadHandler(PCMDbContext context, ILogger<GetCriteriosByEntidadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CriteriosEvaluadosResponse>> Handle(GetCriteriosByEntidadQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo criterios para Entidad {EntidadId}, Compromiso {CompromisoId}",
                request.EntidadId, request.CompromisoId);

            // Obtener todos los criterios del catálogo para este compromiso
            var criteriosCatalogo = await _context.CriteriosEvaluacion
                .Where(c => c.CompromisoId == request.CompromisoId && c.Activo)
                .OrderBy(c => c.CriterioEvaluacionId)
                .ToListAsync(cancellationToken);

            if (!criteriosCatalogo.Any())
            {
                _logger.LogInformation("No hay criterios definidos para el compromiso {CompromisoId}", request.CompromisoId);
                return Result<CriteriosEvaluadosResponse>.Success(new CriteriosEvaluadosResponse
                {
                    EntidadId = request.EntidadId,
                    CompromisoId = request.CompromisoId,
                    Criterios = new List<CriterioConRespuestaDto>(),
                    LastUpdated = null
                }, "No hay criterios definidos para este compromiso");
            }

            // Obtener las respuestas de la entidad para estos criterios
            var criterioIds = criteriosCatalogo.Select(c => c.CriterioEvaluacionId).ToList();
            var respuestasEntidad = await _context.EvaluacionRespuestasEntidad
                .Where(r => r.EntidadId == request.EntidadId && criterioIds.Contains(r.CriterioEvaluacionId))
                .ToListAsync(cancellationToken);

            // Combinar criterios del catálogo con respuestas de la entidad
            var criteriosConRespuesta = criteriosCatalogo.Select(criterio =>
            {
                var respuesta = respuestasEntidad.FirstOrDefault(r => r.CriterioEvaluacionId == criterio.CriterioEvaluacionId);
                return new CriterioConRespuestaDto
                {
                    CriterioEvaluacionId = criterio.CriterioEvaluacionId,
                    Descripcion = criterio.Descripcion,
                    Cumple = respuesta?.Cumple ?? false, // Si no hay respuesta, no cumple
                    RespuestaId = respuesta?.RespuestaId
                };
            }).ToList();

            // Obtener la última fecha de actualización
            var lastUpdated = respuestasEntidad.Any()
                ? respuestasEntidad.Max(r => r.UpdatedAt ?? r.CreatedAt)
                : null;

            var response = new CriteriosEvaluadosResponse
            {
                EntidadId = request.EntidadId,
                CompromisoId = request.CompromisoId,
                Criterios = criteriosConRespuesta,
                LastUpdated = lastUpdated
            };

            _logger.LogInformation("✅ {Count} criterios obtenidos para Entidad {EntidadId}, Compromiso {CompromisoId}",
                criteriosConRespuesta.Count, request.EntidadId, request.CompromisoId);

            return Result<CriteriosEvaluadosResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener criterios para Entidad {EntidadId}, Compromiso {CompromisoId}",
                request.EntidadId, request.CompromisoId);
            return Result<CriteriosEvaluadosResponse>.Failure($"Error al obtener criterios: {ex.Message}");
        }
    }
}
