using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com2CGTD.Commands.CreateCom2CGTD;
using PCM.Application.Features.Com2CGTD.DTOs;
using PCM.Infrastructure.Data;
using Com2CGTDEntity = PCM.Domain.Entities.Com2CGTD;
using ComiteMiembroEntity = PCM.Domain.Entities.ComiteMiembro;

namespace PCM.Infrastructure.Handlers.Com2CGTD;

public class CreateCom2CGTDHandler : IRequestHandler<CreateCom2CGTDCommand, Result<Com2CGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom2CGTDHandler> _logger;

    public CreateCom2CGTDHandler(PCMDbContext context, ILogger<CreateCom2CGTDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com2CGTDResponse>> Handle(CreateCom2CGTDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Crear registro principal
            var entity = new Com2CGTDEntity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario ?? string.Empty,
                Estado = request.Estado ?? string.Empty,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                EstadoPcm = request.EstadoPcm ?? string.Empty,
                ObservacionesPcm = request.ObservacionesPcm ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                UsuarioRegistra = request.UsuarioRegistra,
                Activo = true,
                UrlDocPcm = request.UrlDocUrl ?? string.Empty,
            };

            _context.Com2CGTD.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
            
            // Crear o actualizar el registro en cumplimiento_normativo para que el dashboard refleje el estado correcto
            var estadoId = MapEstadoToId(request.Estado);
            var cumplimientoExistente = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.EntidadId == request.EntidadId && c.CompromisoId == request.CompromisoId, cancellationToken);
            
            if (cumplimientoExistente != null)
            {
                cumplimientoExistente.EstadoId = estadoId;
                cumplimientoExistente.UpdatedAt = DateTime.UtcNow;
                _logger.LogInformation("Actualizando cumplimiento normativo existente para Compromiso {CompromisoId}, Entidad {EntidadId} con EstadoId {EstadoId}", 
                    request.CompromisoId, request.EntidadId, estadoId);
            }
            else
            {
                var nuevoCumplimiento = new Domain.Entities.CumplimientoNormativo
                {
                    CompromisoId = request.CompromisoId,
                    EntidadId = request.EntidadId,
                    EstadoId = estadoId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.CumplimientosNormativos.Add(nuevoCumplimiento);
                _logger.LogInformation("Creando nuevo cumplimiento normativo para Compromiso {CompromisoId}, Entidad {EntidadId} con EstadoId {EstadoId}", 
                    request.CompromisoId, request.EntidadId, estadoId);
            }
            
            await _context.SaveChangesAsync(cancellationToken);

            // Guardar miembros del comité si existen
            var miembrosResponse = new List<ComiteMiembroDto>();
            if (request.Miembros != null && request.Miembros.Any())
            {
                int numMiembro = 1;
                foreach (var miembroDto in request.Miembros)
                {
                    var miembro = new ComiteMiembroEntity
                    {
                        ComEntidadId = entity.ComcgtdEntId,
                        NumMiembro = numMiembro++,
                        Dni = miembroDto.Dni ?? string.Empty,
                        Nombre = miembroDto.Nombre ?? string.Empty,
                        ApellidoPaterno = miembroDto.ApellidoPaterno ?? string.Empty,
                        ApellidoMaterno = miembroDto.ApellidoMaterno ?? string.Empty,
                        Cargo = miembroDto.Cargo ?? string.Empty,
                        Email = miembroDto.Email ?? string.Empty,
                        Telefono = miembroDto.Telefono ?? string.Empty,
                        Rol = miembroDto.Rol ?? string.Empty,
                        FechaInicio = miembroDto.FechaInicio ?? DateTime.UtcNow,
                        Activo = true
                    };

                    _context.ComiteMiembros.Add(miembro);
                    await _context.SaveChangesAsync(cancellationToken);

                    miembrosResponse.Add(new ComiteMiembroDto
                    {
                        MiembroId = miembro.MiembroId,
                        Dni = miembro.Dni,
                        Nombre = miembro.Nombre,
                        ApellidoPaterno = miembro.ApellidoPaterno,
                        ApellidoMaterno = miembro.ApellidoMaterno,
                        Cargo = miembro.Cargo,
                        Email = miembro.Email,
                        Telefono = miembro.Telefono,
                        Rol = miembro.Rol,
                        FechaInicio = miembro.FechaInicio,
                        Activo = miembro.Activo
                    });
                }
            }

            var response = new Com2CGTDResponse
            {
                ComcgtdEntId = entity.ComcgtdEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPcm = entity.EstadoPcm,
                ObservacionesPcm = entity.ObservacionesPcm,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                UsuarioRegistra = entity.UsuarioRegistra,
                Activo = entity.Activo,
                UrlDocPcm = entity.UrlDocPcm,
                Miembros = miembrosResponse
            };

            _logger.LogInformation("Com2CGTD creado exitosamente: {Id}", entity.ComcgtdEntId);
            return Result<Com2CGTDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com2CGTD");
            return Result<Com2CGTDResponse>.Failure($"Error al crear el registro: {ex.Message}");
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
