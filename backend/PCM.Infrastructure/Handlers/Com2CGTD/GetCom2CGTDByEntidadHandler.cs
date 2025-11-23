using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com2CGTD.Queries.GetCom2CGTDByEntidad;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com2CGTD;

public class GetCom2CGTDByEntidadHandler : IRequestHandler<GetCom2CGTDByEntidadQuery, Result<Com2CGTDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom2CGTDByEntidadHandler> _logger;

    public GetCom2CGTDByEntidadHandler(PCMDbContext context, ILogger<GetCom2CGTDByEntidadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com2CGTDResponse>> Handle(GetCom2CGTDByEntidadQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await _context.Com2CGTD
                .Where(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId && x.Activo)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
            {
                return Result<Com2CGTDResponse>.Failure("No se encontró registro para esta entidad");
            }

            // Obtener miembros del comité
            var miembros = await _context.ComiteMiembros
                .Where(m => m.ComEntidadId == entity.ComcgtdEntId && m.Activo == true)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync(cancellationToken);

            var miembrosDto = miembros.Select(m => new ComiteMiembroDto
            {
                MiembroId = m.MiembroId,
                Dni = m.Dni,
                Nombre = m.Nombre,
                ApellidoPaterno = m.ApellidoPaterno,
                ApellidoMaterno = m.ApellidoMaterno,
                Cargo = m.Cargo,
                Email = m.Email,
                Telefono = m.Telefono,
                Rol = m.Rol,
                FechaInicio = m.FechaInicio,
                Activo = m.Activo
            }).ToList();

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
                CriteriosEvaluados = entity.CriteriosEvaluados,
                Miembros = miembrosDto
            };

            _logger.LogInformation("Com2CGTD obtenido exitosamente: {Id}", entity.ComcgtdEntId);
            return Result<Com2CGTDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com2CGTD");
            return Result<Com2CGTDResponse>.Failure($"Error al obtener el registro: {ex.Message}");
        }
    }
}
