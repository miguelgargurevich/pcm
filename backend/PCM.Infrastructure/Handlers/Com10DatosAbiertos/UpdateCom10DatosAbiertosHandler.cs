using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com10DatosAbiertos.Commands.UpdateCom10DatosAbiertos;
using PCM.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com10DatosAbiertos
{
    public class UpdateCom10DatosAbiertosHandler : IRequestHandler<UpdateCom10DatosAbiertosCommand, Result<bool>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<UpdateCom10DatosAbiertosHandler> _logger;

        public UpdateCom10DatosAbiertosHandler(PCMDbContext context, ILogger<UpdateCom10DatosAbiertosHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<bool>> Handle(UpdateCom10DatosAbiertosCommand request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Actualizando Com10 Datos Abiertos con ID {request.ComdaEntId}");

                var registro = await _context.Com10DatosAbiertos
                    .FirstOrDefaultAsync(c => c.ComdaEntId == request.ComdaEntId, cancellationToken);

                if (registro == null)
                {
                    _logger.LogWarning($"No se encontró Com10 Datos Abiertos con ID {request.ComdaEntId}");
                    return Result<bool>.Failure("Registro no encontrado");
                }

                // Actualizar campos
                registro.UrlDatosAbiertos = request.UrlDatosAbiertos ?? registro.UrlDatosAbiertos;
                registro.TotalDatasets = request.TotalDatasets ?? registro.TotalDatasets;
                registro.FechaUltimaActualizacionDa = request.FechaUltimaActualizacionDa ?? registro.FechaUltimaActualizacionDa;
                registro.ResponsableDa = request.ResponsableDa ?? registro.ResponsableDa;
                registro.CargoResponsableDa = request.CargoResponsableDa ?? registro.CargoResponsableDa;
                registro.CorreoResponsableDa = request.CorreoResponsableDa ?? registro.CorreoResponsableDa;
                registro.TelefonoResponsableDa = request.TelefonoResponsableDa ?? registro.TelefonoResponsableDa;
                registro.NumeroNormaResolucionDa = request.NumeroNormaResolucionDa ?? registro.NumeroNormaResolucionDa;
                registro.FechaAprobacionDa = request.FechaAprobacionDa ?? registro.FechaAprobacionDa;
                registro.ObservacionDa = request.ObservacionDa ?? registro.ObservacionDa;
                registro.RutaPdfDa = request.RutaPdfDa ?? registro.RutaPdfDa;
                registro.CriteriosEvaluados = request.CriteriosEvaluados ?? registro.CriteriosEvaluados;
                registro.CheckPrivacidad = request.CheckPrivacidad ?? registro.CheckPrivacidad;
                registro.CheckDdjj = request.CheckDdjj ?? registro.CheckDdjj;
                registro.UsuarioRegistra = request.UsuarioRegistra ?? registro.UsuarioRegistra;
                registro.EtapaFormulario = request.EtapaFormulario ?? registro.EtapaFormulario;
                registro.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation($"Com10 Datos Abiertos actualizado exitosamente");

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar Com10 Datos Abiertos");
                return Result<bool>.Failure($"Error al actualizar Com10 Datos Abiertos: {ex.Message}");
            }
        }
    }
}
