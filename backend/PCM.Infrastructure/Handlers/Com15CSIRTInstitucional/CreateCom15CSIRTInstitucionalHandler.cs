using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com15CSIRTInstitucional.Commands.CreateCom15CSIRTInstitucional;
using PCM.Application.Common;
using PCM.Infrastructure.Data;
using Com15CSIRTInstitucionalEntity = PCM.Domain.Entities.Com15CSIRTInstitucional;

namespace PCM.Infrastructure.Handlers.Com15CSIRTInstitucional;

public class CreateCom15CSIRTInstitucionalHandler : IRequestHandler<CreateCom15CSIRTInstitucionalCommand, Result<Com15CSIRTInstitucionalResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom15CSIRTInstitucionalHandler> _logger;

    public CreateCom15CSIRTInstitucionalHandler(PCMDbContext context, ILogger<CreateCom15CSIRTInstitucionalHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com15CSIRTInstitucionalResponse>> Handle(CreateCom15CSIRTInstitucionalCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creando registro Com15CSIRTInstitucional para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            // Debug para entender el valor de FechaConformacion
            var fechaConformacion = request.FechaConformacion.HasValue 
                ? DateTime.SpecifyKind(request.FechaConformacion.Value, DateTimeKind.Utc) 
                : DateTime.UtcNow;
            
            _logger.LogInformation("FechaConformacion request: {RequestFecha}, FechaConformacion asignada: {FechaAsignada}", 
                request.FechaConformacion, fechaConformacion);

            var entity = new Com15CSIRTInstitucionalEntity
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
                
                // Asignar directamente a las propiedades de la base de datos
                NombreCsirt = "", // Valor por defecto
                FechaConformacionCsirt = fechaConformacion, // Usar la variable calculada
                NumeroResolucionCsirt = request.NumeroResolucion ?? "",
                ResponsableCsirt = request.Responsable ?? "",
                CargoResponsableCsirt = "", // Valor por defecto
                CorreoCsirt = request.EmailContacto ?? "",
                TelefonoCsirt = request.TelefonoContacto ?? "",
                ProtocoloIncidentesCsirt = false, // Valor por defecto
                ComunicadoPcmCsirt = false, // Valor por defecto
                RutaPdfCsirt = request.ArchivoProcedimientos ?? "",
                ObservacionCsirt = request.Descripcion ?? "",
                RutaPdfNormativa = "", // Valor por defecto
            };

            _logger.LogInformation("Entidad Com15CSIRTInstitucional antes de guardar:");
            _logger.LogInformation("- FechaConformacionCsirt: {Fecha}", entity.FechaConformacionCsirt);
            _logger.LogInformation("- NombreCsirt: '{Nombre}'", entity.NombreCsirt);
            _logger.LogInformation("- ResponsableCsirt: '{Responsable}'", entity.ResponsableCsirt);

            _context.Com15CSIRTInstitucional.Add(entity);
            
            // Crear o actualizar el registro en cumplimiento_normativo para que el dashboard refleje el estado correcto
            // Cuando se guardan datos del paso 1, automáticamente pasa a "EN PROCESO"
            var estadoId = 4; // EN PROCESO
            var cumplimientoExistente = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.EntidadId == request.EntidadId && c.CompromisoId == request.CompromisoId, cancellationToken);
            
            if (cumplimientoExistente != null)
            {
                // Actualizar el estado existente
                cumplimientoExistente.EstadoId = estadoId;
                cumplimientoExistente.UpdatedAt = DateTime.UtcNow;
                _logger.LogInformation("📝 COM15 - Actualizando cumplimiento normativo existente para Compromiso {CompromisoId}, Entidad {EntidadId} con EstadoId {EstadoId} (PENDIENTE → EN PROCESO)", 
                    request.CompromisoId, request.EntidadId, estadoId);
            }
            else
            {
                // Crear nuevo registro en cumplimiento_normativo
                var nuevoCumplimiento = new Domain.Entities.CumplimientoNormativo
                {
                    CompromisoId = request.CompromisoId,
                    EntidadId = request.EntidadId,
                    EstadoId = estadoId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.CumplimientosNormativos.Add(nuevoCumplimiento);
                _logger.LogInformation("📝 COM15 - Creando nuevo cumplimiento normativo para Compromiso {CompromisoId}, Entidad {EntidadId} con EstadoId {EstadoId} (NUEVO → EN PROCESO)", 
                    request.CompromisoId, request.EntidadId, estadoId);
            }
            
            await _context.SaveChangesAsync(cancellationToken);

            var response = new Com15CSIRTInstitucionalResponse
            {
                ComcsirtEntId = entity.ComcsirtEntId,
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
                
                // Mapear desde las propiedades de la base de datos
                FechaConformacion = entity.FechaConformacionCsirt,
                NumeroResolucion = entity.NumeroResolucionCsirt,
                Responsable = entity.ResponsableCsirt,
                EmailContacto = entity.CorreoCsirt,
                TelefonoContacto = entity.TelefonoCsirt,
                ArchivoProcedimientos = entity.RutaPdfCsirt,
                Descripcion = entity.ObservacionCsirt,
            };

            return Result<Com15CSIRTInstitucionalResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com15CSIRTInstitucional");
            return Result<Com15CSIRTInstitucionalResponse>.Failure($"Error al crear registro: {ex.Message}");
        }
    }
}
