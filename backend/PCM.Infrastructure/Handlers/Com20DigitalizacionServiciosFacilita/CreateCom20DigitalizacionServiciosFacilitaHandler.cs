using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Commands.CreateCom20DigitalizacionServiciosFacilita;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com20DigitalizacionServiciosFacilitaEntity = PCM.Domain.Entities.Com20DigitalizacionServiciosFacilita;

namespace PCM.Infrastructure.Handlers.Com20DigitalizacionServiciosFacilita;

public class CreateCom20DigitalizacionServiciosFacilitaHandler : IRequestHandler<CreateCom20DigitalizacionServiciosFacilitaCommand, Result<Com20DigitalizacionServiciosFacilitaResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom20DigitalizacionServiciosFacilitaHandler> _logger;

    public CreateCom20DigitalizacionServiciosFacilitaHandler(PCMDbContext context, ILogger<CreateCom20DigitalizacionServiciosFacilitaHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com20DigitalizacionServiciosFacilitaResponse>> Handle(CreateCom20DigitalizacionServiciosFacilitaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com20DigitalizacionServiciosFacilita para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com20DigitalizacionServiciosFacilitaEntity
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
                SistemasDocumentados = request.SistemasDocumentados,
                SistemasTotal = request.SistemasTotal,
                PorcentajeDocumentacion = request.PorcentajeDocumentacion,
                ArchivoRepositorio = request.ArchivoRepositorio,
                Descripcion = request.Descripcion,
            };

            _context.Com20DigitalizacionServiciosFacilita.Add(entity);
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
                SistemasDocumentados = entity.SistemasDocumentados,
                SistemasTotal = entity.SistemasTotal,
                PorcentajeDocumentacion = entity.PorcentajeDocumentacion,
                ArchivoRepositorio = entity.ArchivoRepositorio,
                Descripcion = entity.Descripcion,
            };

            return Result<Com20DigitalizacionServiciosFacilitaResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com20DigitalizacionServiciosFacilita");
            return Result<Com20DigitalizacionServiciosFacilitaResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
