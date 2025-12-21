using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;

public class UpdateCumplimientoCommand : IRequest<Result<CumplimientoResponseDto>>
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
}
