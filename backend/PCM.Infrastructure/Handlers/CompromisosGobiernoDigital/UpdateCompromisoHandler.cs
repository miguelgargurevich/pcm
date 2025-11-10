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
                .FirstOrDefaultAsync(c => c.CompromisoId == request.CompromisoId, cancellationToken);

            if (compromiso == null)
            {
                return Result<CompromisoResponseDto>.Failure("Compromiso no encontrado");
            }

            // Update main properties
            compromiso.NombreCompromiso = request.NombreCompromiso;
            compromiso.Descripcion = request.Descripcion;
            compromiso.Alcances = string.Join(",", request.Alcances); // Convert list to comma-separated string
            compromiso.FechaInicio = request.FechaInicio;
            compromiso.FechaFin = request.FechaFin;
            compromiso.Estado = request.Estado;
            compromiso.UpdatedAt = DateTime.UtcNow;

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

            // Update criterios de evaluacion - remove old ones and add new ones
            _context.CriteriosEvaluacion.RemoveRange(compromiso.CriteriosEvaluacion);

            if (request.CriteriosEvaluacion != null && request.CriteriosEvaluacion.Any())
            {
                foreach (var criterioDto in request.CriteriosEvaluacion)
                {
                    var criterio = new CriterioEvaluacion
                    {
                        CompromisoId = compromiso.CompromisoId,
                        Descripcion = criterioDto.Descripcion,
                        Estado = criterioDto.Estado,
                        Activo = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CriteriosEvaluacion.Add(criterio);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Reload with related data
            var updated = await _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                .Include(c => c.CriteriosEvaluacion)
                .FirstOrDefaultAsync(c => c.CompromisoId == compromiso.CompromisoId, cancellationToken);

            var response = MapToResponseDto(updated);

            _logger.LogInformation("Compromiso updated successfully: {CompromisoId}", compromiso.CompromisoId);
            return Result<CompromisoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating compromiso {CompromisoId}", request.CompromisoId);
            return Result<CompromisoResponseDto>.Failure($"Error al actualizar el compromiso: {ex.Message}");
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
                : compromiso.Alcances.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
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
                NombreNorma = n.Norma?.NombreNorma,
                Numero = n.Norma?.Numero,
                TipoNormaId = n.Norma?.TipoNormaId,
                CreatedAt = n.CreatedAt
            }).ToList(),
            CriteriosEvaluacion = compromiso.CriteriosEvaluacion?.Select(c => new CriterioEvaluacionResponseDto
            {
                CriterioEvaluacionId = c.CriterioEvaluacionId,
                CompromisoId = c.CompromisoId,
                Descripcion = c.Descripcion,
                Estado = c.Estado,
                Activo = c.Activo,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList()
        };
    }
}
