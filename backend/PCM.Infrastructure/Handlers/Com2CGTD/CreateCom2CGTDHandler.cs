using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com2CGTD.Commands.CreateCom2CGTD;
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

            // Guardar miembros del comité si existen
            var miembrosResponse = new List<ComiteMiembroDto>();
            if (request.Miembros != null && request.Miembros.Any())
            {
                foreach (var miembroDto in request.Miembros)
                {
                    var miembro = new ComiteMiembroEntity
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
}
