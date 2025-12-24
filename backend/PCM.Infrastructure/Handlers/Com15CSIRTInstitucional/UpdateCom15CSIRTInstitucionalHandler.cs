using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com15CSIRTInstitucional.Commands.UpdateCom15CSIRTInstitucional;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com15CSIRTInstitucional;

public class UpdateCom15CSIRTInstitucionalHandler : IRequestHandler<UpdateCom15CSIRTInstitucionalCommand, Result<Com15CSIRTInstitucionalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom15CSIRTInstitucionalHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom15CSIRTInstitucionalHandler(PCMDbContext context, ILogger<UpdateCom15CSIRTInstitucionalHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com15CSIRTInstitucionalResponse>> Handle(UpdateCom15CSIRTInstitucionalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com15CSIRTInstitucional {Id}", request.ComcsirtEntId);

            var entity = await _context.Com15CSIRTInstitucional
                .FirstOrDefaultAsync(x => x.ComcsirtEntId == request.ComcsirtEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com15CSIRTInstitucionalResponse>.Failure($"Registro con ID {request.ComcsirtEntId} no encontrado");
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

            // Actualizar campos específicos del CSIRT
            if (!string.IsNullOrEmpty(request.NombreCsirt)) entity.NombreCsirt = request.NombreCsirt;
            if (request.FechaConformacionCsirt.HasValue) entity.FechaConformacionCsirt = DateTime.SpecifyKind(request.FechaConformacionCsirt.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroResolucionCsirt)) entity.NumeroResolucionCsirt = request.NumeroResolucionCsirt;
            if (!string.IsNullOrEmpty(request.ResponsableCsirt)) entity.ResponsableCsirt = request.ResponsableCsirt;
            if (!string.IsNullOrEmpty(request.CargoResponsableCsirt)) entity.CargoResponsableCsirt = request.CargoResponsableCsirt;
            if (!string.IsNullOrEmpty(request.CorreoCsirt)) entity.CorreoCsirt = request.CorreoCsirt;
            if (!string.IsNullOrEmpty(request.TelefonoCsirt)) entity.TelefonoCsirt = request.TelefonoCsirt;
            if (request.ProtocoloIncidentesCsirt.HasValue) entity.ProtocoloIncidentesCsirt = request.ProtocoloIncidentesCsirt.Value;
            if (request.ComunicadoPcmCsirt.HasValue) entity.ComunicadoPcmCsirt = request.ComunicadoPcmCsirt.Value;
            if (!string.IsNullOrEmpty(request.RutaPdfCsirt)) entity.RutaPdfCsirt = request.RutaPdfCsirt;
            if (!string.IsNullOrEmpty(request.ObservacionCsirt)) entity.ObservacionCsirt = request.ObservacionCsirt;

            // Campos heredados (compatibilidad)
            if (request.FechaConformacion.HasValue) entity.FechaConformacion = DateTime.SpecifyKind(request.FechaConformacion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroResolucion)) entity.NumeroResolucion = request.NumeroResolucion;
            if (!string.IsNullOrEmpty(request.Responsable)) entity.Responsable = request.Responsable;
            if (!string.IsNullOrEmpty(request.EmailContacto)) entity.EmailContacto = request.EmailContacto;
            if (!string.IsNullOrEmpty(request.TelefonoContacto)) entity.TelefonoContacto = request.TelefonoContacto;
            if (!string.IsNullOrEmpty(request.ArchivoProcedimientos)) entity.ArchivoProcedimientos = request.ArchivoProcedimientos;
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
                    usuarioId: request.UsuarioRegistra ?? Guid.Empty,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com15, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com15CSIRTInstitucionalResponse
            {
                ComcsirtEntId = entity.ComcsirtEntId,
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
                FechaConformacion = entity.FechaConformacion,
                NumeroResolucion = entity.NumeroResolucion,
                Responsable = entity.Responsable,
                EmailContacto = entity.EmailContacto,
                TelefonoContacto = entity.TelefonoContacto,
                ArchivoProcedimientos = entity.ArchivoProcedimientos,
                Descripcion = entity.Descripcion,
            };

            return Result<Com15CSIRTInstitucionalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com15CSIRTInstitucional");
            return Result<Com15CSIRTInstitucionalResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
