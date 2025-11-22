using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com1Entity = PCM.Domain.Entities.Com1LiderGTD;

namespace PCM.Infrastructure.Handlers.Com1LiderGTD;

public class CreateCom1LiderGTDHandler : IRequestHandler<CreateCom1LiderGTDCommand, Result<Com1LiderGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom1LiderGTDHandler> _logger;

    public CreateCom1LiderGTDHandler(PCMDbContext context, ILogger<CreateCom1LiderGTDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com1LiderGTDResponse>> Handle(CreateCom1LiderGTDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com1LiderGTD para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com1Entity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario,
                Estado = request.Estado,
                DniLider = request.DniLider,
                NombreLider = request.NombreLider,
                ApePatLider = request.ApePatLider,
                ApeMatLider = request.ApeMatLider,
                EmailLider = request.EmailLider,
                TelefonoLider = request.TelefonoLider,
                RolLider = request.RolLider,
                CargoLider = request.CargoLider,
                FecIniLider = request.FecIniLider ?? DateTime.UtcNow,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                EstadoPCM = "en_revision",
                CreatedAt = DateTime.UtcNow,
                FecRegistro = request.FecIniLider ?? DateTime.UtcNow,
                UsuarioRegistra = request.UsuarioRegistra ?? Guid.Empty,
                Activo = true
            };

            _context.Com1LiderGTD.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Registro Com1LiderGTD creado exitosamente con ID {Id}", entity.ComlgtdEntId);

            var response = new Com1LiderGTDResponse
            {
                ComlgtdEntId = entity.ComlgtdEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                DniLider = entity.DniLider,
                NombreLider = entity.NombreLider,
                ApePatLider = entity.ApePatLider,
                ApeMatLider = entity.ApeMatLider,
                EmailLider = entity.EmailLider,
                TelefonoLider = entity.TelefonoLider,
                RolLider = entity.RolLider,
                CargoLider = entity.CargoLider,
                FecIniLider = entity.FecIniLider,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                UsuarioRegistra = entity.UsuarioRegistra,
                Activo = entity.Activo
            };

            return Result<Com1LiderGTDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com1LiderGTD");
            return Result<Com1LiderGTDResponse>.Failure($"Error al crear el registro: {ex.Message}");
        }
    }
}
