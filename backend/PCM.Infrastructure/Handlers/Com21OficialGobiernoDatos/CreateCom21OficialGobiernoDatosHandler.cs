using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com21OficialGobiernoDatos.Commands.CreateCom21OficialGobiernoDatos;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com21OficialGobiernoDatosEntity = PCM.Domain.Entities.Com21OficialGobiernoDatos;

namespace PCM.Infrastructure.Handlers.Com21OficialGobiernoDatos;

public class CreateCom21OficialGobiernoDatosHandler : IRequestHandler<CreateCom21OficialGobiernoDatosCommand, Result<Com21OficialGobiernoDatosResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom21OficialGobiernoDatosHandler> _logger;

    public CreateCom21OficialGobiernoDatosHandler(PCMDbContext context, ILogger<CreateCom21OficialGobiernoDatosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com21OficialGobiernoDatosResponse>> Handle(CreateCom21OficialGobiernoDatosCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com21OficialGobiernoDatos para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com21OficialGobiernoDatosEntity
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
                FechaElaboracion = request.FechaElaboracion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaElaboracion.Value, DateTimeKind.Utc) 
                    : null,
                NumeroDocumento = request.NumeroDocumento,
                ArchivoDocumento = request.ArchivoDocumento,
                Descripcion = request.Descripcion,
                Procedimientos = request.Procedimientos,
                Responsables = request.Responsables,
                FechaVigencia = request.FechaVigencia.HasValue 
                    ? DateTime.SpecifyKind(request.FechaVigencia.Value, DateTimeKind.Utc) 
                    : null,
            };

            _context.Com21OficialGobiernoDatos.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com21OficialGobiernoDatosResponse
            {
                ComdogdEntId = entity.ComdogdEntId,
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
                Procedimientos = entity.Procedimientos,
                Responsables = entity.Responsables,
                FechaVigencia = entity.FechaVigencia,
            };

            return Result<Com21OficialGobiernoDatosResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com21OficialGobiernoDatos");
            return Result<Com21OficialGobiernoDatosResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
