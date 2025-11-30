using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com11AportacionGeoPeru.Commands.CreateCom11AportacionGeoPeru;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com11AportacionGeoPeruEntity = PCM.Domain.Entities.Com11AportacionGeoPeru;

namespace PCM.Infrastructure.Handlers.Com11AportacionGeoPeru;

public class CreateCom11AportacionGeoPeruHandler : IRequestHandler<CreateCom11AportacionGeoPeruCommand, Result<Com11AportacionGeoPeruResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom11AportacionGeoPeruHandler> _logger;

    public CreateCom11AportacionGeoPeruHandler(PCMDbContext context, ILogger<CreateCom11AportacionGeoPeruHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com11AportacionGeoPeruResponse>> Handle(CreateCom11AportacionGeoPeruCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com11AportacionGeoPeru para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com11AportacionGeoPeruEntity
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
                FechaInicio = request.FechaInicio.HasValue 
                    ? DateTime.SpecifyKind(request.FechaInicio.Value, DateTimeKind.Utc) 
                    : null,
                FechaFin = request.FechaFin.HasValue 
                    ? DateTime.SpecifyKind(request.FechaFin.Value, DateTimeKind.Utc) 
                    : null,
                ServiciosDigitalizados = request.ServiciosDigitalizados,
                ServiciosTotal = request.ServiciosTotal,
                PorcentajeDigitalizacion = request.PorcentajeDigitalizacion,
                ArchivoPlan = request.ArchivoPlan,
                Descripcion = request.Descripcion,
                BeneficiariosEstimados = request.BeneficiariosEstimados,
            };

            _context.Com11AportacionGeoPeru.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com11AportacionGeoPeruResponse
            {
                ComageopEntId = entity.ComageopEntId,
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
                FechaInicio = entity.FechaInicio,
                FechaFin = entity.FechaFin,
                ServiciosDigitalizados = entity.ServiciosDigitalizados,
                ServiciosTotal = entity.ServiciosTotal,
                PorcentajeDigitalizacion = entity.PorcentajeDigitalizacion,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
                BeneficiariosEstimados = entity.BeneficiariosEstimados,
            };

            return Result<Com11AportacionGeoPeruResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com11AportacionGeoPeru");
            return Result<Com11AportacionGeoPeruResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
