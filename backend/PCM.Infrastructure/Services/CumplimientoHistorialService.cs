using System.Reflection;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.DTOs.CumplimientoHistorial;
using PCM.Application.Interfaces;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Services;

/// <summary>
/// Servicio para gestionar el historial de cambios de estado de cumplimiento de compromisos.
/// Registra cada transición de estado con un snapshot de datos para auditoría y trazabilidad.
/// </summary>
public class CumplimientoHistorialService : ICumplimientoHistorialService
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CumplimientoHistorialService> _logger;
    
    // Nombres de estados para referencias rápidas
    private static readonly Dictionary<int, string> EstadosNombres = new()
    {
        { 1, "PENDIENTE" },
        { 2, "SIN REPORTAR" },
        { 3, "NO EXIGIBLE" },
        { 4, "EN PROCESO" },
        { 5, "ENVIADO" },
        { 6, "EN REVISIÓN" },
        { 7, "OBSERVADO" },
        { 8, "ACEPTADO" }
    };

    public CumplimientoHistorialService(PCMDbContext context, ILogger<CumplimientoHistorialService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<long> RegistrarCambioEstadoAsync(CreateCumplimientoHistorialDto dto)
    {
        try
        {
            _logger.LogInformation("🔵 RegistrarCambioEstadoAsync - Iniciando...");
            _logger.LogInformation("🔵 DatosSnapshot es null: {EsNull}, Tiene elementos: {Count}", 
                dto.DatosSnapshot == null, 
                dto.DatosSnapshot?.GetType().GetProperty("Count")?.GetValue(dto.DatosSnapshot) ?? "N/A");

            var historial = new CumplimientoHistorial
            {
                CumplimientoId = dto.CumplimientoId,
                EstadoAnteriorId = dto.EstadoAnteriorId,
                EstadoNuevoId = dto.EstadoNuevoId,
                UsuarioResponsableId = dto.UsuarioResponsableId,
                ObservacionSnapshot = dto.ObservacionSnapshot,
                DatosSnapshot = dto.DatosSnapshot != null 
                    ? JsonSerializer.Serialize(dto.DatosSnapshot, new JsonSerializerOptions { WriteIndented = false })
                    : null,
                FechaCambio = DateTime.UtcNow
            };

            _logger.LogInformation("🔵 DatosSnapshot JSON length: {Length}", 
                historial.DatosSnapshot?.Length ?? 0);

            _context.CumplimientosHistorial.Add(historial);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "✅ Historial registrado: CumplimientoId={CumplimientoId}, EstadoAnterior={EstadoAnterior}, EstadoNuevo={EstadoNuevo}",
                dto.CumplimientoId, dto.EstadoAnteriorId, dto.EstadoNuevoId);

            return historial.HistorialId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al registrar historial de cumplimiento");
            throw;
        }
    }

    public async Task<long> RegistrarCambioConSnapshotAsync(
        long cumplimientoId,
        long compromisoId,
        Guid entidadId,
        int? estadoAnteriorId,
        int estadoNuevoId,
        Guid usuarioId,
        string? observacion,
        string tipoAccion,
        string? ipOrigen = null)
    {
        try
        {
            _logger.LogInformation("🟢 RegistrarCambioConSnapshotAsync - CumplimientoId={CumplimientoId}, CompromisoId={CompromisoId}, EstadoAnteriorId={EstadoAnteriorId}, EstadoNuevoId={EstadoNuevoId}",
                cumplimientoId, compromisoId, estadoAnteriorId, estadoNuevoId);
            
            // Generar snapshot de datos
            var snapshot = await GenerarSnapshotAsync(compromisoId, entidadId, cumplimientoId, tipoAccion, ipOrigen);

            _logger.LogInformation("🟢 Snapshot generado. Registrando en BD...");

            var dto = new CreateCumplimientoHistorialDto
            {
                CumplimientoId = cumplimientoId,
                EstadoAnteriorId = estadoAnteriorId,
                EstadoNuevoId = estadoNuevoId,
                UsuarioResponsableId = usuarioId,
                ObservacionSnapshot = observacion,
                DatosSnapshot = snapshot
            };

            var historialId = await RegistrarCambioEstadoAsync(dto);
            
            _logger.LogInformation("✅ Historial registrado exitosamente con ID={HistorialId}", historialId);
            
            return historialId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ ERROR al registrar historial con snapshot para compromiso {CompromisoId}", compromisoId);
            throw;
        }
    }

    public async Task<DatosSnapshotDto> GenerarSnapshotAsync(
        long compromisoId, 
        Guid entidadId, 
        long cumplimientoId,
        string tipoAccion,
        string? ipOrigen = null)
    {
        var snapshot = new DatosSnapshotDto
        {
            Metadata = new SnapshotMetadata
            {
                FechaCaptura = DateTime.UtcNow,
                Version = "1.0",
                TipoAccion = tipoAccion,
                IpOrigen = ipOrigen
            }
        };

        // Obtener información del compromiso
        var compromiso = await _context.CompromisosGobiernoDigital
            .FirstOrDefaultAsync(c => c.CompromisoId == compromisoId);
        
        if (compromiso != null)
        {
            snapshot.Compromiso = new CompromisoSnapshotInfo
            {
                CompromisoId = compromiso.CompromisoId,
                Nombre = compromiso.NombreCompromiso,
                Descripcion = compromiso.Descripcion
            };
        }

        // Obtener información de la entidad
        var entidad = await _context.Entidades
            .Include(e => e.Clasificacion)
                .ThenInclude(c => c!.Clasificacion)
            .FirstOrDefaultAsync(e => e.EntidadId == entidadId);
        
        if (entidad != null)
        {
            snapshot.Entidad = new EntidadSnapshotInfo
            {
                EntidadId = entidad.EntidadId,
                Nombre = entidad.Nombre,
                Ruc = entidad.Ruc,
                Clasificacion = entidad.Clasificacion?.Clasificacion?.Nombre,
                Subclasificacion = entidad.Clasificacion?.Nombre
            };
        }

        // Obtener información del cumplimiento
        var cumplimiento = await _context.CumplimientosNormativos
            .FirstOrDefaultAsync(c => c.CumplimientoId == cumplimientoId);
        
        if (cumplimiento != null)
        {
            snapshot.Cumplimiento = new CumplimientoSnapshotInfo
            {
                CumplimientoId = cumplimiento.CumplimientoId,
                EstadoId = cumplimiento.EstadoId,
                EstadoNombre = EstadosNombres.GetValueOrDefault(cumplimiento.EstadoId, "DESCONOCIDO"),
                ObservacionPcm = cumplimiento.ObservacionPcm,
                FechaAsignacion = cumplimiento.FechaAsignacion
            };
        }

        // Obtener datos específicos del formulario según el compromiso
        _logger.LogInformation("🔵 Antes de ObtenerDatosFormularioAsync");
        snapshot.DatosFormulario = await ObtenerDatosFormularioAsync(compromisoId, entidadId);
        _logger.LogInformation("🔵 Después de ObtenerDatosFormularioAsync, DatosFormulario tiene {Count} elementos", 
            snapshot.DatosFormulario?.Count ?? 0);
        
        snapshot.DatosRelacionados = await ObtenerDatosRelacionadosAsync(compromisoId, entidadId);

        _logger.LogInformation("🟢 Snapshot generado completo con {CountFormulario} datos formulario y {CountRelacionados} datos relacionados",
            snapshot.DatosFormulario?.Count ?? 0, snapshot.DatosRelacionados?.Count ?? 0);

        return snapshot;
    }

    private async Task<Dictionary<string, object?>> ObtenerDatosFormularioAsync(long compromisoId, Guid entidadId)
    {
        var datos = new Dictionary<string, object?>();

        try
        {
            _logger.LogInformation("🔵 ObtenerDatosFormularioAsync - CompromisoId={CompromisoId}, EntidadId={EntidadId}", 
                compromisoId, entidadId);
            
            object? registro = compromisoId switch
            {
                1 => await _context.Com1LiderGTD
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                2 => await _context.Com2CGTD
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                3 => await _context.Com3EPGD
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                4 => await _context.Com4PEI
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                5 => await _context.Com5EstrategiaDigital
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                6 => await _context.Com6MigracionGobPe
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                7 => await _context.Com7ImplementacionMPD
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                8 => await _context.Com8PublicacionTUPA
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                9 => await _context.Com9ModeloGestionDocumental
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                10 => await _context.Com10DatosAbiertos
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                11 => await _context.Com11AportacionGeoPeru
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                12 => await _context.Com12ResponsableSoftwarePublico
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                13 => await _context.Com13InteroperabilidadPIDE
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                14 => await _context.Com14OficialSeguridadDigital
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                15 => await _context.Com15CSIRTInstitucional
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                16 => await _context.Com16SistemaGestionSeguridad
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                17 => await _context.Com17PlanTransicionIPv6
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                18 => await _context.Com18AccesoPortalTransparencia
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                19 => await _context.Com19EncuestaNacionalGobDigital
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                20 => await _context.Com20DigitalizacionServiciosFacilita
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                21 => await _context.Com21OficialGobiernoDatos
                    .Where(c => c.EntidadId == entidadId && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(),
                    
                _ => null
            };

            _logger.LogInformation("🔵 Registro encontrado: {RegistroEncontrado}, Tipo: {TipoRegistro}", 
                registro != null, registro?.GetType().Name);

            if (registro != null)
            {
                // Usar reflexión para obtener todas las propiedades
                var properties = registro.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
                
                _logger.LogInformation("🔵 Total propiedades encontradas: {TotalPropiedades}", properties.Length);
                
                foreach (var prop in properties)
                {
                    // Excluir propiedades de navegación
                    if (prop.PropertyType.IsClass && 
                        prop.PropertyType != typeof(string) &&
                        !prop.PropertyType.IsValueType &&
                        prop.PropertyType.Namespace?.StartsWith("PCM.Domain") == true)
                    {
                        continue;
                    }

                    try
                    {
                        var value = prop.GetValue(registro);
                        // Convertir nombres PascalCase a camelCase para consistencia JSON
                        var key = char.ToLowerInvariant(prop.Name[0]) + prop.Name[1..];
                        datos[key] = value;
                        _logger.LogInformation("   ✅ {PropiedadNombre} ({PropiedadTipo}) = {Valor}", 
                            prop.Name, prop.PropertyType.Name, value);
                    }
                    catch
                    {
                        // Ignorar errores de lectura
                    }
                }
            }
            
            _logger.LogInformation("🟢 Total datos capturados: {TotalDatos}", datos.Count);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error al obtener datos del formulario para compromiso {CompromisoId}", compromisoId);
            datos["error"] = $"Error al obtener datos: {ex.Message}";
        }

        return datos;
    }

    private async Task<Dictionary<string, object?>> ObtenerDatosRelacionadosAsync(long compromisoId, Guid entidadId)
    {
        var datos = new Dictionary<string, object?>();

        try
        {
            switch (compromisoId)
            {
                case 2: // Comité GTD - obtener miembros
                    var com2 = await _context.Com2CGTD
                        .Where(c => c.EntidadId == entidadId && c.Activo)
                        .OrderByDescending(c => c.CreatedAt)
                        .FirstOrDefaultAsync();
                    
                    if (com2 != null)
                    {
                        var miembros = await _context.ComiteMiembros
                            .Where(m => m.ComEntidadId == com2.ComcgtdEntId && m.Activo)
                            .ToListAsync();
                        
                        datos["miembrosComite"] = miembros.Select(m => new
                        {
                            m.MiembroId,
                            m.Dni,
                            m.Nombre,
                            m.ApellidoPaterno,
                            m.ApellidoMaterno,
                            m.Email,
                            m.Telefono,
                            m.Rol,
                            m.Cargo
                        }).ToList();
                        datos["totalMiembros"] = miembros.Count;
                    }
                    break;

                case 3: // Plan Gobierno Digital - obtener personal TI, inventarios, etc.
                    var com3 = await _context.Com3EPGD
                        .Where(c => c.EntidadId == entidadId && c.Activo)
                        .OrderByDescending(c => c.CreatedAt)
                        .FirstOrDefaultAsync();
                    
                    if (com3 != null)
                    {
                        var personalTI = await _context.PersonalTI
                            .Where(p => p.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();
                        
                        var software = await _context.InventarioSoftware
                            .Where(s => s.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();
                        
                        var sistemas = await _context.InventarioSistemasInfo
                            .Where(s => s.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();

                        var redes = await _context.InventarioRed
                            .Where(r => r.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();

                        var servidores = await _context.InventarioServidores
                            .Where(s => s.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();

                        var objetivos = await _context.ObjetivosEntidades
                            .Where(o => o.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();

                        var accionesIds = objetivos.Select(o => o.ObjEntId).ToList();
                        var acciones = await _context.AccionesObjetivosEntidades
                            .Where(a => accionesIds.Contains(a.ObjEntId))
                            .ToListAsync();
                        
                        var proyectos = await _context.ProyectosEntidades
                            .Where(p => p.ComEntidadId == com3.ComepgdEntId)
                            .ToListAsync();

                        datos["personalTI"] = personalTI.Select(p => new { p.NombrePersona, p.Dni, p.Cargo, p.Especialidad, p.EmailPersonal }).ToList();
                        datos["totalPersonalTI"] = personalTI.Count;
                        datos["inventarioSoftware"] = software.Select(s => new { s.NombreProducto, s.Version, s.TipoSoftware, s.CantidadLicencias }).ToList();
                        datos["totalSoftware"] = software.Count;
                        datos["inventarioSistemas"] = sistemas.Select(s => new { s.NombreSistema, s.TipoSistema }).ToList();
                        datos["totalSistemas"] = sistemas.Count;
                        datos["inventarioRed"] = redes.Select(r => new { r.TipoEquipo, r.Cantidad, r.PuertosOperativos, r.PuertosInoperativos, r.TotalPuertos, r.CostoMantenimientoAnual }).ToList();
                        datos["totalRedes"] = redes.Count;
                        datos["inventarioServidores"] = servidores.Select(s => new { s.NombreEquipo, s.TipoEquipo, s.Estado, s.Capa, s.Propiedad, s.MarcaCpu, s.ModeloCpu, s.VelocidadGhz, s.Nucleos, s.MemoriaGb }).ToList();
                        datos["totalServidores"] = servidores.Count;
                        datos["objetivos"] = objetivos.Select(o => new { o.ObjEntId, o.TipoObj, o.NumeracionObj, o.DescripcionObjetivo }).ToList();
                        datos["totalObjetivos"] = objetivos.Count;
                        datos["acciones"] = acciones.Select(a => new { a.AccObjEntId, a.ObjEntId, a.NumeracionAcc, a.DescripcionAccion }).ToList();
                        datos["totalAcciones"] = acciones.Count;
                        datos["proyectos"] = proyectos.Select(p => new { p.ProyEntId, p.NumeracionProy, p.Nombre, p.Alcance, p.TipoProy, p.PorcentajeAvance }).ToList();
                        datos["totalProyectos"] = proyectos.Count;
                    }
                    break;

                case 4: // PEI - obtener objetivos y acciones (SIN proyectos, los proyectos son del Compromiso 3)
                    var com4 = await _context.Com4PEI
                        .Where(c => c.EntidadId == entidadId && c.Activo)
                        .OrderByDescending(c => c.CreatedAt)
                        .FirstOrDefaultAsync();
                    
                    if (com4 != null)
                    {
                        var objetivos = await _context.ObjetivosEntidades
                            .Where(o => o.ComEntidadId == com4.ComtdpeiEntId)
                            .ToListAsync();

                        var accionesIds = objetivos.Select(o => o.ObjEntId).ToList();
                        var acciones = await _context.AccionesObjetivosEntidades
                            .Where(a => accionesIds.Contains(a.ObjEntId))
                            .ToListAsync();

                        datos["objetivos"] = objetivos.Select(o => new { o.ObjEntId, o.TipoObj, o.NumeracionObj, o.DescripcionObjetivo }).ToList();
                        datos["totalObjetivos"] = objetivos.Count;
                        datos["acciones"] = acciones.Select(a => new { a.AccObjEntId, a.ObjEntId, a.NumeracionAcc, a.DescripcionAccion }).ToList();
                        datos["totalAcciones"] = acciones.Count;
                        // NOTA: Los proyectos NO se incluyen aquí, pertenecen al Compromiso 3 (Portafolio de Proyectos)
                    }
                    break;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error al obtener datos relacionados para compromiso {CompromisoId}", compromisoId);
            datos["error"] = $"Error al obtener datos relacionados: {ex.Message}";
        }

        return datos;
    }

    public async Task<List<CumplimientoHistorialResponseDto>> ObtenerHistorialPorCumplimientoAsync(long cumplimientoId)
    {
        var historiales = await _context.CumplimientosHistorial
            .Where(h => h.CumplimientoId == cumplimientoId)
            .Include(h => h.Cumplimiento)
            .Include(h => h.UsuarioResponsable)
            .OrderByDescending(h => h.FechaCambio)
            .ToListAsync();

        return await MapToResponseDtosAsync(historiales);
    }

    public async Task<List<CumplimientoHistorialResponseDto>> ObtenerHistorialPorEntidadAsync(Guid entidadId)
    {
        var cumplimientoIds = await _context.CumplimientosNormativos
            .Where(c => c.EntidadId == entidadId)
            .Select(c => c.CumplimientoId)
            .ToListAsync();

        var historiales = await _context.CumplimientosHistorial
            .Where(h => cumplimientoIds.Contains(h.CumplimientoId))
            .Include(h => h.Cumplimiento)
            .Include(h => h.UsuarioResponsable)
            .OrderByDescending(h => h.FechaCambio)
            .ToListAsync();

        return await MapToResponseDtosAsync(historiales);
    }

    public async Task<CumplimientoHistorialPaginatedResponseDto> ObtenerHistorialFiltradoAsync(CumplimientoHistorialFilterDto filtro)
    {
        _logger.LogInformation("🔍 ObtenerHistorialFiltradoAsync - Filtros: CompromisoId={CompromisoId}, EntidadId={EntidadId}, EstadoId={EstadoId}, FechaDesde={FechaDesde}, FechaHasta={FechaHasta}",
            filtro.CompromisoId, filtro.EntidadId, filtro.EstadoId, filtro.FechaDesde, filtro.FechaHasta);
        
        // NO usar Include aquí porque genera INNER JOINs que filtran registros
        // Las relaciones se cargarán manualmente en MapToResponseDtoAsync
        var query = _context.CumplimientosHistorial
            .AsQueryable();

        _logger.LogInformation("🔍 Total registros en cumplimiento_historial: {Total}", await _context.CumplimientosHistorial.CountAsync());

        // Aplicar filtros
        if (filtro.CumplimientoId.HasValue)
        {
            query = query.Where(h => h.CumplimientoId == filtro.CumplimientoId.Value);
        }

        if (filtro.CompromisoId.HasValue)
        {
            // Usar subquery en lugar de Include para evitar INNER JOIN
            var cumplimientoIds = await _context.CumplimientosNormativos
                .Where(c => c.CompromisoId == filtro.CompromisoId.Value)
                .Select(c => c.CumplimientoId)
                .ToListAsync();
            query = query.Where(h => cumplimientoIds.Contains(h.CumplimientoId));
        }

        if (filtro.EntidadId.HasValue)
        {
            // Usar subquery en lugar de Include para evitar INNER JOIN
            var cumplimientoIds = await _context.CumplimientosNormativos
                .Where(c => c.EntidadId == filtro.EntidadId.Value)
                .Select(c => c.CumplimientoId)
                .ToListAsync();
            query = query.Where(h => cumplimientoIds.Contains(h.CumplimientoId));
        }

        if (filtro.EstadoId.HasValue)
        {
            query = query.Where(h => h.EstadoNuevoId == filtro.EstadoId.Value || h.EstadoAnteriorId == filtro.EstadoId.Value);
        }

        if (filtro.UsuarioId.HasValue)
        {
            query = query.Where(h => h.UsuarioResponsableId == filtro.UsuarioId.Value);
        }

        if (filtro.FechaDesde.HasValue)
        {
            query = query.Where(h => h.FechaCambio >= filtro.FechaDesde.Value);
        }

        if (filtro.FechaHasta.HasValue)
        {
            query = query.Where(h => h.FechaCambio <= filtro.FechaHasta.Value);
        }

        // Contar total
        var totalItems = await query.CountAsync();

        _logger.LogInformation("🔍 Items encontrados después de filtros: {TotalItems}", totalItems);

        // Paginar
        var historiales = await query
            .OrderByDescending(h => h.FechaCambio)
            .Skip((filtro.Page - 1) * filtro.PageSize)
            .Take(filtro.PageSize)
            .ToListAsync();

        _logger.LogInformation("🔍 Historiales obtenidos de la BD: {Count}", historiales.Count);
        
        var mappedItems = await MapToResponseDtosAsync(historiales);
        
        _logger.LogInformation("🔍 Items mapeados: {Count}", mappedItems.Count);

        var result = new CumplimientoHistorialPaginatedResponseDto
        {
            Items = mappedItems,
            TotalItems = totalItems,
            Page = filtro.Page,
            PageSize = filtro.PageSize
        };
        
        _logger.LogInformation("🔍 Respuesta final - Items: {ItemsCount}, TotalItems: {TotalItems}, Page: {Page}, PageSize: {PageSize}", 
            result.Items.Count, result.TotalItems, result.Page, result.PageSize);

        return result;
    }

    public async Task<CumplimientoHistorialResponseDto?> ObtenerPorIdAsync(long historialId)
    {
        var historial = await _context.CumplimientosHistorial
            .FirstOrDefaultAsync(h => h.HistorialId == historialId);

        if (historial == null) return null;

        // Cargar relaciones manualmente
        var cumplimiento = await _context.CumplimientosNormativos
            .FirstOrDefaultAsync(c => c.CumplimientoId == historial.CumplimientoId);
        
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.UserId == historial.UsuarioResponsableId);

        CompromisoGobiernoDigital? compromiso = null;
        Entidad? entidad = null;
        
        if (cumplimiento != null)
        {
            compromiso = await _context.CompromisosGobiernoDigital
                .FirstOrDefaultAsync(c => c.CompromisoId == cumplimiento.CompromisoId);
            entidad = await _context.Entidades
                .FirstOrDefaultAsync(e => e.EntidadId == cumplimiento.EntidadId);
        }

        return MapToResponseDtoSingle(historial, cumplimiento, usuario, compromiso, entidad);
    }

    private async Task<List<CumplimientoHistorialResponseDto>> MapToResponseDtosAsync(List<CumplimientoHistorial> historiales)
    {
        // Cargar todas las relaciones necesarias en una sola consulta para evitar N+1
        var cumplimientoIds = historiales.Select(h => h.CumplimientoId).Distinct().ToList();
        var usuarioIds = historiales.Select(h => h.UsuarioResponsableId).Distinct().ToList();

        var cumplimientos = await _context.CumplimientosNormativos
            .Where(c => cumplimientoIds.Contains(c.CumplimientoId))
            .ToDictionaryAsync(c => c.CumplimientoId);

        var usuarios = await _context.Usuarios
            .Where(u => usuarioIds.Contains(u.UserId))
            .ToDictionaryAsync(u => u.UserId);

        _logger.LogInformation("🔍 Usuarios cargados: {Count} de {Total} IDs únicos", usuarios.Count, usuarioIds.Count);
        
        // Log de usuarios no encontrados
        var usuariosNoEncontrados = usuarioIds.Where(id => !usuarios.ContainsKey(id)).ToList();
        if (usuariosNoEncontrados.Any())
        {
            _logger.LogWarning("⚠️ Usuarios NO encontrados en BD: {Count} - IDs: {Ids}", 
                usuariosNoEncontrados.Count, 
                string.Join(", ", usuariosNoEncontrados.Take(5)));
        }

        var compromisoIds = cumplimientos.Values.Select(c => c.CompromisoId).Distinct().ToList();
        var entidadIds = cumplimientos.Values.Select(c => c.EntidadId).Distinct().ToList();

        var compromisos = await _context.CompromisosGobiernoDigital
            .Where(c => compromisoIds.Contains(c.CompromisoId))
            .ToDictionaryAsync(c => c.CompromisoId);

        var entidades = await _context.Entidades
            .Where(e => entidadIds.Contains(e.EntidadId))
            .ToDictionaryAsync(e => e.EntidadId);

        // Mapear cada historial
        var result = new List<CumplimientoHistorialResponseDto>();
        foreach (var h in historiales)
        {
            result.Add(MapToResponseDto(h, cumplimientos, usuarios, compromisos, entidades));
        }
        return result;
    }

    private CumplimientoHistorialResponseDto MapToResponseDto(
        CumplimientoHistorial historial,
        Dictionary<long, CumplimientoNormativo> cumplimientos,
        Dictionary<Guid, Usuario> usuarios,
        Dictionary<long, CompromisoGobiernoDigital> compromisos,
        Dictionary<Guid, Entidad> entidades)
    {
        object? datosSnapshotObj = null;
        if (!string.IsNullOrEmpty(historial.DatosSnapshot))
        {
            try
            {
                datosSnapshotObj = JsonSerializer.Deserialize<object>(historial.DatosSnapshot);
            }
            catch
            {
                datosSnapshotObj = historial.DatosSnapshot;
            }
        }

        // Obtener datos de las relaciones usando los diccionarios
        string? compromisoNombre = null;
        string? entidadNombre = null;
        long? compromisoId = null;
        Guid? entidadId = null;
        string? usuarioNombre = "Sistema";

        if (cumplimientos.TryGetValue(historial.CumplimientoId, out var cumplimiento))
        {
            compromisoId = cumplimiento.CompromisoId;
            entidadId = cumplimiento.EntidadId;

            if (compromisos.TryGetValue(cumplimiento.CompromisoId, out var compromiso))
            {
                compromisoNombre = compromiso.NombreCompromiso;
            }

            if (entidades.TryGetValue(cumplimiento.EntidadId, out var entidad))
            {
                entidadNombre = entidad.Nombre;
            }
        }

        if (usuarios.TryGetValue(historial.UsuarioResponsableId, out var usuario))
        {
            usuarioNombre = $"{usuario.Nombres} {usuario.ApePaterno}";
        }

        return new CumplimientoHistorialResponseDto
        {
            HistorialId = historial.HistorialId,
            CumplimientoId = historial.CumplimientoId,
            EstadoAnteriorId = historial.EstadoAnteriorId,
            EstadoAnteriorNombre = historial.EstadoAnteriorId.HasValue 
                ? EstadosNombres.GetValueOrDefault(historial.EstadoAnteriorId.Value, "DESCONOCIDO") 
                : null,
            EstadoNuevoId = historial.EstadoNuevoId,
            EstadoNuevoNombre = EstadosNombres.GetValueOrDefault(historial.EstadoNuevoId, "DESCONOCIDO"),
            UsuarioResponsableId = historial.UsuarioResponsableId,
            UsuarioResponsableNombre = usuarioNombre,
            ObservacionSnapshot = historial.ObservacionSnapshot,
            DatosSnapshot = datosSnapshotObj,
            FechaCambio = historial.FechaCambio,
            CompromisoId = compromisoId,
            CompromisoNombre = compromisoNombre,
            EntidadId = entidadId,
            EntidadNombre = entidadNombre
        };
    }

    private CumplimientoHistorialResponseDto MapToResponseDtoSingle(
        CumplimientoHistorial historial,
        CumplimientoNormativo? cumplimiento,
        Usuario? usuario,
        CompromisoGobiernoDigital? compromiso,
        Entidad? entidad)
    {
        object? datosSnapshotObj = null;
        if (!string.IsNullOrEmpty(historial.DatosSnapshot))
        {
            try
            {
                datosSnapshotObj = JsonSerializer.Deserialize<object>(historial.DatosSnapshot);
            }
            catch
            {
                datosSnapshotObj = historial.DatosSnapshot;
            }
        }

        string? compromisoNombre = compromiso?.NombreCompromiso;
        string? entidadNombre = entidad?.Nombre;
        long? compromisoId = cumplimiento?.CompromisoId;
        Guid? entidadId = cumplimiento?.EntidadId;
        string usuarioNombre = usuario != null 
            ? $"{usuario.Nombres} {usuario.ApePaterno}" 
            : "Sistema";

        return new CumplimientoHistorialResponseDto
        {
            HistorialId = historial.HistorialId,
            CumplimientoId = historial.CumplimientoId,
            EstadoAnteriorId = historial.EstadoAnteriorId,
            EstadoAnteriorNombre = historial.EstadoAnteriorId.HasValue 
                ? EstadosNombres.GetValueOrDefault(historial.EstadoAnteriorId.Value, "DESCONOCIDO") 
                : null,
            EstadoNuevoId = historial.EstadoNuevoId,
            EstadoNuevoNombre = EstadosNombres.GetValueOrDefault(historial.EstadoNuevoId, "DESCONOCIDO"),
            UsuarioResponsableId = historial.UsuarioResponsableId,
            UsuarioResponsableNombre = usuarioNombre,
            ObservacionSnapshot = historial.ObservacionSnapshot,
            DatosSnapshot = datosSnapshotObj,
            FechaCambio = historial.FechaCambio,
            CompromisoId = compromisoId,
            CompromisoNombre = compromisoNombre,
            EntidadId = entidadId,
            EntidadNombre = entidadNombre
        };
    }

    public async Task<long> RegistrarCambioDesdeFormularioAsync(
        long compromisoId,
        Guid entidadId,
        string? estadoAnterior,
        string estadoNuevo,
        Guid usuarioId,
        string? observacion = null,
        string tipoAccion = "ENVIO",
        string? ipOrigen = null)
    {
        try
        {
            _logger.LogInformation("🔵 RegistrarCambioDesdeFormularioAsync INICIO - CompromisoId={CompromisoId}, EntidadId={EntidadId}, EstadoAnterior={EstadoAnterior}, EstadoNuevo={EstadoNuevo}, TipoAccion={TipoAccion}",
                compromisoId, entidadId, estadoAnterior, estadoNuevo, tipoAccion);
            
            // Convertir estados de texto a IDs
            int? estadoAnteriorId = ConvertirEstadoTextoAId(estadoAnterior);
            int estadoNuevoId = ConvertirEstadoTextoAId(estadoNuevo) ?? 4; // Default EN PROCESO

            _logger.LogInformation("🔵 Estados convertidos - AnteriorId={EstadoAnteriorId}, NuevoId={EstadoNuevoId}",
                estadoAnteriorId, estadoNuevoId);

            // COMENTADO: Permitir registro incluso si el estado no cambió (para auditoría)
            // if (estadoAnteriorId == estadoNuevoId)
            // {
            //     _logger.LogWarning("⚠️ No se registra historial, estado no cambió: {Estado}", estadoNuevo);
            //     return 0;
            // }

            // Buscar cumplimiento existente
            var cumplimiento = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.CompromisoId == compromisoId && c.EntidadId == entidadId);

            _logger.LogInformation("🔵 Cumplimiento existente: {Existe}, CumplimientoId={CumplimientoId}",
                cumplimiento != null ? "SÍ" : "NO", cumplimiento?.CumplimientoId);

            long cumplimientoId;

            if (cumplimiento != null)
            {
                cumplimientoId = cumplimiento.CumplimientoId;
                // Actualizar estado en cumplimiento_normativo
                cumplimiento.EstadoId = estadoNuevoId;
                cumplimiento.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Crear nuevo registro de cumplimiento
                var nuevoCumplimiento = new CumplimientoNormativo
                {
                    CompromisoId = compromisoId,
                    EntidadId = entidadId,
                    EstadoId = estadoNuevoId,
                    FechaAsignacion = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.CumplimientosNormativos.Add(nuevoCumplimiento);
                await _context.SaveChangesAsync();
                cumplimientoId = nuevoCumplimiento.CumplimientoId;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("🔵 CumplimientoId={CumplimientoId} actualizado/creado. Llamando RegistrarCambioConSnapshotAsync...",
                cumplimientoId);

            // Registrar en historial
            return await RegistrarCambioConSnapshotAsync(
                cumplimientoId: cumplimientoId,
                compromisoId: compromisoId,
                entidadId: entidadId,
                estadoAnteriorId: estadoAnteriorId,
                estadoNuevoId: estadoNuevoId,
                usuarioId: usuarioId,
                observacion: observacion,
                tipoAccion: tipoAccion,
                ipOrigen: ipOrigen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ ERROR al registrar historial desde formulario para compromiso {CompromisoId}", compromisoId);
            return 0; // No fallar la operación principal
        }
    }

    private int? ConvertirEstadoTextoAId(string? estado)
    {
        if (string.IsNullOrEmpty(estado)) return null;
        
        return estado.ToLower().Trim() switch
        {
            "aceptado" or "aprobado" or "publicado" => 8, // ACEPTADO
            "observado" => 7, // OBSERVADO
            "en_revision" or "en revisión" or "en revision" => 6, // EN REVISIÓN
            "enviado" => 5, // ENVIADO
            "en_proceso" or "en proceso" or "borrador" => 4, // EN PROCESO
            "no_exigible" or "no exigible" => 3, // NO EXIGIBLE
            "sin_reportar" or "sin reportar" => 2, // SIN REPORTAR
            "pendiente" => 1, // PENDIENTE
            _ => null
        };
    }
}
