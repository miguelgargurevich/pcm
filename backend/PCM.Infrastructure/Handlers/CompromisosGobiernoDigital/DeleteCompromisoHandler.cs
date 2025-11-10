using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.CompromisosGobiernoDigital.Commands.DeleteCompromiso;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class DeleteCompromisoHandler : IRequestHandler<DeleteCompromisoCommand, Result<bool>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<DeleteCompromisoHandler> _logger;

    public DeleteCompromisoHandler(PCMDbContext context, ILogger<DeleteCompromisoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(DeleteCompromisoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var compromiso = await _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                .Include(c => c.CriteriosEvaluacion)
                .FirstOrDefaultAsync(c => c.CompromisoId == request.CompromisoId, cancellationToken);

            if (compromiso == null)
            {
                return Result<bool>.Failure("Compromiso no encontrado");
            }

            // Remove related entities first
            _context.CompromisosNormativas.RemoveRange(compromiso.Normativas);
            _context.CriteriosEvaluacion.RemoveRange(compromiso.CriteriosEvaluacion);

            // Remove the compromiso
            _context.CompromisosGobiernoDigital.Remove(compromiso);

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Compromiso deleted successfully: {CompromisoId}", request.CompromisoId);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting compromiso {CompromisoId}", request.CompromisoId);
            return Result<bool>.Failure($"Error al eliminar el compromiso: {ex.Message}");
        }
    }
}
