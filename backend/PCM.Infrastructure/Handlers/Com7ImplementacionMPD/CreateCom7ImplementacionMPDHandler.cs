using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com7ImplementacionMPD.Commands.CreateCom7ImplementacionMPD;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com7Entity = PCM.Domain.Entities.Com7ImplementacionMPD;

namespace PCM.Infrastructure.Handlers.Com7ImplementacionMPD;

public class CreateCom7ImplementacionMPDHandler : IRequestHandler<CreateCom7ImplementacionMPDCommand, Result<Com7ImplementacionMPDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom7ImplementacionMPDHandler> _logger;

    public CreateCom7ImplementacionMPDHandler(
        PCMDbContext context,
        ILogger<CreateCom7ImplementacionMPDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com7ImplementacionMPDResponse>> Handle(CreateCom7ImplementacionMPDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com7ImplementacionMPD para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com7Entity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                UrlMpd = request.UrlMpd,
                FechaImplementacionMpd = request.FechaImplementacionMpd,
                ResponsableMpd = request.ResponsableMpd,
                CargoResponsableMpd = request.CargoResponsableMpd,
                CorreoResponsableMpd = request.CorreoResponsableMpd,
                TelefonoResponsableMpd = request.TelefonoResponsableMpd,
                TipoMpd = request.TipoMpd,
                InteroperabilidadMpd = request.InteroperabilidadMpd,
                ObservacionMpd = request.ObservacionMpd,
                RutaPdfMpd = request.RutaPdfMpd,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                Activo = true
            };

            _context.Com7ImplementacionMPD.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

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

            _logger.LogInformation("Registro Com7ImplementacionMPD creado exitosamente con ID {ComimpdEntId}", entity.ComimpdEntId);

            return Result<Com7ImplementacionMPDResponse>.Success(response, "Registro creado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear registro Com7ImplementacionMPD");
            return Result<Com7ImplementacionMPDResponse>.Failure($"Error al crear el registro: {ex.Message}");
        }
    }
}
