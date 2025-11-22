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
                Alcances = string.Join(",", request.Alcances.Select(a => a.Trim()).Distinct(StringComparer.OrdinalIgnoreCase)), // Convert list to comma-separated string
                FechaInicio = DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc),
                FechaFin = DateTime.SpecifyKind(request.FechaFin, DateTimeKind.Utc),
                IdEstado = 1, // Default pendiente
                Activo = request.Activo,
                CreatedAt = DateTime.UtcNow
            };

            _context.CompromisosGobiernoDigital.Add(compromiso);
            await _context.SaveChangesAsync(cancellationToken);

            // Add alcances to alcances_compromisos table
            if (request.Alcances != null && request.Alcances.Any())
            {
                foreach (var alcanceIdStr in request.Alcances)
                {
                    if (int.TryParse(alcanceIdStr, out int alcanceId))
                    {
                        // Verificar que el ClasificacionId existe
                        var clasificacionExists = await _context.Clasificaciones
                            .AnyAsync(c => c.ClasificacionId == alcanceId, cancellationToken);
                        
                        if (!clasificacionExists)
                        {
                            _logger.LogWarning("ClasificacionId {AlcanceId} no existe en la tabla clasificacion", alcanceId);
                            continue; // Skip this alcance
                        }

                        var alcanceCompromiso = new AlcanceCompromiso
                        {
                            CompromisoId = compromiso.CompromisoId,
                            ClasificacionId = alcanceId,
                            Activo = true,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.AlcancesCompromisos.Add(alcanceCompromiso);
                    }
                }
            }

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
                        IdEstado = 1, // Default pendiente
                        Activo = criterioDto.Activo,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = null  // Explicitly set to null to avoid unspecified DateTime
                    };
                    _context.CriteriosEvaluacion.Add(criterio);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Load related data for response
            var created = await _context.CompromisosGobiernoDigital
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

            if (created == null)
            {
                return Result<CompromisoResponseDto>.Failure("No se pudo recuperar el compromiso creado");
            }

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
                : compromiso.Alcances.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(a => a.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList(),
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
