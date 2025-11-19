using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Queries.GetAllEntidades;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Entidades;

public class GetAllEntidadesHandler : IRequestHandler<GetAllEntidadesQuery, Result<List<EntidadListDto>>>
{
    private readonly PCMDbContext _context;

    public GetAllEntidadesHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<EntidadListDto>>> Handle(GetAllEntidadesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Entidades
                .AsNoTracking()
                .AsQueryable();

            // Filtros opcionales
            if (request.UbigeoId.HasValue)
            {
                query = query.Where(e => e.UbigeoId == request.UbigeoId.Value);
            }

            if (request.ClasificacionId.HasValue)
            {
                query = query.Where(e => e.ClasificacionId == request.ClasificacionId.Value);
            }

            if (request.NivelGobiernoId.HasValue)
            {
                query = query.Where(e => e.NivelGobiernoId == request.NivelGobiernoId.Value);
            }

            if (request.SectorId.HasValue)
            {
                query = query.Where(e => e.SectorId == request.SectorId.Value);
            }

            if (request.Activo.HasValue)
            {
                query = query.Where(e => e.Activo == request.Activo.Value);
            }

            // Búsqueda por término
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchLower = request.SearchTerm.ToLower();
                query = query.Where(e =>
                    e.Nombre.ToLower().Contains(searchLower) ||
                    e.Ruc.Contains(searchLower));
            }

            var entidades = await query
                .OrderBy(e => e.Nombre)
                .Select(e => new EntidadListDto
                {
                    EntidadId = e.EntidadId,
                    Ruc = e.Ruc,
                    Nombre = e.Nombre,
                    Direccion = e.Direccion ?? "",
                    UbigeoId = e.UbigeoId,
                    Departamento = _context.Ubigeos
                        .Where(u => u.UbigeoId == e.UbigeoId)
                        .Select(u => u.NODEP)
                        .FirstOrDefault() ?? "",
                    Provincia = _context.Ubigeos
                        .Where(u => u.UbigeoId == e.UbigeoId)
                        .Select(u => u.NOPRV)
                        .FirstOrDefault() ?? "",
                    Distrito = _context.Ubigeos
                        .Where(u => u.UbigeoId == e.UbigeoId)
                        .Select(u => u.NODIS)
                        .FirstOrDefault() ?? "",
                    NivelGobiernoId = e.NivelGobiernoId,
                    NivelGobierno = _context.NivelesGobierno
                        .Where(ng => ng.NivelGobiernoId == e.NivelGobiernoId)
                        .Select(ng => ng.Nombre)
                        .FirstOrDefault() ?? "",
                    SectorId = e.SectorId,
                    NombreSector = _context.Sectores
                        .Where(s => s.SectorId == e.SectorId)
                        .Select(s => s.Nombre)
                        .FirstOrDefault() ?? "",
                    ClasificacionId = e.ClasificacionId,
                    NombreClasificacion = _context.Clasificaciones
                        .Where(c => c.ClasificacionId == e.ClasificacionId)
                        .Select(c => c.Nombre)
                        .FirstOrDefault() ?? "",
                    Email = e.Email ?? "",
                    Telefono = e.Telefono ?? "",
                    Web = e.Web,
                    NombreAlcalde = e.NombreAlcalde ?? "",
                    ApePatAlcalde = e.ApePatAlcalde ?? "",
                    ApeMatAlcalde = e.ApeMatAlcalde ?? "",
                    EmailAlcalde = e.EmailAlcalde ?? "",
                    Activo = e.Activo
                })
                .ToListAsync(cancellationToken);

            return Result<List<EntidadListDto>>.Success(entidades);
        }
        catch (Exception ex)
        {
            return Result<List<EntidadListDto>>.Failure(
                "Error al obtener entidades",
                new List<string> { ex.Message }
            );
        }
    }
}
