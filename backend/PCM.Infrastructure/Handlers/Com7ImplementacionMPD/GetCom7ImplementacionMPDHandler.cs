using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com7ImplementacionMPD.Queries.GetCom7ImplementacionMPD;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com7ImplementacionMPD;

public class GetCom7ImplementacionMPDHandler : IRequestHandler<GetCom7ImplementacionMPDQuery, Result<Com7ImplementacionMPDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom7ImplementacionMPDHandler> _logger;

    public GetCom7ImplementacionMPDHandler(
        PCMDbContext context,
        ILogger<GetCom7ImplementacionMPDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com7ImplementacionMPDResponse>> Handle(GetCom7ImplementacionMPDQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation(
                "Buscando Com7ImplementacionMPD para CompromisoId: {CompromisoId}, EntidadId: {EntidadId}",
                request.CompromisoId,
                request.EntidadId);

            var entity = await _context.Com7ImplementacionMPD
                .Where(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                _logger.LogInformation("No se encontró registro Com7ImplementacionMPD");
                return Result<Com7ImplementacionMPDResponse>.Success(null, "No se encontró registro");
            }

            var response = new Com7ImplementacionMPDResponse
            {
                ComimpdEntId = entity.ComimpdEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                UrlMpd = entity.UrlMpd,
                FechaImplementacionMpd = entity.FechaImplementacionMpd,
                ResponsableMpd = entity.ResponsableMpd,
                CargoResponsableMpd = entity.CargoResponsableMpd,
                CorreoResponsableMpd = entity.CorreoResponsableMpd,
                TelefonoResponsableMpd = entity.TelefonoResponsableMpd,
                TipoMpd = entity.TipoMpd,
                InteroperabilidadMpd = entity.InteroperabilidadMpd,
                ObservacionMpd = entity.ObservacionMpd,
                RutaPdfMpd = entity.RutaPdfMpd,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            _logger.LogInformation("Registro Com7ImplementacionMPD encontrado con ID {ComimpdEntId}", entity.ComimpdEntId);
            return Result<Com7ImplementacionMPDResponse>.Success(response, "Registro encontrado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com7ImplementacionMPD");
            return Result<Com7ImplementacionMPDResponse>.Failure($"Error al obtener el registro: {ex.Message}");
        }
    }
}
