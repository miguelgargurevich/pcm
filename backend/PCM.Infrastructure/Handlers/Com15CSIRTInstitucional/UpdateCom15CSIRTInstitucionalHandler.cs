using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com15CSIRTInstitucional.Commands.UpdateCom15CSIRTInstitucional;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com15CSIRTInstitucional;

public class UpdateCom15CSIRTInstitucionalHandler : IRequestHandler<UpdateCom15CSIRTInstitucionalCommand, Result<Com15CSIRTInstitucionalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom15CSIRTInstitucionalHandler> _logger;

    public UpdateCom15CSIRTInstitucionalHandler(PCMDbContext context, ILogger<UpdateCom15CSIRTInstitucionalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com15CSIRTInstitucionalResponse>> Handle(UpdateCom15CSIRTInstitucionalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com15CSIRTInstitucional {Id}", request.ComcsirtEntId);

            var entity = await _context.Com15CSIRTInstitucional
                .FirstOrDefaultAsync(x => x.ComcsirtEntId == request.ComcsirtEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com15CSIRTInstitucionalResponse>.Failure($"Registro con ID {request.ComcsirtEntId} no encontrado");
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
            if (request.FechaConformacion.HasValue) entity.FechaConformacion = DateTime.SpecifyKind(request.FechaConformacion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroResolucion)) entity.NumeroResolucion = request.NumeroResolucion;
            if (!string.IsNullOrEmpty(request.Responsable)) entity.Responsable = request.Responsable;
            if (!string.IsNullOrEmpty(request.EmailContacto)) entity.EmailContacto = request.EmailContacto;
            if (!string.IsNullOrEmpty(request.TelefonoContacto)) entity.TelefonoContacto = request.TelefonoContacto;
            if (!string.IsNullOrEmpty(request.ArchivoProcedimientos)) entity.ArchivoProcedimientos = request.ArchivoProcedimientos;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;

            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com15CSIRTInstitucionalResponse
            {
                ComcsirtEntId = entity.ComcsirtEntId,
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
                FechaConformacion = entity.FechaConformacion,
                NumeroResolucion = entity.NumeroResolucion,
                Responsable = entity.Responsable,
                EmailContacto = entity.EmailContacto,
                TelefonoContacto = entity.TelefonoContacto,
                ArchivoProcedimientos = entity.ArchivoProcedimientos,
                Descripcion = entity.Descripcion,
            };

            return Result<Com15CSIRTInstitucionalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com15CSIRTInstitucional");
            return Result<Com15CSIRTInstitucionalResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
