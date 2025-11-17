using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Commands.UpdateEntidad;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Entidades;

public class UpdateEntidadHandler : IRequestHandler<UpdateEntidadCommand, Result<EntidadDetailDto>>
{
    private readonly PCMDbContext _context;

    public UpdateEntidadHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<EntidadDetailDto>> Handle(UpdateEntidadCommand request, CancellationToken cancellationToken)
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

            // Validar RUC único (excepto el actual)
            var existeRuc = await _context.Entidades
                .AnyAsync(e => e.Ruc == request.Ruc && e.EntidadId != request.EntidadId, cancellationToken);

            if (existeRuc)
            {
                return Result<EntidadDetailDto>.Failure("El RUC ya está registrado");
            }

            // Validar email único (excepto el actual)
            var existeEmail = await _context.Entidades
                .AnyAsync(e => e.Email == request.Email && e.EntidadId != request.EntidadId, cancellationToken);

            if (existeEmail)
            {
                return Result<EntidadDetailDto>.Failure("El email ya está registrado");
            }

            // Validar ubigeo
            var ubigeoExiste = await _context.Ubigeos
                .AnyAsync(u => u.UbigeoId == request.UbigeoId, cancellationToken);

            if (!ubigeoExiste)
            {
                return Result<EntidadDetailDto>.Failure("El ubigeo especificado no existe");
            }

            // Validar clasificación
            var clasificacionExiste = await _context.Clasificaciones
                .AnyAsync(c => c.ClasificacionId == request.ClasificacionId, cancellationToken);

            if (!clasificacionExiste)
            {
                return Result<EntidadDetailDto>.Failure("La clasificación especificada no existe");
            }

            // Actualizar datos
            entidad.Ruc = request.Ruc;
            entidad.Nombre = request.Nombre;
            entidad.Direccion = request.Direccion;
            entidad.UbigeoId = request.UbigeoId;
            entidad.Telefono = request.Telefono;
            entidad.Email = request.Email;
            entidad.Web = request.Web;
            entidad.NivelGobiernoId = request.NivelGobiernoId;
            entidad.SectorId = request.SectorId;
            entidad.ClasificacionId = request.ClasificacionId;
            entidad.NombreAlcalde = request.NombreAlcalde;
            entidad.ApePatAlcalde = request.ApePatAlcalde;
            entidad.ApeMatAlcalde = request.ApeMatAlcalde;
            entidad.EmailAlcalde = request.EmailAlcalde;
            entidad.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            // Recargar relaciones
            await _context.Entry(entidad).Reference(e => e.Ubigeo).LoadAsync(cancellationToken);
            await _context.Entry(entidad).Reference(e => e.Clasificacion).LoadAsync(cancellationToken);

            var entidadDto = new EntidadDetailDto
            {
                EntidadId = entidad.EntidadId,
                Ruc = entidad.Ruc,
                Nombre = entidad.Nombre,
                Direccion = entidad.Direccion,
                UbigeoId = entidad.UbigeoId,
                UbigeoCodigo = entidad.Ubigeo?.Codigo ?? "",
                Departamento = entidad.Ubigeo?.NODEP ?? "",
                Provincia = entidad.Ubigeo?.NOPRV ?? "",
                Distrito = entidad.Ubigeo?.NODIS ?? "",
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

            return Result<EntidadDetailDto>.Success(entidadDto, "Entidad actualizada exitosamente");
        }
        catch (Exception ex)
        {
            return Result<EntidadDetailDto>.Failure(
                "Error al actualizar entidad",
                new List<string> { ex.Message }
            );
        }
    }
}
