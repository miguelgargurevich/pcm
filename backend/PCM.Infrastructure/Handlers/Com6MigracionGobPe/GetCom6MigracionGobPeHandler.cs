using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com6MigracionGobPe.Queries.GetCom6MigracionGobPe;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com6MigracionGobPe;

public class GetCom6MigracionGobPeHandler : IRequestHandler<GetCom6MigracionGobPeQuery, Result<Com6MigracionGobPeResponse?>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom6MigracionGobPeHandler> _logger;

    public GetCom6MigracionGobPeHandler(PCMDbContext context, ILogger<GetCom6MigracionGobPeHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com6MigracionGobPeResponse?>> Handle(GetCom6MigracionGobPeQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Buscando registro Com6MigracionGobPe para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com6MigracionGobPe
                .Where(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                _logger.LogInformation("No se encontró registro Com6MigracionGobPe para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                    request.CompromisoId, request.EntidadId);
                return Result<Com6MigracionGobPeResponse?>.Success(null, "No se encontró registro");
            }

            var response = new Com6MigracionGobPeResponse
            {
                CommpgobpeEntId = entity.CommpgobpeEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                UrlGobPe = entity.UrlGobPe,
                FechaMigracionGobPe = entity.FechaMigracionGobPe,
                FechaActualizacionGobPe = entity.FechaActualizacionGobPe,
                ResponsableGobPe = entity.ResponsableGobPe,
                CorreoResponsableGobPe = entity.CorreoResponsableGobPe,
                TelefonoResponsableGobPe = entity.TelefonoResponsableGobPe,
                TipoMigracionGobPe = entity.TipoMigracionGobPe,
                ObservacionGobPe = entity.ObservacionGobPe,
                RutaPdfGobPe = entity.RutaPdfGobPe,
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            _logger.LogInformation("Registro Com6MigracionGobPe encontrado con ID {CommpgobpeEntId}", entity.CommpgobpeEntId);

            return Result<Com6MigracionGobPeResponse?>.Success(response, "Datos obtenidos exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al buscar registro Com6MigracionGobPe");
            return Result<Com6MigracionGobPeResponse?>.Failure($"Error al obtener los datos: {ex.Message}");
        }
    }
}
