using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com12ResponsableSoftwarePublico.Queries.GetCom12ResponsableSoftwarePublico;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com12ResponsableSoftwarePublico;

public class GetCom12ResponsableSoftwarePublicoHandler : IRequestHandler<GetCom12ResponsableSoftwarePublicoQuery, Result<Com12ResponsableSoftwarePublicoResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom12ResponsableSoftwarePublicoHandler> _logger;

    public GetCom12ResponsableSoftwarePublicoHandler(PCMDbContext context, ILogger<GetCom12ResponsableSoftwarePublicoHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com12ResponsableSoftwarePublicoResponse>> Handle(GetCom12ResponsableSoftwarePublicoQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com12ResponsableSoftwarePublico para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com12ResponsableSoftwarePublico
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com12ResponsableSoftwarePublicoResponse>.Failure("Registro no encontrado");
            }

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
            _logger.LogError(ex, "Error al obtener Com12ResponsableSoftwarePublico");
            return Result<Com12ResponsableSoftwarePublicoResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
