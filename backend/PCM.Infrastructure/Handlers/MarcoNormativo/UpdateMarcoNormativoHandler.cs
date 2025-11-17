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
            // Convertir la fecha a UTC si viene sin especificar
            var fechaPublicacionUtc = request.FechaPublicacion.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(request.FechaPublicacion, DateTimeKind.Utc)
                : request.FechaPublicacion.ToUniversalTime();

            marcoNormativo.Numero = request.Numero;
            marcoNormativo.NombreNorma = request.NombreNorma;
            marcoNormativo.TipoNormaId = request.TipoNormaId;
            marcoNormativo.NivelGobiernoId = request.NivelGobiernoId;
            marcoNormativo.SectorId = request.SectorId;
            marcoNormativo.FechaPublicacion = fechaPublicacionUtc;
            marcoNormativo.Descripcion = request.Descripcion;
            marcoNormativo.Url = request.Url;

            await _context.SaveChangesAsync(cancellationToken);

            // Obtener descripciones
            var tipoNorma = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {request.TipoNormaId} AND nombre_tabla = 'TIPO_NORMA'")
                .FirstOrDefaultAsync(cancellationToken);

            var nivelGobierno = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {request.NivelGobiernoId} AND nombre_tabla = 'NIVEL_GOBIERNO'")
                .FirstOrDefaultAsync(cancellationToken);

            var sector = await _context.Database
                .SqlQuery<CatalogoResult>($"SELECT descripcion FROM tabla_tablas WHERE tabla_id = {request.SectorId} AND nombre_tabla = 'SECTOR'")
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
        public string descripcion { get; set; } = string.Empty;
    }
}
