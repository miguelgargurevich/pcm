using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com10DatosAbiertos.Commands.CreateCom10DatosAbiertos;
using Com10Entity = PCM.Domain.Entities.Com10DatosAbiertos;
using PCM.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com10DatosAbiertos
{
    public class CreateCom10DatosAbiertosHandler : IRequestHandler<CreateCom10DatosAbiertosCommand, Result<Com10DatosAbiertosResponse>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<CreateCom10DatosAbiertosHandler> _logger;

        public CreateCom10DatosAbiertosHandler(PCMDbContext context, ILogger<CreateCom10DatosAbiertosHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<Com10DatosAbiertosResponse>> Handle(CreateCom10DatosAbiertosCommand request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Creando nuevo registro Com10 Datos Abiertos para Entidad {request.EntidadId}");
                _logger.LogInformation($"Request EstadoPCM: '{request.EstadoPCM}', ObservacionesPCM: '{request.ObservacionesPCM}'");

                // Asegurar valores por defecto para campos requeridos
                var estadoPCM = string.IsNullOrWhiteSpace(request.EstadoPCM) ? "En Proceso" : request.EstadoPCM;
                var observacionesPCM = string.IsNullOrWhiteSpace(request.ObservacionesPCM) ? "" : request.ObservacionesPCM;
                
                _logger.LogInformation($"Valores finales EstadoPCM: '{estadoPCM}', ObservacionesPCM: '{observacionesPCM}'");

                var nuevoRegistro = new Com10Entity
                {
                    CompromisoId = request.CompromisoId,
                    EntidadId = request.EntidadId,
                    EstadoPCM = estadoPCM,
                    ObservacionesPCM = observacionesPCM,
                    UrlDatosAbiertos = request.UrlDatosAbiertos,
                    TotalDatasets = request.TotalDatasets,
                    FechaUltimaActualizacionDa = request.FechaUltimaActualizacionDa.HasValue 
                        ? DateTime.SpecifyKind(request.FechaUltimaActualizacionDa.Value, DateTimeKind.Utc) 
                        : null,
                    ResponsableDa = request.ResponsableDa,
                    CargoResponsableDa = request.CargoResponsableDa,
                    CorreoResponsableDa = request.CorreoResponsableDa,
                    TelefonoResponsableDa = request.TelefonoResponsableDa,
                    NumeroNormaResolucionDa = request.NumeroNormaResolucionDa,
                    FechaAprobacionDa = request.FechaAprobacionDa.HasValue 
                        ? DateTime.SpecifyKind(request.FechaAprobacionDa.Value, DateTimeKind.Utc) 
                        : null,
                    ObservacionDa = request.ObservacionDa,
                    RutaPdfDa = request.RutaPdfDa,
                    CheckPrivacidad = request.CheckPrivacidad,
                    CheckDdjj = request.CheckDdjj,
                    UsuarioRegistra = request.UsuarioRegistra,
                    EtapaFormulario = request.EtapaFormulario ?? "",
                    Estado = request.Estado,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Com10DatosAbiertos.Add(nuevoRegistro);
                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation($"Registro Com10 Datos Abiertos creado exitosamente con ID {nuevoRegistro.ComdaEntId}");

                var response = new Com10DatosAbiertosResponse
                {
                    ComdaEntId = nuevoRegistro.ComdaEntId,
                    CompromisoId = nuevoRegistro.CompromisoId,
                    EntidadId = nuevoRegistro.EntidadId,
                    EstadoPCM = estadoPCM,
                    ObservacionesPCM = observacionesPCM,
                    UrlDatosAbiertos = nuevoRegistro.UrlDatosAbiertos,
                    TotalDatasets = nuevoRegistro.TotalDatasets,
                    FechaUltimaActualizacionDa = nuevoRegistro.FechaUltimaActualizacionDa,
                    ResponsableDa = nuevoRegistro.ResponsableDa,
                    CargoResponsableDa = nuevoRegistro.CargoResponsableDa,
                    CorreoResponsableDa = nuevoRegistro.CorreoResponsableDa,
                    TelefonoResponsableDa = nuevoRegistro.TelefonoResponsableDa,
                    NumeroNormaResolucionDa = nuevoRegistro.NumeroNormaResolucionDa,
                    FechaAprobacionDa = nuevoRegistro.FechaAprobacionDa,
                    ObservacionDa = nuevoRegistro.ObservacionDa,
                    RutaPdfDa = nuevoRegistro.RutaPdfDa,
                    CheckPrivacidad = nuevoRegistro.CheckPrivacidad,
                    CheckDdjj = nuevoRegistro.CheckDdjj,
                    UsuarioRegistra = nuevoRegistro.UsuarioRegistra,
                    EtapaFormulario = nuevoRegistro.EtapaFormulario,
                    Estado = nuevoRegistro.Estado,
                    CreatedAt = nuevoRegistro.CreatedAt,
                    UpdatedAt = nuevoRegistro.UpdatedAt
                };

                return Result<Com10DatosAbiertosResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear Com10 Datos Abiertos");
                return Result<Com10DatosAbiertosResponse>.Failure($"Error al crear Com10 Datos Abiertos: {ex.Message}");
            }
        }
    }
}
