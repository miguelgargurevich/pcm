using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.CreateCom16SistemaGestionSeguridad;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com16SistemaGestionSeguridadEntity = PCM.Domain.Entities.Com16SistemaGestionSeguridad;

namespace PCM.Infrastructure.Handlers.Com16SistemaGestionSeguridad;

public class CreateCom16SistemaGestionSeguridadHandler : IRequestHandler<CreateCom16SistemaGestionSeguridadCommand, Result<Com16SistemaGestionSeguridadResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom16SistemaGestionSeguridadHandler> _logger;

    public CreateCom16SistemaGestionSeguridadHandler(PCMDbContext context, ILogger<CreateCom16SistemaGestionSeguridadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com16SistemaGestionSeguridadResponse>> Handle(CreateCom16SistemaGestionSeguridadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com16SistemaGestionSeguridad para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com16SistemaGestionSeguridadEntity
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
                FechaImplementacion = request.FechaImplementacion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaImplementacion.Value, DateTimeKind.Utc) 
                    : null,
                NormaAplicable = request.NormaAplicable,
                Certificacion = request.Certificacion,
                FechaCertificacion = request.FechaCertificacion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaCertificacion.Value, DateTimeKind.Utc) 
                    : null,
                ArchivoCertificado = request.ArchivoCertificado,
                Descripcion = request.Descripcion,
                Alcance = request.Alcance,
            };

            _context.Com16SistemaGestionSeguridad.Add(entity);
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
            _logger.LogError(ex, "Error al crear Com16SistemaGestionSeguridad");
            return Result<Com16SistemaGestionSeguridadResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
