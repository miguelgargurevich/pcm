using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com2CGTD.Commands.UpdateCom2CGTD;
using PCM.Infrastructure.Data;
using ComiteMiembroEntity = PCM.Domain.Entities.ComiteMiembro;

namespace PCM.Infrastructure.Handlers.Com2CGTD;

public class UpdateCom2CGTDHandler : IRequestHandler<UpdateCom2CGTDCommand, Result<Com2CGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom2CGTDHandler> _logger;

    public UpdateCom2CGTDHandler(PCMDbContext context, ILogger<UpdateCom2CGTDHandler> logger)
    {
        _context = context;
        _logger = logger;
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

            // Actualizar campos
            entity.EtapaFormulario = request.EtapaFormulario;
            entity.Estado = request.Estado;
            entity.CheckPrivacidad = request.CheckPrivacidad;
            entity.CheckDdjj = request.CheckDdjj;
            entity.EstadoPcm = request.EstadoPcm;
            entity.ObservacionesPcm = request.ObservacionesPcm;
            entity.UrlDocPcm = request.UrlDocUrl;

            await _context.SaveChangesAsync(cancellationToken);

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
                foreach (var miembroDto in request.Miembros)
                {
                    if (miembroDto.MiembroId.HasValue && miembroDto.MiembroId > 0)
                    {
                        // Actualizar existente
                        var miembroExistente = miembrosExistentes
                            .FirstOrDefault(m => m.MiembroId == miembroDto.MiembroId.Value);
                        
                        if (miembroExistente != null)
                        {
                            miembroExistente.Dni = miembroDto.Dni;
                            miembroExistente.Nombre = miembroDto.Nombre;
                            miembroExistente.ApellidoPaterno = miembroDto.ApellidoPaterno;
                            miembroExistente.ApellidoMaterno = miembroDto.ApellidoMaterno;
                            miembroExistente.Cargo = miembroDto.Cargo;
                            miembroExistente.Email = miembroDto.Email;
                            miembroExistente.Telefono = miembroDto.Telefono;
                            miembroExistente.Rol = miembroDto.Rol;
                            miembroExistente.FechaInicio = miembroDto.FechaInicio;
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
                        // Crear nuevo
                        var nuevoMiembro = new ComiteMiembroEntity
                        {
                            ComEntidadId = entity.ComcgtdEntId,
                            Dni = miembroDto.Dni,
                            Nombre = miembroDto.Nombre,
                            ApellidoPaterno = miembroDto.ApellidoPaterno,
                            ApellidoMaterno = miembroDto.ApellidoMaterno,
                            Cargo = miembroDto.Cargo,
                            Email = miembroDto.Email,
                            Telefono = miembroDto.Telefono,
                            Rol = miembroDto.Rol,
                            FechaInicio = miembroDto.FechaInicio ?? DateTime.UtcNow,
                            Activo = true,
                            CreatedAt = DateTime.UtcNow
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
