using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Features.Com2CGTD.Queries.GetCom2CGTDByEntidad;
using PCM.Application.Features.Com3EPGD.Queries.GetCom3EPGDByEntidad;
using PCM.Application.Interfaces;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.API.Controllers;

/// <summary>
/// Controlador para la Evaluación y Cumplimiento de compromisos
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EvaluacionController : ControllerBase
{
    private readonly PCMDbContext _context;
    private readonly ILogger<EvaluacionController> _logger;
    private readonly IMediator _mediator;
    private readonly ICumplimientoHistorialService _historialService;

    public EvaluacionController(
        PCMDbContext context, 
        ILogger<EvaluacionController> logger, 
        IMediator mediator,
        ICumplimientoHistorialService historialService)
    {
        _context = context;
        _logger = logger;
        _mediator = mediator;
        _historialService = historialService;
    }

    /// <summary>
    /// Obtiene la matriz de evaluación de todas las entidades con sus compromisos
    /// </summary>
    [HttpGet("matriz")]
    public async Task<IActionResult> GetMatrizEvaluacion(
        [FromQuery] string? entidad = null,
        [FromQuery] int? sectorId = null,
        [FromQuery] long? clasificacionId = null,
        [FromQuery] int? compromisoId = null,
        [FromQuery] string? estado = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            // Obtener todas las entidades activas con sus relaciones
            var entidadesQuery = _context.Entidades
                .Include(e => e.Sector)
                .Include(e => e.Clasificacion)
                .Where(e => e.Activo);

            // Aplicar filtros
            if (!string.IsNullOrEmpty(entidad))
            {
                entidadesQuery = entidadesQuery.Where(e => e.Nombre.ToLower().Contains(entidad.ToLower()));
            }

            if (sectorId.HasValue)
            {
                entidadesQuery = entidadesQuery.Where(e => e.SectorId == sectorId.Value);
            }

            if (clasificacionId.HasValue)
            {
                entidadesQuery = entidadesQuery.Where(e => e.ClasificacionId == clasificacionId.Value);
            }

            var entidades = await entidadesQuery.OrderBy(e => e.Nombre).ToListAsync();
            
            // Obtener todos los estados de compromisos por entidad
            var com1Data = await _context.Com1LiderGTD.Where(c => c.Activo).ToListAsync();
            var com2Data = await _context.Com2CGTD.Where(c => c.Activo).ToListAsync();
            var com3Data = await _context.Com3EPGD.Where(c => c.Activo).ToListAsync();
            var com4Data = await _context.Com4PEI.Where(c => c.Activo).ToListAsync();
            var com5Data = await _context.Com5EstrategiaDigital.Where(c => c.Activo).ToListAsync();
            var com6Data = await _context.Com6MigracionGobPe.Where(c => c.Activo).ToListAsync();
            var com7Data = await _context.Com7ImplementacionMPD.Where(c => c.Activo).ToListAsync();
            var com8Data = await _context.Com8PublicacionTUPA.Where(c => c.Activo).ToListAsync();
            var com9Data = await _context.Com9ModeloGestionDocumental.Where(c => c.Activo).ToListAsync();
            var com10Data = await _context.Com10DatosAbiertos.Where(c => c.Activo).ToListAsync();
            var com11Data = await _context.Com11AportacionGeoPeru.Where(c => c.Activo).ToListAsync();
            var com12Data = await _context.Com12ResponsableSoftwarePublico.Where(c => c.Activo).ToListAsync();
            var com13Data = await _context.Com13InteroperabilidadPIDE.Where(c => c.Activo).ToListAsync();
            var com14Data = await _context.Com14OficialSeguridadDigital.Where(c => c.Activo).ToListAsync();
            var com15Data = await _context.Com15CSIRTInstitucional.Where(c => c.Activo).ToListAsync();
            var com16Data = await _context.Com16SistemaGestionSeguridad.Where(c => c.Activo).ToListAsync();
            var com17Data = await _context.Com17PlanTransicionIPv6.Where(c => c.Activo).ToListAsync();
            var com18Data = await _context.Com18AccesoPortalTransparencia.Where(c => c.Activo).ToListAsync();
            var com19Data = await _context.Com19EncuestaNacionalGobDigital.Where(c => c.Activo).ToListAsync();
            var com20Data = await _context.Com20DigitalizacionServiciosFacilita.Where(c => c.Activo).ToListAsync();
            var com21Data = await _context.Com21OficialGobiernoDatos.Where(c => c.Activo).ToListAsync();

            // Obtener alcances de compromisos para saber cuáles son exigibles por clasificación
            var alcances = await _context.AlcancesCompromisos
                .Where(a => a.Activo)
                .ToListAsync();

            // Construir la matriz
            var matrizItems = new List<object>();
            
            foreach (var ent in entidades)
            {
                var compromisos = new List<string>();
                
                // Para cada compromiso, determinar el estado
                for (int i = 1; i <= 21; i++)
                {
                    // Obtener el estado del compromiso para esta entidad
                    // Nota: Por ahora mostramos el estado real sin filtrar por alcances
                    // ya que la configuración de alcances puede no estar completa
                    string estadoCompromiso = ObtenerEstadoCompromiso(
                        i, ent.EntidadId,
                        com1Data, com2Data, com3Data, com4Data, com5Data,
                        com6Data, com7Data, com8Data, com9Data, com10Data,
                        com11Data, com12Data, com13Data, com14Data, com15Data,
                        com16Data, com17Data, com18Data, com19Data, com20Data, com21Data
                    );
                    
                    compromisos.Add(estadoCompromiso);
                }
                
                matrizItems.Add(new
                {
                    id = ent.EntidadId,
                    nombre = ent.Nombre,
                    sector = ent.Sector?.Nombre ?? "Sin sector",
                    sectorId = ent.SectorId,
                    clasificacion = ent.Clasificacion?.Nombre ?? "Sin clasificación",
                    clasificacionId = ent.ClasificacionId,
                    compromisos
                });
            }

            // Aplicar filtro por estado de compromiso específico
            if (compromisoId.HasValue && !string.IsNullOrEmpty(estado))
            {
                matrizItems = matrizItems.Where(m => 
                {
                    dynamic item = m;
                    var comps = (List<string>)item.compromisos;
                    return comps[compromisoId.Value - 1] == estado;
                }).ToList();
            }
            else if (!string.IsNullOrEmpty(estado))
            {
                matrizItems = matrizItems.Where(m => 
                {
                    dynamic item = m;
                    var comps = (List<string>)item.compromisos;
                    return comps.Any(c => c == estado);
                }).ToList();
            }

            // Paginación
            var totalItems = matrizItems.Count;
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            var pagedItems = matrizItems.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new
            {
                isSuccess = true,
                data = pagedItems,
                pagination = new
                {
                    currentPage = page,
                    pageSize,
                    totalItems,
                    totalPages
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener matriz de evaluación");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene los sectores para filtros
    /// </summary>
    [HttpGet("sectores")]
    public async Task<IActionResult> GetSectores()
    {
        var sectores = await _context.Sectores
            .Where(s => s.Activo)
            .OrderBy(s => s.Nombre)
            .Select(s => new { s.SectorId, s.Nombre })
            .ToListAsync();

        return Ok(new { isSuccess = true, data = sectores });
    }

    /// <summary>
    /// Obtiene las clasificaciones para filtros
    /// </summary>
    [HttpGet("clasificaciones")]
    public async Task<IActionResult> GetClasificaciones()
    {
        var clasificaciones = await _context.Subclasificaciones
            .Where(c => c.Activo)
            .OrderBy(c => c.Nombre)
            .Select(c => new { clasificacionId = c.SubclasificacionId, c.Nombre })
            .ToListAsync();

        return Ok(new { isSuccess = true, data = clasificaciones });
    }

    /// <summary>
    /// Actualiza el estado de un compromiso y registra en cumplimiento_normativo
    /// </summary>
    [HttpPut("compromiso/{compromisoId}/entidad/{entidadId}/estado")]
    public async Task<IActionResult> UpdateEstado(
        int compromisoId, 
        Guid entidadId, 
        [FromBody] UpdateEstadoRequest request)
    {
        try
        {
            // Obtener el ID del operador logueado desde el JWT
            var userIdClaim = User.FindFirst("UserId")?.Value;
            Guid? operadorId = null;
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                operadorId = parsedUserId;
            }

            _logger.LogInformation("Actualizando estado para compromiso {CompromisoId}, entidad {EntidadId}, estado: {Estado}, operador: {OperadorId}", 
                compromisoId, entidadId, request.Estado, operadorId);

            // 1. Actualizar estado en la tabla comX
            var updated = await ActualizarEstado(compromisoId, entidadId, request.Estado, request.Observaciones);
            
            if (!updated)
            {
                return NotFound(new { isSuccess = false, message = "No se encontró el compromiso para esta entidad" });
            }

            // 2. Registrar en cumplimiento_normativo
            // Mapear estado string a estado_id
            int estadoId = request.Estado?.ToLower() switch
            {
                "aceptado" or "aprobado" => 8, // ACEPTADO
                "observado" => 7, // OBSERVADO
                "en_revision" or "en revisión" => 6, // EN REVISIÓN
                "enviado" => 5, // ENVIADO
                "en_proceso" or "en proceso" => 4, // EN PROCESO
                "no_exigible" or "no exigible" => 3, // NO EXIGIBLE
                "sin_reportar" or "sin reportar" => 2, // SIN REPORTAR
                _ => 1 // PENDIENTE
            };

            // Buscar si ya existe un registro en cumplimiento_normativo
            var cumplimientoExistente = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.CompromisoId == compromisoId);

            int? estadoAnteriorId = cumplimientoExistente?.EstadoId;
            long cumplimientoId;

            if (cumplimientoExistente != null)
            {
                // Actualizar registro existente
                cumplimientoExistente.EstadoId = estadoId;
                cumplimientoExistente.OperadorId = operadorId;
                cumplimientoExistente.ObservacionPcm = request.Observaciones ?? "";
                cumplimientoExistente.UpdatedAt = DateTime.UtcNow;
                cumplimientoId = cumplimientoExistente.CumplimientoId;
            }
            else
            {
                // Crear nuevo registro
                var nuevoCumplimiento = new Domain.Entities.CumplimientoNormativo
                {
                    EntidadId = entidadId,
                    CompromisoId = compromisoId,
                    EstadoId = estadoId,
                    OperadorId = operadorId,
                    FechaAsignacion = DateTime.UtcNow,
                    ObservacionPcm = request.Observaciones ?? "",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.CumplimientosNormativos.Add(nuevoCumplimiento);
                await _context.SaveChangesAsync();
                cumplimientoId = nuevoCumplimiento.CumplimientoId;
            }

            if (cumplimientoExistente != null)
            {
                await _context.SaveChangesAsync();
            }

            // Registrar en historial de cumplimiento
            string tipoAccion = estadoId switch
            {
                8 => "APROBACION",
                7 => "OBSERVACION",
                6 => "REVISION",
                _ => "CAMBIO_ESTADO"
            };

            try
            {
                await _historialService.RegistrarCambioConSnapshotAsync(
                    cumplimientoId: cumplimientoId,
                    compromisoId: compromisoId,
                    entidadId: entidadId,
                    estadoAnteriorId: estadoAnteriorId,
                    estadoNuevoId: estadoId,
                    usuarioId: operadorId ?? Guid.Empty,
                    observacion: request.Observaciones,
                    tipoAccion: tipoAccion,
                    ipOrigen: HttpContext.Connection.RemoteIpAddress?.ToString()
                );
                _logger.LogInformation("Historial registrado para compromiso {CompromisoId}, entidad {EntidadId}, acción: {TipoAccion}", 
                    compromisoId, entidadId, tipoAccion);
            }
            catch (Exception histEx)
            {
                // Log pero no fallar si el historial falla
                _logger.LogWarning(histEx, "Error al registrar historial para compromiso {CompromisoId}", compromisoId);
            }

            _logger.LogInformation("Estado actualizado y registrado en cumplimiento_normativo para compromiso {CompromisoId}, entidad {EntidadId}", 
                compromisoId, entidadId);

            return Ok(new { isSuccess = true, message = "Estado actualizado correctamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar estado");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene el detalle de un compromiso para una entidad
    /// </summary>
    [HttpGet("compromiso/{compromisoId}/entidad/{entidadId}")]
    public async Task<IActionResult> GetDetalleCompromiso(int compromisoId, Guid entidadId)
    {
        try
        {
            _logger.LogInformation("Obteniendo detalle compromiso {CompromisoId} para entidad {EntidadId}", compromisoId, entidadId);
            
            object? data = null;
            
            // Usar MediatR para compromisos que tienen datos relacionados
            switch (compromisoId)
            {
                case 2:
                    // Compromiso 2: Comité GTD con Miembros
                    var com2Query = new GetCom2CGTDByEntidadQuery
                    {
                        CompromisoId = compromisoId,
                        EntidadId = entidadId
                    };
                    var com2Result = await _mediator.Send(com2Query);
                    if (com2Result.IsSuccess && com2Result.Data != null)
                    {
                        data = com2Result.Data;
                    }
                    break;
                    
                case 3:
                    // Compromiso 3: Plan de Gobierno Digital con todas sus relaciones
                    var com3Query = new GetCom3EPGDByEntidadQuery
                    {
                        CompromisoId = compromisoId,
                        EntidadId = entidadId
                    };
                    var com3Result = await _mediator.Send(com3Query);
                    if (com3Result.IsSuccess && com3Result.Data != null)
                    {
                        data = com3Result.Data;
                    }
                    break;
                    
                default:
                    // Para el resto de compromisos, usar query directo
                    data = compromisoId switch
                    {
                        1 => await _context.Com1LiderGTD.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        4 => await _context.Com4PEI.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        5 => await _context.Com5EstrategiaDigital.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        6 => await _context.Com6MigracionGobPe.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        7 => await _context.Com7ImplementacionMPD.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        8 => await _context.Com8PublicacionTUPA.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        9 => await _context.Com9ModeloGestionDocumental.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        10 => await _context.Com10DatosAbiertos.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        11 => await _context.Com11AportacionGeoPeru.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        12 => await _context.Com12ResponsableSoftwarePublico.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        13 => await _context.Com13InteroperabilidadPIDE.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        14 => await _context.Com14OficialSeguridadDigital.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        15 => await _context.Com15CSIRTInstitucional.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        16 => await _context.Com16SistemaGestionSeguridad.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        17 => await _context.Com17PlanTransicionIPv6.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        18 => await _context.Com18AccesoPortalTransparencia.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        19 => await _context.Com19EncuestaNacionalGobDigital.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        20 => await _context.Com20DigitalizacionServiciosFacilita.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        21 => await _context.Com21OficialGobiernoDatos.AsNoTracking().FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo),
                        _ => null
                    };
                    break;
            }

            _logger.LogInformation("Data obtenida: {HasData}", data != null);

            // Obtener datos de la entidad
            var entidad = await _context.Entidades
                .AsNoTracking()
                .Include(e => e.Sector)
                .Include(e => e.Clasificacion)
                .FirstOrDefaultAsync(e => e.EntidadId == entidadId);

            _logger.LogInformation("Entidad obtenida: {HasEntidad}", entidad != null);

            // Obtener criterios de evaluación del compromiso
            var criteriosEvaluacion = await _context.CriteriosEvaluacion
                .AsNoTracking()
                .Where(c => c.CompromisoId == compromisoId && c.Activo)
                .OrderBy(c => c.CriterioEvaluacionId)
                .Select(c => new 
                {
                    c.CriterioEvaluacionId,
                    c.Descripcion,
                    c.Activo
                })
                .ToListAsync();

            // Obtener respuestas de la entidad para estos criterios
            var criterioIds = criteriosEvaluacion.Select(c => c.CriterioEvaluacionId).ToList();
            var respuestasEntidad = await _context.EvaluacionRespuestasEntidad
                .AsNoTracking()
                .Where(r => r.EntidadId == entidadId && criterioIds.Contains(r.CriterioEvaluacionId))
                .ToListAsync();

            // Combinar criterios con respuestas
            var criteriosConRespuestas = criteriosEvaluacion.Select(c => new
            {
                c.CriterioEvaluacionId,
                c.Descripcion,
                c.Activo,
                Cumple = respuestasEntidad.FirstOrDefault(r => r.CriterioEvaluacionId == c.CriterioEvaluacionId)?.Cumple ?? false
            }).ToList();

            _logger.LogInformation("Criterios de evaluación: {Count}", criteriosConRespuestas.Count);

            return Ok(new 
            { 
                isSuccess = true, 
                data,
                entidad = entidad != null ? new
                {
                    entidad.EntidadId,
                    entidad.Nombre,
                    sector = entidad.Sector?.Nombre,
                    clasificacion = entidad.Clasificacion?.Nombre
                } : null,
                criteriosEvaluacion = criteriosConRespuestas
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener detalle del compromiso {CompromisoId} para entidad {EntidadId}", compromisoId, entidadId);
            return StatusCode(500, new { isSuccess = false, message = $"Error interno: {ex.Message}" });
        }
    }

    #region Private Methods

    private string ObtenerEstadoCompromiso(
        int compromisoId, 
        Guid entidadId,
        List<Com1LiderGTD> com1Data,
        List<Com2CGTD> com2Data,
        List<Com3EPGD> com3Data,
        List<Com4PEI> com4Data,
        List<Com5EstrategiaDigital> com5Data,
        List<Com6MigracionGobPe> com6Data,
        List<Com7ImplementacionMPD> com7Data,
        List<Com8PublicacionTUPA> com8Data,
        List<Com9ModeloGestionDocumental> com9Data,
        List<Com10DatosAbiertos> com10Data,
        List<Com11AportacionGeoPeru> com11Data,
        List<Com12ResponsableSoftwarePublico> com12Data,
        List<Com13InteroperabilidadPIDE> com13Data,
        List<Com14OficialSeguridadDigital> com14Data,
        List<Com15CSIRTInstitucional> com15Data,
        List<Com16SistemaGestionSeguridad> com16Data,
        List<Com17PlanTransicionIPv6> com17Data,
        List<Com18AccesoPortalTransparencia> com18Data,
        List<Com19EncuestaNacionalGobDigital> com19Data,
        List<Com20DigitalizacionServiciosFacilita> com20Data,
        List<Com21OficialGobiernoDatos> com21Data)
    {
        string? estado = null;
        string? etapa = null;

        switch (compromisoId)
        {
            case 1:
                var c1 = com1Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c1 != null) { estado = c1.Estado; etapa = c1.EtapaFormulario; }
                break;
            case 2:
                var c2 = com2Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c2 != null) { estado = c2.Estado; etapa = c2.EtapaFormulario; }
                break;
            case 3:
                var c3 = com3Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c3 != null) { estado = c3.Estado; etapa = c3.EtapaFormulario; }
                break;
            case 4:
                var c4 = com4Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c4 != null) { estado = c4.Estado; etapa = c4.EtapaFormulario; }
                break;
            case 5:
                var c5 = com5Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c5 != null) { estado = c5.Estado; etapa = c5.EtapaFormulario; }
                break;
            case 6:
                var c6 = com6Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c6 != null) { estado = c6.Estado; etapa = c6.EtapaFormulario; }
                break;
            case 7:
                var c7 = com7Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c7 != null) { estado = c7.Estado; etapa = c7.EtapaFormulario; }
                break;
            case 8:
                var c8 = com8Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c8 != null) { estado = c8.Estado; etapa = c8.EtapaFormulario; }
                break;
            case 9:
                var c9 = com9Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c9 != null) { estado = c9.Estado; etapa = c9.EtapaFormulario; }
                break;
            case 10:
                var c10 = com10Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c10 != null) { estado = c10.Estado; etapa = c10.EtapaFormulario; }
                break;
            case 11:
                var c11 = com11Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c11 != null) { estado = c11.Estado; etapa = c11.EtapaFormulario; }
                break;
            case 12:
                var c12 = com12Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c12 != null) { estado = c12.Estado; etapa = c12.EtapaFormulario; }
                break;
            case 13:
                var c13 = com13Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c13 != null) { estado = c13.Estado; etapa = c13.EtapaFormulario; }
                break;
            case 14:
                var c14 = com14Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c14 != null) { estado = c14.Estado; etapa = c14.EtapaFormulario; }
                break;
            case 15:
                var c15 = com15Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c15 != null) { estado = c15.Estado; etapa = c15.EtapaFormulario; }
                break;
            case 16:
                var c16 = com16Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c16 != null) { estado = c16.Estado; etapa = c16.EtapaFormulario; }
                break;
            case 17:
                var c17 = com17Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c17 != null) { estado = c17.Estado; etapa = c17.EtapaFormulario; }
                break;
            case 18:
                var c18 = com18Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c18 != null) { estado = c18.Estado; etapa = c18.EtapaFormulario; }
                break;
            case 19:
                var c19 = com19Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c19 != null) { estado = c19.Estado; etapa = c19.EtapaFormulario; }
                break;
            case 20:
                var c20 = com20Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c20 != null) { estado = c20.Estado; etapa = c20.EtapaFormulario; }
                break;
            case 21:
                var c21 = com21Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c21 != null) { estado = c21.Estado; etapa = c21.EtapaFormulario; }
                break;
        }

        // Si no hay registro, es "sin reportar"
        if (string.IsNullOrEmpty(estado) && string.IsNullOrEmpty(etapa))
        {
            return "sin reportar";
        }

        // Mapear el campo estado a los estados de la UI
        return estado?.ToLower() switch
        {
            "aceptado" or "validado" or "aprobado" => "aceptado",
            "observado" => "observado",
            "en_revision" or "revision" or "en revisión" => "en revisión",
            "enviado" => "enviado",
            "en_proceso" or "en proceso" => "en proceso",
            "sin_reportar" or "sin reportar" => "sin reportar",
            "no_exigible" or "no exigible" => "no exigible",
            _ => MapearEstadoEntidad(estado, etapa)
        };
    }

    private string MapearEstadoEntidad(string? estado, string? etapa)
    {
        // Mapear basado en el estado del formulario
        if (estado?.ToLower() == "pendiente" && etapa?.ToLower() == "completado")
        {
            return "enviado";
        }

        if (etapa?.ToLower() == "completado")
        {
            return "enviado";
        }

        if (!string.IsNullOrEmpty(etapa) && etapa.ToLower() != "completado")
        {
            return "en proceso";
        }

        if (estado?.ToLower() == "sin_reportar" || string.IsNullOrEmpty(estado))
        {
            return "sin reportar";
        }

        return "pendiente";
    }

    private async Task<bool> ActualizarEstado(int compromisoId, Guid entidadId, string nuevoEstado, string? observaciones)
    {
        switch (compromisoId)
        {
            case 1:
                var c1 = await _context.Com1LiderGTD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c1 != null) { c1.Estado = nuevoEstado; c1.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 2:
                var c2 = await _context.Com2CGTD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c2 != null) { c2.Estado = nuevoEstado; c2.ObservacionesPcm = observaciones ?? ""; }
                else return false;
                break;
            case 3:
                var c3 = await _context.Com3EPGD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c3 != null) { c3.Estado = nuevoEstado; c3.ObservacionesPcm = observaciones ?? ""; }
                else return false;
                break;
            case 4:
                var c4 = await _context.Com4PEI.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c4 != null) { c4.Estado = nuevoEstado; c4.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 5:
                var c5 = await _context.Com5EstrategiaDigital.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c5 != null) { c5.Estado = nuevoEstado; c5.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 6:
                var c6 = await _context.Com6MigracionGobPe.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c6 != null) { c6.Estado = nuevoEstado; c6.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 7:
                var c7 = await _context.Com7ImplementacionMPD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c7 != null) { c7.Estado = nuevoEstado; c7.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 8:
                var c8 = await _context.Com8PublicacionTUPA.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c8 != null) { c8.Estado = nuevoEstado; c8.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 9:
                var c9 = await _context.Com9ModeloGestionDocumental.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c9 != null) { c9.Estado = nuevoEstado; c9.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 10:
                var c10 = await _context.Com10DatosAbiertos.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c10 != null) { c10.Estado = nuevoEstado; c10.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 11:
                var c11 = await _context.Com11AportacionGeoPeru.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c11 != null) { c11.Estado = nuevoEstado; c11.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 12:
                var c12 = await _context.Com12ResponsableSoftwarePublico.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c12 != null) { c12.Estado = nuevoEstado; c12.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 13:
                var c13 = await _context.Com13InteroperabilidadPIDE.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c13 != null) { c13.Estado = nuevoEstado; c13.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 14:
                var c14 = await _context.Com14OficialSeguridadDigital.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c14 != null) { c14.Estado = nuevoEstado; c14.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 15:
                var c15 = await _context.Com15CSIRTInstitucional.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c15 != null) { c15.Estado = nuevoEstado; c15.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 16:
                var c16 = await _context.Com16SistemaGestionSeguridad.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c16 != null) { c16.Estado = nuevoEstado; c16.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 17:
                var c17 = await _context.Com17PlanTransicionIPv6.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c17 != null) { c17.Estado = nuevoEstado; c17.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 18:
                var c18 = await _context.Com18AccesoPortalTransparencia.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c18 != null) { c18.Estado = nuevoEstado; c18.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 19:
                var c19 = await _context.Com19EncuestaNacionalGobDigital.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c19 != null) { c19.Estado = nuevoEstado; c19.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 20:
                var c20 = await _context.Com20DigitalizacionServiciosFacilita.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c20 != null) { c20.Estado = nuevoEstado; c20.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 21:
                var c21 = await _context.Com21OficialGobiernoDatos.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c21 != null) { c21.Estado = nuevoEstado; c21.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            default:
                return false;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    #endregion

    /// <summary>
    /// Obtiene todos los proyectos del portafolio de todas las entidades para reportes
    /// </summary>
    [HttpGet("proyectos")]
    public async Task<IActionResult> GetProyectos(
        [FromQuery] int? sectorId = null,
        [FromQuery] long? clasificacionId = null,
        [FromQuery] string? etapa = null)
    {
        try
        {
            // Obtener proyectos con información de entidad
            var proyectosQuery = from p in _context.ProyectosEntidades
                                 join c3 in _context.Com3EPGD on p.ComEntidadId equals c3.ComepgdEntId
                                 join e in _context.Entidades on c3.EntidadId equals e.EntidadId
                                 where p.EstadoProyecto && e.Activo && c3.Activo
                                 select new
                                 {
                                     id = p.ProyEntId,
                                     codigo = p.NumeracionProy,
                                     nombre = p.Nombre,
                                     alcance = p.Alcance,
                                     tipoProyecto = p.TipoProy,
                                     areaProyecto = p.AreaProy,
                                     areaEjecuta = p.AreaEjecuta,
                                     tipoBeneficiario = p.TipoBeneficiario,
                                     etapa = p.EtapaProyecto,
                                     ambito = p.AmbitoProyecto,
                                     fechaInicioProg = p.FecIniProg,
                                     fechaFinProg = p.FecFinProg,
                                     fechaInicioReal = p.FecIniReal,
                                     fechaFinReal = p.FecFinReal,
                                     alineadoPgd = p.AlineadoPgd,
                                     objetivoTransformacionDigital = p.ObjTranDig,
                                     objetivoEstrategico = p.ObjEst,
                                     accionEstrategica = p.AccEst,
                                     porcentajeAvance = p.PorcentajeAvance,
                                     informoAvance = p.InformoAvance,
                                     entidad = new
                                     {
                                         id = e.EntidadId,
                                         nombre = e.Nombre,
                                         sectorId = e.SectorId,
                                         clasificacionId = e.ClasificacionId
                                     }
                                 };

            // Aplicar filtros
            if (sectorId.HasValue)
            {
                proyectosQuery = proyectosQuery.Where(p => p.entidad.sectorId == sectorId.Value);
            }

            if (clasificacionId.HasValue)
            {
                proyectosQuery = proyectosQuery.Where(p => p.entidad.clasificacionId == clasificacionId.Value);
            }

            if (!string.IsNullOrEmpty(etapa))
            {
                proyectosQuery = proyectosQuery.Where(p => p.etapa.ToLower() == etapa.ToLower());
            }

            var proyectos = await proyectosQuery.ToListAsync();

            return Ok(new
            {
                isSuccess = true,
                data = proyectos,
                total = proyectos.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener proyectos para reportes");
            return StatusCode(500, new { isSuccess = false, message = "Error interno del servidor" });
        }
    }
}

public class UpdateEstadoRequest
{
    public string Estado { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
}
