using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com7ImplementacionMPD.Commands.UpdateCom7ImplementacionMPD;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com7ImplementacionMPD;

public class UpdateCom7ImplementacionMPDHandler : IRequestHandler<UpdateCom7ImplementacionMPDCommand, Result<Com7ImplementacionMPDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom7ImplementacionMPDHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom7ImplementacionMPDHandler(
        PCMDbContext context,
        ILogger<UpdateCom7ImplementacionMPDHandler> logger,
        ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com7ImplementacionMPDResponse>> Handle(UpdateCom7ImplementacionMPDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com7ImplementacionMPD con ID: {ComimpdEntId}", request.ComimpdEntId);

            var entity = await _context.Com7ImplementacionMPD
                .FirstOrDefaultAsync(x => x.ComimpdEntId == request.ComimpdEntId, cancellationToken);

            if (entity == null)
            {
                _logger.LogWarning("No se encontró el registro Com7ImplementacionMPD con ID: {ComimpdEntId}", request.ComimpdEntId);
                return Result<Com7ImplementacionMPDResponse>.Failure("Registro no encontrado");
            }

            // Guardar estado anterior para historial
            string? estadoAnterior = entity.Estado;

            // Actualizar solo los campos que no son nulos
            if (request.CompromisoId.HasValue)
                entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue)
                entity.EntidadId = request.EntidadId.Value;
            if (request.UrlMpd != null)
                entity.UrlMpd = request.UrlMpd;
            if (request.FechaImplementacionMpd.HasValue)
                entity.FechaImplementacionMpd = DateTime.SpecifyKind(request.FechaImplementacionMpd.Value, DateTimeKind.Utc);
            if (request.ResponsableMpd != null)
                entity.ResponsableMpd = request.ResponsableMpd;
            if (request.CargoResponsableMpd != null)
                entity.CargoResponsableMpd = request.CargoResponsableMpd;
            if (request.CorreoResponsableMpd != null)
                entity.CorreoResponsableMpd = request.CorreoResponsableMpd;
            if (request.TelefonoResponsableMpd != null)
                entity.TelefonoResponsableMpd = request.TelefonoResponsableMpd;
            if (request.TipoMpd != null)
                entity.TipoMpd = request.TipoMpd;
            if (request.InteroperabilidadMpd.HasValue)
                entity.InteroperabilidadMpd = request.InteroperabilidadMpd.Value;
            if (request.ObservacionMpd != null)
                entity.ObservacionMpd = request.ObservacionMpd;
            if (request.RutaPdfMpd != null)
                entity.RutaPdfMpd = request.RutaPdfMpd;
            if (request.RutaPdfNormativa != null)
                entity.RutaPdfNormativa = request.RutaPdfNormativa;
            if (request.CheckPrivacidad.HasValue)
                entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue)
                entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue)
                entity.UsuarioRegistra = request.UsuarioRegistra.Value;
            if (request.EtapaFormulario != null)
                entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado))
                entity.Estado = request.Estado;

            await _context.SaveChangesAsync(cancellationToken);

            // Registrar en historial si el estado cambió
            if (!string.IsNullOrEmpty(request.Estado) && request.Estado != estadoAnterior)
            {
                string tipoAccion = request.Estado.ToLower() switch
                {
                    "enviado" or "publicado" => "ENVIO",
                    "en_proceso" or "borrador" => "BORRADOR",
                    _ => "CAMBIO_ESTADO"
                };

                await _historialService.RegistrarCambioDesdeFormularioAsync(
                    compromisoId: entity.CompromisoId,
                    entidadId: entity.EntidadId,
                    estadoAnterior: estadoAnterior,
                    estadoNuevo: request.Estado,
                    usuarioId: request.UserId,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com7ImplementacionMPD, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
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
                InteroperabilidadMpd = entity.InteroperabilidadMpd ?? false,
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

            _logger.LogInformation("Registro Com7ImplementacionMPD actualizado exitosamente");

            return Result<Com7ImplementacionMPDResponse>.Success(response, "Registro actualizado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com7ImplementacionMPD");
            return Result<Com7ImplementacionMPDResponse>.Failure($"Error al actualizar el registro: {ex.Message}");
        }
    }
}
