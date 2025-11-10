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
                .FirstOrDefaultAsync(m => m.NormaId == request.NormaId, cancellationToken);

            if (marcoNormativo == null)
            {
                return Result<MarcoNormativoDetailDto>.Failure("Marco normativo no encontrado");
            }

            // Validar número único (excepto el actual)
            var existeNumero = await _context.MarcosNormativos
                .AnyAsync(m => m.Numero == request.Numero && m.NormaId != request.NormaId, cancellationToken);

            if (existeNumero)
            {
                return Result<MarcoNormativoDetailDto>.Failure("El número de norma ya está registrado");
            }

            // Actualizar datos
            marcoNormativo.Numero = request.Numero;
            marcoNormativo.NombreNorma = request.NombreNorma;
            marcoNormativo.TipoNormaId = request.TipoNormaId;
            marcoNormativo.NivelGobiernoId = request.NivelGobiernoId;
            marcoNormativo.SectorId = request.SectorId;
            marcoNormativo.FechaPublicacion = request.FechaPublicacion;
            marcoNormativo.Descripcion = request.Descripcion;
            marcoNormativo.Url = request.Url;

            await _context.SaveChangesAsync(cancellationToken);

            // Obtener descripciones
            var tipoNorma = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion as Descripcion FROM tabla_tablas WHERE tabla_id = {request.TipoNormaId} AND tipo_tabla = 'TIPO_NORMA'")
                .FirstOrDefaultAsync(cancellationToken);

            var nivelGobierno = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion as Descripcion FROM tabla_tablas WHERE tabla_id = {request.NivelGobiernoId} AND tipo_tabla = 'NIVEL_GOBIERNO'")
                .FirstOrDefaultAsync(cancellationToken);

            var sector = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion as Descripcion FROM tabla_tablas WHERE tabla_id = {request.SectorId} AND tipo_tabla = 'SECTOR'")
                .FirstOrDefaultAsync(cancellationToken);

            var marcoNormativoDto = new MarcoNormativoDetailDto
            {
                NormaId = marcoNormativo.NormaId,
                NombreNorma = marcoNormativo.NombreNorma,
                Numero = marcoNormativo.Numero,
                TipoNormaId = marcoNormativo.TipoNormaId,
                TipoNorma = tipoNorma?.Descripcion ?? "No especificado",
                NivelGobiernoId = marcoNormativo.NivelGobiernoId,
                NivelGobierno = nivelGobierno?.Descripcion ?? "No especificado",
                SectorId = marcoNormativo.SectorId,
                Sector = sector?.Descripcion ?? "No especificado",
                FechaPublicacion = marcoNormativo.FechaPublicacion,
                Descripcion = marcoNormativo.Descripcion,
                Url = marcoNormativo.Url,
                Activo = marcoNormativo.Activo,
                CreatedAt = marcoNormativo.CreatedAt
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

    private class CatalogoResult
    {
        public string Descripcion { get; set; } = string.Empty;
    }
}
