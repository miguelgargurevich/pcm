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

            var now = DateTime.UtcNow;
            var entity = new Com4Entity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                CreatedAt = now,
                FecRegistro = now,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                Activo = true,
                AnioInicioPei = request.AnioInicioPei,
                AnioFinPei = request.AnioFinPei,
                ObjetivoPei = request.ObjetivoPei,
                DescripcionPei = request.DescripcionPei,
                AlineadoPgd = request.AlineadoPgd,
                FechaAprobacionPei = request.FechaAprobacionPei,
                RutaPdfPei = request.RutaPdfPei,
                CriteriosEvaluados = request.CriteriosEvaluados
            };

            _context.Com4PEI.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Registro Com4PEI creado exitosamente con ID {ComtdpeiEntId}", entity.ComtdpeiEntId);

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
                CriteriosEvaluados = entity.CriteriosEvaluados,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            return Result<Com4PEIResponse>.Success(response, "Compromiso 4 creado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear registro Com4PEI para Compromiso {CompromisoId}", request.CompromisoId);
            return Result<Com4PEIResponse>.Failure($"Error al crear el compromiso: {ex.Message}");
        }
    }
}
