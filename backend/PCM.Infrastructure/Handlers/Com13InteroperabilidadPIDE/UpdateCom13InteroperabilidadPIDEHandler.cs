using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.UpdateCom13InteroperabilidadPIDE;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com13InteroperabilidadPIDE;

public class UpdateCom13InteroperabilidadPIDEHandler : IRequestHandler<UpdateCom13InteroperabilidadPIDECommand, Result<Com13InteroperabilidadPIDEResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom13InteroperabilidadPIDEHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom13InteroperabilidadPIDEHandler(PCMDbContext context, ILogger<UpdateCom13InteroperabilidadPIDEHandler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com13InteroperabilidadPIDEResponse>> Handle(UpdateCom13InteroperabilidadPIDECommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com13InteroperabilidadPIDE {Id}", request.CompcpideEntId);

            var entity = await _context.Com13InteroperabilidadPIDE
                .FirstOrDefaultAsync(x => x.CompcpideEntId == request.CompcpideEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com13InteroperabilidadPIDEResponse>.Failure($"Registro con ID {request.CompcpideEntId} no encontrado");
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
            if (request.FechaAprobacion.HasValue) entity.FechaAprobacion = DateTime.SpecifyKind(request.FechaAprobacion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroResolucion)) entity.NumeroResolucion = request.NumeroResolucion;
            if (!string.IsNullOrEmpty(request.ArchivoPlan)) entity.ArchivoPlan = request.ArchivoPlan;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.RiesgosIdentificados)) entity.RiesgosIdentificados = request.RiesgosIdentificados;
            if (!string.IsNullOrEmpty(request.EstrategiasMitigacion)) entity.EstrategiasMitigacion = request.EstrategiasMitigacion;
            if (request.FechaRevision.HasValue) entity.FechaRevision = DateTime.SpecifyKind(request.FechaRevision.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.Responsable)) entity.Responsable = request.Responsable;

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

                _logger.LogInformation("Historial registrado para Com13, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com13InteroperabilidadPIDEResponse
            {
                CompcpideEntId = entity.CompcpideEntId,
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
                FechaAprobacion = entity.FechaAprobacion,
                NumeroResolucion = entity.NumeroResolucion,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
                RiesgosIdentificados = entity.RiesgosIdentificados,
                EstrategiasMitigacion = entity.EstrategiasMitigacion,
                FechaRevision = entity.FechaRevision,
                Responsable = entity.Responsable,
            };

            return Result<Com13InteroperabilidadPIDEResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com13InteroperabilidadPIDE");
            return Result<Com13InteroperabilidadPIDEResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
