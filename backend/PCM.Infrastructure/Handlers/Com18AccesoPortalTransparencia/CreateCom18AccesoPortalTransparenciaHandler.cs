using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com18AccesoPortalTransparencia.Commands.CreateCom18AccesoPortalTransparencia;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com18AccesoPortalTransparenciaEntity = PCM.Domain.Entities.Com18AccesoPortalTransparencia;

namespace PCM.Infrastructure.Handlers.Com18AccesoPortalTransparencia;

public class CreateCom18AccesoPortalTransparenciaHandler : IRequestHandler<CreateCom18AccesoPortalTransparenciaCommand, Result<Com18AccesoPortalTransparenciaResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom18AccesoPortalTransparenciaHandler> _logger;

    public CreateCom18AccesoPortalTransparenciaHandler(PCMDbContext context, ILogger<CreateCom18AccesoPortalTransparenciaHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com18AccesoPortalTransparenciaResponse>> Handle(CreateCom18AccesoPortalTransparenciaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com18AccesoPortalTransparencia para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com18AccesoPortalTransparenciaEntity
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
                UrlPlataforma = request.UrlPlataforma,
                FechaImplementacion = request.FechaImplementacion,
                TramitesDisponibles = request.TramitesDisponibles,
                UsuariosRegistrados = request.UsuariosRegistrados,
                TramitesProcesados = request.TramitesProcesados,
                ArchivoEvidencia = request.ArchivoEvidencia,
                Descripcion = request.Descripcion,
            };

            _context.Com18AccesoPortalTransparencia.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com18AccesoPortalTransparenciaResponse
            {
                ComsapteEntId = entity.ComsapteEntId,
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
                UrlPlataforma = entity.UrlPlataforma,
                FechaImplementacion = entity.FechaImplementacion,
                TramitesDisponibles = entity.TramitesDisponibles,
                UsuariosRegistrados = entity.UsuariosRegistrados,
                TramitesProcesados = entity.TramitesProcesados,
                ArchivoEvidencia = entity.ArchivoEvidencia,
                Descripcion = entity.Descripcion,
            };

            return Result<Com18AccesoPortalTransparenciaResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com18AccesoPortalTransparencia");
            return Result<Com18AccesoPortalTransparenciaResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
