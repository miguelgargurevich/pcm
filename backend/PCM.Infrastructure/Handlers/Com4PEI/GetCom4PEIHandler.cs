using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com4PEI.Queries.GetCom4PEI;
using PCM.Application.Features.Com4PEI.Commands.CreateCom4PEI;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com4PEI;

public class GetCom4PEIHandler : IRequestHandler<GetCom4PEIQuery, Result<Com4PEIResponse?>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom4PEIHandler> _logger;

    public GetCom4PEIHandler(PCMDbContext context, ILogger<GetCom4PEIHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com4PEIResponse?>> Handle(GetCom4PEIQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Buscando registro Com4PEI para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com4PEI
                .Where(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                _logger.LogInformation("No se encontró registro Com4PEI para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                    request.CompromisoId, request.EntidadId);
                return Result<Com4PEIResponse?>.Success(null, "No se encontró registro");
            }

            var response = new Com4PEIResponse
            {
                ComtdpeiEntId = entity.ComtdpeiEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                AnioInicioPei = entity.AnioInicioPei,
                AnioFinPei = entity.AnioFinPei,
                FechaAprobacionPei = entity.FechaAprobacionPei,
                ObjetivoPei = entity.ObjetivoPei,
                DescripcionPei = entity.DescripcionPei,
                AlineadoPgd = entity.AlineadoPgd,
                RutaPdfPei = entity.RutaPdfPei,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            _logger.LogInformation("Registro Com4PEI encontrado con ID {ComtdpeiEntId}", entity.ComtdpeiEntId);

            return Result<Com4PEIResponse?>.Success(response, "Datos obtenidos exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al buscar registro Com4PEI");
            return Result<Com4PEIResponse?>.Failure($"Error al obtener los datos: {ex.Message}");
        }
    }
}
