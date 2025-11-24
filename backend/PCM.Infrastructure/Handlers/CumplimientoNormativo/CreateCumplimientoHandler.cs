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
                
                // Paso 1: Datos Generales
                NroDni = request.NroDni,
                Nombres = request.Nombres,
                ApellidoPaterno = request.ApellidoPaterno,
                ApellidoMaterno = request.ApellidoMaterno,
                CorreoElectronico = request.CorreoElectronico,
                Telefono = request.Telefono,
                Rol = request.Rol,
                Cargo = request.Cargo,
                FechaInicio = DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc),
                
                // Paso 2: Normativa
                DocumentoUrl = request.DocumentoUrl,
                DocumentoNombre = request.DocumentoNombre,
                DocumentoTamano = request.DocumentoTamano,
                DocumentoTipo = request.DocumentoTipo,
                DocumentoFechaSubida = !string.IsNullOrEmpty(request.DocumentoUrl) ? DateTime.UtcNow : null,
                ValidacionResolucionAutoridad = request.ValidacionResolucionAutoridad,
                ValidacionLiderFuncionario = request.ValidacionLiderFuncionario,
                ValidacionDesignacionArticulo = request.ValidacionDesignacionArticulo,
                ValidacionFuncionesDefinidas = request.ValidacionFuncionesDefinidas,
                
                // Paso 3: Confirmación
                AceptaPoliticaPrivacidad = request.AceptaPoliticaPrivacidad,
                AceptaDeclaracionJurada = request.AceptaDeclaracionJurada,
                
                EtapaFormulario = request.EtapaFormulario ?? "paso1",
                Estado = request.Estado,
                Activo = true,
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
            NombreCompromiso = cumplimiento.Compromiso?.NombreCompromiso,
            NombreEntidad = cumplimiento.Entidad?.Nombre,
            
            // Paso 1
            NroDni = cumplimiento.NroDni,
            Nombres = cumplimiento.Nombres,
            ApellidoPaterno = cumplimiento.ApellidoPaterno,
            ApellidoMaterno = cumplimiento.ApellidoMaterno,
            CorreoElectronico = cumplimiento.CorreoElectronico,
            Telefono = cumplimiento.Telefono,
            Rol = cumplimiento.Rol,
            Cargo = cumplimiento.Cargo,
            FechaInicio = cumplimiento.FechaInicio,
            
            // Paso 2
            DocumentoUrl = cumplimiento.DocumentoUrl,
            DocumentoNombre = cumplimiento.DocumentoNombre,
            DocumentoTamano = cumplimiento.DocumentoTamano,
            DocumentoTipo = cumplimiento.DocumentoTipo,
            DocumentoFechaSubida = cumplimiento.DocumentoFechaSubida,
            ValidacionResolucionAutoridad = cumplimiento.ValidacionResolucionAutoridad,
            ValidacionLiderFuncionario = cumplimiento.ValidacionLiderFuncionario,
            ValidacionDesignacionArticulo = cumplimiento.ValidacionDesignacionArticulo,
            ValidacionFuncionesDefinidas = cumplimiento.ValidacionFuncionesDefinidas,
            
            // Paso 3
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
