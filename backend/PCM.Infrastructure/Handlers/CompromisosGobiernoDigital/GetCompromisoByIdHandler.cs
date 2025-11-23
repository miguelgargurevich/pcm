using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetCompromisoById;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class GetCompromisoByIdHandler : IRequestHandler<GetCompromisoByIdQuery, Result<CompromisoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCompromisoByIdHandler> _logger;

    public GetCompromisoByIdHandler(PCMDbContext context, ILogger<GetCompromisoByIdHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CompromisoResponseDto>> Handle(GetCompromisoByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var compromiso = await _context.CompromisosGobiernoDigital
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
                .Include(c => c.AlcancesCompromisos)
                    .ThenInclude(ac => ac.Clasificacion)
                .FirstOrDefaultAsync(c => c.CompromisoId == request.CompromisoId, cancellationToken);

            if (compromiso == null)
            {
                return Result<CompromisoResponseDto>.Failure("Compromiso no encontrado");
            }

            var response = MapToResponseDto(compromiso);

            _logger.LogInformation("Retrieved compromiso: {CompromisoId}", compromiso.CompromisoId);
            return Result<CompromisoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compromiso {CompromisoId}", request.CompromisoId);
            return Result<CompromisoResponseDto>.Failure($"Error al obtener el compromiso: {ex.Message}");
        }
    }

    private CompromisoResponseDto MapToResponseDto(CompromisoGobiernoDigital compromiso)
    {
        return new CompromisoResponseDto
        {
            CompromisoId = compromiso.CompromisoId,
            NombreCompromiso = compromiso.NombreCompromiso,
            Descripcion = compromiso.Descripcion,
            Alcances = compromiso.AlcancesCompromisos?
                .Where(ac => ac.Activo)
                .Select(ac => ac.Clasificacion?.Nombre ?? string.Empty)
                .Where(nombre => !string.IsNullOrEmpty(nombre))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList() ?? new List<string>(),
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
