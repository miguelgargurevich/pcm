using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com5EstrategiaDigital.Commands;
using PCM.Infrastructure.Data;
using PCM.Application.Common;

namespace PCM.Infrastructure.Handlers.Com5EstrategiaDigital;

public class CreateCom5EstrategiaDigitalHandler
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom5EstrategiaDigitalHandler> _logger;

    public CreateCom5EstrategiaDigitalHandler(
        PCMDbContext context,
        ILogger<CreateCom5EstrategiaDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com5EstrategiaDigitalResponse>> Handle(CreateCom5EstrategiaDigitalCommand command)
    {
        try
        {
            _logger.LogInformation("Creando registro Com5 Estrategia Digital para entidad {EntidadId}", command.EntidadId);

            // Convertir string etapa a int
            int etapaInt = command.EtapaFormulario.ToLower() switch
            {
                "paso1" => 1,
                "paso2" => 2,
                "paso3" => 3,
                _ => 1
            };

            var entity = new Domain.Entities.Com5EstrategiaDigital
            {
                CompromisoId = command.CompromisoId,
                EntidadId = command.EntidadId,
                NombreEstrategia = command.NombreEstrategia,
                AnioInicio = command.AnioInicio,
                AnioFin = command.AnioFin,
                FechaAprobacion = command.FechaAprobacion,
                ObjetivosEstrategicos = command.ObjetivosEstrategicos,
                LineasAccion = command.LineasAccion,
                AlineadoPgd = command.AlineadoPgd,
                EstadoImplementacion = command.EstadoImplementacion,
                UrlDoc = command.UrlDoc,
                CriteriosEvaluados = command.CriteriosEvaluados,
                CheckPrivacidad = command.CheckPrivacidad,
                CheckDdjj = command.CheckDdjj,
                UsuarioRegistra = command.UsuarioRegistra,
                Estado = "bandeja",
                EtapaFormulario = etapaInt,
                CreatedAt = DateTime.UtcNow
            };

            _context.Com5EstrategiaDigital.Add(entity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Registro Com5 creado exitosamente con ID {ComedEntId}", entity.ComedEntId);

            // Convertir int etapa a string para respuesta
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

            return Result<Com5EstrategiaDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear registro Com5 Estrategia Digital");
            return Result<Com5EstrategiaDigitalResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
