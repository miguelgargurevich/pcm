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

            // Obtener tipo de norma
            var tipoNorma = await _context.Database
                .SqlQuery<string>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {marcoNormativo.TipoNormaId} AND tipo_tabla = 'TIPO_NORMA'")
                .FirstOrDefaultAsync(cancellationToken) ?? "No especificado";

            var marcoNormativoDto = new MarcoNormativoDetailDto
            {
                MarcoNormativoId = marcoNormativo.NormaId,
                Titulo = marcoNormativo.NombreNorma,
                NumeroNorma = marcoNormativo.Numero,
                TipoNormaId = marcoNormativo.TipoNormaId,
                TipoNorma = tipoNorma,
                FechaPublicacion = marcoNormativo.FechaPublicacion,
                Entidad = "PCM", // Por defecto
                Descripcion = marcoNormativo.Descripcion,
                UrlDocumento = marcoNormativo.Url,
                Activo = marcoNormativo.Activo,
                CreatedAt = marcoNormativo.CreatedAt,
                UpdatedAt = marcoNormativo.CreatedAt
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
}
