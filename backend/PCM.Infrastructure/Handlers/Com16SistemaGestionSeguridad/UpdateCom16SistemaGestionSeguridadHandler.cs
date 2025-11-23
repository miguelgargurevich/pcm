using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.UpdateCom16SistemaGestionSeguridad;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com16SistemaGestionSeguridad;

public class UpdateCom16SistemaGestionSeguridadHandler : IRequestHandler<UpdateCom16SistemaGestionSeguridadCommand, Result<Com16SistemaGestionSeguridadResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom16SistemaGestionSeguridadHandler> _logger;

    public UpdateCom16SistemaGestionSeguridadHandler(PCMDbContext context, ILogger<UpdateCom16SistemaGestionSeguridadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com16SistemaGestionSeguridadResponse>> Handle(UpdateCom16SistemaGestionSeguridadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com16SistemaGestionSeguridad {Id}", request.ComsgsiEntId);

            var entity = await _context.Com16SistemaGestionSeguridad
                .FirstOrDefaultAsync(x => x.ComsgsiEntId == request.ComsgsiEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com16SistemaGestionSeguridadResponse>.Failure($"Registro con ID {request.ComsgsiEntId} no encontrado");
            }

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos
            if (request.FechaImplementacion.HasValue) entity.FechaImplementacion = request.FechaImplementacion;
            if (!string.IsNullOrEmpty(request.NormaAplicable)) entity.NormaAplicable = request.NormaAplicable;
            if (!string.IsNullOrEmpty(request.Certificacion)) entity.Certificacion = request.Certificacion;
            if (request.FechaCertificacion.HasValue) entity.FechaCertificacion = request.FechaCertificacion;
            if (!string.IsNullOrEmpty(request.ArchivoCertificado)) entity.ArchivoCertificado = request.ArchivoCertificado;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.Alcance)) entity.Alcance = request.Alcance;

            await _context.SaveChangesAsync(cancellationToken);

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
                FechaImplementacion = entity.FechaImplementacion,
                NormaAplicable = entity.NormaAplicable,
                Certificacion = entity.Certificacion,
                FechaCertificacion = entity.FechaCertificacion,
                ArchivoCertificado = entity.ArchivoCertificado,
                Descripcion = entity.Descripcion,
                Alcance = entity.Alcance,
            };

            return Result<Com16SistemaGestionSeguridadResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com16SistemaGestionSeguridad");
            return Result<Com16SistemaGestionSeguridadResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
