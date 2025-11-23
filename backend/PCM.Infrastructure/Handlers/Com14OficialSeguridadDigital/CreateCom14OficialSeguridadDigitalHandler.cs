using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com14OficialSeguridadDigital.Commands.CreateCom14OficialSeguridadDigital;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com14OficialSeguridadDigitalEntity = PCM.Domain.Entities.Com14OficialSeguridadDigital;

namespace PCM.Infrastructure.Handlers.Com14OficialSeguridadDigital;

public class CreateCom14OficialSeguridadDigitalHandler : IRequestHandler<CreateCom14OficialSeguridadDigitalCommand, Result<Com14OficialSeguridadDigitalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom14OficialSeguridadDigitalHandler> _logger;

    public CreateCom14OficialSeguridadDigitalHandler(PCMDbContext context, ILogger<CreateCom14OficialSeguridadDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com14OficialSeguridadDigitalResponse>> Handle(CreateCom14OficialSeguridadDigitalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com14OficialSeguridadDigital para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com14OficialSeguridadDigitalEntity
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
                FechaElaboracion = request.FechaElaboracion,
                NumeroDocumento = request.NumeroDocumento,
                ArchivoDocumento = request.ArchivoDocumento,
                Descripcion = request.Descripcion,
                PoliticasSeguridad = request.PoliticasSeguridad,
                Certificaciones = request.Certificaciones,
                FechaVigencia = request.FechaVigencia,
            };

            _context.Com14OficialSeguridadDigital.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com14OficialSeguridadDigitalResponse
            {
                ComdoscdEntId = entity.ComdoscdEntId,
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
                FechaElaboracion = entity.FechaElaboracion,
                NumeroDocumento = entity.NumeroDocumento,
                ArchivoDocumento = entity.ArchivoDocumento,
                Descripcion = entity.Descripcion,
                PoliticasSeguridad = entity.PoliticasSeguridad,
                Certificaciones = entity.Certificaciones,
                FechaVigencia = entity.FechaVigencia,
            };

            return Result<Com14OficialSeguridadDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com14OficialSeguridadDigital");
            return Result<Com14OficialSeguridadDigitalResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
