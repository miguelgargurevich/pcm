using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CumplimientoNormativo;

public class UpdateCumplimientoHandler : IRequestHandler<UpdateCumplimientoCommand, Result<CumplimientoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCumplimientoHandler> _logger;

    public UpdateCumplimientoHandler(PCMDbContext context, ILogger<UpdateCumplimientoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CumplimientoResponseDto>> Handle(UpdateCumplimientoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("🔍 UpdateCumplimiento - Request recibido para CumplimientoId: {CumplimientoId}", request.CumplimientoId);
            
            var cumplimiento = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.CumplimientoId == request.CumplimientoId, cancellationToken);

            if (cumplimiento == null)
            {
                return Result<CumplimientoResponseDto>.Failure("Cumplimiento normativo no encontrado");
            }

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
            
            // Actualizar campos adicionales del formulario
            if (!string.IsNullOrEmpty(request.CriteriosEvaluados))
            {
                cumplimiento.CriteriosEvaluados = request.CriteriosEvaluados;
            }
            if (!string.IsNullOrEmpty(request.DocumentoUrl))
            {
                cumplimiento.DocumentoUrl = request.DocumentoUrl;
            }
            cumplimiento.AceptaPoliticaPrivacidad = request.AceptaPoliticaPrivacidad;
            cumplimiento.AceptaDeclaracionJurada = request.AceptaDeclaracionJurada;
            if (!string.IsNullOrEmpty(request.EtapaFormulario))
            {
                cumplimiento.EtapaFormulario = request.EtapaFormulario;
            }
            
            cumplimiento.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

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
            CriteriosEvaluados = cumplimiento.CriteriosEvaluados,
            DocumentoUrl = cumplimiento.DocumentoUrl,
            AceptaPoliticaPrivacidad = cumplimiento.AceptaPoliticaPrivacidad,
            AceptaDeclaracionJurada = cumplimiento.AceptaDeclaracionJurada,
            EtapaFormulario = cumplimiento.EtapaFormulario,
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
