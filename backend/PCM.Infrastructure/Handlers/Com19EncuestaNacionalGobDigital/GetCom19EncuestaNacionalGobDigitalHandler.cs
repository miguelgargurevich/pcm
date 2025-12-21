using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com19EncuestaNacionalGobDigital.Queries.GetCom19EncuestaNacionalGobDigital;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com19EncuestaNacionalGobDigital;

public class GetCom19EncuestaNacionalGobDigitalHandler : IRequestHandler<GetCom19EncuestaNacionalGobDigitalQuery, Result<Com19EncuestaNacionalGobDigitalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom19EncuestaNacionalGobDigitalHandler> _logger;

    public GetCom19EncuestaNacionalGobDigitalHandler(PCMDbContext context, ILogger<GetCom19EncuestaNacionalGobDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com19EncuestaNacionalGobDigitalResponse>> Handle(GetCom19EncuestaNacionalGobDigitalQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com19EncuestaNacionalGobDigital para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com19EncuestaNacionalGobDigital
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com19EncuestaNacionalGobDigitalResponse>.Failure("Registro no encontrado");
            }

            var response = new Com19EncuestaNacionalGobDigitalResponse
            {
                ComrenadEntId = entity.ComrenadEntId,
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
                // Campos específicos ENAD
                AnioEnad = entity.AnioEnad,
                ResponsableEnad = entity.ResponsableEnad,
                CargoResponsableEnad = entity.CargoResponsableEnad,
                CorreoEnad = entity.CorreoEnad,
                TelefonoEnad = entity.TelefonoEnad,
                FechaEnvioEnad = entity.FechaEnvioEnad,
                EstadoRespuestaEnad = entity.EstadoRespuestaEnad,
                EnlaceFormularioEnad = entity.EnlaceFormularioEnad,
                ObservacionEnad = entity.ObservacionEnad,
                RutaPdfEnad = entity.RutaPdfEnad,
                RutaPdfNormativa = entity.RutaPdfNormativa
            };

            return Result<Com19EncuestaNacionalGobDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com19EncuestaNacionalGobDigital");
            return Result<Com19EncuestaNacionalGobDigitalResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
