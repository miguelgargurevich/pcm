using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetCumplimientoById;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CumplimientoNormativo;

public class GetCumplimientoByIdHandler : IRequestHandler<GetCumplimientoByIdQuery, Result<CumplimientoResponseDto>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCumplimientoByIdHandler> _logger;

    public GetCumplimientoByIdHandler(PCMDbContext context, ILogger<GetCumplimientoByIdHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CumplimientoResponseDto>> Handle(GetCumplimientoByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var cumplimiento = await _context.CumplimientosNormativos
                .Include(c => c.Compromiso)
                .Include(c => c.Entidad)
                .FirstOrDefaultAsync(c => c.CumplimientoId == request.CumplimientoId, cancellationToken);

            if (cumplimiento == null)
            {
                return Result<CumplimientoResponseDto>.Failure("Cumplimiento normativo no encontrado");
            }

            var response = MapToResponseDto(cumplimiento);

            _logger.LogInformation("Retrieved cumplimiento normativo {CumplimientoId}", cumplimiento.CumplimientoId);
            return Result<CumplimientoResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener cumplimiento normativo {CumplimientoId}", request.CumplimientoId);
            return Result<CumplimientoResponseDto>.Failure($"Error al obtener cumplimiento: {ex.Message}");
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
            CriteriosEvaluados = cumplimiento.CriteriosEvaluados,
            
            AceptaPoliticaPrivacidad = cumplimiento.AceptaPoliticaPrivacidad,
            AceptaDeclaracionJurada = cumplimiento.AceptaDeclaracionJurada,
            
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
