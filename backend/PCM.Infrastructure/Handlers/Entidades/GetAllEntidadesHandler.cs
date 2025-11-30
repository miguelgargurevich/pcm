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
                .Include(e => e.Clasificacion) // Esto es Subclasificacion
                    .ThenInclude(s => s!.Clasificacion) // Cargar clasificación padre
                .AsNoTracking()
                .AsQueryable();

            // Filtros opcionales
            if (request.UbigeoId.HasValue)
            {
                query = query.Where(e => e.UbigeoId == request.UbigeoId.Value);
            }

            // IMPORTANTE: ClasificacionId del filtro es el ID de la clasificación PADRE
            // Pero Entidad.ClasificacionId apunta a subclasificacion_id en BD
            // Entonces filtramos por la clasificación padre de la subclasificación
            if (request.ClasificacionId.HasValue)
            {
                query = query.Where(e => e.Clasificacion != null && 
                                         e.Clasificacion.ClasificacionId == request.ClasificacionId.Value);
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
                    // ClasificacionId devuelve el ID de la clasificación PADRE para el filtro del frontend
                    ClasificacionId = e.Clasificacion != null ? e.Clasificacion.ClasificacionId : 0,
                    NombreClasificacion = e.Clasificacion != null && e.Clasificacion.Clasificacion != null 
                        ? e.Clasificacion.Clasificacion.Nombre 
                        : (e.Clasificacion != null ? e.Clasificacion.Nombre : ""),
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
