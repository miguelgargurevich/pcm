using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;
using PCM.Application.Features.Com1LiderGTD.Queries.GetCom1LiderGTDByEntidad;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com1LiderGTD;

public class GetCom1LiderGTDByEntidadHandler : IRequestHandler<GetCom1LiderGTDByEntidadQuery, Result<Com1LiderGTDResponse?>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom1LiderGTDByEntidadHandler> _logger;

    public GetCom1LiderGTDByEntidadHandler(PCMDbContext context, ILogger<GetCom1LiderGTDByEntidadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com1LiderGTDResponse?>> Handle(GetCom1LiderGTDByEntidadQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Buscando Com1LiderGTD para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            // Obtener el registro más reciente (por created_at DESC)
            var entity = await _context.Com1LiderGTD
                .Where(x => 
                    x.CompromisoId == request.CompromisoId && 
                    x.EntidadId == request.EntidadId && 
                    x.Activo)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                _logger.LogInformation("No se encontró registro Com1LiderGTD");
                return Result<Com1LiderGTDResponse?>.Success(null);
            }

            var response = new Com1LiderGTDResponse
            {
                ComlgtdEntId = entity.ComlgtdEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                DniLider = entity.DniLider,
                NombreLider = entity.NombreLider,
                ApePatLider = entity.ApePatLider,
                ApeMatLider = entity.ApeMatLider,
                EmailLider = entity.EmailLider,
                TelefonoLider = entity.TelefonoLider,
                RolLider = entity.RolLider,
                CargoLider = entity.CargoLider,
                FecIniLider = entity.FecIniLider,
                UrlDocPcm = entity.UrlDocPcm,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                UsuarioRegistra = entity.UsuarioRegistra,
                Activo = entity.Activo
            };

            return Result<Com1LiderGTDResponse?>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al buscar Com1LiderGTD");
            return Result<Com1LiderGTDResponse?>.Failure($"Error al buscar el registro: {ex.Message}");
        }
    }
}
