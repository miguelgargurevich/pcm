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

            // Actualizar campos (solo si vienen con valores no-default)
            if (command.CompromisoId > 0) entity.CompromisoId = command.CompromisoId;
            if (command.EntidadId != Guid.Empty) entity.EntidadId = command.EntidadId;
            if (!string.IsNullOrEmpty(command.EtapaFormulario)) entity.EtapaFormulario = command.EtapaFormulario;
            if (!string.IsNullOrEmpty(command.Estado)) entity.Estado = command.Estado;
            if (command.NombreEstrategia != null) entity.NombreEstrategia = command.NombreEstrategia;
            if (command.PeriodoInicioEstrategia.HasValue) entity.PeriodoInicioEstrategia = command.PeriodoInicioEstrategia;
            if (command.PeriodoFinEstrategia.HasValue) entity.PeriodoFinEstrategia = command.PeriodoFinEstrategia;
            if (command.FechaAprobacionEstrategia.HasValue) 
                entity.FechaAprobacionEstrategia = DateTime.SpecifyKind(command.FechaAprobacionEstrategia.Value, DateTimeKind.Utc);
            if (command.ObjetivosEstrategicos != null) entity.ObjetivosEstrategicos = command.ObjetivosEstrategicos;
            if (command.LineasAccion != null) entity.LineasAccion = command.LineasAccion;
            entity.AlineadoPgdEstrategia = command.AlineadoPgdEstrategia;
            if (command.EstadoImplementacionEstrategia != null) entity.EstadoImplementacionEstrategia = command.EstadoImplementacionEstrategia;
            if (command.RutaPdfEstrategia != null) entity.RutaPdfEstrategia = command.RutaPdfEstrategia;
            entity.CheckPrivacidad = command.CheckPrivacidad;
            entity.CheckDdjj = command.CheckDdjj;
            if (command.UsuarioRegistra != Guid.Empty) entity.UsuarioRegistra = command.UsuarioRegistra;

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
