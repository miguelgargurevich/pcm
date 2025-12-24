using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com21OficialGobiernoDatos.Commands.UpdateCom21OficialGobiernoDatos;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com21OficialGobiernoDatos;

public class UpdateCom21OficialGobiernoDatosHandler : IRequestHandler<UpdateCom21OficialGobiernoDatosCommand, Result<Com21OficialGobiernoDatosResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom21OficialGobiernoDatosHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom21OficialGobiernoDatosHandler(PCMDbContext context, ILogger<UpdateCom21OficialGobiernoDatosHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com21OficialGobiernoDatosResponse>> Handle(UpdateCom21OficialGobiernoDatosCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com21OficialGobiernoDatos {Id}", request.ComdogdEntId);

            var entity = await _context.Com21OficialGobiernoDatos
                .FirstOrDefaultAsync(x => x.ComdogdEntId == request.ComdogdEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com21OficialGobiernoDatosResponse>.Failure($"Registro con ID {request.ComdogdEntId} no encontrado");
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

            // Actualizar campos específicos OGD
            if (!string.IsNullOrEmpty(request.DniOgd)) entity.DniOgd = request.DniOgd;
            if (!string.IsNullOrEmpty(request.NombreOgd)) entity.NombreOgd = request.NombreOgd;
            if (!string.IsNullOrEmpty(request.ApePatOgd)) entity.ApePatOgd = request.ApePatOgd;
            if (!string.IsNullOrEmpty(request.ApeMatOgd)) entity.ApeMatOgd = request.ApeMatOgd;
            if (!string.IsNullOrEmpty(request.CargoOgd)) entity.CargoOgd = request.CargoOgd;
            if (!string.IsNullOrEmpty(request.CorreoOgd)) entity.CorreoOgd = request.CorreoOgd;
            if (!string.IsNullOrEmpty(request.TelefonoOgd)) entity.TelefonoOgd = request.TelefonoOgd;
            if (request.FechaDesignacionOgd.HasValue) entity.FechaDesignacionOgd = DateTime.SpecifyKind(request.FechaDesignacionOgd.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroResolucionOgd)) entity.NumeroResolucionOgd = request.NumeroResolucionOgd;
            if (request.ComunicadoPcmOgd.HasValue) entity.ComunicadoPcmOgd = request.ComunicadoPcmOgd.Value;
            if (!string.IsNullOrEmpty(request.RutaPdfOgd)) entity.RutaPdfOgd = request.RutaPdfOgd;
            if (!string.IsNullOrEmpty(request.ObservacionOgd)) entity.ObservacionOgd = request.ObservacionOgd;

            // Actualizar campos heredados de compatibilidad
            if (request.FechaElaboracion.HasValue) entity.FechaElaboracion = DateTime.SpecifyKind(request.FechaElaboracion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroDocumento)) entity.NumeroDocumento = request.NumeroDocumento;
            if (!string.IsNullOrEmpty(request.ArchivoDocumento)) entity.ArchivoDocumento = request.ArchivoDocumento;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.Procedimientos)) entity.Procedimientos = request.Procedimientos;
            if (!string.IsNullOrEmpty(request.Responsables)) entity.Responsables = request.Responsables;
            if (request.FechaVigencia.HasValue) entity.FechaVigencia = DateTime.SpecifyKind(request.FechaVigencia.Value, DateTimeKind.Utc);

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

                _logger.LogInformation("Historial registrado para Com21, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com21OficialGobiernoDatosResponse
            {
                ComdogdEntId = entity.ComdogdEntId,
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
                FechaElaboracion = entity.FechaElaboracion,
                NumeroDocumento = entity.NumeroDocumento,
                ArchivoDocumento = entity.ArchivoDocumento,
                Descripcion = entity.Descripcion,
                Procedimientos = entity.Procedimientos,
                Responsables = entity.Responsables,
                FechaVigencia = entity.FechaVigencia,
            };

            return Result<Com21OficialGobiernoDatosResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com21OficialGobiernoDatos");
            return Result<Com21OficialGobiernoDatosResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
