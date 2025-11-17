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
                .SqlQuery<TipoNormaResult>($"SELECT tabla_id as TipoNormaId, descripcion FROM tabla_tablas WHERE nombre_tabla = 'TIPO_NORMA'")
                .ToListAsync(cancellationToken);

            var tiposNormaDict = tiposNorma.ToDictionary(t => t.TipoNormaId, t => t.descripcion);

            // Obtener niveles de gobierno y sectores
            var nivelesGobierno = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT tabla_id as Id, descripcion FROM tabla_tablas WHERE nombre_tabla = 'NIVEL_GOBIERNO'")
                .ToListAsync(cancellationToken);
            
            var sectores = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT tabla_id as Id, descripcion FROM tabla_tablas WHERE nombre_tabla = 'SECTOR'")
                .ToListAsync(cancellationToken);

            var nivelesDict = nivelesGobierno.ToDictionary(n => n.Id, n => n.descripcion);
            var sectoresDict = sectores.ToDictionary(s => s.Id, s => s.descripcion);

            var result = marcosNormativos.Select(m => new MarcoNormativoListDto
            {
                NormaId = m.NormaId,
                NombreNorma = m.NombreNorma,
                Numero = m.Numero,
                TipoNorma = tiposNormaDict.GetValueOrDefault(m.TipoNormaId, "No especificado"),
                FechaPublicacion = m.FechaPublicacion,
                NivelGobierno = nivelesDict.GetValueOrDefault(m.NivelGobiernoId, "No especificado"),
                Sector = sectoresDict.GetValueOrDefault(m.SectorId, "No especificado"),
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
        public string descripcion { get; set; } = string.Empty;
    }

    private class CatalogoResult
    {
        public int Id { get; set; }
        public string descripcion { get; set; } = string.Empty;
    }
}
