using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com1LiderGTD.Commands.UpdateCom1LiderGTD;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;
using PCM.Application.Common;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com1LiderGTD;

public class UpdateCom1LiderGTDHandler : IRequestHandler<UpdateCom1LiderGTDCommand, Result<Com1LiderGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom1LiderGTDHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom1LiderGTDHandler(
        PCMDbContext context, 
        ILogger<UpdateCom1LiderGTDHandler> logger,
        ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
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

            // Guardar estado anterior para historial
            string? estadoAnterior = entity.Estado;

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
                entity.FecIniLider = DateTime.SpecifyKind(request.FecIniLider.Value, DateTimeKind.Utc);

            if (request.UrlDocUrl != null)
                entity.UrlDocPcm = request.UrlDocUrl;
            
            if (request.RutaPdfNormativa != null)
                entity.RutaPdfNormativa = request.RutaPdfNormativa;

            if (request.CheckPrivacidad.HasValue)
                entity.CheckPrivacidad = request.CheckPrivacidad.Value;
            
            if (request.CheckDdjj.HasValue)
                entity.CheckDdjj = request.CheckDdjj.Value;

            if (!string.IsNullOrEmpty(request.EstadoPCM))
                entity.EstadoPCM = request.EstadoPCM;
            
            if (request.ObservacionesPCM != null)
                entity.ObservacionesPCM = request.ObservacionesPCM;

            await _context.SaveChangesAsync(cancellationToken);

            // Actualizar también el estado en cumplimiento_normativo para que el dashboard refleje el estado correcto
            if (!string.IsNullOrEmpty(request.Estado))
            {
                var estadoId = MapEstadoToId(request.Estado);
                var cumplimientoExistente = await _context.CumplimientosNormativos
                    .FirstOrDefaultAsync(c => c.EntidadId == entity.EntidadId && c.CompromisoId == entity.CompromisoId, cancellationToken);
                
                if (cumplimientoExistente != null)
                {
                    cumplimientoExistente.EstadoId = estadoId;
                    cumplimientoExistente.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Cumplimiento normativo actualizado para Compromiso {CompromisoId}, Entidad {EntidadId} con EstadoId {EstadoId}", 
                        entity.CompromisoId, entity.EntidadId, estadoId);
                }
                else
                {
                    // Si no existe, crear uno nuevo
                    var nuevoCumplimiento = new Domain.Entities.CumplimientoNormativo
                    {
                        CompromisoId = entity.CompromisoId,
                        EntidadId = entity.EntidadId,
                        EstadoId = estadoId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CumplimientosNormativos.Add(nuevoCumplimiento);
                    await _context.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Nuevo cumplimiento normativo creado para Compromiso {CompromisoId}, Entidad {EntidadId} con EstadoId {EstadoId}", 
                        entity.CompromisoId, entity.EntidadId, estadoId);
                }
            }

            // Registrar en historial si el estado cambió
            if (!string.IsNullOrEmpty(request.Estado) && request.Estado != estadoAnterior)
            {
                string tipoAccion = request.Estado.ToLower() switch
                {
                    "enviado" or "publicado" => "ENVIO",
                    "en_proceso" or "borrador" => "BORRADOR",
                    _ => "CAMBIO_ESTADO"
                };

                await _historialService.RegistrarCambioDesdeFormularioAsync(
                    compromisoId: entity.CompromisoId,
                    entidadId: entity.EntidadId,
                    estadoAnterior: estadoAnterior,
                    estadoNuevo: request.Estado,
                    usuarioId: request.UserId,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com1LiderGTD, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

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
    
    /// <summary>
    /// Convierte el estado string a su ID correspondiente en la tabla estado_cumplimiento
    /// </summary>
    private int MapEstadoToId(string? estado)
    {
        return estado?.ToLower() switch
        {
            "pendiente" => 1,       // PENDIENTE
            "sin_reportar" => 2,    // SIN REPORTAR
            "no_exigible" => 3,     // NO EXIGIBLE
            "en_proceso" => 4,      // EN PROCESO
            "bandeja" => 5,         // BANDEJA (equivale a ENVIADO)
            "enviado" => 5,         // ENVIADO
            "en_revision" => 6,     // EN REVISIÓN
            "observado" => 7,       // OBSERVADO
            "aceptado" => 8,        // ACEPTADO
            _ => 4                  // Por defecto EN PROCESO si no se especifica
        };
    }
}
