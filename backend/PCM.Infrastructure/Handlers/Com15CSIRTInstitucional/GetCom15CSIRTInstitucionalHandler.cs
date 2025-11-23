using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com15CSIRTInstitucional.Queries.GetCom15CSIRTInstitucional;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com15CSIRTInstitucional;

public class GetCom15CSIRTInstitucionalHandler : IRequestHandler<GetCom15CSIRTInstitucionalQuery, Result<Com15CSIRTInstitucionalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom15CSIRTInstitucionalHandler> _logger;

    public GetCom15CSIRTInstitucionalHandler(PCMDbContext context, ILogger<GetCom15CSIRTInstitucionalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com15CSIRTInstitucionalResponse>> Handle(GetCom15CSIRTInstitucionalQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com15CSIRTInstitucional para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com15CSIRTInstitucional
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com15CSIRTInstitucionalResponse>.Failure("Registro no encontrado");
            }

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
            _logger.LogError(ex, "Error al obtener Com15CSIRTInstitucional");
            return Result<Com15CSIRTInstitucionalResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
