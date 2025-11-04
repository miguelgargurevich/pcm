using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.Features.Entidades.Commands.ToggleEntidadStatus;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Entidades;

public class ToggleEntidadStatusHandler : IRequestHandler<ToggleEntidadStatusCommand, Result>
{
    private readonly PCMDbContext _context;

    public ToggleEntidadStatusHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ToggleEntidadStatusCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var entidad = await _context.Entidades
                .FirstOrDefaultAsync(e => e.EntidadId == request.EntidadId, cancellationToken);

            if (entidad == null)
            {
                return Result.Failure("Entidad no encontrada");
            }

            entidad.Activo = !entidad.Activo;
            entidad.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            var mensaje = entidad.Activo ? "Entidad activada" : "Entidad desactivada";
            return Result.Success(mensaje);
        }
        catch (Exception ex)
        {
            return Result.Failure(
                "Error al cambiar estado de la entidad",
                new List<string> { ex.Message }
            );
        }
    }
}
