using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com11AportacionGeoPeru.Commands.UpdateCom11AportacionGeoPeru;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com11AportacionGeoPeru;

public class UpdateCom11AportacionGeoPeruHandler : IRequestHandler<UpdateCom11AportacionGeoPeruCommand, Result<Com11AportacionGeoPeruResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom11AportacionGeoPeruHandler> _logger;

    public UpdateCom11AportacionGeoPeruHandler(PCMDbContext context, ILogger<UpdateCom11AportacionGeoPeruHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com11AportacionGeoPeruResponse>> Handle(UpdateCom11AportacionGeoPeruCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com11AportacionGeoPeru {Id}", request.ComageopEntId);

            var entity = await _context.Com11AportacionGeoPeru
                .FirstOrDefaultAsync(x => x.ComageopEntId == request.ComageopEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com11AportacionGeoPeruResponse>.Failure($"Registro con ID {request.ComageopEntId} no encontrado");
            }

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos de Aportación a GeoPeru
            if (!string.IsNullOrEmpty(request.UrlGeo)) entity.UrlGeo = request.UrlGeo;
            if (!string.IsNullOrEmpty(request.TipoInformacionGeo)) entity.TipoInformacionGeo = request.TipoInformacionGeo;
            if (request.TotalCapasPublicadas.HasValue) entity.TotalCapasPublicadas = request.TotalCapasPublicadas.Value;
            if (request.FechaUltimaActualizacionGeo.HasValue) entity.FechaUltimaActualizacionGeo = DateTime.SpecifyKind(request.FechaUltimaActualizacionGeo.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.ResponsableGeo)) entity.ResponsableGeo = request.ResponsableGeo;
            if (!string.IsNullOrEmpty(request.CargoResponsableGeo)) entity.CargoResponsableGeo = request.CargoResponsableGeo;
            if (!string.IsNullOrEmpty(request.CorreoResponsableGeo)) entity.CorreoResponsableGeo = request.CorreoResponsableGeo;
            if (!string.IsNullOrEmpty(request.TelefonoResponsableGeo)) entity.TelefonoResponsableGeo = request.TelefonoResponsableGeo;
            if (!string.IsNullOrEmpty(request.NormaAprobacionGeo)) entity.NormaAprobacionGeo = request.NormaAprobacionGeo;
            if (request.FechaAprobacionGeo.HasValue) entity.FechaAprobacionGeo = DateTime.SpecifyKind(request.FechaAprobacionGeo.Value, DateTimeKind.Utc);
            if (request.InteroperabilidadGeo.HasValue) entity.InteroperabilidadGeo = request.InteroperabilidadGeo.Value;
            if (!string.IsNullOrEmpty(request.ObservacionGeo)) entity.ObservacionGeo = request.ObservacionGeo;
            if (!string.IsNullOrEmpty(request.RutaPdfGeo)) entity.RutaPdfGeo = request.RutaPdfGeo;

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
            };

            return Result<Com11AportacionGeoPeruResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com11AportacionGeoPeru");
            return Result<Com11AportacionGeoPeruResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
