using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Queries.GetMarcoNormativoById;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.MarcoNormativo;

public class GetMarcoNormativoByIdHandler : IRequestHandler<GetMarcoNormativoByIdQuery, Result<MarcoNormativoDetailDto>>
{
    private readonly PCMDbContext _context;

    public GetMarcoNormativoByIdHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MarcoNormativoDetailDto>> Handle(GetMarcoNormativoByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var marcoNormativo = await _context.MarcosNormativos
                .FirstOrDefaultAsync(m => m.NormaId == request.MarcoNormativoId, cancellationToken);

            if (marcoNormativo == null)
            {
                return Result<MarcoNormativoDetailDto>.Failure("Marco normativo no encontrado");
            }

            // Obtener descripciones de catálogos
            var tipoNorma = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {marcoNormativo.TipoNormaId} AND nombre_tabla = 'TIPO_NORMA'")
                .FirstOrDefaultAsync(cancellationToken);

            var nivelGobierno = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {marcoNormativo.NivelGobiernoId} AND nombre_tabla = 'NIVEL_GOBIERNO'")
                .FirstOrDefaultAsync(cancellationToken);

            var sector = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {marcoNormativo.SectorId} AND nombre_tabla = 'SECTOR'")
                .FirstOrDefaultAsync(cancellationToken);

            var marcoNormativoDto = new MarcoNormativoDetailDto
            {
                NormaId = marcoNormativo.NormaId,
                NombreNorma = marcoNormativo.NombreNorma,
                Numero = marcoNormativo.Numero,
                TipoNormaId = marcoNormativo.TipoNormaId,
                TipoNorma = tipoNorma?.descripcion ?? "No especificado",
                NivelGobiernoId = marcoNormativo.NivelGobiernoId,
                NivelGobierno = nivelGobierno?.descripcion ?? "No especificado",
                SectorId = marcoNormativo.SectorId,
                Sector = sector?.descripcion ?? "No especificado",
                FechaPublicacion = marcoNormativo.FechaPublicacion,
                Descripcion = marcoNormativo.Descripcion,
                Url = marcoNormativo.Url,
                Activo = marcoNormativo.Activo,
                CreatedAt = marcoNormativo.CreatedAt
            };

            return Result<MarcoNormativoDetailDto>.Success(marcoNormativoDto);
        }
        catch (Exception ex)
        {
            return Result<MarcoNormativoDetailDto>.Failure(
                "Error al obtener marco normativo",
                new List<string> { ex.Message }
            );
        }
    }

    private class CatalogoResult
    {
        public string descripcion { get; set; } = string.Empty;
    }
}
