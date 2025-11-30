using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com12ResponsableSoftwarePublico.Commands.UpdateCom12ResponsableSoftwarePublico;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com12ResponsableSoftwarePublico;

public class UpdateCom12ResponsableSoftwarePublicoHandler : IRequestHandler<UpdateCom12ResponsableSoftwarePublicoCommand, Result<Com12ResponsableSoftwarePublicoResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom12ResponsableSoftwarePublicoHandler> _logger;

    public UpdateCom12ResponsableSoftwarePublicoHandler(PCMDbContext context, ILogger<UpdateCom12ResponsableSoftwarePublicoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com12ResponsableSoftwarePublicoResponse>> Handle(UpdateCom12ResponsableSoftwarePublicoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com12ResponsableSoftwarePublico {Id}", request.ComdrspEntId);

            var entity = await _context.Com12ResponsableSoftwarePublico
                .FirstOrDefaultAsync(x => x.ComdrspEntId == request.ComdrspEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com12ResponsableSoftwarePublicoResponse>.Failure($"Registro con ID {request.ComdrspEntId} no encontrado");
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
            if (request.FechaElaboracion.HasValue) entity.FechaElaboracion = DateTime.SpecifyKind(request.FechaElaboracion.Value, DateTimeKind.Utc);
            if (!string.IsNullOrEmpty(request.NumeroDocumento)) entity.NumeroDocumento = request.NumeroDocumento;
            if (!string.IsNullOrEmpty(request.ArchivoDocumento)) entity.ArchivoDocumento = request.ArchivoDocumento;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.RequisitosSeguridad)) entity.RequisitosSeguridad = request.RequisitosSeguridad;
            if (!string.IsNullOrEmpty(request.RequisitosPrivacidad)) entity.RequisitosPrivacidad = request.RequisitosPrivacidad;
            if (request.FechaVigencia.HasValue) entity.FechaVigencia = DateTime.SpecifyKind(request.FechaVigencia.Value, DateTimeKind.Utc);

            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com12ResponsableSoftwarePublicoResponse
            {
                ComdrspEntId = entity.ComdrspEntId,
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
                FechaElaboracion = entity.FechaElaboracion,
                NumeroDocumento = entity.NumeroDocumento,
                ArchivoDocumento = entity.ArchivoDocumento,
                Descripcion = entity.Descripcion,
                RequisitosSeguridad = entity.RequisitosSeguridad,
                RequisitosPrivacidad = entity.RequisitosPrivacidad,
                FechaVigencia = entity.FechaVigencia,
            };

            return Result<Com12ResponsableSoftwarePublicoResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com12ResponsableSoftwarePublico");
            return Result<Com12ResponsableSoftwarePublicoResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
