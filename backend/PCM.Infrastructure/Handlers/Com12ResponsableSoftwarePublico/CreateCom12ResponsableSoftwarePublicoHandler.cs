using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com12ResponsableSoftwarePublico.Commands.CreateCom12ResponsableSoftwarePublico;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com12ResponsableSoftwarePublicoEntity = PCM.Domain.Entities.Com12ResponsableSoftwarePublico;

namespace PCM.Infrastructure.Handlers.Com12ResponsableSoftwarePublico;

public class CreateCom12ResponsableSoftwarePublicoHandler : IRequestHandler<CreateCom12ResponsableSoftwarePublicoCommand, Result<Com12ResponsableSoftwarePublicoResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom12ResponsableSoftwarePublicoHandler> _logger;

    public CreateCom12ResponsableSoftwarePublicoHandler(PCMDbContext context, ILogger<CreateCom12ResponsableSoftwarePublicoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com12ResponsableSoftwarePublicoResponse>> Handle(CreateCom12ResponsableSoftwarePublicoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com12ResponsableSoftwarePublico para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com12ResponsableSoftwarePublicoEntity
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
                FechaElaboracion = request.FechaElaboracion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaElaboracion.Value, DateTimeKind.Utc) 
                    : null,
                NumeroDocumento = request.NumeroDocumento,
                ArchivoDocumento = request.ArchivoDocumento,
                Descripcion = request.Descripcion,
                RequisitosSeguridad = request.RequisitosSeguridad,
                RequisitosPrivacidad = request.RequisitosPrivacidad,
                FechaVigencia = request.FechaVigencia.HasValue 
                    ? DateTime.SpecifyKind(request.FechaVigencia.Value, DateTimeKind.Utc) 
                    : null,
            };

            _context.Com12ResponsableSoftwarePublico.Add(entity);
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
            _logger.LogError(ex, "Error al crear Com12ResponsableSoftwarePublico");
            return Result<Com12ResponsableSoftwarePublicoResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
