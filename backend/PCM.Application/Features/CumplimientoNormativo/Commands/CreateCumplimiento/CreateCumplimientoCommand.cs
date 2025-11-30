using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.CumplimientoNormativo.Commands.CreateCumplimiento;

public class CreateCumplimientoCommand : IRequest<Result<CumplimientoResponseDto>>
{
    [JsonPropertyName("compromiso_id")]
    public long CompromisoId { get; set; }
    
    [JsonPropertyName("entidad_id")]
    public Guid EntidadId { get; set; }
    
    // Paso 1: Datos Generales
    [JsonPropertyName("nro_dni")]
    public string? NroDni { get; set; }
    
    [JsonPropertyName("nombres")]
    public string? Nombres { get; set; }
    
    [JsonPropertyName("apellido_paterno")]
    public string? ApellidoPaterno { get; set; }
    
    [JsonPropertyName("apellido_materno")]
    public string? ApellidoMaterno { get; set; }
    
    [JsonPropertyName("correo_electronico")]
    public string? CorreoElectronico { get; set; }
    
    [JsonPropertyName("telefono")]
    public string? Telefono { get; set; }
    
    [JsonPropertyName("rol")]
    public string? Rol { get; set; }
    
    [JsonPropertyName("cargo")]
    public string? Cargo { get; set; }
    
    [JsonPropertyName("fecha_inicio")]
    public DateTime? FechaInicio { get; set; }
    
    // Paso 2: Normativa
    [JsonPropertyName("documento_url")]
    public string? DocumentoUrl { get; set; }
    
    [JsonPropertyName("documento_nombre")]
    public string? DocumentoNombre { get; set; }
    
    [JsonPropertyName("documento_tamano")]
    public long? DocumentoTamano { get; set; }
    
    [JsonPropertyName("documento_tipo")]
    public string? DocumentoTipo { get; set; }
    
    [JsonPropertyName("validacion_resolucion_autoridad")]
    public bool ValidacionResolucionAutoridad { get; set; }
    
    [JsonPropertyName("validacion_lider_funcionario")]
    public bool ValidacionLiderFuncionario { get; set; }
    
    [JsonPropertyName("validacion_designacion_articulo")]
    public bool ValidacionDesignacionArticulo { get; set; }
    
    [JsonPropertyName("validacion_funciones_definidas")]
    public bool ValidacionFuncionesDefinidas { get; set; }
    
    [JsonPropertyName("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }
    
    // Paso 3: Confirmación
    [JsonPropertyName("acepta_politica_privacidad")]
    public bool AceptaPoliticaPrivacidad { get; set; }
    
    [JsonPropertyName("acepta_declaracion_jurada")]
    public bool AceptaDeclaracionJurada { get; set; }
    
    [JsonPropertyName("etapa_formulario")]
    public string? EtapaFormulario { get; set; }
    
    [JsonPropertyName("estado")]
    public int Estado { get; set; } = 1;
}
