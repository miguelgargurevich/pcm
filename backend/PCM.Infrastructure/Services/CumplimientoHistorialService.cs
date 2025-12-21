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

            _context.CumplimientosHistorial.Add(historial);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Historial registrado: CumplimientoId={CumplimientoId}, EstadoAnterior={EstadoAnterior}, EstadoNuevo={EstadoNuevo}",
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
            // Generar snapshot de datos
            var snapshot = await GenerarSnapshotAsync(compromisoId, entidadId, cumplimientoId, tipoAccion, ipOrigen);

            var dto = new CreateCumplimientoHistorialDto
            {
                CumplimientoId = cumplimientoId,
                EstadoAnteriorId = estadoAnteriorId,
                EstadoNuevoId = estadoNuevoId,
                UsuarioResponsableId = usuarioId,
                ObservacionSnapshot = observacion,
                DatosSnapshot = snapshot
            };

            return await RegistrarCambioEstadoAsync(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al registrar historial con snapshot para compromiso {CompromisoId}", compromisoId);
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
        snapshot.DatosFormulario = await ObtenerDatosFormularioAsync(compromisoId, entidadId);
        snapshot.DatosRelacionados = await ObtenerDatosRelacionadosAsync(compromisoId, entidadId);

        return snapshot;
    }

    private async Task<Dictionary<string, object?>> ObtenerDatosFormularioAsync(long compromisoId, Guid entidadId)
    {
        var datos = new Dictionary<string, object?>();

        try
        {
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

            if (registro != null)
            {
                // Usar reflexión para obtener todas las propiedades
                var properties = registro.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
                
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
                    }
                    catch
                    {
                        // Ignorar errores de lectura
                    }
                }
            }
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

                        datos["personalTI"] = personalTI.Select(p => new { p.NombrePersona, p.Dni, p.Cargo, p.Especialidad, p.EmailPersonal }).ToList();
                        datos["totalPersonalTI"] = personalTI.Count;
                        datos["inventarioSoftware"] = software.Select(s => new { s.NombreProducto, s.Version, s.TipoSoftware, s.CantidadLicencias }).ToList();
                        datos["totalSoftware"] = software.Count;
                        datos["inventarioSistemas"] = sistemas.Select(s => new { s.NombreSistema, s.TipoSistema }).ToList();
                        datos["totalSistemas"] = sistemas.Count;
                        datos["totalRedes"] = redes.Count;
                        datos["totalServidores"] = servidores.Count;
                    }
                    break;

                case 4: // PEI - obtener objetivos, acciones y proyectos
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
                        
                        var proyectos = await _context.ProyectosEntidades
                            .Where(p => p.ComEntidadId == com4.ComtdpeiEntId)
                            .ToListAsync();

                        datos["objetivos"] = objetivos.Select(o => new { o.ObjEntId, o.TipoObj, o.NumeracionObj, o.DescripcionObjetivo }).ToList();
                        datos["totalObjetivos"] = objetivos.Count;
                        datos["acciones"] = acciones.Select(a => new { a.AccObjEntId, a.ObjEntId, a.NumeracionAcc, a.DescripcionAccion }).ToList();
                        datos["totalAcciones"] = acciones.Count;
                        datos["proyectos"] = proyectos.Select(p => new { 
                            p.ProyEntId, 
                            p.NumeracionProy,
                            p.Nombre, 
                            p.Alcance,
                            p.TipoProy,
                            p.PorcentajeAvance, 
                            p.AlineadoPgd,
                            p.EstadoProyecto
                        }).ToList();
                        datos["totalProyectos"] = proyectos.Count;
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
        var query = _context.CumplimientosHistorial
            .Include(h => h.Cumplimiento)
            .Include(h => h.UsuarioResponsable)
            .AsQueryable();

        // Aplicar filtros
        if (filtro.CumplimientoId.HasValue)
        {
            query = query.Where(h => h.CumplimientoId == filtro.CumplimientoId.Value);
        }

        if (filtro.CompromisoId.HasValue)
        {
            query = query.Where(h => h.Cumplimiento != null && h.Cumplimiento.CompromisoId == filtro.CompromisoId.Value);
        }

        if (filtro.EntidadId.HasValue)
        {
            query = query.Where(h => h.Cumplimiento != null && h.Cumplimiento.EntidadId == filtro.EntidadId.Value);
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

        // Paginar
        var historiales = await query
            .OrderByDescending(h => h.FechaCambio)
            .Skip((filtro.Page - 1) * filtro.PageSize)
            .Take(filtro.PageSize)
            .ToListAsync();

        return new CumplimientoHistorialPaginatedResponseDto
        {
            Items = await MapToResponseDtosAsync(historiales),
            TotalItems = totalItems,
            Page = filtro.Page,
            PageSize = filtro.PageSize
        };
    }

    public async Task<CumplimientoHistorialResponseDto?> ObtenerPorIdAsync(long historialId)
    {
        var historial = await _context.CumplimientosHistorial
            .Include(h => h.Cumplimiento)
                .ThenInclude(c => c!.Compromiso)
            .Include(h => h.Cumplimiento)
                .ThenInclude(c => c!.Entidad)
            .Include(h => h.UsuarioResponsable)
            .FirstOrDefaultAsync(h => h.HistorialId == historialId);

        if (historial == null) return null;

        return await MapToResponseDtoAsync(historial);
    }

    private async Task<List<CumplimientoHistorialResponseDto>> MapToResponseDtosAsync(List<CumplimientoHistorial> historiales)
    {
        var result = new List<CumplimientoHistorialResponseDto>();
        foreach (var h in historiales)
        {
            result.Add(await MapToResponseDtoAsync(h));
        }
        return result;
    }

    private async Task<CumplimientoHistorialResponseDto> MapToResponseDtoAsync(CumplimientoHistorial historial)
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

        // Cargar información adicional si no está incluida
        string? compromisoNombre = null;
        string? entidadNombre = null;
        long? compromisoId = null;
        Guid? entidadId = null;

        if (historial.Cumplimiento != null)
        {
            compromisoId = historial.Cumplimiento.CompromisoId;
            entidadId = historial.Cumplimiento.EntidadId;
            
            if (historial.Cumplimiento.Compromiso != null)
            {
                compromisoNombre = historial.Cumplimiento.Compromiso.NombreCompromiso;
            }
            else
            {
                var compromiso = await _context.CompromisosGobiernoDigital
                    .FirstOrDefaultAsync(c => c.CompromisoId == historial.Cumplimiento.CompromisoId);
                compromisoNombre = compromiso?.NombreCompromiso;
            }

            if (historial.Cumplimiento.Entidad != null)
            {
                entidadNombre = historial.Cumplimiento.Entidad.Nombre;
            }
            else
            {
                var entidad = await _context.Entidades
                    .FirstOrDefaultAsync(e => e.EntidadId == historial.Cumplimiento.EntidadId);
                entidadNombre = entidad?.Nombre;
            }
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
            UsuarioResponsableNombre = historial.UsuarioResponsable != null 
                ? $"{historial.UsuarioResponsable.Nombres} {historial.UsuarioResponsable.ApePaterno}" 
                : string.Empty,
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
            // Convertir estados de texto a IDs
            int? estadoAnteriorId = ConvertirEstadoTextoAId(estadoAnterior);
            int estadoNuevoId = ConvertirEstadoTextoAId(estadoNuevo) ?? 4; // Default EN PROCESO

            // Solo registrar si hay cambio real de estado
            if (estadoAnteriorId == estadoNuevoId)
            {
                _logger.LogDebug("No se registra historial, estado no cambió: {Estado}", estadoNuevo);
                return 0;
            }

            // Buscar cumplimiento existente
            var cumplimiento = await _context.CumplimientosNormativos
                .FirstOrDefaultAsync(c => c.CompromisoId == compromisoId && c.EntidadId == entidadId);

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
            _logger.LogWarning(ex, "Error al registrar historial desde formulario para compromiso {CompromisoId}", compromisoId);
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
