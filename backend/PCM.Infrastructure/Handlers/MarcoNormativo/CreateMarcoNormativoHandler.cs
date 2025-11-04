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
                .AnyAsync(m => m.Numero == request.NumeroNorma, cancellationToken);

            if (existeNumero)
            {
                return Result<MarcoNormativoDetailDto>.Failure("El número de norma ya está registrado");
            }

            // Crear marco normativo
            var marcoNormativo = new Domain.Entities.MarcoNormativo
            {
                Numero = request.NumeroNorma,
                NombreNorma = request.Titulo,
                TipoNormaId = request.TipoNormaId,
                FechaPublicacion = request.FechaPublicacion,
                NivelGobiernoId = 1, // Por defecto Gobierno Nacional
                SectorId = 1, // Por defecto PCM
                Descripcion = request.Descripcion,
                Url = request.UrlDocumento,
                Activo = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.MarcosNormativos.Add(marcoNormativo);
            await _context.SaveChangesAsync(cancellationToken);

            // Obtener tipo de norma desde tabla_tablas
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
}
