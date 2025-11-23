using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Catalogos.Queries;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Catalogos;

public class GetCatalogoHandler : IRequestHandler<GetCatalogoQuery, Result<List<CatalogoItemResponse>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCatalogoHandler> _logger;

    public GetCatalogoHandler(PCMDbContext context, ILogger<GetCatalogoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CatalogoItemResponse>>> Handle(GetCatalogoQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo catálogo: {NombreTabla}", request.NombreTabla);

            var items = await _context.TablaTablas
                .Where(t => t.NombreTabla == request.NombreTabla && t.Activo)
                .OrderBy(t => t.Orden)
                .Select(t => new CatalogoItemResponse
                {
                    Id = t.ColumnaId,
                    Valor = t.Valor,
                    Descripcion = t.Descripcion,
                    Orden = t.Orden
                })
                .ToListAsync(cancellationToken);

            if (!items.Any())
            {
                _logger.LogWarning("No se encontraron elementos para el catálogo: {NombreTabla}", request.NombreTabla);
                return Result<List<CatalogoItemResponse>>.Failure($"No se encontraron elementos para el catálogo '{request.NombreTabla}'");
            }

            _logger.LogInformation("Se obtuvieron {Count} elementos del catálogo {NombreTabla}", items.Count, request.NombreTabla);
            return Result<List<CatalogoItemResponse>>.Success(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener el catálogo: {NombreTabla}", request.NombreTabla);
            return Result<List<CatalogoItemResponse>>.Failure($"Error al obtener el catálogo: {ex.Message}");
        }
    }
}
