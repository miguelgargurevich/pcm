using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com15CSIRTInstitucional.Commands.CreateCom15CSIRTInstitucional;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com15CSIRTInstitucionalEntity = PCM.Domain.Entities.Com15CSIRTInstitucional;

namespace PCM.Infrastructure.Handlers.Com15CSIRTInstitucional;

public class CreateCom15CSIRTInstitucionalHandler : IRequestHandler<CreateCom15CSIRTInstitucionalCommand, Result<Com15CSIRTInstitucionalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom15CSIRTInstitucionalHandler> _logger;

    public CreateCom15CSIRTInstitucionalHandler(PCMDbContext context, ILogger<CreateCom15CSIRTInstitucionalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com15CSIRTInstitucionalResponse>> Handle(CreateCom15CSIRTInstitucionalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com15CSIRTInstitucional para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com15CSIRTInstitucionalEntity
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
                FechaConformacion = request.FechaConformacion,
                NumeroResolucion = request.NumeroResolucion,
                Responsable = request.Responsable,
                EmailContacto = request.EmailContacto,
                TelefonoContacto = request.TelefonoContacto,
                ArchivoProcedimientos = request.ArchivoProcedimientos,
                Descripcion = request.Descripcion,
            };

            _context.Com15CSIRTInstitucional.Add(entity);
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
            _logger.LogError(ex, "Error al crear Com15CSIRTInstitucional");
            return Result<Com15CSIRTInstitucionalResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
