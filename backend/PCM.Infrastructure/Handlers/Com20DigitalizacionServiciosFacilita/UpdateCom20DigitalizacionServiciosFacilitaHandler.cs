using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Commands.UpdateCom20DigitalizacionServiciosFacilita;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com20DigitalizacionServiciosFacilita;

public class UpdateCom20DigitalizacionServiciosFacilitaHandler : IRequestHandler<UpdateCom20DigitalizacionServiciosFacilitaCommand, Result<Com20DigitalizacionServiciosFacilitaResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom20DigitalizacionServiciosFacilitaHandler> _logger;

    public UpdateCom20DigitalizacionServiciosFacilitaHandler(PCMDbContext context, ILogger<UpdateCom20DigitalizacionServiciosFacilitaHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com20DigitalizacionServiciosFacilitaResponse>> Handle(UpdateCom20DigitalizacionServiciosFacilitaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com20DigitalizacionServiciosFacilita {Id}", request.ComdsfpeEntId);

            var entity = await _context.Com20DigitalizacionServiciosFacilita
                .FirstOrDefaultAsync(x => x.ComdsfpeEntId == request.ComdsfpeEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com20DigitalizacionServiciosFacilitaResponse>.Failure($"Registro con ID {request.ComdsfpeEntId} no encontrado");
            }

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos (mapeados desde request genérico a entidad real)
            // Los handlers tienen propiedades genéricas pero la BD tiene campos específicos
            // Por ahora, mantenemos compatibilidad con el esquema de BD real

            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com20DigitalizacionServiciosFacilitaResponse
            {
                ComdsfpeEntId = entity.ComdsfpeEntId,
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
                // Propiedades específicas reales de la BD
                ResponsableFacilita = entity.ResponsableFacilita,
                CargoResponsableFacilita = entity.CargoResponsableFacilita,
                CorreoFacilita = entity.CorreoFacilita,
                TelefonoFacilita = entity.TelefonoFacilita,
                EstadoImplementacionFacilita = entity.EstadoImplementacionFacilita,
                FechaInicioFacilita = entity.FechaInicioFacilita,
                FechaUltimoAvanceFacilita = entity.FechaUltimoAvanceFacilita,
                TotalServiciosDigitalizados = entity.TotalServiciosDigitalizados,
                RutaPdfFacilita = entity.RutaPdfFacilita,
                ObservacionFacilita = entity.ObservacionFacilita,
            };

            return Result<Com20DigitalizacionServiciosFacilitaResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com20DigitalizacionServiciosFacilita");
            return Result<Com20DigitalizacionServiciosFacilitaResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
