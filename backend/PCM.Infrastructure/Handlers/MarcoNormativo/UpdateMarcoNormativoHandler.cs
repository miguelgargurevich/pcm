using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Commands.UpdateMarcoNormativo;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.MarcoNormativo;

public class UpdateMarcoNormativoHandler : IRequestHandler<UpdateMarcoNormativoCommand, Result<MarcoNormativoDetailDto>>
{
    private readonly PCMDbContext _context;

    public UpdateMarcoNormativoHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MarcoNormativoDetailDto>> Handle(UpdateMarcoNormativoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var marcoNormativo = await _context.MarcosNormativos
                .FirstOrDefaultAsync(m => m.NormaId == request.MarcoNormativoId, cancellationToken);

            if (marcoNormativo == null)
            {
                return Result<MarcoNormativoDetailDto>.Failure("Marco normativo no encontrado");
            }

            // Validar número único (excepto el actual)
            var existeNumero = await _context.MarcosNormativos
                .AnyAsync(m => m.Numero == request.NumeroNorma && m.NormaId != request.MarcoNormativoId, cancellationToken);

            if (existeNumero)
            {
                return Result<MarcoNormativoDetailDto>.Failure("El número de norma ya está registrado");
            }

            // Actualizar datos
            marcoNormativo.Numero = request.NumeroNorma;
            marcoNormativo.NombreNorma = request.Titulo;
            marcoNormativo.TipoNormaId = request.TipoNormaId;
            marcoNormativo.FechaPublicacion = request.FechaPublicacion;
            marcoNormativo.Descripcion = request.Descripcion;
            marcoNormativo.Url = request.UrlDocumento;

            await _context.SaveChangesAsync(cancellationToken);

            // Obtener tipo de norma
            var tipoNorma = await _context.Database
                .SqlQuery<string>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {request.TipoNormaId} AND tipo_tabla = 'TIPO_NORMA'")
                .FirstOrDefaultAsync(cancellationToken) ?? "No especificado";

            var marcoNormativoDto = new MarcoNormativoDetailDto
            {
                MarcoNormativoId = marcoNormativo.NormaId,
                Titulo = marcoNormativo.NombreNorma,
                NumeroNorma = marcoNormativo.Numero,
                TipoNormaId = marcoNormativo.TipoNormaId,
                TipoNorma = tipoNorma,
                FechaPublicacion = marcoNormativo.FechaPublicacion,
                FechaVigencia = request.FechaVigencia,
                Entidad = request.Entidad,
                Descripcion = marcoNormativo.Descripcion,
                UrlDocumento = marcoNormativo.Url,
                Activo = marcoNormativo.Activo,
                CreatedAt = marcoNormativo.CreatedAt,
                UpdatedAt = marcoNormativo.CreatedAt
            };

            return Result<MarcoNormativoDetailDto>.Success(marcoNormativoDto, "Marco normativo actualizado exitosamente");
        }
        catch (Exception ex)
        {
            return Result<MarcoNormativoDetailDto>.Failure(
                "Error al actualizar marco normativo",
                new List<string> { ex.Message }
            );
        }
    }
}
