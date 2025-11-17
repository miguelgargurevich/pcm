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
            // Convertir la fecha a UTC si viene sin especificar
            var fechaPublicacionUtc = request.FechaPublicacion.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(request.FechaPublicacion, DateTimeKind.Utc)
                : request.FechaPublicacion.ToUniversalTime();

            var marcoNormativo = new Domain.Entities.MarcoNormativo
            {
                Numero = request.Numero,
                NombreNorma = request.NombreNorma,
                TipoNormaId = request.TipoNormaId,
                NivelGobiernoId = request.NivelGobiernoId,
                SectorId = request.SectorId,
                FechaPublicacion = fechaPublicacionUtc,
                Descripcion = request.Descripcion,
                Url = request.Url,
                Activo = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.MarcosNormativos.Add(marcoNormativo);
            await _context.SaveChangesAsync(cancellationToken);

            // Obtener descripciones de catálogos
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
                CreatedAt = marcoNormativo.CreatedAt,
                UpdatedAt = marcoNormativo.UpdatedAt
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
        public string descripcion { get; set; } = string.Empty;
    }
}
