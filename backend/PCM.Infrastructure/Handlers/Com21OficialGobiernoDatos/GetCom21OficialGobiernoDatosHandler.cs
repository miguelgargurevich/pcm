using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com21OficialGobiernoDatos.Queries.GetCom21OficialGobiernoDatos;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com21OficialGobiernoDatos;

public class GetCom21OficialGobiernoDatosHandler : IRequestHandler<GetCom21OficialGobiernoDatosQuery, Result<Com21OficialGobiernoDatosResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom21OficialGobiernoDatosHandler> _logger;

    public GetCom21OficialGobiernoDatosHandler(PCMDbContext context, ILogger<GetCom21OficialGobiernoDatosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com21OficialGobiernoDatosResponse>> Handle(GetCom21OficialGobiernoDatosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com21OficialGobiernoDatos para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com21OficialGobiernoDatos
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com21OficialGobiernoDatosResponse>.Failure("Registro no encontrado");
            }

            var response = new Com21OficialGobiernoDatosResponse
            {
                ComdogdEntId = entity.ComdogdEntId,
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
                // Mapear campos reales a propiedades del Response
                FechaElaboracion = entity.FechaDesignacionOgd,
                NumeroDocumento = entity.NumeroResolucionOgd,
                ArchivoDocumento = entity.RutaPdfOgd,
                Descripcion = entity.ObservacionOgd,
                Procedimientos = null,
                Responsables = entity.NombreOgd,
                FechaVigencia = null,
                // Campos específicos de OGD
                DniOgd = entity.DniOgd,
                NombreOgd = entity.NombreOgd,
                ApePatOgd = entity.ApePatOgd,
                ApeMatOgd = entity.ApeMatOgd,
                CargoOgd = entity.CargoOgd,
                CorreoOgd = entity.CorreoOgd,
                TelefonoOgd = entity.TelefonoOgd,
                FechaDesignacionOgd = entity.FechaDesignacionOgd,
                NumeroResolucionOgd = entity.NumeroResolucionOgd,
                ComunicadoPcmOgd = entity.ComunicadoPcmOgd,
                RutaPdfOgd = entity.RutaPdfOgd,
                ObservacionOgd = entity.ObservacionOgd,
                RutaPdfNormativa = entity.RutaPdfNormativa
            };

            return Result<Com21OficialGobiernoDatosResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com21OficialGobiernoDatos");
            return Result<Com21OficialGobiernoDatosResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
