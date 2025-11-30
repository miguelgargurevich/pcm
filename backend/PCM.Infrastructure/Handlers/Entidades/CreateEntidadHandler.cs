using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Commands.CreateEntidad;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Entidades;

public class CreateEntidadHandler : IRequestHandler<CreateEntidadCommand, Result<EntidadDetailDto>>
{
    private readonly PCMDbContext _context;

    public CreateEntidadHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<EntidadDetailDto>> Handle(CreateEntidadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validar RUC único
            var existeRuc = await _context.Entidades
                .AnyAsync(e => e.Ruc == request.Ruc, cancellationToken);

            if (existeRuc)
            {
                return Result<EntidadDetailDto>.Failure("El RUC ya está registrado");
            }

            // Validar email único
            var existeEmail = await _context.Entidades
                .AnyAsync(e => e.Email == request.Email, cancellationToken);

            if (existeEmail)
            {
                return Result<EntidadDetailDto>.Failure("El email ya está registrado");
            }

            // Validar que el ubigeo existe
            var ubigeoExiste = await _context.Ubigeos
                .AnyAsync(u => u.UbigeoId == request.UbigeoId, cancellationToken);

            if (!ubigeoExiste)
            {
                return Result<EntidadDetailDto>.Failure("El ubigeo especificado no existe");
            }

            // Validar que la subclasificación existe (ClasificacionId en Entidad apunta a subclasificacion_id)
            var subclasificacionExiste = await _context.Subclasificaciones
                .AnyAsync(s => s.SubclasificacionId == request.ClasificacionId, cancellationToken);

            if (!subclasificacionExiste)
            {
                return Result<EntidadDetailDto>.Failure("La subclasificación especificada no existe");
            }

            // Crear entidad
            var entidad = new Entidad
            {
                Ruc = request.Ruc,
                Nombre = request.Nombre,
                Direccion = request.Direccion,
                UbigeoId = request.UbigeoId,
                Telefono = request.Telefono,
                Email = request.Email,
                Web = request.Web,
                NivelGobiernoId = request.NivelGobiernoId,
                SectorId = request.SectorId,
                ClasificacionId = request.ClasificacionId,
                NombreAlcalde = request.NombreAlcalde,
                ApePatAlcalde = request.ApePatAlcalde,
                ApeMatAlcalde = request.ApeMatAlcalde,
                EmailAlcalde = request.EmailAlcalde,
                Activo = request.Activo,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Entidades.Add(entidad);
            await _context.SaveChangesAsync(cancellationToken);

            // Recargar con navegación
            await _context.Entry(entidad)
                .Reference(e => e.Ubigeo)
                .LoadAsync(cancellationToken);

            await _context.Entry(entidad)
                .Reference(e => e.Clasificacion)
                .LoadAsync(cancellationToken);

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

            return Result<EntidadDetailDto>.Success(entidadDto, "Entidad creada exitosamente");
        }
        catch (Exception ex)
        {
            return Result<EntidadDetailDto>.Failure(
                "Error al crear entidad",
                new List<string> { ex.Message }
            );
        }
    }
}
