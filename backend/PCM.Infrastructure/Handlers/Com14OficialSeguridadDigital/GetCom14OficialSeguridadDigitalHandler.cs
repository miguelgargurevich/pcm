using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com14OficialSeguridadDigital.Queries.GetCom14OficialSeguridadDigital;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com14OficialSeguridadDigital;

public class GetCom14OficialSeguridadDigitalHandler : IRequestHandler<GetCom14OficialSeguridadDigitalQuery, Result<Com14OficialSeguridadDigitalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom14OficialSeguridadDigitalHandler> _logger;

    public GetCom14OficialSeguridadDigitalHandler(PCMDbContext context, ILogger<GetCom14OficialSeguridadDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com14OficialSeguridadDigitalResponse>> Handle(GetCom14OficialSeguridadDigitalQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com14OficialSeguridadDigital para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com14OficialSeguridadDigital
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com14OficialSeguridadDigitalResponse>.Failure("Registro no encontrado");
            }

            var response = new Com14OficialSeguridadDigitalResponse
            {
                ComdoscdEntId = entity.ComdoscdEntId,
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
                // Campos específicos OSCD
                DniOscd = entity.DniOscd,
                NombreOscd = entity.NombreOscd,
                ApePatOscd = entity.ApePatOscd,
                ApeMatOscd = entity.ApeMatOscd,
                CargoOscd = entity.CargoOscd,
                CorreoOscd = entity.CorreoOscd,
                TelefonoOscd = entity.TelefonoOscd,
                FechaDesignacionOscd = entity.FechaDesignacionOscd,
                NumeroResolucionOscd = entity.NumeroResolucionOscd,
                ComunicadoPcmOscd = entity.ComunicadoPcmOscd,
                RutaPdfOscd = entity.RutaPdfOscd,
                ObservacionOscd = entity.ObservacionOscd,
                RutaPdfNormativa = entity.RutaPdfNormativa,
            };

            return Result<Com14OficialSeguridadDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com14OficialSeguridadDigital");
            return Result<Com14OficialSeguridadDigitalResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
