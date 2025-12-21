using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com5EstrategiaDigital.Commands;
using PCM.Application.Features.Com5EstrategiaDigital.Queries;
using PCM.Infrastructure.Data;
using PCM.Application.Common;

namespace PCM.Infrastructure.Handlers.Com5EstrategiaDigital;

public class GetCom5EstrategiaDigitalHandler
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom5EstrategiaDigitalHandler> _logger;

    public GetCom5EstrategiaDigitalHandler(
        PCMDbContext context,
        ILogger<GetCom5EstrategiaDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com5EstrategiaDigitalResponse?>> Handle(GetCom5EstrategiaDigitalQuery query)
    {
        try
        {
            _logger.LogInformation("Obteniendo registro Com5 para compromiso {CompromisoId} y entidad {EntidadId}", 
                query.CompromisoId, query.EntidadId);

            var entity = await _context.Com5EstrategiaDigital
                .Where(x => x.CompromisoId == query.CompromisoId && x.EntidadId == query.EntidadId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (entity == null)
            {
                _logger.LogInformation("No se encontró registro Com5 para entidad {EntidadId}", query.EntidadId);
                return Result<Com5EstrategiaDigitalResponse?>.Success(null);
            }

            var response = new Com5EstrategiaDigitalResponse
            {
                ComdedEntId = entity.ComdedEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                NombreEstrategia = entity.NombreEstrategia,
                PeriodoInicioEstrategia = entity.PeriodoInicioEstrategia,
                PeriodoFinEstrategia = entity.PeriodoFinEstrategia,
                FechaAprobacionEstrategia = entity.FechaAprobacionEstrategia,
                ObjetivosEstrategicos = entity.ObjetivosEstrategicos,
                LineasAccion = entity.LineasAccion,
                AlineadoPgdEstrategia = entity.AlineadoPgdEstrategia,
                EstadoImplementacionEstrategia = entity.EstadoImplementacionEstrategia,
                RutaPdfEstrategia = entity.RutaPdfEstrategia,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                Estado = entity.Estado,
                EtapaFormulario = entity.EtapaFormulario,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                RutaPdfNormativa = entity.RutaPdfNormativa
            };

            _logger.LogInformation("Registro Com5 encontrado: {ComdedEntId}", entity.ComdedEntId);
            return Result<Com5EstrategiaDigitalResponse?>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener registro Com5");
            return Result<Com5EstrategiaDigitalResponse?>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
