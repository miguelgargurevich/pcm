using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com6MigracionGobPe.Commands.UpdateCom6MigracionGobPe;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com6MigracionGobPe;

public class UpdateCom6MigracionGobPeHandler : IRequestHandler<UpdateCom6MigracionGobPeCommand, Result<Com6MigracionGobPeResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom6MigracionGobPeHandler> _logger;

    public UpdateCom6MigracionGobPeHandler(PCMDbContext context, ILogger<UpdateCom6MigracionGobPeHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com6MigracionGobPeResponse>> Handle(UpdateCom6MigracionGobPeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com6MigracionGobPe con ID {CommpgobpeEntId}", request.CommpgobpeEntId);

            var entity = await _context.Com6MigracionGobPe
                .FirstOrDefaultAsync(x => x.CommpgobpeEntId == request.CommpgobpeEntId, cancellationToken);

            if (entity == null)
            {
                _logger.LogWarning("No se encontró registro Com6MigracionGobPe con ID {CommpgobpeEntId}", request.CommpgobpeEntId);
                return Result<Com6MigracionGobPeResponse>.Failure("Registro no encontrado");
            }

            // Actualizar campos
            if (request.EtapaFormulario != null) entity.EtapaFormulario = request.EtapaFormulario;
            if (request.Estado != null) entity.Estado = request.Estado;
            if (request.UrlGobPe != null) entity.UrlGobPe = request.UrlGobPe;
            if (request.FechaMigracionGobPe.HasValue) 
                entity.FechaMigracionGobPe = DateTime.SpecifyKind(request.FechaMigracionGobPe.Value, DateTimeKind.Utc);
            if (request.FechaActualizacionGobPe.HasValue) 
                entity.FechaActualizacionGobPe = DateTime.SpecifyKind(request.FechaActualizacionGobPe.Value, DateTimeKind.Utc);
            if (request.ResponsableGobPe != null) entity.ResponsableGobPe = request.ResponsableGobPe;
            if (request.CorreoResponsableGobPe != null) entity.CorreoResponsableGobPe = request.CorreoResponsableGobPe;
            if (request.TelefonoResponsableGobPe != null) entity.TelefonoResponsableGobPe = request.TelefonoResponsableGobPe;
            if (request.TipoMigracionGobPe != null) entity.TipoMigracionGobPe = request.TipoMigracionGobPe;
            if (request.ObservacionGobPe != null) entity.ObservacionGobPe = request.ObservacionGobPe;
            if (request.RutaPdfGobPe != null) entity.RutaPdfGobPe = request.RutaPdfGobPe;
            if (request.RutaPdfNormativa != null) entity.RutaPdfNormativa = request.RutaPdfNormativa;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;

            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com6MigracionGobPeResponse
            {
                CommpgobpeEntId = entity.CommpgobpeEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                UrlGobPe = entity.UrlGobPe,
                FechaMigracionGobPe = entity.FechaMigracionGobPe,
                FechaActualizacionGobPe = entity.FechaActualizacionGobPe,
                ResponsableGobPe = entity.ResponsableGobPe,
                CorreoResponsableGobPe = entity.CorreoResponsableGobPe,
                TelefonoResponsableGobPe = entity.TelefonoResponsableGobPe,
                TipoMigracionGobPe = entity.TipoMigracionGobPe,
                ObservacionGobPe = entity.ObservacionGobPe,
                RutaPdfGobPe = entity.RutaPdfGobPe,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            _logger.LogInformation("Registro Com6MigracionGobPe actualizado exitosamente con ID {CommpgobpeEntId}", entity.CommpgobpeEntId);

            return Result<Com6MigracionGobPeResponse>.Success(response, "Registro actualizado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar registro Com6MigracionGobPe");
            return Result<Com6MigracionGobPeResponse>.Failure($"Error al actualizar el registro: {ex.Message}");
        }
    }
}
