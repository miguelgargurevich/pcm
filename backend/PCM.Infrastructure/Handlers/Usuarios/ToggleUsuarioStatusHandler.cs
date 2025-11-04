using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.Features.Usuarios.Commands.ToggleUsuarioStatus;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Usuarios;

public class ToggleUsuarioStatusHandler : IRequestHandler<ToggleUsuarioStatusCommand, Result>
{
    private readonly PCMDbContext _context;

    public ToggleUsuarioStatusHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ToggleUsuarioStatusCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

            if (usuario == null)
            {
                return Result.Failure("Usuario no encontrado");
            }

            usuario.Activo = !usuario.Activo;
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            var mensaje = usuario.Activo ? "Usuario activado" : "Usuario desactivado";
            return Result.Success(mensaje);
        }
        catch (Exception ex)
        {
            return Result.Failure(
                "Error al cambiar estado del usuario",
                new List<string> { ex.Message }
            );
        }
    }
}
