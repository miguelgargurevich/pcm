using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com19EncuestaNacionalGobDigital.Commands.UpdateCom19EncuestaNacionalGobDigital;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com19EncuestaNacionalGobDigital;

public class UpdateCom19EncuestaNacionalGobDigitalHandler : IRequestHandler<UpdateCom19EncuestaNacionalGobDigitalCommand, Result<Com19EncuestaNacionalGobDigitalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom19EncuestaNacionalGobDigitalHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom19EncuestaNacionalGobDigitalHandler(PCMDbContext context, ILogger<UpdateCom19EncuestaNacionalGobDigitalHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com19EncuestaNacionalGobDigitalResponse>> Handle(UpdateCom19EncuestaNacionalGobDigitalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com19EncuestaNacionalGobDigital {Id}", request.ComrenadEntId);

            var entity = await _context.Com19EncuestaNacionalGobDigital
                .FirstOrDefaultAsync(x => x.ComrenadEntId == request.ComrenadEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com19EncuestaNacionalGobDigitalResponse>.Failure($"Registro con ID {request.ComrenadEntId} no encontrado");
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

            // Actualizar campos específicos ENAD
            if (request.AnioEnad.HasValue) entity.AnioEnad = request.AnioEnad.Value;
            if (!string.IsNullOrEmpty(request.ResponsableEnad)) entity.ResponsableEnad = request.ResponsableEnad;
            if (!string.IsNullOrEmpty(request.CargoResponsableEnad)) entity.CargoResponsableEnad = request.CargoResponsableEnad;
            if (!string.IsNullOrEmpty(request.CorreoEnad)) entity.CorreoEnad = request.CorreoEnad;
            if (!string.IsNullOrEmpty(request.TelefonoEnad)) entity.TelefonoEnad = request.TelefonoEnad;
            if (request.FechaEnvioEnad.HasValue) entity.FechaEnvioEnad = DateTime.SpecifyKind(request.FechaEnvioEnad.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.EstadoRespuestaEnad)) entity.EstadoRespuestaEnad = request.EstadoRespuestaEnad;
            if (!string.IsNullOrEmpty(request.EnlaceFormularioEnad)) entity.EnlaceFormularioEnad = request.EnlaceFormularioEnad;
            if (!string.IsNullOrEmpty(request.ObservacionEnad)) entity.ObservacionEnad = request.ObservacionEnad;
            if (!string.IsNullOrEmpty(request.RutaPdfEnad)) entity.RutaPdfEnad = request.RutaPdfEnad;

            // Actualizar campos heredados de compatibilidad
            if (request.FechaConexion.HasValue) entity.FechaConexion = DateTime.SpecifyKind(request.FechaConexion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.TipoConexion)) entity.TipoConexion = request.TipoConexion;
            if (!string.IsNullOrEmpty(request.AnchoBanda)) entity.AnchoBanda = request.AnchoBanda;
            if (!string.IsNullOrEmpty(request.Proveedor)) entity.Proveedor = request.Proveedor;
            if (!string.IsNullOrEmpty(request.ArchivoContrato)) entity.ArchivoContrato = request.ArchivoContrato;
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
                    usuarioId: request.UserId,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com19, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com19EncuestaNacionalGobDigitalResponse
            {
                ComrenadEntId = entity.ComrenadEntId,
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
                FechaConexion = entity.FechaConexion,
                TipoConexion = entity.TipoConexion,
                AnchoBanda = entity.AnchoBanda,
                Proveedor = entity.Proveedor,
                ArchivoContrato = entity.ArchivoContrato,
                Descripcion = entity.Descripcion,
            };

            return Result<Com19EncuestaNacionalGobDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com19EncuestaNacionalGobDigital");
            return Result<Com19EncuestaNacionalGobDigitalResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
