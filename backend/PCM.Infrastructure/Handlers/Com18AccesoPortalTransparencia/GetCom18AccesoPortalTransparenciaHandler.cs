using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com18AccesoPortalTransparencia.Queries.GetCom18AccesoPortalTransparencia;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com18AccesoPortalTransparencia;

public class GetCom18AccesoPortalTransparenciaHandler : IRequestHandler<GetCom18AccesoPortalTransparenciaQuery, Result<Com18AccesoPortalTransparenciaResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom18AccesoPortalTransparenciaHandler> _logger;

    public GetCom18AccesoPortalTransparenciaHandler(PCMDbContext context, ILogger<GetCom18AccesoPortalTransparenciaHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com18AccesoPortalTransparenciaResponse>> Handle(GetCom18AccesoPortalTransparenciaQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com18AccesoPortalTransparencia para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com18AccesoPortalTransparencia
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com18AccesoPortalTransparenciaResponse>.Failure("Registro no encontrado");
            }

            var response = new Com18AccesoPortalTransparenciaResponse
            {
                ComsapteEntId = entity.ComsapteEntId,
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
                // Campos específicos PTE
                ResponsablePte = entity.ResponsablePte,
                CargoResponsablePte = entity.CargoResponsablePte,
                CorreoPte = entity.CorreoPte,
                TelefonoPte = entity.TelefonoPte,
                FechaSolicitudPte = entity.FechaSolicitudPte,
                FechaAccesoPte = entity.FechaAccesoPte,
                NumeroOficioPte = entity.NumeroOficioPte,
                EstadoAccesoPte = entity.EstadoAccesoPte,
                EnlacePortalPte = entity.EnlacePortalPte,
                DescripcionPte = entity.DescripcionPte,
                RutaPdfPte = entity.RutaPdfPte,
                ObservacionPte = entity.ObservacionPte,
                RutaPdfNormativa = entity.RutaPdfNormativa,
                CriteriosEvaluados = entity.CriteriosEvaluados,
            };

            return Result<Com18AccesoPortalTransparenciaResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com18AccesoPortalTransparencia");
            return Result<Com18AccesoPortalTransparenciaResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
