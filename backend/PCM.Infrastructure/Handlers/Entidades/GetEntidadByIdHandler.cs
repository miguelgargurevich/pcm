using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Queries.GetEntidadById;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Entidades;

public class GetEntidadByIdHandler : IRequestHandler<GetEntidadByIdQuery, Result<EntidadDetailDto>>
{
    private readonly PCMDbContext _context;

    public GetEntidadByIdHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<EntidadDetailDto>> Handle(GetEntidadByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var entidad = await _context.Entidades
                .Include(e => e.Ubigeo)
                .Include(e => e.Clasificacion)
                .FirstOrDefaultAsync(e => e.EntidadId == request.EntidadId, cancellationToken);

            if (entidad == null)
            {
                return Result<EntidadDetailDto>.Failure("Entidad no encontrada");
            }

            var entidadDto = new EntidadDetailDto
            {
                EntidadId = entidad.EntidadId,
                Ruc = entidad.Ruc,
                Nombre = entidad.Nombre,
                Direccion = entidad.Direccion,
                UbigeoId = entidad.UbigeoId,
                UbigeoCodigo = entidad.Ubigeo?.Codigo ?? "",
                Departamento = entidad.Ubigeo?.Departamento ?? "",
                Provincia = entidad.Ubigeo?.Provincia ?? "",
                Distrito = entidad.Ubigeo?.Distrito ?? "",
                Telefono = entidad.Telefono,
                Email = entidad.Email,
                Web = entidad.Web,
                NivelGobiernoId = entidad.NivelGobiernoId,
                SectorId = entidad.SectorId,
                ClasificacionId = entidad.ClasificacionId,
                NombreClasificacion = entidad.Clasificacion?.Nombre ?? "",
                NombreAlcalde = entidad.NombreAlcalde,
                ApePatAlcalde = entidad.ApePatAlcalde,
                ApeMatAlcalde = entidad.ApeMatAlcalde,
                EmailAlcalde = entidad.EmailAlcalde,
                Activo = entidad.Activo,
                CreatedAt = entidad.CreatedAt,
                UpdatedAt = entidad.UpdatedAt
            };

            return Result<EntidadDetailDto>.Success(entidadDto);
        }
        catch (Exception ex)
        {
            return Result<EntidadDetailDto>.Failure(
                "Error al obtener entidad",
                new List<string> { ex.Message }
            );
        }
    }
}
