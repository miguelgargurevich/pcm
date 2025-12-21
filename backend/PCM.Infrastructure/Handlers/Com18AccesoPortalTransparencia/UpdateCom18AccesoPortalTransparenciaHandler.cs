using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com18AccesoPortalTransparencia.Commands.UpdateCom18AccesoPortalTransparencia;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com18AccesoPortalTransparencia;

public class UpdateCom18AccesoPortalTransparenciaHandler : IRequestHandler<UpdateCom18AccesoPortalTransparenciaCommand, Result<Com18AccesoPortalTransparenciaResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom18AccesoPortalTransparenciaHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom18AccesoPortalTransparenciaHandler(PCMDbContext context, ILogger<UpdateCom18AccesoPortalTransparenciaHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com18AccesoPortalTransparenciaResponse>> Handle(UpdateCom18AccesoPortalTransparenciaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com18AccesoPortalTransparencia {Id}", request.ComsapteEntId);

            var entity = await _context.Com18AccesoPortalTransparencia
                .FirstOrDefaultAsync(x => x.ComsapteEntId == request.ComsapteEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com18AccesoPortalTransparenciaResponse>.Failure($"Registro con ID {request.ComsapteEntId} no encontrado");
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

            // Actualizar campos específicos
            if (!string.IsNullOrEmpty(request.UrlPlataforma)) entity.UrlPlataforma = request.UrlPlataforma;
            if (request.FechaImplementacion.HasValue) entity.FechaImplementacion = DateTime.SpecifyKind(request.FechaImplementacion.Value, DateTimeKind.Utc);
            if (request.TramitesDisponibles.HasValue) entity.TramitesDisponibles = request.TramitesDisponibles;
            if (request.UsuariosRegistrados.HasValue) entity.UsuariosRegistrados = request.UsuariosRegistrados;
            if (request.TramitesProcesados.HasValue) entity.TramitesProcesados = request.TramitesProcesados;
            if (!string.IsNullOrEmpty(request.ArchivoEvidencia)) entity.ArchivoEvidencia = request.ArchivoEvidencia;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;

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
                    usuarioId: Guid.Empty,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com18, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com18AccesoPortalTransparenciaResponse
            {
                ComsapteEntId = entity.ComsapteEntId,
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
                UrlPlataforma = entity.UrlPlataforma,
                FechaImplementacion = entity.FechaImplementacion,
                TramitesDisponibles = entity.TramitesDisponibles,
                UsuariosRegistrados = entity.UsuariosRegistrados,
                TramitesProcesados = entity.TramitesProcesados,
                ArchivoEvidencia = entity.ArchivoEvidencia,
                Descripcion = entity.Descripcion,
            };

            return Result<Com18AccesoPortalTransparenciaResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com18AccesoPortalTransparencia");
            return Result<Com18AccesoPortalTransparenciaResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
