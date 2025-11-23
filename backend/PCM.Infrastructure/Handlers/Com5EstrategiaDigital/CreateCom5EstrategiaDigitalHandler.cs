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

            var now = DateTime.UtcNow;
            var entity = new Domain.Entities.Com5EstrategiaDigital
            {
                CompromisoId = command.CompromisoId,
                EntidadId = command.EntidadId,
                EtapaFormulario = command.EtapaFormulario,
                Estado = command.Estado,
                CheckPrivacidad = command.CheckPrivacidad,
                CheckDdjj = command.CheckDdjj,
                CreatedAt = now,
                FecRegistro = now,
                UsuarioRegistra = command.UsuarioRegistra,
                Activo = true,
                NombreEstrategia = command.NombreEstrategia,
                PeriodoInicioEstrategia = command.PeriodoInicioEstrategia,
                PeriodoFinEstrategia = command.PeriodoFinEstrategia,
                ObjetivosEstrategicos = command.ObjetivosEstrategicos,
                LineasAccion = command.LineasAccion,
                FechaAprobacionEstrategia = command.FechaAprobacionEstrategia,
                AlineadoPgdEstrategia = command.AlineadoPgdEstrategia,
                EstadoImplementacionEstrategia = command.EstadoImplementacionEstrategia,
                RutaPdfEstrategia = command.RutaPdfEstrategia,
                CriteriosEvaluados = command.CriteriosEvaluados
            };

            _context.Com5EstrategiaDigital.Add(entity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Registro Com5 creado exitosamente con ID {ComdedEntId}", entity.ComdedEntId);

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
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                UsuarioRegistra = entity.UsuarioRegistra,
                Estado = entity.Estado,
                EtapaFormulario = entity.EtapaFormulario,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM
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
