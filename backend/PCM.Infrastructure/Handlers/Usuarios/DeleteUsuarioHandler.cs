using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Usuarios.Commands.DeleteUsuario;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Usuarios;

public class DeleteUsuarioHandler : IRequestHandler<DeleteUsuarioCommand, Result<bool>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<DeleteUsuarioHandler> _logger;

    public DeleteUsuarioHandler(PCMDbContext context, ILogger<DeleteUsuarioHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(DeleteUsuarioCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var usuario = await _context.Usuarios.FindAsync(new object[] { request.UserId }, cancellationToken);

            if (usuario == null)
            {
                return Result<bool>.Failure("Usuario no encontrado", new List<string> { "El usuario especificado no existe" });
            }

            // Soft delete: solo marcamos como inactivo
            usuario.Activo = false;
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Usuario eliminado (soft delete): {UserId}", request.UserId);

            return Result<bool>.Success(true, "Usuario eliminado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar usuario: {UserId}", request.UserId);
            return Result<bool>.Failure("Error al eliminar usuario", new List<string> { ex.Message });
        }
    }
}
