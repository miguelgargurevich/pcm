using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetAllCompromisos;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class GetAllCompromisosHandler : IRequestHandler<GetAllCompromisosQuery, Result<List<CompromisoResponseDto>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetAllCompromisosHandler> _logger;

    public GetAllCompromisosHandler(PCMDbContext context, ILogger<GetAllCompromisosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CompromisoResponseDto>>> Handle(GetAllCompromisosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Obtener la clasificación de la entidad del usuario (si está autenticado)
            long? userClasificacionId = null;
            if (request.UserId.HasValue)
            {
                var usuario = await _context.Usuarios
                    .Include(u => u.Entidad)
                    .FirstOrDefaultAsync(u => u.UserId == request.UserId.Value, cancellationToken);
                
                if (usuario?.Entidad != null)
                {
                    userClasificacionId = usuario.Entidad.ClasificacionId;
                }
            }

            var query = _context.CompromisosGobiernoDigital
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
                .AsQueryable();

            // Filtrar por clasificación de la entidad del usuario
            if (userClasificacionId.HasValue)
            {
                query = query.Where(c => c.AlcancesCompromisos.Any(ac => ac.ClasificacionId == userClasificacionId.Value && ac.Activo));
            }

            // Apply filters
            if (!string.IsNullOrEmpty(request.Nombre))
            {
                query = query.Where(c => EF.Functions.ILike(c.NombreCompromiso, $"%{request.Nombre}%"));
            }

            if (!string.IsNullOrEmpty(request.Alcance))
            {
                query = query.Where(c => EF.Functions.ILike(c.Alcances, $"%{request.Alcance}%"));
            }

            if (request.Estado.HasValue)
            {
                query = query.Where(c => c.Estado == request.Estado.Value);
            }
            
            // Only show active records
            query = query.Where(c => c.Activo);

            var compromisos = await query
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync(cancellationToken);

            var response = compromisos.Select(MapToResponseDto).ToList();

            _logger.LogInformation("Retrieved {Count} compromisos", response.Count);
            return Result<List<CompromisoResponseDto>>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compromisos");
            return Result<List<CompromisoResponseDto>>.Failure($"Error al obtener compromisos: {ex.Message}");
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
