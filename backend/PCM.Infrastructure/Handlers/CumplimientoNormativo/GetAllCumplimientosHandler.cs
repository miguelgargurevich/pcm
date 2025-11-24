using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using PCM.Application.Features.CumplimientoNormativo.Queries.GetAllCumplimientos;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CumplimientoNormativo;

public class GetAllCumplimientosHandler : IRequestHandler<GetAllCumplimientosQuery, Result<List<CumplimientoListItemDto>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetAllCumplimientosHandler> _logger;

    public GetAllCumplimientosHandler(PCMDbContext context, ILogger<GetAllCumplimientosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CumplimientoListItemDto>>> Handle(GetAllCumplimientosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Obtener la clasificación de la entidad del usuario (si está autenticado)
            long? userClasificacionId = null;
            if (request.UserId.HasValue)
            {
                var usuario = await _context.Usuarios
                    .Include(u => u.Entidad)
                    .FirstOrDefaultAsync(u => u.UserId == request.UserId.Value, cancellationToken);
                
                if (usuario?.Entidad != null)
                {
                    userClasificacionId = usuario.Entidad.ClasificacionId;
                }
            }

            var query = _context.CumplimientosNormativos
                .Include(c => c.Compromiso)
                    .ThenInclude(comp => comp.AlcancesCompromisos)
                .Include(c => c.Entidad)
                .Where(c => c.Activo);

            // Filtrar por clasificación de la entidad del usuario
            if (userClasificacionId.HasValue)
            {
                query = query.Where(c => c.Compromiso.AlcancesCompromisos.Any(ac => ac.ClasificacionId == userClasificacionId.Value && ac.Activo));
            }

            // Aplicar filtros
            if (request.CompromisoId.HasValue)
            {
                query = query.Where(c => c.CompromisoId == request.CompromisoId.Value);
            }

            if (request.Estado.HasValue)
            {
                query = query.Where(c => c.Estado == request.Estado.Value);
            }

            if (request.EntidadId.HasValue)
            {
                query = query.Where(c => c.EntidadId == request.EntidadId.Value);
            }

            var cumplimientos = await query
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync(cancellationToken);

            // Obtener registros de tablas específicas para compromisos 1, 2, 4, 5
            var entidadId = request.EntidadId ?? cumplimientos.FirstOrDefault()?.EntidadId;
            var comTablas = new Dictionary<long, (DateTime? fecha, int? estado, string? etapa)>();
            
            if (entidadId.HasValue)
            {
                var com1 = await _context.Com1LiderGTD
                    .Where(c => c.EntidadId == entidadId.Value)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com1 != null) comTablas[1] = (com1.CreatedAt, ConvertEstadoToInt(com1.Estado), com1.EtapaFormulario);

                var com2 = await _context.Com2CGTD
                    .Where(c => c.EntidadId == entidadId.Value)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com2 != null) comTablas[2] = (com2.CreatedAt, ConvertEstadoToInt(com2.Estado), com2.EtapaFormulario);

                var com4 = await _context.Com4PEI
                    .Where(c => c.EntidadId == entidadId.Value)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com4 != null) comTablas[4] = (com4.CreatedAt, ConvertEstadoToInt(com4.EstadoPCM), com4.EtapaFormulario);

                var com5 = await _context.Com5EstrategiaDigital
                    .Where(c => c.EntidadId == entidadId.Value)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com5 != null) comTablas[5] = (com5.CreatedAt, ConvertEstadoToInt(com5.EstadoPCM), com5.EtapaFormulario);
            }

            var result = cumplimientos.Select(c => {
                // Usar fecha y estado de tabla específica si existe
                var fechaActualizacion = c.UpdatedAt;
                var estadoFinal = c.Estado;
                
                if (comTablas.ContainsKey(c.CompromisoId))
                {
                    var comData = comTablas[c.CompromisoId];
                    if (comData.fecha.HasValue) fechaActualizacion = comData.fecha;
                    if (comData.estado.HasValue) estadoFinal = comData.estado.Value;
                }

                return new CumplimientoListItemDto
                {
                    CumplimientoId = c.CumplimientoId,
                    CompromisoId = c.CompromisoId,
                    NombreCompromiso = c.Compromiso?.NombreCompromiso ?? "Sin compromiso",
                    NombreEntidad = c.Entidad?.Nombre ?? "Sin entidad",
                    NombreLider = $"{c.Nombres} {c.ApellidoPaterno} {c.ApellidoMaterno}".Trim(),
                    Estado = estadoFinal,
                    EstadoNombre = GetEstadoNombre(estadoFinal),
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = fechaActualizacion,
                    DocumentoUrl = c.DocumentoUrl,
                    TieneDocumento = !string.IsNullOrEmpty(c.DocumentoUrl),
                    ValidacionResolucionAutoridad = c.ValidacionResolucionAutoridad,
                    ValidacionLiderFuncionario = c.ValidacionLiderFuncionario,
                    ValidacionDesignacionArticulo = c.ValidacionDesignacionArticulo,
                    ValidacionFuncionesDefinidas = c.ValidacionFuncionesDefinidas,
                    CriteriosEvaluados = c.CriteriosEvaluados,
                    AceptaPoliticaPrivacidad = c.AceptaPoliticaPrivacidad,
                    AceptaDeclaracionJurada = c.AceptaDeclaracionJurada,
                    EtapaFormulario = c.EtapaFormulario
                };
            }).ToList();

            _logger.LogInformation("Retrieved {Count} cumplimientos normativos", result.Count);
            return Result<List<CumplimientoListItemDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener cumplimientos normativos");
            return Result<List<CumplimientoListItemDto>>.Failure($"Error al obtener cumplimientos: {ex.Message}");
        }
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

    private int ConvertEstadoToInt(string estado)
    {
        return estado switch
        {
            "bandeja" => 1,
            "sin_reportar" => 2,
            "publicado" => 3,
            _ => 1
        };
    }
}
