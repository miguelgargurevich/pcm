using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com11AportacionGeoPeru.Commands.UpdateCom11AportacionGeoPeru;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com11AportacionGeoPeru;

public class UpdateCom11AportacionGeoPeruHandler : IRequestHandler<UpdateCom11AportacionGeoPeruCommand, Result<Com11AportacionGeoPeruResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom11AportacionGeoPeruHandler> _logger;

    public UpdateCom11AportacionGeoPeruHandler(PCMDbContext context, ILogger<UpdateCom11AportacionGeoPeruHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com11AportacionGeoPeruResponse>> Handle(UpdateCom11AportacionGeoPeruCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com11AportacionGeoPeru {Id}", request.ComageopEntId);

            var entity = await _context.Com11AportacionGeoPeru
                .FirstOrDefaultAsync(x => x.ComageopEntId == request.ComageopEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com11AportacionGeoPeruResponse>.Failure($"Registro con ID {request.ComageopEntId} no encontrado");
            }

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos
            if (request.FechaInicio.HasValue) entity.FechaInicio = request.FechaInicio;
            if (request.FechaFin.HasValue) entity.FechaFin = request.FechaFin;
            if (request.ServiciosDigitalizados.HasValue) entity.ServiciosDigitalizados = request.ServiciosDigitalizados;
            if (request.ServiciosTotal.HasValue) entity.ServiciosTotal = request.ServiciosTotal;
            if (request.PorcentajeDigitalizacion.HasValue) entity.PorcentajeDigitalizacion = request.PorcentajeDigitalizacion;
            if (!string.IsNullOrEmpty(request.ArchivoPlan)) entity.ArchivoPlan = request.ArchivoPlan;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (request.BeneficiariosEstimados.HasValue) entity.BeneficiariosEstimados = request.BeneficiariosEstimados;

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
            _logger.LogError(ex, "Error al actualizar Com11AportacionGeoPeru");
            return Result<Com11AportacionGeoPeruResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
