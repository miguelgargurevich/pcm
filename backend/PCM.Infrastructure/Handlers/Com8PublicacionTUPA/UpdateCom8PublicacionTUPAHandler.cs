using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com8PublicacionTUPA.Commands.UpdateCom8PublicacionTUPA;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com8PublicacionTUPA;

public class UpdateCom8PublicacionTUPAHandler : IRequestHandler<UpdateCom8PublicacionTUPACommand, Result<Com8PublicacionTUPAResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom8PublicacionTUPAHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom8PublicacionTUPAHandler(
        PCMDbContext context,
        ILogger<UpdateCom8PublicacionTUPAHandler> logger,
        ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com8PublicacionTUPAResponse>> Handle(UpdateCom8PublicacionTUPACommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com8PublicacionTUPA con ID: {ComptupaEntId}", request.ComptupaEntId);

            var entity = await _context.Com8PublicacionTUPA
                .FirstOrDefaultAsync(x => x.ComptupaEntId == request.ComptupaEntId, cancellationToken);

            if (entity == null)
            {
                _logger.LogWarning("No se encontró el registro Com8PublicacionTUPA con ID: {ComptupaEntId}", request.ComptupaEntId);
                return Result<Com8PublicacionTUPAResponse>.Failure("Registro no encontrado");
            }

            // Guardar estado anterior para historial
            string? estadoAnterior = entity.Estado;

            // Actualizar solo los campos que no son nulos
            if (request.CompromisoId.HasValue)
                entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue)
                entity.EntidadId = request.EntidadId.Value;
            if (request.UrlTupa != null)
                entity.UrlTupa = request.UrlTupa;
            if (request.NumeroResolucionTupa != null)
                entity.NumeroResolucionTupa = request.NumeroResolucionTupa;
            if (request.FechaAprobacionTupa.HasValue)
                entity.FechaAprobacionTupa = DateTime.SpecifyKind(request.FechaAprobacionTupa.Value, DateTimeKind.Utc);
            if (request.ResponsableTupa != null)
                entity.ResponsableTupa = request.ResponsableTupa;
            if (request.CargoResponsableTupa != null)
                entity.CargoResponsableTupa = request.CargoResponsableTupa;
            if (request.CorreoResponsableTupa != null)
                entity.CorreoResponsableTupa = request.CorreoResponsableTupa;
            if (request.TelefonoResponsableTupa != null)
                entity.TelefonoResponsableTupa = request.TelefonoResponsableTupa;
            if (request.ActualizadoTupa.HasValue)
                entity.ActualizadoTupa = request.ActualizadoTupa.Value;
            if (request.ObservacionTupa != null)
                entity.ObservacionTupa = request.ObservacionTupa;
            if (request.RutaPdfTupa != null)
                entity.RutaPdfTupa = request.RutaPdfTupa;
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

            entity.UpdatedAt = DateTime.UtcNow;

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

                _logger.LogInformation("Historial registrado para Com8PublicacionTUPA, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            _logger.LogInformation("Registro Com8PublicacionTUPA actualizado exitosamente");

            var response = new Com8PublicacionTUPAResponse
            {
                ComptupaEntId = entity.ComptupaEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                UrlTupa = entity.UrlTupa,
                NumeroResolucionTupa = entity.NumeroResolucionTupa,
                FechaAprobacionTupa = entity.FechaAprobacionTupa,
                ResponsableTupa = entity.ResponsableTupa,
                CargoResponsableTupa = entity.CargoResponsableTupa,
                CorreoResponsableTupa = entity.CorreoResponsableTupa,
                TelefonoResponsableTupa = entity.TelefonoResponsableTupa,
                ActualizadoTupa = entity.ActualizadoTupa,
                ObservacionTupa = entity.ObservacionTupa,
                RutaPdfTupa = entity.RutaPdfTupa,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };

            return Result<Com8PublicacionTUPAResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com8PublicacionTUPA");
            return Result<Com8PublicacionTUPAResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
