using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com21OficialGobiernoDatos.Commands.UpdateCom21OficialGobiernoDatos;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com21OficialGobiernoDatos;

public class UpdateCom21OficialGobiernoDatosHandler : IRequestHandler<UpdateCom21OficialGobiernoDatosCommand, Result<Com21OficialGobiernoDatosResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom21OficialGobiernoDatosHandler> _logger;

    public UpdateCom21OficialGobiernoDatosHandler(PCMDbContext context, ILogger<UpdateCom21OficialGobiernoDatosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com21OficialGobiernoDatosResponse>> Handle(UpdateCom21OficialGobiernoDatosCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando registro Com21OficialGobiernoDatos {Id}", request.ComdogdEntId);

            var entity = await _context.Com21OficialGobiernoDatos
                .FirstOrDefaultAsync(x => x.ComdogdEntId == request.ComdogdEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com21OficialGobiernoDatosResponse>.Failure($"Registro con ID {request.ComdogdEntId} no encontrado");
            }

            // Actualizar campos comunes
            if (request.CompromisoId.HasValue) entity.CompromisoId = request.CompromisoId.Value;
            if (request.EntidadId.HasValue) entity.EntidadId = request.EntidadId.Value;
            if (!string.IsNullOrEmpty(request.EtapaFormulario)) entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado)) entity.Estado = request.Estado;
            if (request.CheckPrivacidad.HasValue) entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            if (request.CheckDdjj.HasValue) entity.CheckDdjj = request.CheckDdjj.Value;
            if (request.UsuarioRegistra.HasValue) entity.UsuarioRegistra = request.UsuarioRegistra.Value;

            // Actualizar campos específicos
            if (request.FechaElaboracion.HasValue) entity.FechaElaboracion = request.FechaElaboracion;
            if (!string.IsNullOrEmpty(request.NumeroDocumento)) entity.NumeroDocumento = request.NumeroDocumento;
            if (!string.IsNullOrEmpty(request.ArchivoDocumento)) entity.ArchivoDocumento = request.ArchivoDocumento;
            if (!string.IsNullOrEmpty(request.Descripcion)) entity.Descripcion = request.Descripcion;
            if (!string.IsNullOrEmpty(request.Procedimientos)) entity.Procedimientos = request.Procedimientos;
            if (!string.IsNullOrEmpty(request.Responsables)) entity.Responsables = request.Responsables;
            if (request.FechaVigencia.HasValue) entity.FechaVigencia = request.FechaVigencia;

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
            _logger.LogError(ex, "Error al actualizar Com21OficialGobiernoDatos");
            return Result<Com21OficialGobiernoDatosResponse>.Failure($"Error al actualizar registro: {ex.Message}");
        }
    }
}
