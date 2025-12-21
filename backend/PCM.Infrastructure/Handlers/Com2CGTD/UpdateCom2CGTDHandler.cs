using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com2CGTD.Commands.UpdateCom2CGTD;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;
using ComiteMiembroEntity = PCM.Domain.Entities.ComiteMiembro;

namespace PCM.Infrastructure.Handlers.Com2CGTD;

public class UpdateCom2CGTDHandler : IRequestHandler<UpdateCom2CGTDCommand, Result<Com2CGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom2CGTDHandler> _logger;
    private readonly ICumplimientoHistorialService _historialService;

    public UpdateCom2CGTDHandler(
        PCMDbContext context, 
        ILogger<UpdateCom2CGTDHandler> logger,
        ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _historialService = historialService;
    }

    public async Task<Result<Com2CGTDResponse>> Handle(UpdateCom2CGTDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await _context.Com2CGTD
                .FirstOrDefaultAsync(x => x.ComcgtdEntId == request.ComcgtdEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com2CGTDResponse>.Failure("Registro no encontrado");
            }

            // Guardar estado anterior para el historial
            string? estadoAnterior = entity.Estado;

            // Actualizar campos - solo si el valor no está vacío
            if (!string.IsNullOrEmpty(request.EtapaFormulario))
                entity.EtapaFormulario = request.EtapaFormulario;
            if (!string.IsNullOrEmpty(request.Estado))
                entity.Estado = request.Estado;
            entity.CheckPrivacidad = request.CheckPrivacidad;
            entity.CheckDdjj = request.CheckDdjj;
            entity.EstadoPcm = request.EstadoPcm;
            entity.ObservacionesPcm = request.ObservacionesPcm;
            entity.UrlDocPcm = request.UrlDocUrl;
            if (request.RutaPdfNormativa != null)
                entity.RutaPdfNormativa = request.RutaPdfNormativa;

            await _context.SaveChangesAsync(cancellationToken);

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
                    usuarioId: Guid.Empty,
                    observacion: null,
                    tipoAccion: tipoAccion);

                _logger.LogInformation("Historial registrado para Com2CGTD, entidad {EntidadId}, acción: {TipoAccion}", 
                    entity.EntidadId, tipoAccion);
            }

            // Gestionar miembros del comité
            var miembrosResponse = new List<ComiteMiembroDto>();
            if (request.Miembros != null)
            {
                // Obtener miembros existentes
                var miembrosExistentes = await _context.ComiteMiembros
                    .Where(m => m.ComEntidadId == entity.ComcgtdEntId)
                    .ToListAsync(cancellationToken);

                // Marcar todos como inactivos primero
                foreach (var miembroExistente in miembrosExistentes)
                {
                    miembroExistente.Activo = false;
                }

                // Agregar o actualizar miembros
                int maxNumMiembro = miembrosExistentes.Any() 
                    ? (int)miembrosExistentes.Max(m => m.NumMiembro) 
                    : 0;

                foreach (var miembroDto in request.Miembros)
                {
                    if (miembroDto.MiembroId.HasValue && miembroDto.MiembroId > 0)
                    {
                        // Actualizar existente
                        var miembroExistente = miembrosExistentes
                            .FirstOrDefault(m => m.MiembroId == miembroDto.MiembroId.Value);
                        
                        if (miembroExistente != null)
                        {
                            miembroExistente.Dni = miembroDto.Dni ?? string.Empty;
                            miembroExistente.Nombre = miembroDto.Nombre ?? string.Empty;
                            miembroExistente.ApellidoPaterno = miembroDto.ApellidoPaterno ?? string.Empty;
                            miembroExistente.ApellidoMaterno = miembroDto.ApellidoMaterno ?? string.Empty;
                            miembroExistente.Cargo = miembroDto.Cargo ?? string.Empty;
                            miembroExistente.Email = miembroDto.Email ?? string.Empty;
                            miembroExistente.Telefono = miembroDto.Telefono ?? string.Empty;
                            miembroExistente.Rol = miembroDto.Rol ?? string.Empty;
                            miembroExistente.FechaInicio = miembroDto.FechaInicio ?? DateTime.UtcNow;
                            miembroExistente.Activo = true;

                            miembrosResponse.Add(new ComiteMiembroDto
                            {
                                MiembroId = miembroExistente.MiembroId,
                                Dni = miembroExistente.Dni,
                                Nombre = miembroExistente.Nombre,
                                ApellidoPaterno = miembroExistente.ApellidoPaterno,
                                ApellidoMaterno = miembroExistente.ApellidoMaterno,
                                Cargo = miembroExistente.Cargo,
                                Email = miembroExistente.Email,
                                Telefono = miembroExistente.Telefono,
                                Rol = miembroExistente.Rol,
                                FechaInicio = miembroExistente.FechaInicio,
                                Activo = miembroExistente.Activo
                            });
                        }
                    }
                    else
                    {
                        // Incrementar número de miembro
                        maxNumMiembro++;

                        // Crear nuevo
                        var nuevoMiembro = new ComiteMiembroEntity
                        {
                            ComEntidadId = entity.ComcgtdEntId,
                            NumMiembro = maxNumMiembro,
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

                        _context.ComiteMiembros.Add(nuevoMiembro);
                        await _context.SaveChangesAsync(cancellationToken);

                        miembrosResponse.Add(new ComiteMiembroDto
                        {
                            MiembroId = nuevoMiembro.MiembroId,
                            Dni = nuevoMiembro.Dni,
                            Nombre = nuevoMiembro.Nombre,
                            ApellidoPaterno = nuevoMiembro.ApellidoPaterno,
                            ApellidoMaterno = nuevoMiembro.ApellidoMaterno,
                            Cargo = nuevoMiembro.Cargo,
                            Email = nuevoMiembro.Email,
                            Telefono = nuevoMiembro.Telefono,
                            Rol = nuevoMiembro.Rol,
                            FechaInicio = nuevoMiembro.FechaInicio,
                            Activo = nuevoMiembro.Activo
                        });
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
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

            _logger.LogInformation("Com2CGTD actualizado exitosamente: {Id}", entity.ComcgtdEntId);
            return Result<Com2CGTDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com2CGTD");
            return Result<Com2CGTDResponse>.Failure($"Error al actualizar el registro: {ex.Message}");
        }
    }
}
