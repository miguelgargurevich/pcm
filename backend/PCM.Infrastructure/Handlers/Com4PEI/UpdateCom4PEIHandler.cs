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
            _logger.LogInformation("Actualizando registro Com4PEI con ID {ComtdpeiEntId}", request.ComtdpeiEntId);

            var entity = await _context.Com4PEI
                .FirstOrDefaultAsync(x => x.ComtdpeiEntId == request.ComtdpeiEntId, cancellationToken);

            if (entity == null)
            {
                _logger.LogWarning("No se encontró registro Com4PEI con ID {ComtdpeiEntId}", request.ComtdpeiEntId);
                return Result<Com4PEIResponse>.Failure("Registro no encontrado");
            }

            // Actualizar campos - solo si el valor no está vacío o si explícitamente se envía
            if (!string.IsNullOrEmpty(request.EtapaFormulario))
                entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado))
                entity.Estado = request.Estado;
            
            // Solo actualizar campos del Paso 1 si se envían valores (no nulos)
            if (request.AnioInicioPei.HasValue)
                entity.AnioInicioPei = request.AnioInicioPei;
            if (request.AnioFinPei.HasValue)
                entity.AnioFinPei = request.AnioFinPei;
            if (request.FechaAprobacionPei.HasValue)
                entity.FechaAprobacionPei = DateTime.SpecifyKind(request.FechaAprobacionPei.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.ObjetivoPei))
                entity.ObjetivoPei = request.ObjetivoPei;
            if (!string.IsNullOrEmpty(request.DescripcionPei))
                entity.DescripcionPei = request.DescripcionPei;
            // AlineadoPgd es bool, siempre actualizar
            if (request.AlineadoPgd != entity.AlineadoPgd)
                entity.AlineadoPgd = request.AlineadoPgd;
            if (!string.IsNullOrEmpty(request.RutaPdfPei))
                entity.RutaPdfPei = request.RutaPdfPei;
            if (!string.IsNullOrEmpty(request.RutaPdfNormativa))
                entity.RutaPdfNormativa = request.RutaPdfNormativa;
            // Checkboxes de Paso 3 - actualizar si se envían
            entity.CheckPrivacidad = request.CheckPrivacidad;
            entity.CheckDdjj = request.CheckDdjj;

            // Si está en paso 3 y tiene ambos checks, marcar como publicado
            if (request.EtapaFormulario == "paso3" && request.CheckPrivacidad && request.CheckDdjj)
            {
                entity.Estado = "publicado";
            }

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Registro Com4PEI actualizado exitosamente con ID {ComtdpeiEntId}", entity.ComtdpeiEntId);

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
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            return Result<Com4PEIResponse>.Success(response, "Compromiso 4 actualizado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar registro Com4PEI con ID {ComtdpeiEntId}", request.ComtdpeiEntId);
            return Result<Com4PEIResponse>.Failure($"Error al actualizar el compromiso: {ex.Message}");
        }
    }
}
