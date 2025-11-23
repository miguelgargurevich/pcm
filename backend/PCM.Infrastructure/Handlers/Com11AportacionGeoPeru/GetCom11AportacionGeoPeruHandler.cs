using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com11AportacionGeoPeru.Queries.GetCom11AportacionGeoPeru;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com11AportacionGeoPeru;

public class GetCom11AportacionGeoPeruHandler : IRequestHandler<GetCom11AportacionGeoPeruQuery, Result<Com11AportacionGeoPeruResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom11AportacionGeoPeruHandler> _logger;

    public GetCom11AportacionGeoPeruHandler(PCMDbContext context, ILogger<GetCom11AportacionGeoPeruHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com11AportacionGeoPeruResponse>> Handle(GetCom11AportacionGeoPeruQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com11AportacionGeoPeru para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com11AportacionGeoPeru
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com11AportacionGeoPeruResponse>.Failure("Registro no encontrado");
            }

            var response = new Com11AportacionGeoPeruResponse
            {
                ComageopEntId = entity.ComageopEntId,
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
                FechaInicio = entity.FechaInicio,
                FechaFin = entity.FechaFin,
                ServiciosDigitalizados = entity.ServiciosDigitalizados,
                ServiciosTotal = entity.ServiciosTotal,
                PorcentajeDigitalizacion = entity.PorcentajeDigitalizacion,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
                BeneficiariosEstimados = entity.BeneficiariosEstimados,
            };

            return Result<Com11AportacionGeoPeruResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com11AportacionGeoPeru");
            return Result<Com11AportacionGeoPeruResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
