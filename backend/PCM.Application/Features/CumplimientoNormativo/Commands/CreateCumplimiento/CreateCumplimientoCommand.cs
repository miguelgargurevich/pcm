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
    
    [JsonPropertyName("estado_id")]
    public int EstadoId { get; set; } = 1; // 1=Pendiente, 2=En Proceso, 3=Completado
    
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
