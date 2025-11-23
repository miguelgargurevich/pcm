using System;

namespace PCM.Application.DTOs.CumplimientoNormativo;

// ============================================
// REQUEST DTOs
// ============================================

public class CreateCumplimientoRequest
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    
    // Paso 1: Datos Generales
    public string NroDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string CorreoElectronico { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public string? Cargo { get; set; }
    public DateTime FechaInicio { get; set; }
    
    // Paso 2: Normativa
    public string? DocumentoUrl { get; set; }
    public string? DocumentoNombre { get; set; }
    public long? DocumentoTamano { get; set; }
    public string? DocumentoTipo { get; set; }
    public bool ValidacionResolucionAutoridad { get; set; }
    public bool ValidacionLiderFuncionario { get; set; }
    public bool ValidacionDesignacionArticulo { get; set; }
    public bool ValidacionFuncionesDefinidas { get; set; }
    
    // Paso 3: Confirmación
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    
    public int Estado { get; set; } = 1; // 1=bandeja
}

public class UpdateCumplimientoRequest
{
    public int CumplimientoId { get; set; }
    
    // Paso 1: Datos Generales
    public string NroDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string CorreoElectronico { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public string? Cargo { get; set; }
    public DateTime FechaInicio { get; set; }
    
    // Paso 2: Normativa
    public string? DocumentoUrl { get; set; }
    public string? DocumentoNombre { get; set; }
    public long? DocumentoTamano { get; set; }
    public string? DocumentoTipo { get; set; }
    public bool ValidacionResolucionAutoridad { get; set; }
    public bool ValidacionLiderFuncionario { get; set; }
    public bool ValidacionDesignacionArticulo { get; set; }
    public bool ValidacionFuncionesDefinidas { get; set; }
    
    // Paso 3: Confirmación
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    
    public int Estado { get; set; }
}

// ============================================
// RESPONSE DTOs
// ============================================

public class CumplimientoResponseDto
{
    public int CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    
    // Datos del Compromiso (para mostrar en listado)
    public string? NombreCompromiso { get; set; }
    
    // Datos de la Entidad (para mostrar en listado)
    public string? NombreEntidad { get; set; }
    
    // Paso 1: Datos Generales
    public string NroDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string CorreoElectronico { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public string? Cargo { get; set; }
    public DateTime FechaInicio { get; set; }
    
    // Paso 2: Normativa
    public string? DocumentoUrl { get; set; }
    public string? DocumentoNombre { get; set; }
    public long? DocumentoTamano { get; set; }
    public string? DocumentoTipo { get; set; }
    public DateTime? DocumentoFechaSubida { get; set; }
    public bool ValidacionResolucionAutoridad { get; set; }
    public bool ValidacionLiderFuncionario { get; set; }
    public bool ValidacionDesignacionArticulo { get; set; }
    public bool ValidacionFuncionesDefinidas { get; set; }
    
    // Paso 3: Confirmación
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    
    // Metadatos
    public int Estado { get; set; } // 1=bandeja, 2=sin_reportar, 3=publicado
    public string? EstadoNombre { get; set; } // Para mostrar en UI
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// DTO simplificado para listado
public class CumplimientoListItemDto
{
    public int CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public string NombreEntidad { get; set; } = string.Empty;
    public string NombreLider { get; set; } = string.Empty; // Nombres + Apellidos
    public int Estado { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool TieneDocumento { get; set; }
}
