using System;

namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para gestionar el cumplimiento normativo de compromisos de gobierno digital por entidad.
/// Una entidad solo puede tener un cumplimiento por compromiso (constraint único en BD).
/// </summary>
public class CumplimientoNormativo
{
    public int CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    
    // ============================================
    // PASO 1: DATOS GENERALES DEL LÍDER
    // ============================================
    public string NroDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string CorreoElectronico { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public string? Cargo { get; set; }
    public DateTime FechaInicio { get; set; }
    
    // ============================================
    // PASO 2: NORMATIVA (Documento y Validaciones)
    // ============================================
    public string? DocumentoUrl { get; set; }
    public string? DocumentoNombre { get; set; }
    public long? DocumentoTamano { get; set; }
    public string? DocumentoTipo { get; set; }
    public DateTime? DocumentoFechaSubida { get; set; }
    
    // Checkboxes de Validación
    public bool ValidacionResolucionAutoridad { get; set; }
    public bool ValidacionLiderFuncionario { get; set; }
    public bool ValidacionDesignacionArticulo { get; set; }
    public bool ValidacionFuncionesDefinidas { get; set; }
    
    // ============================================
    // PASO 3: CONFIRMACIÓN
    // ============================================
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    
    // ============================================
    // METADATOS
    // ============================================
    public int Estado { get; set; } = 1; // 1=bandeja, 2=sin_reportar, 3=publicado
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // ============================================
    // RELACIONES DE NAVEGACIÓN
    // ============================================
    public CompromisoGobiernoDigital Compromiso { get; set; } = null!;
    public Entidad Entidad { get; set; } = null!;
}
