using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com8PublicacionTUPA.Commands.CreateCom8PublicacionTUPA;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com8Entity = PCM.Domain.Entities.Com8PublicacionTUPA;

namespace PCM.Infrastructure.Handlers.Com8PublicacionTUPA;

public class CreateCom8PublicacionTUPAHandler : IRequestHandler<CreateCom8PublicacionTUPACommand, Result<Com8PublicacionTUPAResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom8PublicacionTUPAHandler> _logger;

    public CreateCom8PublicacionTUPAHandler(
        PCMDbContext context,
        ILogger<CreateCom8PublicacionTUPAHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com8PublicacionTUPAResponse>> Handle(CreateCom8PublicacionTUPACommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com8PublicacionTUPA para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com8Entity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                EstadoPCM = request.EstadoPCM ?? "En Proceso", // Valor por defecto
                ObservacionesPCM = request.ObservacionesPCM ?? "", // Valor por defecto
                UrlTupa = request.UrlTupa,
                NumeroResolucionTupa = request.NumeroResolucionTupa,
                FechaAprobacionTupa = request.FechaAprobacionTupa.HasValue 
                    ? DateTime.SpecifyKind(request.FechaAprobacionTupa.Value, DateTimeKind.Utc) 
                    : null,
                ResponsableTupa = request.ResponsableTupa,
                CargoResponsableTupa = request.CargoResponsableTupa,
                CorreoResponsableTupa = request.CorreoResponsableTupa,
                TelefonoResponsableTupa = request.TelefonoResponsableTupa,
                ActualizadoTupa = request.ActualizadoTupa,
                ObservacionTupa = request.ObservacionTupa,
                RutaPdfTupa = request.RutaPdfTupa,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                Activo = true
            };

            _context.Com8PublicacionTUPA.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com8PublicacionTUPAResponse
            {
                ComptupaEntId = entity.ComptupaEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                UrlTupa = entity.UrlTupa,
                NumeroResolucionTupa = entity.NumeroResolucionTupa,
                FechaAprobacionTupa = entity.FechaAprobacionTupa,
                ResponsableTupa = entity.ResponsableTupa,
                CargoResponsableTupa = entity.CargoResponsableTupa,
                CorreoResponsableTupa = entity.CorreoResponsableTupa,
                TelefonoResponsableTupa = entity.TelefonoResponsableTupa,
                ActualizadoTupa = entity.ActualizadoTupa,
                ObservacionTupa = entity.ObservacionTupa,
                RutaPdfTupa = entity.RutaPdfTupa,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo
            };

            _logger.LogInformation("Registro Com8PublicacionTUPA creado exitosamente con ID {ComptupaEntId}", entity.ComptupaEntId);

            return Result<Com8PublicacionTUPAResponse>.Success(response, "Registro creado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear registro Com8PublicacionTUPA");
            return Result<Com8PublicacionTUPAResponse>.Failure($"Error al crear el registro: {ex.Message}");
        }
    }
}
