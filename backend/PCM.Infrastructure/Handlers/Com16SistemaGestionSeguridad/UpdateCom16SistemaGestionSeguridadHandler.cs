using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.UpdateCom16SistemaGestionSeguridad;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com16SistemaGestionSeguridad;

public class UpdateCom16SistemaGestionSeguridadHandler : IRequestHandler<UpdateCom16SistemaGestionSeguridadCommand, Result<Com16SistemaGestionSeguridadResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom16SistemaGestionSeguridadHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom16SistemaGestionSeguridadHandler(PCMDbContext context, ILogger<UpdateCom16SistemaGestionSeguridadHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com16SistemaGestionSeguridadResponse>> Handle(UpdateCom16SistemaGestionSeguridadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com16SistemaGestionSeguridad {Id}", request.ComsgsiEntId);

            var entity = await _context.Com16SistemaGestionSeguridad
                .FirstOrDefaultAsync(x => x.ComsgsiEntId == request.ComsgsiEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com16SistemaGestionSeguridadResponse>.Failure($"Registro con ID {request.ComsgsiEntId} no encontrado");
            }

            string? estadoAnterior = entity.Estado;

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (!string.IsNullOrEmpty(request.RutaPdfNormativa)) entity.RutaPdfNormativa = request.RutaPdfNormativa;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos SGSI
            if (!string.IsNullOrEmpty(request.ResponsableSgsi)) entity.ResponsableSgsi = request.ResponsableSgsi;
            if (!string.IsNullOrEmpty(request.CargoResponsableSgsi)) entity.CargoResponsableSgsi = request.CargoResponsableSgsi;
            if (!string.IsNullOrEmpty(request.CorreoSgsi)) entity.CorreoSgsi = request.CorreoSgsi;
            if (!string.IsNullOrEmpty(request.TelefonoSgsi)) entity.TelefonoSgsi = request.TelefonoSgsi;
            if (!string.IsNullOrEmpty(request.EstadoImplementacionSgsi)) entity.EstadoImplementacionSgsi = request.EstadoImplementacionSgsi;
            if (!string.IsNullOrEmpty(request.AlcanceSgsi)) entity.AlcanceSgsi = request.AlcanceSgsi;
            if (request.FechaInicioSgsi.HasValue) entity.FechaInicioSgsi = DateTime.SpecifyKind(request.FechaInicioSgsi.Value, DateTimeKind.Utc);
            if (request.FechaCertificacionSgsi.HasValue) entity.FechaCertificacionSgsi = DateTime.SpecifyKind(request.FechaCertificacionSgsi.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.EntidadCertificadoraSgsi)) entity.EntidadCertificadoraSgsi = request.EntidadCertificadoraSgsi;
            if (!string.IsNullOrEmpty(request.VersionNormaSgsi)) entity.VersionNormaSgsi = request.VersionNormaSgsi;
            if (!string.IsNullOrEmpty(request.RutaPdfCertificadoSgsi)) entity.RutaPdfCertificadoSgsi = request.RutaPdfCertificadoSgsi;
            if (!string.IsNullOrEmpty(request.RutaPdfPoliticasSgsi)) entity.RutaPdfPoliticasSgsi = request.RutaPdfPoliticasSgsi;
            if (!string.IsNullOrEmpty(request.ObservacionSgsi)) entity.ObservacionSgsi = request.ObservacionSgsi;
            if (request.FechaImplementacionSgsi.HasValue) entity.FechaImplementacionSgsi = DateTime.SpecifyKind(request.FechaImplementacionSgsi.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NormaAplicadaSgsi)) entity.NormaAplicadaSgsi = request.NormaAplicadaSgsi;
            if (!string.IsNullOrEmpty(request.RutaPdfSgsi)) entity.RutaPdfSgsi = request.RutaPdfSgsi;
            if (!string.IsNullOrEmpty(request.NivelImplementacionSgsi)) entity.NivelImplementacionSgsi = request.NivelImplementacionSgsi;

            // Actualizar campos heredados de compatibilidad
            if (request.FechaImplementacion.HasValue) entity.FechaImplementacion = DateTime.SpecifyKind(request.FechaImplementacion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NormaAplicable)) entity.NormaAplicable = request.NormaAplicable;
            if (!string.IsNullOrEmpty(request.Certificacion)) entity.Certificacion = request.Certificacion;
            if (request.FechaCertificacion.HasValue) entity.FechaCertificacion = DateTime.SpecifyKind(request.FechaCertificacion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.ArchivoCertificado)) entity.ArchivoCertificado = request.ArchivoCertificado;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.Alcance)) entity.Alcance = request.Alcance;

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
                    usuarioId: request.UsuarioRegistra,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com16, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com16SistemaGestionSeguridadResponse
            {
                ComsgsiEntId = entity.ComsgsiEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
                FechaImplementacion = entity.FechaImplementacion,
                NormaAplicable = entity.NormaAplicable,
                Certificacion = entity.Certificacion,
                FechaCertificacion = entity.FechaCertificacion,
                ArchivoCertificado = entity.ArchivoCertificado,
                Descripcion = entity.Descripcion,
                Alcance = entity.Alcance,
            };

            return Result<Com16SistemaGestionSeguridadResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com16SistemaGestionSeguridad");
            return Result<Com16SistemaGestionSeguridadResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
