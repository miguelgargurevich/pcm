using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Commands.CreateCompromiso;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class CreateCompromisoHandler : IRequestHandler<CreateCompromisoCommand, Result<CompromisoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCompromisoHandler> _logger;

    public CreateCompromisoHandler(PCMDbContext context, ILogger<CreateCompromisoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CompromisoResponseDto>> Handle(CreateCompromisoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Create the main compromiso
            var compromiso = new CompromisoGobiernoDigital
            {
                NombreCompromiso = request.NombreCompromiso,
                Descripcion = request.Descripcion,
                Alcances = string.Join(",", request.Alcances), // Convert list to comma-separated string
                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin,
                IdEstado = request.Estado,
                Activo = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.CompromisosGobiernoDigital.Add(compromiso);
            await _context.SaveChangesAsync(cancellationToken);

            // Add normativas if provided
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

            // Add criterios de evaluacion if provided
            if (request.CriteriosEvaluacion != null && request.CriteriosEvaluacion.Any())
            {
                foreach (var criterioDto in request.CriteriosEvaluacion)
                {
                    var criterio = new CriterioEvaluacion
                    {
                        CompromisoId = compromiso.CompromisoId,
                        Descripcion = criterioDto.Descripcion,
                        IdEstado = criterioDto.Estado,
                        Activo = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CriteriosEvaluacion.Add(criterio);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Load related data for response
            var created = await _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                .Include(c => c.CriteriosEvaluacion)
                .FirstOrDefaultAsync(c => c.CompromisoId == compromiso.CompromisoId, cancellationToken);

            var response = MapToResponseDto(created);

            _logger.LogInformation("Compromiso created successfully: {CompromisoId}", compromiso.CompromisoId);
            return Result<CompromisoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating compromiso");
            return Result<CompromisoResponseDto>.Failure($"Error al crear el compromiso: {ex.Message}");
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
            Estado = compromiso.IdEstado,
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
                Estado = c.IdEstado,
                Activo = c.Activo,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList()
        };
    }
}
