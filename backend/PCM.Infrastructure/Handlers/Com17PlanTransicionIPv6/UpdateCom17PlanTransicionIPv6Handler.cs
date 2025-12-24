using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com17PlanTransicionIPv6.Commands.UpdateCom17PlanTransicionIPv6;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com17PlanTransicionIPv6;

public class UpdateCom17PlanTransicionIPv6Handler : IRequestHandler<UpdateCom17PlanTransicionIPv6Command, Result<Com17PlanTransicionIPv6Response>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom17PlanTransicionIPv6Handler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom17PlanTransicionIPv6Handler(PCMDbContext context, ILogger<UpdateCom17PlanTransicionIPv6Handler> logger, ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com17PlanTransicionIPv6Response>> Handle(UpdateCom17PlanTransicionIPv6Command request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com17PlanTransicionIPv6 {Id}", request.Comptipv6EntId);

            var entity = await _context.Com17PlanTransicionIPv6
                .FirstOrDefaultAsync(x => x.Comptipv6EntId == request.Comptipv6EntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com17PlanTransicionIPv6Response>.Failure($"Registro con ID {request.Comptipv6EntId} no encontrado");
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

            // Actualizar campos específicos IPv6
            if (!string.IsNullOrEmpty(request.ResponsableIpv6)) entity.ResponsableIpv6 = request.ResponsableIpv6;
            if (!string.IsNullOrEmpty(request.CargoResponsableIpv6)) entity.CargoResponsableIpv6 = request.CargoResponsableIpv6;
            if (!string.IsNullOrEmpty(request.CorreoIpv6)) entity.CorreoIpv6 = request.CorreoIpv6;
            if (!string.IsNullOrEmpty(request.TelefonoIpv6)) entity.TelefonoIpv6 = request.TelefonoIpv6;
            if (!string.IsNullOrEmpty(request.EstadoPlanIpv6)) entity.EstadoPlanIpv6 = request.EstadoPlanIpv6;
            if (request.FechaFormulacionIpv6.HasValue) entity.FechaFormulacionIpv6 = DateTime.SpecifyKind(request.FechaFormulacionIpv6.Value, DateTimeKind.Utc);
            if (request.FechaAprobacionIpv6.HasValue) entity.FechaAprobacionIpv6 = DateTime.SpecifyKind(request.FechaAprobacionIpv6.Value, DateTimeKind.Utc);
            if (request.FechaInicioIpv6.HasValue) entity.FechaInicioIpv6 = DateTime.SpecifyKind(request.FechaInicioIpv6.Value, DateTimeKind.Utc);
            if (request.FechaFinIpv6.HasValue) entity.FechaFinIpv6 = DateTime.SpecifyKind(request.FechaFinIpv6.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.DescripcionPlanIpv6)) entity.DescripcionPlanIpv6 = request.DescripcionPlanIpv6;
            if (!string.IsNullOrEmpty(request.RutaPdfPlanIpv6)) entity.RutaPdfPlanIpv6 = request.RutaPdfPlanIpv6;
            if (!string.IsNullOrEmpty(request.ObservacionIpv6)) entity.ObservacionIpv6 = request.ObservacionIpv6;

            // Actualizar campos heredados de compatibilidad
            if (request.FechaInicioTransicion.HasValue) entity.FechaInicioTransicion = DateTime.SpecifyKind(request.FechaInicioTransicion.Value, DateTimeKind.Utc);
            if (request.FechaFinTransicion.HasValue) entity.FechaFinTransicion = DateTime.SpecifyKind(request.FechaFinTransicion.Value, DateTimeKind.Utc);
            if (request.PorcentajeAvance.HasValue) entity.PorcentajeAvance = request.PorcentajeAvance;
            if (request.SistemasMigrados.HasValue) entity.SistemasMigrados = request.SistemasMigrados;
            if (request.SistemasTotal.HasValue) entity.SistemasTotal = request.SistemasTotal;
            if (!string.IsNullOrEmpty(request.ArchivoPlan)) entity.ArchivoPlan = request.ArchivoPlan;
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

                _logger.LogInformation("Historial registrado para Com17, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            var response = new Com17PlanTransicionIPv6Response
            {
                Comptipv6EntId = entity.Comptipv6EntId,
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
                FechaInicioTransicion = entity.FechaInicioTransicion,
                FechaFinTransicion = entity.FechaFinTransicion,
                PorcentajeAvance = entity.PorcentajeAvance,
                SistemasMigrados = entity.SistemasMigrados,
                SistemasTotal = entity.SistemasTotal,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
            };

            return Result<Com17PlanTransicionIPv6Response>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com17PlanTransicionIPv6");
            return Result<Com17PlanTransicionIPv6Response>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
