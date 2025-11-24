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
            var cumplimiento = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.CumplimientoId == request.CumplimientoId, cancellationToken);

            if (cumplimiento == null)
            {
                return Result<CumplimientoResponseDto>.Failure("Cumplimiento normativo no encontrado");
            }

            // Actualizar Paso 1: Datos Generales
            cumplimiento.NroDni = request.NroDni;
            cumplimiento.Nombres = request.Nombres;
            cumplimiento.ApellidoPaterno = request.ApellidoPaterno;
            cumplimiento.ApellidoMaterno = request.ApellidoMaterno;
            cumplimiento.CorreoElectronico = request.CorreoElectronico;
            cumplimiento.Telefono = request.Telefono;
            cumplimiento.Rol = request.Rol;
            cumplimiento.Cargo = request.Cargo;
            cumplimiento.FechaInicio = DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc);
            
            // Actualizar Paso 2: Normativa (solo si vienen datos, no sobrescribir con null)
            if (!string.IsNullOrEmpty(request.DocumentoUrl))
            {
                cumplimiento.DocumentoUrl = request.DocumentoUrl;
                cumplimiento.DocumentoNombre = request.DocumentoNombre;
                cumplimiento.DocumentoTamano = request.DocumentoTamano;
                cumplimiento.DocumentoTipo = request.DocumentoTipo;
                cumplimiento.DocumentoFechaSubida = DateTime.UtcNow;
            }
            
            cumplimiento.ValidacionResolucionAutoridad = request.ValidacionResolucionAutoridad;
            cumplimiento.ValidacionLiderFuncionario = request.ValidacionLiderFuncionario;
            cumplimiento.ValidacionDesignacionArticulo = request.ValidacionDesignacionArticulo;
            cumplimiento.ValidacionFuncionesDefinidas = request.ValidacionFuncionesDefinidas;
            
            // Actualizar criterios evaluados si vienen datos
            {
            }
            
            // Actualizar Paso 3: Confirmación
            cumplimiento.AceptaPoliticaPrivacidad = request.AceptaPoliticaPrivacidad;
            cumplimiento.AceptaDeclaracionJurada = request.AceptaDeclaracionJurada;
            
            // Actualizar etapa del formulario
            if (!string.IsNullOrEmpty(request.EtapaFormulario))
            {
                cumplimiento.EtapaFormulario = request.EtapaFormulario;
            }
            
            cumplimiento.Estado = request.Estado;
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
            NombreCompromiso = cumplimiento.Compromiso?.NombreCompromiso,
            NombreEntidad = cumplimiento.Entidad?.Nombre,
            
            NroDni = cumplimiento.NroDni,
            Nombres = cumplimiento.Nombres,
            ApellidoPaterno = cumplimiento.ApellidoPaterno,
            ApellidoMaterno = cumplimiento.ApellidoMaterno,
            CorreoElectronico = cumplimiento.CorreoElectronico,
            Telefono = cumplimiento.Telefono,
            Rol = cumplimiento.Rol,
            Cargo = cumplimiento.Cargo,
            FechaInicio = cumplimiento.FechaInicio,
            
            DocumentoUrl = cumplimiento.DocumentoUrl,
            DocumentoNombre = cumplimiento.DocumentoNombre,
            DocumentoTamano = cumplimiento.DocumentoTamano,
            DocumentoTipo = cumplimiento.DocumentoTipo,
            DocumentoFechaSubida = cumplimiento.DocumentoFechaSubida,
            ValidacionResolucionAutoridad = cumplimiento.ValidacionResolucionAutoridad,
            ValidacionLiderFuncionario = cumplimiento.ValidacionLiderFuncionario,
            ValidacionDesignacionArticulo = cumplimiento.ValidacionDesignacionArticulo,
            ValidacionFuncionesDefinidas = cumplimiento.ValidacionFuncionesDefinidas,
            
            AceptaPoliticaPrivacidad = cumplimiento.AceptaPoliticaPrivacidad,
            AceptaDeclaracionJurada = cumplimiento.AceptaDeclaracionJurada,
            
            EtapaFormulario = cumplimiento.EtapaFormulario,
            Estado = cumplimiento.Estado,
            EstadoNombre = GetEstadoNombre(cumplimiento.Estado),
            Activo = cumplimiento.Activo,
            CreatedAt = cumplimiento.CreatedAt,
            UpdatedAt = cumplimiento.UpdatedAt
        };
    }

    private string GetEstadoNombre(int estadoId)
    {
        return estadoId switch
        {
            1 => "bandeja",
            2 => "sin_reportar",
            3 => "publicado",
            _ => "desconocido"
        };
    }
}
