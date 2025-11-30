using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.CreateCom13InteroperabilidadPIDE;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com13InteroperabilidadPIDEEntity = PCM.Domain.Entities.Com13InteroperabilidadPIDE;

namespace PCM.Infrastructure.Handlers.Com13InteroperabilidadPIDE;

public class CreateCom13InteroperabilidadPIDEHandler : IRequestHandler<CreateCom13InteroperabilidadPIDECommand, Result<Com13InteroperabilidadPIDEResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom13InteroperabilidadPIDEHandler> _logger;

    public CreateCom13InteroperabilidadPIDEHandler(PCMDbContext context, ILogger<CreateCom13InteroperabilidadPIDEHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com13InteroperabilidadPIDEResponse>> Handle(CreateCom13InteroperabilidadPIDECommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com13InteroperabilidadPIDE para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com13InteroperabilidadPIDEEntity
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
                FechaAprobacion = request.FechaAprobacion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaAprobacion.Value, DateTimeKind.Utc) 
                    : null,
                NumeroResolucion = request.NumeroResolucion,
                ArchivoPlan = request.ArchivoPlan,
                Descripcion = request.Descripcion,
                RiesgosIdentificados = request.RiesgosIdentificados,
                EstrategiasMitigacion = request.EstrategiasMitigacion,
                FechaRevision = request.FechaRevision.HasValue 
                    ? DateTime.SpecifyKind(request.FechaRevision.Value, DateTimeKind.Utc) 
                    : null,
                Responsable = request.Responsable,
            };

            _context.Com13InteroperabilidadPIDE.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com13InteroperabilidadPIDEResponse
            {
                CompcpideEntId = entity.CompcpideEntId,
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
                FechaAprobacion = entity.FechaAprobacion,
                NumeroResolucion = entity.NumeroResolucion,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
                RiesgosIdentificados = entity.RiesgosIdentificados,
                EstrategiasMitigacion = entity.EstrategiasMitigacion,
                FechaRevision = entity.FechaRevision,
                Responsable = entity.Responsable,
            };

            return Result<Com13InteroperabilidadPIDEResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com13InteroperabilidadPIDE");
            return Result<Com13InteroperabilidadPIDEResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
