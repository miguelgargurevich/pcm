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
                .Include(c => c.CriteriosEvaluacion)
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
