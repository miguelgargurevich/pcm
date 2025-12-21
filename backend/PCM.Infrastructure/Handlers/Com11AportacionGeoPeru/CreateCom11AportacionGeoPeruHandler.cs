using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com11AportacionGeoPeru.Commands.CreateCom11AportacionGeoPeru;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com11AportacionGeoPeruEntity = PCM.Domain.Entities.Com11AportacionGeoPeru;

namespace PCM.Infrastructure.Handlers.Com11AportacionGeoPeru;

public class CreateCom11AportacionGeoPeruHandler : IRequestHandler<CreateCom11AportacionGeoPeruCommand, Result<Com11AportacionGeoPeruResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom11AportacionGeoPeruHandler> _logger;

    public CreateCom11AportacionGeoPeruHandler(PCMDbContext context, ILogger<CreateCom11AportacionGeoPeruHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com11AportacionGeoPeruResponse>> Handle(CreateCom11AportacionGeoPeruCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com11AportacionGeoPeru para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com11AportacionGeoPeruEntity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                EstadoPCM = "",
                ObservacionesPCM = "",
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                Activo = true,
                // Campos específicos de GeoPeru
                UrlGeo = request.UrlGeo ?? "",
                TipoInformacionGeo = request.TipoInformacionGeo ?? "",
                TotalCapasPublicadas = request.TotalCapasPublicadas,
                FechaUltimaActualizacionGeo = request.FechaUltimaActualizacionGeo.HasValue 
                    ? DateTime.SpecifyKind(request.FechaUltimaActualizacionGeo.Value, DateTimeKind.Utc) 
                    : null,
                ResponsableGeo = request.ResponsableGeo ?? "",
                CargoResponsableGeo = request.CargoResponsableGeo ?? "",
                CorreoResponsableGeo = request.CorreoResponsableGeo ?? "",
                TelefonoResponsableGeo = request.TelefonoResponsableGeo ?? "",
                NormaAprobacionGeo = request.NormaAprobacionGeo ?? "",
                FechaAprobacionGeo = request.FechaAprobacionGeo.HasValue 
                    ? DateTime.SpecifyKind(request.FechaAprobacionGeo.Value, DateTimeKind.Utc) 
                    : null,
                InteroperabilidadGeo = request.InteroperabilidadGeo,
                ObservacionGeo = request.ObservacionGeo ?? "",
                RutaPdfGeo = request.RutaPdfGeo ?? "",
                RutaPdfNormativa = request.RutaPdfNormativa
            };

            _context.Com11AportacionGeoPeru.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com11AportacionGeoPeruResponse
            {
                ComageopEntId = entity.ComageopEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
                // Campos específicos de GeoPeru
                UrlGeo = entity.UrlGeo,
                TipoInformacionGeo = entity.TipoInformacionGeo,
                TotalCapasPublicadas = entity.TotalCapasPublicadas,
                FechaUltimaActualizacionGeo = entity.FechaUltimaActualizacionGeo,
                ResponsableGeo = entity.ResponsableGeo,
                CargoResponsableGeo = entity.CargoResponsableGeo,
                CorreoResponsableGeo = entity.CorreoResponsableGeo,
                TelefonoResponsableGeo = entity.TelefonoResponsableGeo,
                NormaAprobacionGeo = entity.NormaAprobacionGeo,
                FechaAprobacionGeo = entity.FechaAprobacionGeo,
                InteroperabilidadGeo = entity.InteroperabilidadGeo,
                ObservacionGeo = entity.ObservacionGeo,
                RutaPdfGeo = entity.RutaPdfGeo,
                RutaPdfNormativa = entity.RutaPdfNormativa
            };

            return Result<Com11AportacionGeoPeruResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com11AportacionGeoPeru");
            return Result<Com11AportacionGeoPeruResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
