using System;
using System.Text.Json.Serialization;

namespace PCM.Application.DTOs.CumplimientoHistorial;

/// <summary>
/// DTO para respuesta del historial de cumplimiento
/// </summary>
public class CumplimientoHistorialResponseDto
{
    public long HistorialId { get; set; }
    public long CumplimientoId { get; set; }
    public int? EstadoAnteriorId { get; set; }
    public string? EstadoAnteriorNombre { get; set; }
    public int EstadoNuevoId { get; set; }
    public string EstadoNuevoNombre { get; set; } = string.Empty;
    public Guid UsuarioResponsableId { get; set; }
    public string UsuarioResponsableNombre { get; set; } = string.Empty;
    public string? ObservacionSnapshot { get; set; }
    public object? DatosSnapshot { get; set; } // Se deserializa el JSON para enviar como objeto
    public DateTime FechaCambio { get; set; }
    
    // Información adicional del contexto
    public long? CompromisoId { get; set; }
    public string? CompromisoNombre { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EntidadNombre { get; set; }
}

/// <summary>
/// DTO para crear un registro de historial
/// </summary>
public class CreateCumplimientoHistorialDto
{
    public long CumplimientoId { get; set; }
    public int? EstadoAnteriorId { get; set; }
    public int EstadoNuevoId { get; set; }
    public Guid UsuarioResponsableId { get; set; }
    public string? ObservacionSnapshot { get; set; }
    public object? DatosSnapshot { get; set; } // Se serializa a JSON al guardar
}

/// <summary>
/// DTO para filtros de búsqueda del historial
/// </summary>
public class CumplimientoHistorialFilterDto
{
    public long? CumplimientoId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public int? EstadoId { get; set; }
    public Guid? UsuarioId { get; set; }
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

/// <summary>
/// DTO para respuesta paginada
/// </summary>
public class CumplimientoHistorialPaginatedResponseDto
{
    public List<CumplimientoHistorialResponseDto> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
}

/// <summary>
/// Estructura genérica para el snapshot de datos.
/// Diseñada para ser flexible y permitir diferentes tipos de datos por compromiso.
/// </summary>
public class DatosSnapshotDto
{
    /// <summary>
    /// Información general del compromiso
    /// </summary>
    public CompromisoSnapshotInfo Compromiso { get; set; } = new();
    
    /// <summary>
    /// Información de la entidad
    /// </summary>
    public EntidadSnapshotInfo Entidad { get; set; } = new();
    
    /// <summary>
    /// Información del cumplimiento
    /// </summary>
    public CumplimientoSnapshotInfo Cumplimiento { get; set; } = new();
    
    /// <summary>
    /// Datos específicos del formulario del compromiso (varía según el compromiso)
    /// </summary>
    public Dictionary<string, object?> DatosFormulario { get; set; } = new();
    
    /// <summary>
    /// Datos relacionados (miembros de comité, proyectos, etc.)
    /// </summary>
    public Dictionary<string, object?> DatosRelacionados { get; set; } = new();
    
    /// <summary>
    /// Metadatos del snapshot
    /// </summary>
    public SnapshotMetadata Metadata { get; set; } = new();
}

public class CompromisoSnapshotInfo
{
    public long CompromisoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
}

public class EntidadSnapshotInfo
{
    public Guid EntidadId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Ruc { get; set; }
    public string? Clasificacion { get; set; }
    public string? Subclasificacion { get; set; }
}

public class CumplimientoSnapshotInfo
{
    public long CumplimientoId { get; set; }
    public int EstadoId { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public string? ObservacionPcm { get; set; }
    public DateTime? FechaAsignacion { get; set; }
}

public class SnapshotMetadata
{
    public DateTime FechaCaptura { get; set; } = DateTime.UtcNow;
    public string Version { get; set; } = "1.0";
    public string TipoAccion { get; set; } = string.Empty; // "ENVIO", "APROBACION", "OBSERVACION", "CORRECCION"
    public string? IpOrigen { get; set; }
}
