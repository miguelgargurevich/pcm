using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com5EstrategiaDigital.Commands;
using PCM.Infrastructure.Data;
using PCM.Application.Common;

namespace PCM.Infrastructure.Handlers.Com5EstrategiaDigital;

public class UpdateCom5EstrategiaDigitalHandler
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom5EstrategiaDigitalHandler> _logger;

    public UpdateCom5EstrategiaDigitalHandler(
        PCMDbContext context,
        ILogger<UpdateCom5EstrategiaDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com5EstrategiaDigitalResponse>> Handle(UpdateCom5EstrategiaDigitalCommand command)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com5 con ID {ComdedEntId}", command.ComdedEntId);

            var entity = await _context.Com5EstrategiaDigital
                .FirstOrDefaultAsync(x => x.ComdedEntId == command.ComdedEntId);

            if (entity == null)
            {
                _logger.LogWarning("Registro Com5 con ID {ComdedEntId} no encontrado", command.ComdedEntId);
                return Result<Com5EstrategiaDigitalResponse>.Failure("Registro no encontrado");
            }

            // Actualizar campos
            entity.CompromisoId = command.CompromisoId;
            entity.EntidadId = command.EntidadId;
            entity.EtapaFormulario = command.EtapaFormulario;
            entity.Estado = command.Estado;
            entity.NombreEstrategia = command.NombreEstrategia;
            entity.PeriodoInicioEstrategia = command.PeriodoInicioEstrategia;
            entity.PeriodoFinEstrategia = command.PeriodoFinEstrategia;
            entity.FechaAprobacionEstrategia = command.FechaAprobacionEstrategia.HasValue 
                ? DateTime.SpecifyKind(command.FechaAprobacionEstrategia.Value, DateTimeKind.Utc)
                : null;
            entity.ObjetivosEstrategicos = command.ObjetivosEstrategicos;
            entity.LineasAccion = command.LineasAccion;
            entity.AlineadoPgdEstrategia = command.AlineadoPgdEstrategia;
            entity.EstadoImplementacionEstrategia = command.EstadoImplementacionEstrategia;
            entity.RutaPdfEstrategia = command.RutaPdfEstrategia;
            entity.CheckPrivacidad = command.CheckPrivacidad;
            entity.CheckDdjj = command.CheckDdjj;
            entity.UsuarioRegistra = command.UsuarioRegistra;

            // Si está en paso3 y ambos checks están true, cambiar estado a publicado
            if (command.EtapaFormulario == "paso3" && command.CheckPrivacidad && command.CheckDdjj)
            {
                entity.Estado = "publicado";
                _logger.LogInformation("Registro Com5 {ComdedEntId} marcado como publicado", entity.ComdedEntId);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Registro Com5 actualizado exitosamente");

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
                ObservacionesPCM = entity.ObservacionesPCM
            };

            return Result<Com5EstrategiaDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar registro Com5");
            return Result<Com5EstrategiaDigitalResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
