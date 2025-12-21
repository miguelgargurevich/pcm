using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com14OficialSeguridadDigital.Commands.UpdateCom14OficialSeguridadDigital;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com14OficialSeguridadDigital;

public class UpdateCom14OficialSeguridadDigitalHandler : IRequestHandler<UpdateCom14OficialSeguridadDigitalCommand, Result<Com14OficialSeguridadDigitalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom14OficialSeguridadDigitalHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom14OficialSeguridadDigitalHandler(PCMDbContext context, ILogger<UpdateCom14OficialSeguridadDigitalHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com14OficialSeguridadDigitalResponse>> Handle(UpdateCom14OficialSeguridadDigitalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com14OficialSeguridadDigital {Id}", request.ComdoscdEntId);

            var entity = await _context.Com14OficialSeguridadDigital
                .FirstOrDefaultAsync(x => x.ComdoscdEntId == request.ComdoscdEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com14OficialSeguridadDigitalResponse>.Failure($"Registro con ID {request.ComdoscdEntId} no encontrado");
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
            if (request.FechaElaboracion.HasValue) entity.FechaElaboracion = DateTime.SpecifyKind(request.FechaElaboracion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroDocumento)) entity.NumeroDocumento = request.NumeroDocumento;
            if (!string.IsNullOrEmpty(request.ArchivoDocumento)) entity.ArchivoDocumento = request.ArchivoDocumento;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.PoliticasSeguridad)) entity.PoliticasSeguridad = request.PoliticasSeguridad;
            if (!string.IsNullOrEmpty(request.Certificaciones)) entity.Certificaciones = request.Certificaciones;
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
                    usuarioId: Guid.Empty,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com14, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com14OficialSeguridadDigitalResponse
            {
                ComdoscdEntId = entity.ComdoscdEntId,
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
                PoliticasSeguridad = entity.PoliticasSeguridad,
                Certificaciones = entity.Certificaciones,
                FechaVigencia = entity.FechaVigencia,
            };

            return Result<Com14OficialSeguridadDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com14OficialSeguridadDigital");
            return Result<Com14OficialSeguridadDigitalResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
