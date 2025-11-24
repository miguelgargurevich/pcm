using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com1LiderGTD.Commands.UpdateCom1LiderGTD;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com1LiderGTD;

public class UpdateCom1LiderGTDHandler : IRequestHandler<UpdateCom1LiderGTDCommand, Result<Com1LiderGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom1LiderGTDHandler> _logger;

    public UpdateCom1LiderGTDHandler(PCMDbContext context, ILogger<UpdateCom1LiderGTDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com1LiderGTDResponse>> Handle(UpdateCom1LiderGTDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Actualizando Com1LiderGTD con ID {Id}", request.ComlgtdEntId);

            var entity = await _context.Com1LiderGTD
                .FirstOrDefaultAsync(x => x.ComlgtdEntId == request.ComlgtdEntId && x.Activo, cancellationToken);

            if (entity == null)
            {
                _logger.LogWarning("Com1LiderGTD con ID {Id} no encontrado", request.ComlgtdEntId);
                return Result<Com1LiderGTDResponse>.Failure("Registro no encontrado");
            }

            // Actualizar solo los campos que vienen en el request
            if (!string.IsNullOrEmpty(request.EtapaFormulario))
                entity.EtapaFormulario = request.EtapaFormulario;
            
            if (!string.IsNullOrEmpty(request.Estado))
                entity.Estado = request.Estado;

            if (request.DniLider != null)
                entity.DniLider = request.DniLider;
            
            if (request.NombreLider != null)
                entity.NombreLider = request.NombreLider;
            
            if (request.ApePatLider != null)
                entity.ApePatLider = request.ApePatLider;
            
            if (request.ApeMatLider != null)
                entity.ApeMatLider = request.ApeMatLider;
            
            if (request.EmailLider != null)
                entity.EmailLider = request.EmailLider;
            
            if (request.TelefonoLider != null)
                entity.TelefonoLider = request.TelefonoLider;
            
            if (request.RolLider != null)
                entity.RolLider = request.RolLider;
            
            if (request.CargoLider != null)
                entity.CargoLider = request.CargoLider;
            
            if (request.FecIniLider.HasValue)
                entity.FecIniLider = request.FecIniLider.Value;

            if (request.UrlDocUrl != null)
                entity.UrlDocPcm = request.UrlDocUrl;
            

            if (request.CheckPrivacidad.HasValue)
                entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            
            if (request.CheckDdjj.HasValue)
                entity.CheckDdjj = request.CheckDdjj.Value;

            if (!string.IsNullOrEmpty(request.EstadoPCM))
                entity.EstadoPCM = request.EstadoPCM;
            
            if (request.ObservacionesPCM != null)
                entity.ObservacionesPCM = request.ObservacionesPCM;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Com1LiderGTD actualizado exitosamente");

            // Devolver el objeto completo actualizado
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
                UrlDocPcm = entity.UrlDocPcm,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                UsuarioRegistra = entity.UsuarioRegistra,
                Activo = entity.Activo
            };

            return Result<Com1LiderGTDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com1LiderGTD");
            return Result<Com1LiderGTDResponse>.Failure($"Error al actualizar el registro: {ex.Message}");
        }
    }
}
