using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Features.Com2CGTD.Queries.GetCom2CGTDByEntidad;
using PCM.Application.Features.Com3EPGD.Queries.GetCom3EPGDByEntidad;
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

    public EvaluacionController(PCMDbContext context, ILogger<EvaluacionController> logger, IMediator mediator)
    {
        _context = context;
        _logger = logger;
        _mediator = mediator;
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
                    // Verificar si el compromiso es exigible para esta clasificación
                    var esExigible = alcances.Any(a => 
                        a.CompromisoId == i && 
                        a.ClasificacionId == ent.ClasificacionId);
                    
                    if (!esExigible)
                    {
                        compromisos.Add("no exigible");
                        continue;
                    }

                    // Obtener el estado del compromiso para esta entidad
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
    /// Actualiza el estado PCM de un compromiso
    /// </summary>
    [HttpPut("compromiso/{compromisoId}/entidad/{entidadId}/estado")]
    public async Task<IActionResult> UpdateEstadoPCM(
        int compromisoId, 
        Guid entidadId, 
        [FromBody] UpdateEstadoPCMRequest request)
    {
        try
        {
            var updated = await ActualizarEstadoPCM(compromisoId, entidadId, request.EstadoPCM, request.Observaciones);
            
            if (!updated)
            {
                return NotFound(new { isSuccess = false, message = "No se encontró el compromiso para esta entidad" });
            }

            return Ok(new { isSuccess = true, message = "Estado actualizado correctamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar estado PCM");
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
                } : null
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
        List<Domain.Entities.Com1LiderGTD> com1Data,
        List<Domain.Entities.Com2CGTD> com2Data,
        List<Domain.Entities.Com3EPGD> com3Data,
        List<Domain.Entities.Com4PEI> com4Data,
        List<Domain.Entities.Com5EstrategiaDigital> com5Data,
        List<Domain.Entities.Com6MigracionGobPe> com6Data,
        List<Domain.Entities.Com7ImplementacionMPD> com7Data,
        List<Domain.Entities.Com8PublicacionTUPA> com8Data,
        List<Domain.Entities.Com9ModeloGestionDocumental> com9Data,
        List<Domain.Entities.Com10DatosAbiertos> com10Data,
        List<Domain.Entities.Com11AportacionGeoPeru> com11Data,
        List<Domain.Entities.Com12ResponsableSoftwarePublico> com12Data,
        List<Domain.Entities.Com13InteroperabilidadPIDE> com13Data,
        List<Domain.Entities.Com14OficialSeguridadDigital> com14Data,
        List<Domain.Entities.Com15CSIRTInstitucional> com15Data,
        List<Domain.Entities.Com16SistemaGestionSeguridad> com16Data,
        List<Domain.Entities.Com17PlanTransicionIPv6> com17Data,
        List<Domain.Entities.Com18AccesoPortalTransparencia> com18Data,
        List<Domain.Entities.Com19EncuestaNacionalGobDigital> com19Data,
        List<Domain.Entities.Com20DigitalizacionServiciosFacilita> com20Data,
        List<Domain.Entities.Com21OficialGobiernoDatos> com21Data)
    {
        string? estadoPcm = null;
        string? estado = null;
        string? etapa = null;

        switch (compromisoId)
        {
            case 1:
                var c1 = com1Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c1 != null) { estadoPcm = c1.EstadoPCM; estado = c1.Estado; etapa = c1.EtapaFormulario; }
                break;
            case 2:
                var c2 = com2Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c2 != null) { estadoPcm = c2.EstadoPcm; estado = c2.Estado; etapa = c2.EtapaFormulario; }
                break;
            case 3:
                var c3 = com3Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c3 != null) { estadoPcm = c3.EstadoPcm; estado = c3.Estado; etapa = c3.EtapaFormulario; }
                break;
            case 4:
                var c4 = com4Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c4 != null) { estadoPcm = c4.EstadoPCM; estado = c4.Estado; etapa = c4.EtapaFormulario; }
                break;
            case 5:
                var c5 = com5Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c5 != null) { estadoPcm = c5.EstadoPCM; estado = c5.Estado; etapa = c5.EtapaFormulario; }
                break;
            case 6:
                var c6 = com6Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c6 != null) { estadoPcm = c6.EstadoPCM; estado = c6.Estado; etapa = c6.EtapaFormulario; }
                break;
            case 7:
                var c7 = com7Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c7 != null) { estadoPcm = c7.EstadoPCM; estado = c7.Estado; etapa = c7.EtapaFormulario; }
                break;
            case 8:
                var c8 = com8Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c8 != null) { estadoPcm = c8.EstadoPCM; estado = c8.Estado; etapa = c8.EtapaFormulario; }
                break;
            case 9:
                var c9 = com9Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c9 != null) { estadoPcm = c9.EstadoPCM; estado = c9.Estado; etapa = c9.EtapaFormulario; }
                break;
            case 10:
                var c10 = com10Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c10 != null) { estadoPcm = c10.EstadoPCM; estado = c10.Estado; etapa = c10.EtapaFormulario; }
                break;
            case 11:
                var c11 = com11Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c11 != null) { estadoPcm = c11.EstadoPCM; estado = c11.Estado; etapa = c11.EtapaFormulario; }
                break;
            case 12:
                var c12 = com12Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c12 != null) { estadoPcm = c12.EstadoPCM; estado = c12.Estado; etapa = c12.EtapaFormulario; }
                break;
            case 13:
                var c13 = com13Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c13 != null) { estadoPcm = c13.EstadoPCM; estado = c13.Estado; etapa = c13.EtapaFormulario; }
                break;
            case 14:
                var c14 = com14Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c14 != null) { estadoPcm = c14.EstadoPCM; estado = c14.Estado; etapa = c14.EtapaFormulario; }
                break;
            case 15:
                var c15 = com15Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c15 != null) { estadoPcm = c15.EstadoPCM; estado = c15.Estado; etapa = c15.EtapaFormulario; }
                break;
            case 16:
                var c16 = com16Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c16 != null) { estadoPcm = c16.EstadoPCM; estado = c16.Estado; etapa = c16.EtapaFormulario; }
                break;
            case 17:
                var c17 = com17Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c17 != null) { estadoPcm = c17.EstadoPCM; estado = c17.Estado; etapa = c17.EtapaFormulario; }
                break;
            case 18:
                var c18 = com18Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c18 != null) { estadoPcm = c18.EstadoPCM; estado = c18.Estado; etapa = c18.EtapaFormulario; }
                break;
            case 19:
                var c19 = com19Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c19 != null) { estadoPcm = c19.EstadoPCM; estado = c19.Estado; etapa = c19.EtapaFormulario; }
                break;
            case 20:
                var c20 = com20Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c20 != null) { estadoPcm = c20.EstadoPCM; estado = c20.Estado; etapa = c20.EtapaFormulario; }
                break;
            case 21:
                var c21 = com21Data.FirstOrDefault(c => c.EntidadId == entidadId);
                if (c21 != null) { estadoPcm = c21.EstadoPCM; estado = c21.Estado; etapa = c21.EtapaFormulario; }
                break;
        }

        // Si no hay registro, es "sin reportar"
        if (string.IsNullOrEmpty(estado) && string.IsNullOrEmpty(etapa))
        {
            return "sin reportar";
        }

        // Mapear estado PCM a los estados de la UI
        return estadoPcm?.ToLower() switch
        {
            "aceptado" or "validado" or "aprobado" => "aceptado",
            "observado" => "observado",
            "en_revision" or "revision" => "en revisión",
            _ => MapearEstadoEntidad(estado, etapa)
        };
    }

    private string MapearEstadoEntidad(string? estado, string? etapa)
    {
        // Mapear basado en el estado del formulario
        if (estado?.ToLower() == "bandeja" && etapa?.ToLower() == "completado")
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

    private async Task<bool> ActualizarEstadoPCM(int compromisoId, Guid entidadId, string estadoPcm, string? observaciones)
    {
        switch (compromisoId)
        {
            case 1:
                var c1 = await _context.Com1LiderGTD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c1 != null) { c1.EstadoPCM = estadoPcm; c1.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 2:
                var c2 = await _context.Com2CGTD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c2 != null) { c2.EstadoPcm = estadoPcm; c2.ObservacionesPcm = observaciones ?? ""; }
                else return false;
                break;
            case 3:
                var c3 = await _context.Com3EPGD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c3 != null) { c3.EstadoPcm = estadoPcm; c3.ObservacionesPcm = observaciones ?? ""; }
                else return false;
                break;
            case 4:
                var c4 = await _context.Com4PEI.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c4 != null) { c4.EstadoPCM = estadoPcm; c4.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 5:
                var c5 = await _context.Com5EstrategiaDigital.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c5 != null) { c5.EstadoPCM = estadoPcm; c5.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 6:
                var c6 = await _context.Com6MigracionGobPe.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c6 != null) { c6.EstadoPCM = estadoPcm; c6.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 7:
                var c7 = await _context.Com7ImplementacionMPD.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c7 != null) { c7.EstadoPCM = estadoPcm; c7.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 8:
                var c8 = await _context.Com8PublicacionTUPA.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c8 != null) { c8.EstadoPCM = estadoPcm; c8.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 9:
                var c9 = await _context.Com9ModeloGestionDocumental.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c9 != null) { c9.EstadoPCM = estadoPcm; c9.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 10:
                var c10 = await _context.Com10DatosAbiertos.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c10 != null) { c10.EstadoPCM = estadoPcm; c10.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 11:
                var c11 = await _context.Com11AportacionGeoPeru.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c11 != null) { c11.EstadoPCM = estadoPcm; c11.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 12:
                var c12 = await _context.Com12ResponsableSoftwarePublico.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c12 != null) { c12.EstadoPCM = estadoPcm; c12.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 13:
                var c13 = await _context.Com13InteroperabilidadPIDE.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c13 != null) { c13.EstadoPCM = estadoPcm; c13.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 14:
                var c14 = await _context.Com14OficialSeguridadDigital.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c14 != null) { c14.EstadoPCM = estadoPcm; c14.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 15:
                var c15 = await _context.Com15CSIRTInstitucional.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c15 != null) { c15.EstadoPCM = estadoPcm; c15.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 16:
                var c16 = await _context.Com16SistemaGestionSeguridad.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c16 != null) { c16.EstadoPCM = estadoPcm; c16.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 17:
                var c17 = await _context.Com17PlanTransicionIPv6.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c17 != null) { c17.EstadoPCM = estadoPcm; c17.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 18:
                var c18 = await _context.Com18AccesoPortalTransparencia.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c18 != null) { c18.EstadoPCM = estadoPcm; c18.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 19:
                var c19 = await _context.Com19EncuestaNacionalGobDigital.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c19 != null) { c19.EstadoPCM = estadoPcm; c19.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 20:
                var c20 = await _context.Com20DigitalizacionServiciosFacilita.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c20 != null) { c20.EstadoPCM = estadoPcm; c20.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            case 21:
                var c21 = await _context.Com21OficialGobiernoDatos.FirstOrDefaultAsync(c => c.EntidadId == entidadId && c.Activo);
                if (c21 != null) { c21.EstadoPCM = estadoPcm; c21.ObservacionesPCM = observaciones ?? ""; }
                else return false;
                break;
            default:
                return false;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    #endregion
}

public class UpdateEstadoPCMRequest
{
    public string EstadoPCM { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
}
