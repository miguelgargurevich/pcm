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
            _logger.LogInformation("Actualizando registro Com5 con ID {ComedEntId}", command.ComedEntId);

            var entity = await _context.Com5EstrategiaDigital
                .FirstOrDefaultAsync(x => x.ComedEntId == command.ComedEntId);

            if (entity == null)
            {
                _logger.LogWarning("Registro Com5 con ID {ComedEntId} no encontrado", command.ComedEntId);
                return Result<Com5EstrategiaDigitalResponse>.Failure("Registro no encontrado");
            }

            // Convertir string etapa a int
            int etapaInt = command.EtapaFormulario.ToLower() switch
            {
                "paso1" => 1,
                "paso2" => 2,
                "paso3" => 3,
                _ => 1
            };

            // Actualizar campos
            entity.CompromisoId = command.CompromisoId;
            entity.EntidadId = command.EntidadId;
            entity.NombreEstrategia = command.NombreEstrategia;
            entity.AnioInicio = command.AnioInicio;
            entity.AnioFin = command.AnioFin;
            entity.FechaAprobacion = command.FechaAprobacion;
            entity.ObjetivosEstrategicos = command.ObjetivosEstrategicos;
            entity.LineasAccion = command.LineasAccion;
            entity.AlineadoPgd = command.AlineadoPgd;
            entity.EstadoImplementacion = command.EstadoImplementacion;
            entity.UrlDoc = command.UrlDoc;
            entity.CriteriosEvaluados = command.CriteriosEvaluados;
            entity.CheckPrivacidad = command.CheckPrivacidad;
            entity.CheckDdjj = command.CheckDdjj;
            entity.UsuarioRegistra = command.UsuarioRegistra;
            entity.EtapaFormulario = etapaInt;
            entity.UpdatedAt = DateTime.UtcNow;

            // Si está en paso3 y ambos checks están true, cambiar estado a publicado
            if (etapaInt == 3 && command.CheckPrivacidad && command.CheckDdjj)
            {
                entity.Estado = "publicado";
                _logger.LogInformation("Registro Com5 {ComedEntId} marcado como publicado", entity.ComedEntId);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Registro Com5 actualizado exitosamente");

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
            _logger.LogError(ex, "Error al actualizar registro Com5");
            return Result<Com5EstrategiaDigitalResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
