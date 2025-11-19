using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetAllCumplimientos;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CumplimientoNormativo;

public class GetAllCumplimientosHandler : IRequestHandler<GetAllCumplimientosQuery, Result<List<CumplimientoListItemDto>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetAllCumplimientosHandler> _logger;

    public GetAllCumplimientosHandler(PCMDbContext context, ILogger<GetAllCumplimientosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CumplimientoListItemDto>>> Handle(GetAllCumplimientosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.CumplimientosNormativos
                .Include(c => c.Compromiso)
                .Include(c => c.Entidad)
                .Where(c => c.Activo);

            // Aplicar filtros
            if (request.CompromisoId.HasValue)
            {
                query = query.Where(c => c.CompromisoId == request.CompromisoId.Value);
            }

            if (request.Estado.HasValue)
            {
                query = query.Where(c => c.Estado == request.Estado.Value);
            }

            if (request.EntidadId.HasValue)
            {
                query = query.Where(c => c.EntidadId == request.EntidadId.Value);
            }

            var cumplimientos = await query
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync(cancellationToken);

            var result = cumplimientos.Select(c => new CumplimientoListItemDto
            {
                CumplimientoId = c.CumplimientoId,
                CompromisoId = c.CompromisoId,
                NombreCompromiso = c.Compromiso?.NombreCompromiso ?? "Sin compromiso",
                NombreEntidad = c.Entidad?.Nombre ?? "Sin entidad",
                NombreLider = $"{c.Nombres} {c.ApellidoPaterno} {c.ApellidoMaterno}".Trim(),
                Estado = c.Estado,
                EstadoNombre = GetEstadoNombre(c.Estado),
                CreatedAt = c.CreatedAt,
                TieneDocumento = !string.IsNullOrEmpty(c.DocumentoUrl)
            }).ToList();

            _logger.LogInformation("Retrieved {Count} cumplimientos normativos", result.Count);
            return Result<List<CumplimientoListItemDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener cumplimientos normativos");
            return Result<List<CumplimientoListItemDto>>.Failure($"Error al obtener cumplimientos: {ex.Message}");
        }
    }

    private string GetEstadoNombre(int estadoId)
    {
        return estadoId switch
        {
            1 => "bandeja",
            2 => "sin_reportar",
            3 => "publicado",
            _ => "desconocido"
        };
    }
}
