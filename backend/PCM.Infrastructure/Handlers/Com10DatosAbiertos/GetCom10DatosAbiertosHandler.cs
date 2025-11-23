using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com10DatosAbiertos.Commands.CreateCom10DatosAbiertos;
using PCM.Application.Features.Com10DatosAbiertos.Queries.GetCom10DatosAbiertos;
using PCM.Infrastructure.Data;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com10DatosAbiertos
{
    public class GetCom10DatosAbiertosHandler : IRequestHandler<GetCom10DatosAbiertosQuery, Result<Com10DatosAbiertosResponse>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<GetCom10DatosAbiertosHandler> _logger;

        public GetCom10DatosAbiertosHandler(PCMDbContext context, ILogger<GetCom10DatosAbiertosHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<Com10DatosAbiertosResponse>> Handle(GetCom10DatosAbiertosQuery request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Buscando Com10 Datos Abiertos para Compromiso {request.CompromisoId} y Entidad {request.EntidadId}");

                var registro = await _context.Com10DatosAbiertos
                    .Where(c => c.CompromisoId == request.CompromisoId && c.EntidadId == request.EntidadId)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);

                if (registro == null)
                {
                    _logger.LogInformation("No se encontró registro Com10 Datos Abiertos");
                    return Result<Com10DatosAbiertosResponse>.Success(null);
                }

                var response = new Com10DatosAbiertosResponse
                {
                    ComdaEntId = registro.ComdaEntId,
                    CompromisoId = registro.CompromisoId,
                    EntidadId = registro.EntidadId,
                    UrlDatosAbiertos = registro.UrlDatosAbiertos,
                    TotalDatasets = registro.TotalDatasets,
                    FechaUltimaActualizacionDa = registro.FechaUltimaActualizacionDa,
                    ResponsableDa = registro.ResponsableDa,
                    CargoResponsableDa = registro.CargoResponsableDa,
                    CorreoResponsableDa = registro.CorreoResponsableDa,
                    TelefonoResponsableDa = registro.TelefonoResponsableDa,
                    NumeroNormaResolucionDa = registro.NumeroNormaResolucionDa,
                    FechaAprobacionDa = registro.FechaAprobacionDa,
                    ObservacionDa = registro.ObservacionDa,
                    RutaPdfDa = registro.RutaPdfDa,
                    CriteriosEvaluados = registro.CriteriosEvaluados,
                    CheckPrivacidad = registro.CheckPrivacidad,
                    CheckDdjj = registro.CheckDdjj,
                    UsuarioRegistra = registro.UsuarioRegistra,
                    EtapaFormulario = registro.EtapaFormulario,
                    Estado = registro.Estado,
                    CreatedAt = registro.CreatedAt,
                    UpdatedAt = registro.UpdatedAt
                };

                return Result<Com10DatosAbiertosResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener Com10 Datos Abiertos");
                return Result<Com10DatosAbiertosResponse>.Failure($"Error al obtener Com10 Datos Abiertos: {ex.Message}");
            }
        }
    }
}
