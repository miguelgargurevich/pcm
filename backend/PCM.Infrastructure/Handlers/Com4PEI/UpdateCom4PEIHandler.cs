using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com4PEI.Commands.UpdateCom4PEI;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com4PEI;

public class UpdateCom4PEIHandler : IRequestHandler<UpdateCom4PEICommand, Result<Com4PEIResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom4PEIHandler> _logger;

    public UpdateCom4PEIHandler(PCMDbContext context, ILogger<UpdateCom4PEIHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com4PEIResponse>> Handle(UpdateCom4PEICommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com4PEI con ID {CompeiEntId}", request.CompeiEntId);

            var entity = await _context.Com4PEI
                .FirstOrDefaultAsync(x => x.CompeiEntId == (int)request.CompeiEntId, cancellationToken);

            if (entity == null)
            {
                _logger.LogWarning("No se encontró registro Com4PEI con ID {CompeiEntId}", request.CompeiEntId);
                return Result<Com4PEIResponse>.Failure("Registro no encontrado");
            }

            // Actualizar campos
            entity.EtapaFormulario = ConvertirEtapaANumero(request.EtapaFormulario);
            entity.Estado = request.Estado;
            entity.AnioInicio = request.AnioInicio;
            entity.AnioFin = request.AnioFin;
            entity.FechaAprobacion = request.FechaAprobacion;
            entity.ObjetivoEstrategico = request.ObjetivoEstrategico;
            entity.DescripcionIncorporacion = request.DescripcionIncorporacion;
            entity.AlineadoPgd = request.AlineadoPgd;
            entity.UrlDocPei = request.UrlDocPei;
            entity.CriteriosEvaluados = request.CriteriosEvaluados;
            entity.CheckPrivacidad = request.CheckPrivacidad;
            entity.CheckDdjj = request.CheckDdjj;
            entity.UpdatedAt = DateTime.UtcNow;

            // Si está en paso 3 y tiene ambos checks, marcar como completado
            if (request.EtapaFormulario == "paso3" && request.CheckPrivacidad && request.CheckDdjj)
            {
                entity.Estado = "publicado";
            }

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Registro Com4PEI actualizado exitosamente con ID {CompeiEntId}", entity.CompeiEntId);

            var response = new Com4PEIResponse
            {
                CompeiEntId = entity.CompeiEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = entity.Estado ?? "bandeja",
                AnioInicio = entity.AnioInicio,
                AnioFin = entity.AnioFin,
                FechaAprobacion = entity.FechaAprobacion,
                ObjetivoEstrategico = entity.ObjetivoEstrategico,
                DescripcionIncorporacion = entity.DescripcionIncorporacion,
                AlineadoPgd = entity.AlineadoPgd,
                UrlDocPei = entity.UrlDocPei,
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj
            };

            return Result<Com4PEIResponse>.Success(response, "Compromiso 4 actualizado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar registro Com4PEI con ID {CompeiEntId}", request.CompeiEntId);
            return Result<Com4PEIResponse>.Failure($"Error al actualizar el compromiso: {ex.Message}");
        }
    }

    private int ConvertirEtapaANumero(string etapa)
    {
        return etapa.ToLower() switch
        {
            "paso1" => 1,
            "paso2" => 2,
            "paso3" => 3,
            "completado" => 3,
            _ => 1
        };
    }
}
