using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.CreateCom9ModeloGestionDocumental;
using PCM.Application.Features.Com9ModeloGestionDocumental.Queries.GetCom9ModeloGestionDocumental;
using PCM.Infrastructure.Data;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com9ModeloGestionDocumental
{
    public class GetCom9ModeloGestionDocumentalHandler : IRequestHandler<GetCom9ModeloGestionDocumentalQuery, Result<Com9ModeloGestionDocumentalResponse>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<GetCom9ModeloGestionDocumentalHandler> _logger;

        public GetCom9ModeloGestionDocumentalHandler(PCMDbContext context, ILogger<GetCom9ModeloGestionDocumentalHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<Com9ModeloGestionDocumentalResponse>> Handle(GetCom9ModeloGestionDocumentalQuery request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Buscando Com9 MGD para Compromiso {request.CompromisoId} y Entidad {request.EntidadId}");

                var registro = await _context.Com9ModeloGestionDocumental
                    .Where(c => c.CompromisoId == request.CompromisoId && c.EntidadId == request.EntidadId)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);

                if (registro == null)
                {
                    _logger.LogInformation("No se encontró registro Com9 MGD");
                    return Result<Com9ModeloGestionDocumentalResponse>.Success(null!, "No se encontró registro");
                }

                var response = new Com9ModeloGestionDocumentalResponse
                {
                    CommgdEntId = registro.CommgdEntId,
                    CompromisoId = registro.CompromisoId,
                    EntidadId = registro.EntidadId,
                    FechaAprobacionMgd = registro.FechaAprobacionMgd,
                    NumeroResolucionMgd = registro.NumeroResolucionMgd,
                    ResponsableMgd = registro.ResponsableMgd,
                    CargoResponsableMgd = registro.CargoResponsableMgd,
                    CorreoResponsableMgd = registro.CorreoResponsableMgd,
                    TelefonoResponsableMgd = registro.TelefonoResponsableMgd,
                    SistemaPlataformaMgd = registro.SistemaPlataformaMgd,
                    TipoImplantacionMgd = registro.TipoImplantacionMgd,
                    InteroperaSistemasMgd = registro.InteroperaSistemasMgd,
                    ObservacionMgd = registro.ObservacionMgd,
                    RutaPdfMgd = registro.RutaPdfMgd,
                    CheckPrivacidad = registro.CheckPrivacidad,
                    CheckDdjj = registro.CheckDdjj,
                    UsuarioRegistra = registro.UsuarioRegistra,
                    EtapaFormulario = registro.EtapaFormulario,
                    Estado = registro.Estado,
                    CreatedAt = registro.CreatedAt,
                    UpdatedAt = registro.UpdatedAt,
                    RutaPdfNormativa = registro.RutaPdfNormativa
                };

                return Result<Com9ModeloGestionDocumentalResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener Com9 MGD");
                return Result<Com9ModeloGestionDocumentalResponse>.Failure($"Error al obtener Com9 MGD: {ex.Message}");
            }
        }
    }
}
