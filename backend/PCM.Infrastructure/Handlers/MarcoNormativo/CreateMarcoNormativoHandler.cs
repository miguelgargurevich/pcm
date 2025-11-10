using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.MarcoNormativo;
using PCM.Application.Features.MarcoNormativo.Commands.CreateMarcoNormativo;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.MarcoNormativo;

public class CreateMarcoNormativoHandler : IRequestHandler<CreateMarcoNormativoCommand, Result<MarcoNormativoDetailDto>>
{
    private readonly PCMDbContext _context;

    public CreateMarcoNormativoHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MarcoNormativoDetailDto>> Handle(CreateMarcoNormativoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validar número de norma único
            var existeNumero = await _context.MarcosNormativos
                .AnyAsync(m => m.Numero == request.Numero, cancellationToken);

            if (existeNumero)
            {
                return Result<MarcoNormativoDetailDto>.Failure("El número de norma ya está registrado");
            }

            // Crear marco normativo
            var marcoNormativo = new Domain.Entities.MarcoNormativo
            {
                Numero = request.Numero,
                NombreNorma = request.NombreNorma,
                TipoNormaId = request.TipoNormaId,
                NivelGobiernoId = request.NivelGobiernoId,
                SectorId = request.SectorId,
                FechaPublicacion = request.FechaPublicacion,
                Descripcion = request.Descripcion,
                Url = request.Url,
                Activo = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.MarcosNormativos.Add(marcoNormativo);
            await _context.SaveChangesAsync(cancellationToken);

            // Obtener descripciones de catálogos
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

            return Result<MarcoNormativoDetailDto>.Success(marcoNormativoDto, "Marco normativo creado exitosamente");
        }
        catch (Exception ex)
        {
            return Result<MarcoNormativoDetailDto>.Failure(
                "Error al crear marco normativo",
                new List<string> { ex.Message }
            );
        }
    }

    private class CatalogoResult
    {
        public string Descripcion { get; set; } = string.Empty;
    }
}
