using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.Features.MarcoNormativo.Commands.ToggleMarcoNormativoStatus;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.MarcoNormativo;

public class ToggleMarcoNormativoStatusHandler : IRequestHandler<ToggleMarcoNormativoStatusCommand, Result>
{
    private readonly PCMDbContext _context;

    public ToggleMarcoNormativoStatusHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ToggleMarcoNormativoStatusCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var marcoNormativo = await _context.MarcosNormativos
                .FirstOrDefaultAsync(m => m.NormaId == request.MarcoNormativoId, cancellationToken);

            if (marcoNormativo == null)
            {
                return Result.Failure("Marco normativo no encontrado");
            }

            marcoNormativo.Activo = !marcoNormativo.Activo;

            await _context.SaveChangesAsync(cancellationToken);

            var mensaje = marcoNormativo.Activo ? "Marco normativo activado" : "Marco normativo desactivado";
            return Result.Success(mensaje);
        }
        catch (Exception ex)
        {
            return Result.Failure(
                "Error al cambiar estado del marco normativo",
                new List<string> { ex.Message }
            );
        }
    }
}
