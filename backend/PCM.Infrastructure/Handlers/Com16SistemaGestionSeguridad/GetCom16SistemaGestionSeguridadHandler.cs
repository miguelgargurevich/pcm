using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Queries.GetCom16SistemaGestionSeguridad;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com16SistemaGestionSeguridad;

public class GetCom16SistemaGestionSeguridadHandler : IRequestHandler<GetCom16SistemaGestionSeguridadQuery, Result<Com16SistemaGestionSeguridadResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom16SistemaGestionSeguridadHandler> _logger;

    public GetCom16SistemaGestionSeguridadHandler(PCMDbContext context, ILogger<GetCom16SistemaGestionSeguridadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com16SistemaGestionSeguridadResponse>> Handle(GetCom16SistemaGestionSeguridadQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com16SistemaGestionSeguridad para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com16SistemaGestionSeguridad
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com16SistemaGestionSeguridadResponse>.Failure("Registro no encontrado");
            }

            var response = new Com16SistemaGestionSeguridadResponse
            {
                ComsgsiEntId = entity.ComsgsiEntId,
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
                // Campos específicos SGSI
                ResponsableSgsi = entity.ResponsableSgsi,
                CargoResponsableSgsi = entity.CargoResponsableSgsi,
                CorreoSgsi = entity.CorreoSgsi,
                TelefonoSgsi = entity.TelefonoSgsi,
                EstadoImplementacionSgsi = entity.EstadoImplementacionSgsi,
                AlcanceSgsi = entity.AlcanceSgsi,
                FechaInicioSgsi = entity.FechaInicioSgsi,
                FechaCertificacionSgsi = entity.FechaCertificacionSgsi,
                EntidadCertificadoraSgsi = entity.EntidadCertificadoraSgsi,
                VersionNormaSgsi = entity.VersionNormaSgsi,
                RutaPdfCertificadoSgsi = entity.RutaPdfCertificadoSgsi,
                RutaPdfPoliticasSgsi = entity.RutaPdfPoliticasSgsi,
                ObservacionSgsi = entity.ObservacionSgsi,
                RutaPdfNormativa = entity.RutaPdfNormativa,
                FechaImplementacionSgsi = entity.FechaImplementacionSgsi,
                NormaAplicadaSgsi = entity.NormaAplicadaSgsi,
                RutaPdfSgsi = entity.RutaPdfSgsi,
                NivelImplementacionSgsi = entity.NivelImplementacionSgsi,
            };

            return Result<Com16SistemaGestionSeguridadResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com16SistemaGestionSeguridad");
            return Result<Com16SistemaGestionSeguridadResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
