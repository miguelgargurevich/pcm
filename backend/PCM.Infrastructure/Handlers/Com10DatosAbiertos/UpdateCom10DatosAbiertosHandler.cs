using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Application.Features.Com10DatosAbiertos.Commands.UpdateCom10DatosAbiertos;
using PCM.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com10DatosAbiertos
{
    public class UpdateCom10DatosAbiertosHandler : IRequestHandler<UpdateCom10DatosAbiertosCommand, Result<bool>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<UpdateCom10DatosAbiertosHandler> _logger;
        private readonly ICumplimientoHistorialService _historialService;

        public UpdateCom10DatosAbiertosHandler(PCMDbContext context, ILogger<UpdateCom10DatosAbiertosHandler> logger, ICumplimientoHistorialService historialService)
        {
            _context = context;
            _logger = logger;
            _historialService = historialService;
        }

        public async Task<Result<bool>> Handle(UpdateCom10DatosAbiertosCommand request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Actualizando Com10 Datos Abiertos con ID {request.ComdaEntId}");

                var registro = await _context.Com10DatosAbiertos
                    .FirstOrDefaultAsync(c => c.ComdaEntId == request.ComdaEntId, cancellationToken);

                if (registro == null)
                {
                    _logger.LogWarning($"No se encontró Com10 Datos Abiertos con ID {request.ComdaEntId}");
                    return Result<bool>.Failure("Registro no encontrado");
                }

                // Guardar estado anterior para historial
                string? estadoAnterior = registro.Estado;

                // Actualizar campos
                registro.UrlDatosAbiertos = request.UrlDatosAbiertos ?? registro.UrlDatosAbiertos;
                registro.TotalDatasets = request.TotalDatasets ?? registro.TotalDatasets;
                registro.FechaUltimaActualizacionDa = request.FechaUltimaActualizacionDa.HasValue 
                    ? DateTime.SpecifyKind(request.FechaUltimaActualizacionDa.Value, DateTimeKind.Utc) 
                    : registro.FechaUltimaActualizacionDa;
                registro.ResponsableDa = request.ResponsableDa ?? registro.ResponsableDa;
                registro.CargoResponsableDa = request.CargoResponsableDa ?? registro.CargoResponsableDa;
                registro.CorreoResponsableDa = request.CorreoResponsableDa ?? registro.CorreoResponsableDa;
                registro.TelefonoResponsableDa = request.TelefonoResponsableDa ?? registro.TelefonoResponsableDa;
                registro.NumeroNormaResolucionDa = request.NumeroNormaResolucionDa ?? registro.NumeroNormaResolucionDa;
                registro.FechaAprobacionDa = request.FechaAprobacionDa.HasValue 
                    ? DateTime.SpecifyKind(request.FechaAprobacionDa.Value, DateTimeKind.Utc) 
                    : registro.FechaAprobacionDa;
                registro.ObservacionDa = request.ObservacionDa ?? registro.ObservacionDa;
                registro.RutaPdfDa = request.RutaPdfDa ?? registro.RutaPdfDa;
                if (request.RutaPdfNormativa != null) registro.RutaPdfNormativa = request.RutaPdfNormativa;
                registro.CheckPrivacidad = request.CheckPrivacidad;
                registro.CheckDdjj = request.CheckDdjj;
                if (request.UsuarioRegistra.HasValue && request.UsuarioRegistra.Value != Guid.Empty)
                {
                    registro.UsuarioRegistra = request.UsuarioRegistra.Value;
                }
                registro.EtapaFormulario = request.EtapaFormulario ?? registro.EtapaFormulario;
                if (!string.IsNullOrEmpty(request.Estado))
                    registro.Estado = request.Estado;
                registro.UpdatedAt = DateTime.UtcNow;

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
                        compromisoId: registro.CompromisoId,
                        entidadId: registro.EntidadId,
                        estadoAnterior: estadoAnterior,
                        estadoNuevo: request.Estado,
                        usuarioId: request.UsuarioRegistra ?? Guid.Empty,
                        observacion: null,
                        tipoAccion: tipoAccion);

                    _logger.LogInformation("Historial registrado para Com10 Datos Abiertos, entidad {EntidadId}, acción: {TipoAccion}", 
                        registro.EntidadId, tipoAccion);
                }

                _logger.LogInformation($"Com10 Datos Abiertos actualizado exitosamente");

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar Com10 Datos Abiertos");
                return Result<bool>.Failure($"Error al actualizar Com10 Datos Abiertos: {ex.Message}");
            }
        }
    }
}
