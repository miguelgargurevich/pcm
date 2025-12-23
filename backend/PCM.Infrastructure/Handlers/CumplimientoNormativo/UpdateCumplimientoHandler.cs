using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CumplimientoNormativo;

public class UpdateCumplimientoHandler : IRequestHandler<UpdateCumplimientoCommand, Result<CumplimientoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCumplimientoHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCumplimientoHandler(
        PCMDbContext context, 
        ILogger<UpdateCumplimientoHandler> logger,
        ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<CumplimientoResponseDto>> Handle(UpdateCumplimientoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("🔍 UpdateCumplimiento - Request recibido para CumplimientoId: {CumplimientoId}", request.CumplimientoId);
            
            var cumplimiento = await _context.CumplimientosNormativos
                .Include(c => c.Compromiso)
                .Include(c => c.Entidad)
                .FirstOrDefaultAsync(c => c.CumplimientoId == request.CumplimientoId, cancellationToken);

            if (cumplimiento == null)
            {
                return Result<CumplimientoResponseDto>.Failure("Cumplimiento normativo no encontrado");
            }

            // Guardar estado anterior para el historial
            var estadoAnterior = cumplimiento.EstadoId;
            var estadoAnteriorNombre = GetEstadoNombre(estadoAnterior);

            // Actualizar estado si viene un valor válido (1, 2 o 3)
            if (request.EstadoId > 0 && request.EstadoId <= 3)
            {
                cumplimiento.EstadoId = request.EstadoId;
            }
            
            // Actualizar operador si viene
            if (request.OperadorId.HasValue)
            {
                cumplimiento.OperadorId = request.OperadorId.Value;
            }
            
            // Actualizar fecha asignación si viene
            if (request.FechaAsignacion.HasValue)
            {
                cumplimiento.FechaAsignacion = DateTime.SpecifyKind(request.FechaAsignacion.Value, DateTimeKind.Utc);
            }
            
            // Actualizar observación si viene
            if (!string.IsNullOrEmpty(request.ObservacionPcm))
            {
                cumplimiento.ObservacionPcm = request.ObservacionPcm;
            }
            
            cumplimiento.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            // Registrar en historial si cambió el estado
            if (estadoAnterior != cumplimiento.EstadoId)
            {
                var estadoNuevoNombre = GetEstadoNombre(cumplimiento.EstadoId);
                var usuarioId = request.UserId ?? Guid.Empty;
                
                _logger.LogInformation("📝 Registrando cambio de estado en historial - CompromisoId: {CompromisoId}, EntidadId: {EntidadId}, EstadoAnterior: {EstadoAnterior}, EstadoNuevo: {EstadoNuevo}, UsuarioId: {UsuarioId}",
                    cumplimiento.CompromisoId, cumplimiento.EntidadId, estadoAnteriorNombre, estadoNuevoNombre, usuarioId);

                await _historialService.RegistrarCambioDesdeFormularioAsync(
                    compromisoId: cumplimiento.CompromisoId,
                    entidadId: cumplimiento.EntidadId,
                    estadoAnterior: estadoAnteriorNombre,
                    estadoNuevo: estadoNuevoNombre,
                    usuarioId: usuarioId,
                    observacion: request.ObservacionPcm,
                    tipoAccion: "CAMBIO_ESTADO_PCM");
            }

            // Recargar con datos relacionados
            var updated = await _context.CumplimientosNormativos
                .Include(c => c.Compromiso)
                .Include(c => c.Entidad)
                .FirstOrDefaultAsync(c => c.CumplimientoId == cumplimiento.CumplimientoId, cancellationToken);

            var response = MapToResponseDto(updated!);

            _logger.LogInformation("Cumplimiento normativo actualizado: {CumplimientoId}", cumplimiento.CumplimientoId);
            return Result<CumplimientoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar cumplimiento normativo {CumplimientoId}", request.CumplimientoId);
            return Result<CumplimientoResponseDto>.Failure($"Error al actualizar cumplimiento: {ex.Message}");
        }
    }

    private CumplimientoResponseDto MapToResponseDto(Domain.Entities.CumplimientoNormativo cumplimiento)
    {
        return new CumplimientoResponseDto
        {
            CumplimientoId = cumplimiento.CumplimientoId,
            CompromisoId = cumplimiento.CompromisoId,
            EntidadId = cumplimiento.EntidadId,
            EstadoId = cumplimiento.EstadoId,
            OperadorId = cumplimiento.OperadorId,
            FechaAsignacion = cumplimiento.FechaAsignacion,
            ObservacionPcm = cumplimiento.ObservacionPcm,
            NombreCompromiso = cumplimiento.Compromiso?.NombreCompromiso,
            NombreEntidad = cumplimiento.Entidad?.Nombre,
            EstadoNombre = GetEstadoNombre(cumplimiento.EstadoId),
            CreatedAt = cumplimiento.CreatedAt,
            UpdatedAt = cumplimiento.UpdatedAt
        };
    }

    private string GetEstadoNombre(int estadoId)
    {
        return estadoId switch
        {
            1 => "Pendiente",
            2 => "En Proceso",
            3 => "Completado",
            _ => "Desconocido"
        };
    }
}
