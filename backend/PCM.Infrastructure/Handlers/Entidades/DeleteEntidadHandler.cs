using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Entidades.Commands.DeleteEntidad;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Entidades;

public class DeleteEntidadHandler : IRequestHandler<DeleteEntidadCommand, Result<bool>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<DeleteEntidadHandler> _logger;

    public DeleteEntidadHandler(PCMDbContext context, ILogger<DeleteEntidadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(DeleteEntidadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var entidad = await _context.Entidades.FindAsync(new object[] { request.EntidadId }, cancellationToken);

            if (entidad == null)
            {
                return Result<bool>.Failure("Entidad no encontrada", new List<string> { "La entidad especificada no existe" });
            }

            // Verificar si tiene usuarios asociados activos
            var tieneUsuariosActivos = await _context.Usuarios
                .AnyAsync(u => u.EntidadId == request.EntidadId && u.Activo, cancellationToken);

            if (tieneUsuariosActivos)
            {
                return Result<bool>.Failure(
                    "No se puede eliminar la entidad",
                    new List<string> { "La entidad tiene usuarios activos asociados. Desactive primero los usuarios." }
                );
            }

            // Soft delete: solo marcamos como inactivo
            entidad.Activo = false;
            entidad.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Entidad eliminada (soft delete): {EntidadId}", request.EntidadId);

            return Result<bool>.Success(true, "Entidad eliminada exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar entidad: {EntidadId}", request.EntidadId);
            return Result<bool>.Failure("Error al eliminar entidad", new List<string> { ex.Message });
        }
    }
}
