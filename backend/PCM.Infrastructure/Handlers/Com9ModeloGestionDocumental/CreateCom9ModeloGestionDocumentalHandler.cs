using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.CreateCom9ModeloGestionDocumental;
using Com9Entity = PCM.Domain.Entities.Com9ModeloGestionDocumental;
using PCM.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.Com9ModeloGestionDocumental
{
    public class CreateCom9ModeloGestionDocumentalHandler : IRequestHandler<CreateCom9ModeloGestionDocumentalCommand, Result<Com9ModeloGestionDocumentalResponse>>
    {
        private readonly PCMDbContext _context;
        private readonly ILogger<CreateCom9ModeloGestionDocumentalHandler> _logger;

        public CreateCom9ModeloGestionDocumentalHandler(PCMDbContext context, ILogger<CreateCom9ModeloGestionDocumentalHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<Com9ModeloGestionDocumentalResponse>> Handle(CreateCom9ModeloGestionDocumentalCommand request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Creando nuevo registro Com9 MGD para Entidad {request.EntidadId}");

                var nuevoRegistro = new Com9Entity
                {
                    CompromisoId = request.CompromisoId,
                    EntidadId = request.EntidadId,
                    FechaAprobacionMgd = request.FechaAprobacionMgd.HasValue 
                        ? DateTime.SpecifyKind(request.FechaAprobacionMgd.Value, DateTimeKind.Utc) 
                        : null,
                    NumeroResolucionMgd = request.NumeroResolucionMgd,
                    ResponsableMgd = request.ResponsableMgd,
                    CargoResponsableMgd = request.CargoResponsableMgd,
                    CorreoResponsableMgd = request.CorreoResponsableMgd,
                    TelefonoResponsableMgd = request.TelefonoResponsableMgd,
                    SistemaPlataformaMgd = request.SistemaPlataformaMgd,
                    TipoImplantacionMgd = request.TipoImplantacionMgd,
                    InteroperaSistemasMgd = request.InteroperaSistemasMgd,
                    ObservacionMgd = request.ObservacionMgd,
                    RutaPdfMgd = request.RutaPdfMgd,
                    CheckPrivacidad = request.CheckPrivacidad,
                    CheckDdjj = request.CheckDdjj,
                    UsuarioRegistra = request.UsuarioRegistra,
                    EtapaFormulario = request.EtapaFormulario,
                    Estado = "bandeja",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Com9ModeloGestionDocumental.Add(nuevoRegistro);
                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation($"Registro Com9 MGD creado exitosamente con ID {nuevoRegistro.CommgdEntId}");

                var response = new Com9ModeloGestionDocumentalResponse
                {
                    CommgdEntId = nuevoRegistro.CommgdEntId,
                    CompromisoId = nuevoRegistro.CompromisoId,
                    EntidadId = nuevoRegistro.EntidadId,
                    FechaAprobacionMgd = nuevoRegistro.FechaAprobacionMgd,
                    NumeroResolucionMgd = nuevoRegistro.NumeroResolucionMgd,
                    ResponsableMgd = nuevoRegistro.ResponsableMgd,
                    CargoResponsableMgd = nuevoRegistro.CargoResponsableMgd,
                    CorreoResponsableMgd = nuevoRegistro.CorreoResponsableMgd,
                    TelefonoResponsableMgd = nuevoRegistro.TelefonoResponsableMgd,
                    SistemaPlataformaMgd = nuevoRegistro.SistemaPlataformaMgd,
                    TipoImplantacionMgd = nuevoRegistro.TipoImplantacionMgd,
                    InteroperaSistemasMgd = nuevoRegistro.InteroperaSistemasMgd,
                    ObservacionMgd = nuevoRegistro.ObservacionMgd,
                    RutaPdfMgd = nuevoRegistro.RutaPdfMgd,
                    CheckPrivacidad = nuevoRegistro.CheckPrivacidad,
                    CheckDdjj = nuevoRegistro.CheckDdjj,
                    UsuarioRegistra = nuevoRegistro.UsuarioRegistra,
                    EtapaFormulario = nuevoRegistro.EtapaFormulario,
                    Estado = nuevoRegistro.Estado,
                    CreatedAt = nuevoRegistro.CreatedAt,
                    UpdatedAt = nuevoRegistro.UpdatedAt
                };

                return Result<Com9ModeloGestionDocumentalResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear Com9 MGD");
                return Result<Com9ModeloGestionDocumentalResponse>.Failure($"Error al crear Com9 MGD: {ex.Message}");
            }
        }
    }
}
