using System;
using System.Text.Json.Serialization;

namespace PCM.Application.DTOs.CumplimientoNormativo;

// ============================================
// REQUEST DTOs (adaptados a estructura Supabase)
// ============================================

public class CreateCumplimientoRequest
{
    [JsonPropertyName("compromiso_id")]
    public long CompromisoId { get; set; }
    
    [JsonPropertyName("entidad_id")]
    public Guid EntidadId { get; set; }
    
    [JsonPropertyName("estado_id")]
    public int EstadoId { get; set; } = 1; // 1=pendiente, 2=en_proceso, 3=completado
    
    [JsonPropertyName("operador_id")]
    public Guid? OperadorId { get; set; }
    
    [JsonPropertyName("fecha_asignacion")]
    public DateTime? FechaAsignacion { get; set; }
    
    [JsonPropertyName("observacion_pcm")]
    public string? ObservacionPcm { get; set; }
    
    // Campos adicionales para formulario
    [JsonPropertyName("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }
    
    [JsonPropertyName("documento_url")]
    public string? DocumentoUrl { get; set; }
    
    [JsonPropertyName("acepta_politica_privacidad")]
    public bool AceptaPoliticaPrivacidad { get; set; }
    
    [JsonPropertyName("acepta_declaracion_jurada")]
    public bool AceptaDeclaracionJurada { get; set; }
    
    [JsonPropertyName("etapa_formulario")]
    public string? EtapaFormulario { get; set; }
}

public class UpdateCumplimientoRequest
{
    [JsonPropertyName("cumplimiento_id")]
    public long CumplimientoId { get; set; }
    
    [JsonPropertyName("estado_id")]
    public int EstadoId { get; set; }
    
    [JsonPropertyName("operador_id")]
    public Guid? OperadorId { get; set; }
    
    [JsonPropertyName("fecha_asignacion")]
    public DateTime? FechaAsignacion { get; set; }
    
    [JsonPropertyName("observacion_pcm")]
    public string? ObservacionPcm { get; set; }
    
    // Campos adicionales para formulario
    [JsonPropertyName("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }
    
    [JsonPropertyName("documento_url")]
    public string? DocumentoUrl { get; set; }
    
    [JsonPropertyName("acepta_politica_privacidad")]
    public bool AceptaPoliticaPrivacidad { get; set; }
    
    [JsonPropertyName("acepta_declaracion_jurada")]
    public bool AceptaDeclaracionJurada { get; set; }
    
    [JsonPropertyName("etapa_formulario")]
    public string? EtapaFormulario { get; set; }
}

// ============================================
// RESPONSE DTOs
// ============================================

public class CumplimientoResponseDto
{
    public long CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public int EstadoId { get; set; }
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
    
    // Campos adicionales para formulario
    public string? CriteriosEvaluados { get; set; }
    public string? DocumentoUrl { get; set; }
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    public string? EtapaFormulario { get; set; }
    
    // Datos del Compromiso (para mostrar en listado)
    public string? NombreCompromiso { get; set; }
    
    // Datos de la Entidad (para mostrar en listado)
    public string? NombreEntidad { get; set; }
    
    // Estado descriptivo
    public string? EstadoNombre { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// DTO simplificado para listado
public class CumplimientoListItemDto
{
    public long CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public Guid EntidadId { get; set; }
    public string NombreEntidad { get; set; } = string.Empty;
    public int EstadoId { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
    
    // Campos adicionales
    public string? CriteriosEvaluados { get; set; }
    public string? DocumentoUrl { get; set; }
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    public string? EtapaFormulario { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
