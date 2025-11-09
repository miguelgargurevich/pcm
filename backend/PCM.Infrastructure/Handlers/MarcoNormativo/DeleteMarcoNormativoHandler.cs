using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.MarcoNormativo.Commands.DeleteMarcoNormativo;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.MarcoNormativo;

public class DeleteMarcoNormativoHandler : IRequestHandler<DeleteMarcoNormativoCommand, Result<bool>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<DeleteMarcoNormativoHandler> _logger;

    public DeleteMarcoNormativoHandler(PCMDbContext context, ILogger<DeleteMarcoNormativoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(DeleteMarcoNormativoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var norma = await _context.MarcosNormativos.FindAsync(new object[] { request.NormaId }, cancellationToken);

            if (norma == null)
            {
                return Result<bool>.Failure("Marco normativo no encontrado", new List<string> { "La norma especificada no existe" });
            }

            // Soft delete: solo marcamos como inactivo
            norma.Activo = false;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Marco normativo eliminado (soft delete): {NormaId}", request.NormaId);

            return Result<bool>.Success(true, "Marco normativo eliminado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar marco normativo: {NormaId}", request.NormaId);
            return Result<bool>.Failure("Error al eliminar marco normativo", new List<string> { ex.Message });
        }
    }
}
