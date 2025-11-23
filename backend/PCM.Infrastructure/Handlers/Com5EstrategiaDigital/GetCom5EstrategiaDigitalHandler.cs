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

            // Convertir int etapa a string
            string etapaString = entity.EtapaFormulario switch
            {
                1 => "paso1",
                2 => "paso2",
                3 => "paso3",
                _ => "paso1"
            };

            var response = new Com5EstrategiaDigitalResponse
            {
                ComedEntId = entity.ComedEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                NombreEstrategia = entity.NombreEstrategia,
                AnioInicio = entity.AnioInicio,
                AnioFin = entity.AnioFin,
                FechaAprobacion = entity.FechaAprobacion,
                ObjetivosEstrategicos = entity.ObjetivosEstrategicos,
                LineasAccion = entity.LineasAccion,
                AlineadoPgd = entity.AlineadoPgd,
                EstadoImplementacion = entity.EstadoImplementacion,
                UrlDoc = entity.UrlDoc,
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                Estado = entity.Estado,
                EtapaFormulario = etapaString,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };

            _logger.LogInformation("Registro Com5 encontrado: {ComedEntId}", entity.ComedEntId);
            return Result<Com5EstrategiaDigitalResponse?>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener registro Com5");
            return Result<Com5EstrategiaDigitalResponse?>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
