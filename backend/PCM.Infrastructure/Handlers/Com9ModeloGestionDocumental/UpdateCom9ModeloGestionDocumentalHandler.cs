using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.UpdateCom9ModeloGestionDocumental;
using PCM.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com9ModeloGestionDocumental
{
    public class UpdateCom9ModeloGestionDocumentalHandler : IRequestHandler<UpdateCom9ModeloGestionDocumentalCommand, Result<bool>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<UpdateCom9ModeloGestionDocumentalHandler> _logger;

        public UpdateCom9ModeloGestionDocumentalHandler(PCMDbContext context, ILogger<UpdateCom9ModeloGestionDocumentalHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<bool>> Handle(UpdateCom9ModeloGestionDocumentalCommand request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Actualizando Com9 MGD con ID {request.CommgdEntId}");

                var registro = await _context.Com9ModeloGestionDocumental
                    .FirstOrDefaultAsync(c => c.CommgdEntId == request.CommgdEntId, cancellationToken);

                if (registro == null)
                {
                    _logger.LogWarning($"No se encontró Com9 MGD con ID {request.CommgdEntId}");
                    return Result<bool>.Failure("Registro no encontrado");
                }

                // Actualizar campos
                registro.FechaAprobacionMgd = request.FechaAprobacionMgd ?? registro.FechaAprobacionMgd;
                registro.NumeroResolucionMgd = request.NumeroResolucionMgd ?? registro.NumeroResolucionMgd;
                registro.ResponsableMgd = request.ResponsableMgd ?? registro.ResponsableMgd;
                registro.CargoResponsableMgd = request.CargoResponsableMgd ?? registro.CargoResponsableMgd;
                registro.CorreoResponsableMgd = request.CorreoResponsableMgd ?? registro.CorreoResponsableMgd;
                registro.TelefonoResponsableMgd = request.TelefonoResponsableMgd ?? registro.TelefonoResponsableMgd;
                registro.SistemaPlataformaMgd = request.SistemaPlataformaMgd ?? registro.SistemaPlataformaMgd;
                registro.TipoImplantacionMgd = request.TipoImplantacionMgd ?? registro.TipoImplantacionMgd;
                registro.InteroperaSistemasMgd = request.InteroperaSistemasMgd ?? registro.InteroperaSistemasMgd;
                registro.ObservacionMgd = request.ObservacionMgd ?? registro.ObservacionMgd;
                registro.RutaPdfMgd = request.RutaPdfMgd ?? registro.RutaPdfMgd;
                registro.CheckPrivacidad = request.CheckPrivacidad ?? registro.CheckPrivacidad;
                registro.CheckDdjj = request.CheckDdjj ?? registro.CheckDdjj;
                registro.UsuarioRegistra = request.UsuarioRegistra ?? registro.UsuarioRegistra;
                registro.EtapaFormulario = request.EtapaFormulario ?? registro.EtapaFormulario;
                registro.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation($"Com9 MGD actualizado exitosamente");

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar Com9 MGD");
                return Result<bool>.Failure($"Error al actualizar Com9 MGD: {ex.Message}");
            }
        }
    }
}
