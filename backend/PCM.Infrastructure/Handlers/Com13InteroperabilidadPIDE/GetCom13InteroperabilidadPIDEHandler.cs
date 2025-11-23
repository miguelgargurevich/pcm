using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com13InteroperabilidadPIDE.Queries.GetCom13InteroperabilidadPIDE;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com13InteroperabilidadPIDE;

public class GetCom13InteroperabilidadPIDEHandler : IRequestHandler<GetCom13InteroperabilidadPIDEQuery, Result<Com13InteroperabilidadPIDEResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom13InteroperabilidadPIDEHandler> _logger;

    public GetCom13InteroperabilidadPIDEHandler(PCMDbContext context, ILogger<GetCom13InteroperabilidadPIDEHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com13InteroperabilidadPIDEResponse>> Handle(GetCom13InteroperabilidadPIDEQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com13InteroperabilidadPIDE para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com13InteroperabilidadPIDE
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com13InteroperabilidadPIDEResponse>.Failure("Registro no encontrado");
            }

            var response = new Com13InteroperabilidadPIDEResponse
            {
                CompcpideEntId = entity.CompcpideEntId,
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
                FechaAprobacion = entity.FechaAprobacion,
                NumeroResolucion = entity.NumeroResolucion,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
                RiesgosIdentificados = entity.RiesgosIdentificados,
                EstrategiasMitigacion = entity.EstrategiasMitigacion,
                FechaRevision = entity.FechaRevision,
                Responsable = entity.Responsable,
            };

            return Result<Com13InteroperabilidadPIDEResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com13InteroperabilidadPIDE");
            return Result<Com13InteroperabilidadPIDEResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
