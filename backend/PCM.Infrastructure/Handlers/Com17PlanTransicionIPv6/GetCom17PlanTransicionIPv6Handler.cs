using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com17PlanTransicionIPv6.Queries.GetCom17PlanTransicionIPv6;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com17PlanTransicionIPv6;

public class GetCom17PlanTransicionIPv6Handler : IRequestHandler<GetCom17PlanTransicionIPv6Query, Result<Com17PlanTransicionIPv6Response>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom17PlanTransicionIPv6Handler> _logger;

    public GetCom17PlanTransicionIPv6Handler(PCMDbContext context, ILogger<GetCom17PlanTransicionIPv6Handler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com17PlanTransicionIPv6Response>> Handle(GetCom17PlanTransicionIPv6Query request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com17PlanTransicionIPv6 para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com17PlanTransicionIPv6
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com17PlanTransicionIPv6Response>.Failure("Registro no encontrado");
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
            _logger.LogError(ex, "Error al obtener Com17PlanTransicionIPv6");
            return Result<Com17PlanTransicionIPv6Response>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
