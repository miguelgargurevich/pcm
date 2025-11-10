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
            var query = _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                .Include(c => c.CriteriosEvaluacion)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Nombre))
            {
                query = query.Where(c => EF.Functions.ILike(c.NombreCompromiso, $"%{request.Nombre}%"));
            }

            if (!string.IsNullOrEmpty(request.Alcance))
            {
                query = query.Where(c => EF.Functions.ILike(c.Alcances, $"%{request.Alcance}%"));
            }

            if (!string.IsNullOrEmpty(request.Estado))
            {
                query = query.Where(c => c.Estado == request.Estado);
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
