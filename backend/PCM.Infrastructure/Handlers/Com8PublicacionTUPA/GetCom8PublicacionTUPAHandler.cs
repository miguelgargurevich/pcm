using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com8PublicacionTUPA.Queries.GetCom8PublicacionTUPA;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com8PublicacionTUPA;

public class GetCom8PublicacionTUPAHandler : IRequestHandler<GetCom8PublicacionTUPAQuery, Result<Com8PublicacionTUPAResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom8PublicacionTUPAHandler> _logger;

    public GetCom8PublicacionTUPAHandler(
        PCMDbContext context,
        ILogger<GetCom8PublicacionTUPAHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com8PublicacionTUPAResponse>> Handle(GetCom8PublicacionTUPAQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation(
                "Buscando Com8PublicacionTUPA para CompromisoId: {CompromisoId}, EntidadId: {EntidadId}",
                request.CompromisoId,
                request.EntidadId);

            var entity = await _context.Com8PublicacionTUPA
                .Where(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                _logger.LogInformation("No se encontró registro Com8PublicacionTUPA");
                return Result<Com8PublicacionTUPAResponse>.Failure("No se encontró registro");
            }

            var response = new Com8PublicacionTUPAResponse
            {
                ComptupaEntId = entity.ComptupaEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                UrlTupa = entity.UrlTupa,
                NumeroResolucionTupa = entity.NumeroResolucionTupa,
                FechaAprobacionTupa = entity.FechaAprobacionTupa,
                ResponsableTupa = entity.ResponsableTupa,
                CargoResponsableTupa = entity.CargoResponsableTupa,
                CorreoResponsableTupa = entity.CorreoResponsableTupa,
                TelefonoResponsableTupa = entity.TelefonoResponsableTupa,
                ActualizadoTupa = entity.ActualizadoTupa,
                ObservacionTupa = entity.ObservacionTupa,
                RutaPdfTupa = entity.RutaPdfTupa,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            _logger.LogInformation("Registro Com8PublicacionTUPA encontrado con ID {ComptupaEntId}", entity.ComptupaEntId);
            return Result<Com8PublicacionTUPAResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com8PublicacionTUPA");
            return Result<Com8PublicacionTUPAResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
