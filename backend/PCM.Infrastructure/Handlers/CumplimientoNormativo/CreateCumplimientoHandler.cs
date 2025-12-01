using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Commands.CreateCumplimiento;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CumplimientoNormativo;

public class CreateCumplimientoHandler : IRequestHandler<CreateCumplimientoCommand, Result<CumplimientoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCumplimientoHandler> _logger;

    public CreateCumplimientoHandler(PCMDbContext context, ILogger<CreateCumplimientoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CumplimientoResponseDto>> Handle(CreateCumplimientoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando cumplimiento - CompromisoId: {CompromisoId}, EntidadId: {EntidadId}", 
                request.CompromisoId, request.EntidadId);
            
            // Verificar que la entidad exista
            var entidadExiste = await _context.Entidades.AnyAsync(e => e.EntidadId == request.EntidadId, cancellationToken);
            if (!entidadExiste)
            {
                _logger.LogWarning("La entidad {EntidadId} no existe en la base de datos", request.EntidadId);
                return Result<CumplimientoResponseDto>.Failure($"La entidad con ID {request.EntidadId} no existe en la base de datos. Por favor, verifique que ha iniciado sesión correctamente.");
            }
            
            // Verificar que no exista ya un cumplimiento para esta entidad y compromiso
            var existente = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.EntidadId == request.EntidadId && c.CompromisoId == request.CompromisoId, cancellationToken);

            if (existente != null)
            {
                return Result<CumplimientoResponseDto>.Failure("Ya existe un cumplimiento para esta entidad y compromiso");
            }

            var cumplimiento = new Domain.Entities.CumplimientoNormativo
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EstadoId = request.EstadoId,
                OperadorId = request.OperadorId,
                FechaAsignacion = request.FechaAsignacion,
                ObservacionPcm = request.ObservacionPcm,
                CriteriosEvaluados = request.CriteriosEvaluados,
                DocumentoUrl = request.DocumentoUrl,
                AceptaPoliticaPrivacidad = request.AceptaPoliticaPrivacidad,
                AceptaDeclaracionJurada = request.AceptaDeclaracionJurada,
                EtapaFormulario = request.EtapaFormulario,
                CreatedAt = DateTime.UtcNow
            };

            _context.CumplimientosNormativos.Add(cumplimiento);
            await _context.SaveChangesAsync(cancellationToken);

            // Recargar con datos relacionados
            var created = await _context.CumplimientosNormativos
                .Include(c => c.Compromiso)
                .Include(c => c.Entidad)
                .FirstOrDefaultAsync(c => c.CumplimientoId == cumplimiento.CumplimientoId, cancellationToken);

            var response = MapToResponseDto(created!);

            _logger.LogInformation("Cumplimiento normativo creado: {CumplimientoId}", cumplimiento.CumplimientoId);
            return Result<CumplimientoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear cumplimiento normativo");
            return Result<CumplimientoResponseDto>.Failure($"Error al crear cumplimiento: {ex.Message}");
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
