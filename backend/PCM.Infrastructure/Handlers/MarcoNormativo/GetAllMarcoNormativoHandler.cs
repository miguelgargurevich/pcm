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

            // Obtener tipos de norma desde la tabla tipo_norma
            var tiposNorma = await _context.TiposNorma
                .Where(t => t.Activo)
                .ToListAsync(cancellationToken);

            var tiposNormaDict = tiposNorma.ToDictionary(t => t.TipoNormaId, t => t.Nombre);

            // Obtener niveles de gobierno desde la tabla nivel_gobierno
            var nivelesGobierno = await _context.NivelesGobierno
                .Where(n => n.Activo)
                .ToListAsync(cancellationToken);
            
            // Obtener sectores desde la tabla sector
            var sectores = await _context.Sectores
                .Where(s => s.Activo)
                .ToListAsync(cancellationToken);

            var nivelesDict = nivelesGobierno.ToDictionary(n => n.NivelGobiernoId, n => n.Nombre);
            var sectoresDict = sectores.ToDictionary(s => s.SectorId, s => s.Nombre);

            var result = marcosNormativos.Select(m => new MarcoNormativoListDto
            {
                NormaId = m.NormaId,
                NombreNorma = m.NombreNorma,
                Numero = m.Numero,
                TipoNormaId = m.TipoNormaId,
                TipoNorma = tiposNormaDict.GetValueOrDefault(m.TipoNormaId, "No especificado"),
                NivelGobiernoId = m.NivelGobiernoId,
                NivelGobierno = nivelesDict.GetValueOrDefault(m.NivelGobiernoId, "No especificado"),
                SectorId = m.SectorId,
                Sector = sectoresDict.GetValueOrDefault(m.SectorId, "No especificado"),
                FechaPublicacion = m.FechaPublicacion,
                Descripcion = m.Descripcion,
                Url = m.Url,
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
}
