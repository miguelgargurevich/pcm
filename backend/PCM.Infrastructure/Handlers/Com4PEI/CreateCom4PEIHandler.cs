using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com4PEI.Commands.CreateCom4PEI;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com4Entity = PCM.Domain.Entities.Com4PEI;

namespace PCM.Infrastructure.Handlers.Com4PEI;

public class CreateCom4PEIHandler : IRequestHandler<CreateCom4PEICommand, Result<Com4PEIResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom4PEIHandler> _logger;

    public CreateCom4PEIHandler(PCMDbContext context, ILogger<CreateCom4PEIHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com4PEIResponse>> Handle(CreateCom4PEICommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com4PEI para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com4Entity
            {
                CompromisoId = (int)request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = ConvertirEtapaANumero(request.EtapaFormulario),
                Estado = request.Estado,
                AnioInicio = request.AnioInicio,
                AnioFin = request.AnioFin,
                FechaAprobacion = request.FechaAprobacion,
                ObjetivoEstrategico = request.ObjetivoEstrategico,
                DescripcionIncorporacion = request.DescripcionIncorporacion,
                AlineadoPgd = request.AlineadoPgd,
                UrlDocPei = request.UrlDocPei,
                CriteriosEvaluados = request.CriteriosEvaluados,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.Com4PEI.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Registro Com4PEI creado exitosamente con ID {CompeiEntId}", entity.CompeiEntId);

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

            return Result<Com4PEIResponse>.Success(response, "Compromiso 4 creado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear registro Com4PEI para Compromiso {CompromisoId}", request.CompromisoId);
            return Result<Com4PEIResponse>.Failure($"Error al crear el compromiso: {ex.Message}");
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
