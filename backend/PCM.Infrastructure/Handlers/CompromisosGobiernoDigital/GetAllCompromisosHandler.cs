using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetAllCompromisos;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class GetAllCompromisosHandler : IRequestHandler<GetAllCompromisosQuery, Result<List<CompromisoResponseDto>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetAllCompromisosHandler> _logger;

    public GetAllCompromisosHandler(PCMDbContext context, ILogger<GetAllCompromisosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CompromisoResponseDto>>> Handle(GetAllCompromisosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Obtener la clasificación y entidadId del usuario (si está autenticado)
            // NOTA: Entidad.ClasificacionId apunta a subclasificacion_id en la BD
            // Necesitamos obtener el clasificacion_id padre de la subclasificación
            long? userClasificacionId = null;
            long? userSubclasificacionId = null; // Para consultar exigibilidad
            Guid? userEntidadId = null;
            if (request.UserId.HasValue)
            {
                var usuario = await _context.Usuarios
                    .Include(u => u.Entidad)
                        .ThenInclude(e => e!.Clasificacion) // Clasificacion es realmente Subclasificacion
                    .FirstOrDefaultAsync(u => u.UserId == request.UserId.Value, cancellationToken);
                
                if (usuario?.Entidad != null)
                {
                    // Entidad.ClasificacionId es subclasificacion_id
                    // Entidad.Clasificacion es la Subclasificacion
                    // Subclasificacion.ClasificacionId es el ID de la clasificación padre
                    userClasificacionId = usuario.Entidad?.Clasificacion?.ClasificacionId;
                    userSubclasificacionId = usuario.Entidad?.ClasificacionId; // subclasificacion_id real
                    userEntidadId = usuario.Entidad?.EntidadId;
                }
            }

            var query = _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.TipoNorma)
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.NivelGobierno)
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.Sector)
                .Include(c => c.CriteriosEvaluacion)
                .Include(c => c.AlcancesCompromisos)
                    .ThenInclude(ac => ac.Clasificacion) // Clasificacion es Subclasificacion
                        .ThenInclude(s => s!.Clasificacion) // Cargar Clasificacion padre
                .AsQueryable();

            // Filtrar por clasificación de la entidad del usuario
            if (userClasificacionId.HasValue)
            {
                query = query.Where(c => c.AlcancesCompromisos.Any(ac => ac.ClasificacionId == userClasificacionId.Value && ac.Activo));
            }

            // Apply filters
            if (!string.IsNullOrEmpty(request.Nombre))
            {
                query = query.Where(c => EF.Functions.ILike(c.NombreCompromiso, $"%{request.Nombre}%"));
            }

            if (!string.IsNullOrEmpty(request.Alcance))
            {
                query = query.Where(c => EF.Functions.ILike(c.Alcances, $"%{request.Alcance}%"));
            }

            if (request.Estado.HasValue)
            {
                query = query.Where(c => c.Estado == request.Estado.Value);
            }
            
            // Only show active records
            query = query.Where(c => c.Activo);

            var compromisos = await query
                .OrderBy(c => c.CompromisoId)
                .ToListAsync(cancellationToken);

            // Obtener cumplimientos de la entidad del usuario
            var cumplimientosPorCompromiso = new Dictionary<long, PCM.Domain.Entities.CumplimientoNormativo>();
            if (userEntidadId.HasValue)
            {
                var cumplimientos = await _context.CumplimientosNormativos
                    .Where(cn => cn.EntidadId == userEntidadId.Value)
                    .ToListAsync(cancellationToken);
                
                cumplimientosPorCompromiso = cumplimientos.ToDictionary(c => c.CompromisoId);
            }

            // Obtener registros de tablas específicas (paso 1) para Com1, Com2, Com4-21
            var registrosEspecificos = new Dictionary<long, (DateTime fecha, string? estado)>();
            if (userEntidadId.HasValue)
            {
                // Com1: Líder GTD
                var com1 = await _context.Com1LiderGTD
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com1 != null)
                {
                    registrosEspecificos[1] = (com1.CreatedAt, com1.Estado);
                }

                // Com2: Comité GTD
                var com2 = await _context.Com2CGTD
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com2 != null)
                {
                    registrosEspecificos[2] = (com2.CreatedAt, com2.Estado);
                }

                // Com3: Plan de Gobierno Digital (EPGD)
                var com3 = await _context.Com3EPGD
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com3 != null)
                {
                    registrosEspecificos[3] = (com3.CreatedAt, com3.Estado);
                }

                // Com4: PEI
                var com4 = await _context.Com4PEI
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com4 != null)
                {
                    registrosEspecificos[4] = (com4.CreatedAt, com4.Estado);
                }

                // Com5: Estrategia Digital
                var com5 = await _context.Com5EstrategiaDigital
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com5 != null)
                {
                    registrosEspecificos[5] = (com5.CreatedAt, com5.Estado);
                }

                // Com6: Migración Gob.pe
                var com6 = await _context.Com6MigracionGobPe
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com6 != null)
                {
                    registrosEspecificos[6] = (com6.CreatedAt, com6.Estado);
                }

                // Com7: Implementación MPD
                var com7 = await _context.Com7ImplementacionMPD
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com7 != null)
                {
                    registrosEspecificos[7] = (com7.CreatedAt, com7.Estado);
                }

                // Com8: Publicación TUPA
                var com8 = await _context.Com8PublicacionTUPA
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com8 != null)
                {
                    registrosEspecificos[8] = (com8.CreatedAt, com8.Estado);
                }

                // Com9: Modelo Gestión Documental
                var com9 = await _context.Com9ModeloGestionDocumental
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com9 != null)
                {
                    registrosEspecificos[9] = (com9.CreatedAt, com9.Estado);
                }

                // Com10: Datos Abiertos
                var com10 = await _context.Com10DatosAbiertos
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com10 != null)
                {
                    registrosEspecificos[10] = (com10.CreatedAt, com10.Estado);
                }

                // Com11: Aportación GeoPeru
                var com11 = await _context.Com11AportacionGeoPeru
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com11 != null)
                {
                    registrosEspecificos[11] = (com11.CreatedAt, com11.Estado);
                }

                // Com12: Responsable Software Público
                var com12 = await _context.Com12ResponsableSoftwarePublico
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com12 != null)
                {
                    registrosEspecificos[12] = (com12.CreatedAt, com12.Estado);
                }

                // Com13: Interoperabilidad PIDE
                var com13 = await _context.Com13InteroperabilidadPIDE
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com13 != null)
                {
                    registrosEspecificos[13] = (com13.CreatedAt, com13.Estado);
                }

                // Com14: Oficial Seguridad Digital
                var com14 = await _context.Com14OficialSeguridadDigital
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com14 != null)
                {
                    registrosEspecificos[14] = (com14.CreatedAt, com14.Estado);
                }

                // Com15: CSIRT Institucional
                var com15 = await _context.Com15CSIRTInstitucional
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com15 != null)
                {
                    registrosEspecificos[15] = (com15.CreatedAt, com15.Estado);
                }

                // Com16: Sistema Gestión Seguridad
                var com16 = await _context.Com16SistemaGestionSeguridad
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com16 != null)
                {
                    registrosEspecificos[16] = (com16.CreatedAt, com16.Estado);
                }

                // Com17: Plan Transición IPv6
                var com17 = await _context.Com17PlanTransicionIPv6
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com17 != null)
                {
                    registrosEspecificos[17] = (com17.CreatedAt, com17.Estado);
                }

                // Com18: Acceso Portal Transparencia
                var com18 = await _context.Com18AccesoPortalTransparencia
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com18 != null)
                {
                    registrosEspecificos[18] = (com18.CreatedAt, com18.Estado);
                }

                // Com19: Encuesta Nacional Gobierno Digital
                var com19 = await _context.Com19EncuestaNacionalGobDigital
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com19 != null)
                {
                    registrosEspecificos[19] = (com19.CreatedAt, com19.Estado);
                }

                // Com20: Digitalización Servicios Facilita
                var com20 = await _context.Com20DigitalizacionServiciosFacilita
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com20 != null)
                {
                    registrosEspecificos[20] = (com20.CreatedAt, com20.Estado);
                }

                // Com21: Oficial Gobierno de Datos
                var com21 = await _context.Com21OficialGobiernoDatos
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com21 != null)
                {
                    registrosEspecificos[21] = (com21.CreatedAt, com21.Estado);
                }
            }

            // Obtener exigibilidades para la subclasificación del usuario
            var exigibilidadesPorCompromiso = new Dictionary<long, string>();
            if (userSubclasificacionId.HasValue)
            {
                var exigibilidades = await _context.Exigibilidades
                    .Where(e => e.SubclasificacionId == userSubclasificacionId.Value && e.Activo)
                    .ToListAsync(cancellationToken);
                
                exigibilidadesPorCompromiso = exigibilidades.ToDictionary(
                    e => e.CompromisoId, 
                    e => e.NivelExigibilidad);
            }

            var response = compromisos.Select(c => MapToResponseDto(c, cumplimientosPorCompromiso, registrosEspecificos, exigibilidadesPorCompromiso)).ToList();

            _logger.LogInformation("Retrieved {Count} compromisos", response.Count);
            return Result<List<CompromisoResponseDto>>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compromisos");
            return Result<List<CompromisoResponseDto>>.Failure($"Error al obtener compromisos: {ex.Message}");
        }
    }

    private CompromisoResponseDto MapToResponseDto(
        CompromisoGobiernoDigital compromiso, 
        Dictionary<long, PCM.Domain.Entities.CumplimientoNormativo> cumplimientosPorCompromiso,
        Dictionary<long, (DateTime fecha, string? estado)> registrosEspecificos,
        Dictionary<long, string> exigibilidadesPorCompromiso)
    {
        // Obtener cumplimiento de este compromiso si existe
        cumplimientosPorCompromiso.TryGetValue(compromiso.CompromisoId, out var cumplimiento);
        
        // Obtener registro específico si existe (tabla específica paso 1)
        registrosEspecificos.TryGetValue(compromiso.CompromisoId, out var registroEspecifico);
        
        // Obtener exigibilidad para este compromiso
        exigibilidadesPorCompromiso.TryGetValue(compromiso.CompromisoId, out var nivelExigibilidad);
        
        // Priorizar datos de registro específico si existe, sino usar cumplimiento genérico
        DateTime? fechaRegistro = registroEspecifico.fecha != default ? registroEspecifico.fecha : cumplimiento?.CreatedAt;
        int? estadoCumplimiento = null;
        
        // PRIORIDAD 1: Si existe evaluación en cumplimiento_normativo, usar ese estado
        if (cumplimiento != null)
        {
            estadoCumplimiento = cumplimiento.EstadoId;
        }
        // PRIORIDAD 2: Si no hay evaluación, usar el estado de la tabla específica (comX)
        else if (!string.IsNullOrEmpty(registroEspecifico.estado))
        {
            estadoCumplimiento = registroEspecifico.estado switch
            {
                "pendiente" => 1,  // PENDIENTE
                "sin_reportar" => 2,  // SIN REPORTAR
                "no_exigible" => 3,  // NO EXIGIBLE
                "en_proceso" => 4,  // EN PROCESO
                "enviado" => 5,  // ENVIADO
                "bandeja" => 5,  // ENVIADO (bandeja = enviado a revisión)
                "en_revision" => 6,  // EN REVISIÓN
                "observado" => 7,  // OBSERVADO
                "aceptado" => 8,  // ACEPTADO
                "aprobado" => 8,  // ACEPTADO (aprobado = aceptado)
                _ => null
            };
        }
        // PRIORIDAD 3: Si no hay registro ni cumplimiento, calcular desde exigibilidad
        else if (!string.IsNullOrEmpty(nivelExigibilidad))
        {
            estadoCumplimiento = nivelExigibilidad switch
            {
                "OBLIGATORIO" => 1,  // PENDIENTE
                "OPCIONAL" => 2,     // SIN REPORTAR
                "NO_EXIGIBLE" => 3,  // NO EXIGIBLE
                _ => null
            };
        }
        
        return new CompromisoResponseDto
        {
            CompromisoId = compromiso.CompromisoId,
            NombreCompromiso = compromiso.NombreCompromiso,
            Descripcion = compromiso.Descripcion,
            Alcances = compromiso.AlcancesCompromisos?
                .Where(ac => ac.Activo)
                .Select(ac => ac.ClasificacionId.ToString()) // Devolver subclasificacion_id directamente
                .Where(id => !string.IsNullOrEmpty(id))
                .Distinct()
                .ToList() ?? new List<string>(),
            FechaInicio = compromiso.FechaInicio,
            FechaFin = compromiso.FechaFin,
            Estado = compromiso.Estado,
            Activo = compromiso.Activo,
            CreatedAt = compromiso.CreatedAt,
            UpdatedAt = compromiso.UpdatedAt,
            FechaRegistroCumplimiento = fechaRegistro,
            EstadoCumplimiento = estadoCumplimiento,
            Normativas = compromiso.Normativas?.Select(n => new CompromisoNormativaResponseDto
            {
                CompromisoNormativaId = n.CompromisoNormativaId,
                CompromisoId = n.CompromisoId,
                NormaId = n.NormaId,
                NombreNorma = n.Norma?.NombreNorma ?? string.Empty,
                Numero = n.Norma?.Numero ?? string.Empty,
                TipoNormaId = n.Norma?.TipoNormaId,
                TipoNorma = n.Norma?.TipoNorma?.Nombre ?? string.Empty,
                NivelGobierno = n.Norma?.NivelGobierno?.Nombre ?? string.Empty,
                Sector = n.Norma?.Sector?.Nombre ?? string.Empty,
                FechaPublicacion = n.Norma?.FechaPublicacion,
                CreatedAt = n.CreatedAt
            }).ToList() ?? new List<CompromisoNormativaResponseDto>(),
            CriteriosEvaluacion = compromiso.CriteriosEvaluacion?.Select(c => new CriterioEvaluacionResponseDto
            {
                CriterioEvaluacionId = c.CriterioEvaluacionId,
                CompromisoId = c.CompromisoId,
                Descripcion = c.Descripcion,
                Estado = c.IdEstado,
                Activo = c.Activo,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList() ?? new List<CriterioEvaluacionResponseDto>()
        };
    }
}
