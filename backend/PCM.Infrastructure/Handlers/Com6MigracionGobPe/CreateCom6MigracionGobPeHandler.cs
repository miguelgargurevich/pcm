using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com6MigracionGobPe.Commands.CreateCom6MigracionGobPe;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com6Entity = PCM.Domain.Entities.Com6MigracionGobPe;

namespace PCM.Infrastructure.Handlers.Com6MigracionGobPe;

public class CreateCom6MigracionGobPeHandler : IRequestHandler<CreateCom6MigracionGobPeCommand, Result<Com6MigracionGobPeResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom6MigracionGobPeHandler> _logger;

    public CreateCom6MigracionGobPeHandler(PCMDbContext context, ILogger<CreateCom6MigracionGobPeHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com6MigracionGobPeResponse>> Handle(CreateCom6MigracionGobPeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com6MigracionGobPe para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com6Entity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                UrlGobPe = request.UrlGobPe,
                FechaMigracionGobPe = request.FechaMigracionGobPe,
                FechaActualizacionGobPe = request.FechaActualizacionGobPe,
                ResponsableGobPe = request.ResponsableGobPe,
                CorreoResponsableGobPe = request.CorreoResponsableGobPe,
                TelefonoResponsableGobPe = request.TelefonoResponsableGobPe,
                TipoMigracionGobPe = request.TipoMigracionGobPe,
                ObservacionGobPe = request.ObservacionGobPe,
                RutaPdfGobPe = request.RutaPdfGobPe,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                Activo = true
            };

            _context.Com6MigracionGobPe.Add(entity);
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

            _logger.LogInformation("Registro Com6MigracionGobPe creado exitosamente con ID {CommpgobpeEntId}", entity.CommpgobpeEntId);

            return Result<Com6MigracionGobPeResponse>.Success(response, "Registro creado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear registro Com6MigracionGobPe");
            return Result<Com6MigracionGobPeResponse>.Failure($"Error al crear el registro: {ex.Message}");
        }
    }
}
