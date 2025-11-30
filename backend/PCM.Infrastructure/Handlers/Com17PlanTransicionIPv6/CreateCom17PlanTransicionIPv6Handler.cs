using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com17PlanTransicionIPv6.Commands.CreateCom17PlanTransicionIPv6;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com17PlanTransicionIPv6Entity = PCM.Domain.Entities.Com17PlanTransicionIPv6;

namespace PCM.Infrastructure.Handlers.Com17PlanTransicionIPv6;

public class CreateCom17PlanTransicionIPv6Handler : IRequestHandler<CreateCom17PlanTransicionIPv6Command, Result<Com17PlanTransicionIPv6Response>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom17PlanTransicionIPv6Handler> _logger;

    public CreateCom17PlanTransicionIPv6Handler(PCMDbContext context, ILogger<CreateCom17PlanTransicionIPv6Handler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com17PlanTransicionIPv6Response>> Handle(CreateCom17PlanTransicionIPv6Command request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com17PlanTransicionIPv6 para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = new Com17PlanTransicionIPv6Entity
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
                FechaInicioTransicion = request.FechaInicioTransicion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaInicioTransicion.Value, DateTimeKind.Utc) 
                    : null,
                FechaFinTransicion = request.FechaFinTransicion.HasValue 
                    ? DateTime.SpecifyKind(request.FechaFinTransicion.Value, DateTimeKind.Utc) 
                    : null,
                PorcentajeAvance = request.PorcentajeAvance,
                SistemasMigrados = request.SistemasMigrados,
                SistemasTotal = request.SistemasTotal,
                ArchivoPlan = request.ArchivoPlan,
                Descripcion = request.Descripcion,
            };

            _context.Com17PlanTransicionIPv6.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com17PlanTransicionIPv6Response
            {
                Comptipv6EntId = entity.Comptipv6EntId,
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
                FechaInicioTransicion = entity.FechaInicioTransicion,
                FechaFinTransicion = entity.FechaFinTransicion,
                PorcentajeAvance = entity.PorcentajeAvance,
                SistemasMigrados = entity.SistemasMigrados,
                SistemasTotal = entity.SistemasTotal,
                ArchivoPlan = entity.ArchivoPlan,
                Descripcion = entity.Descripcion,
            };

            return Result<Com17PlanTransicionIPv6Response>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com17PlanTransicionIPv6");
            return Result<Com17PlanTransicionIPv6Response>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
