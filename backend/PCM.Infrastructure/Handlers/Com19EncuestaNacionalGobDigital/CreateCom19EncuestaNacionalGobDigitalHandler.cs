using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com19EncuestaNacionalGobDigital.Commands.CreateCom19EncuestaNacionalGobDigital;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com19EncuestaNacionalGobDigitalEntity = PCM.Domain.Entities.Com19EncuestaNacionalGobDigital;

namespace PCM.Infrastructure.Handlers.Com19EncuestaNacionalGobDigital;

public class CreateCom19EncuestaNacionalGobDigitalHandler : IRequestHandler<CreateCom19EncuestaNacionalGobDigitalCommand, Result<Com19EncuestaNacionalGobDigitalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom19EncuestaNacionalGobDigitalHandler> _logger;

    public CreateCom19EncuestaNacionalGobDigitalHandler(PCMDbContext context, ILogger<CreateCom19EncuestaNacionalGobDigitalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com19EncuestaNacionalGobDigitalResponse>> Handle(CreateCom19EncuestaNacionalGobDigitalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com19EncuestaNacionalGobDigital para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com19EncuestaNacionalGobDigitalEntity
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
                FechaConexion = request.FechaConexion,
                TipoConexion = request.TipoConexion,
                AnchoBanda = request.AnchoBanda,
                Proveedor = request.Proveedor,
                ArchivoContrato = request.ArchivoContrato,
                Descripcion = request.Descripcion,
            };

            _context.Com19EncuestaNacionalGobDigital.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com19EncuestaNacionalGobDigitalResponse
            {
                ComrenadEntId = entity.ComrenadEntId,
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
                FechaConexion = entity.FechaConexion,
                TipoConexion = entity.TipoConexion,
                AnchoBanda = entity.AnchoBanda,
                Proveedor = entity.Proveedor,
                ArchivoContrato = entity.ArchivoContrato,
                Descripcion = entity.Descripcion,
            };

            return Result<Com19EncuestaNacionalGobDigitalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com19EncuestaNacionalGobDigital");
            return Result<Com19EncuestaNacionalGobDigitalResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
