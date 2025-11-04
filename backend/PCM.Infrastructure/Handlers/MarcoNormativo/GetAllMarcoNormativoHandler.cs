using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Queries.GetAllMarcoNormativo;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.MarcoNormativo;

public class GetAllMarcoNormativoHandler : IRequestHandler<GetAllMarcoNormativoQuery, Result<List<MarcoNormativoListDto>>>
{
    private readonly PCMDbContext _context;

    public GetAllMarcoNormativoHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<MarcoNormativoListDto>>> Handle(GetAllMarcoNormativoQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.MarcosNormativos.AsQueryable();

            // Filtros opcionales
            if (request.TipoNormaId.HasValue)
            {
                query = query.Where(m => m.TipoNormaId == request.TipoNormaId.Value);
            }

            if (request.Activo.HasValue)
            {
                query = query.Where(m => m.Activo == request.Activo.Value);
            }

            if (request.FechaDesde.HasValue)
            {
                query = query.Where(m => m.FechaPublicacion >= request.FechaDesde.Value);
            }

            if (request.FechaHasta.HasValue)
            {
                query = query.Where(m => m.FechaPublicacion <= request.FechaHasta.Value);
            }

            // Búsqueda por término
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchLower = request.SearchTerm.ToLower();
                query = query.Where(m =>
                    m.NombreNorma.ToLower().Contains(searchLower) ||
                    m.Numero.Contains(searchLower));
            }

            var marcosNormativos = await query
                .OrderByDescending(m => m.FechaPublicacion)
                .ToListAsync(cancellationToken);

            // Obtener tipos de norma
            var tiposNorma = await _context.Database
                .SqlQuery<TipoNormaResult>($"SELECT tabla_id as TipoNormaId, descripcion as Descripcion FROM tabla_tablas WHERE tipo_tabla = 'TIPO_NORMA'")
                .ToListAsync(cancellationToken);

            var tiposNormaDict = tiposNorma.ToDictionary(t => t.TipoNormaId, t => t.Descripcion);

            var result = marcosNormativos.Select(m => new MarcoNormativoListDto
            {
                MarcoNormativoId = m.NormaId,
                Titulo = m.NombreNorma,
                NumeroNorma = m.Numero,
                TipoNorma = tiposNormaDict.GetValueOrDefault(m.TipoNormaId, "No especificado"),
                FechaPublicacion = m.FechaPublicacion,
                Entidad = "PCM",
                Activo = m.Activo
            }).ToList();

            return Result<List<MarcoNormativoListDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<List<MarcoNormativoListDto>>.Failure(
                "Error al obtener marcos normativos",
                new List<string> { ex.Message }
            );
        }
    }

    private class TipoNormaResult
    {
        public int TipoNormaId { get; set; }
        public string Descripcion { get; set; } = string.Empty;
    }
}
