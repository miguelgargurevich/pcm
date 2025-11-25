using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com4PEI.Commands.UpdateCom4PEI;

public class UpdateCom4PEICommand : IRequest<Result<Com4PEIResponse>>
{
    public long ComtdpeiEntId { get; set; }
    
    [JsonPropertyName("etapaFormulario")]
    public string EtapaFormulario { get; set; } = "paso1";
    
    [JsonPropertyName("estado")]
    public string Estado { get; set; } = "bandeja";
    
    // Campos del PEI - Supabase schema
    [JsonPropertyName("anioInicioPei")]
    public long? AnioInicioPei { get; set; }
    
    [JsonPropertyName("anioFinPei")]
    public long? AnioFinPei { get; set; }
    
    [JsonPropertyName("fechaAprobacionPei")]
    public DateTime? FechaAprobacionPei { get; set; }
    
    [JsonPropertyName("objetivoPei")]
    public string? ObjetivoPei { get; set; }
    
    [JsonPropertyName("descripcionPei")]
    public string? DescripcionPei { get; set; }
    
    [JsonPropertyName("alineadoPgd")]
    public bool AlineadoPgd { get; set; }
    
    [JsonPropertyName("rutaPdfPei")]
    public string? RutaPdfPei { get; set; }
    
    // Aceptaciones
    [JsonPropertyName("checkPrivacidad")]
    public bool CheckPrivacidad { get; set; }
    
    [JsonPropertyName("checkDdjj")]
    public bool CheckDdjj { get; set; }
}

public class Com4PEIResponse
{
    public long ComtdpeiEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public long? AnioInicioPei { get; set; }
    public long? AnioFinPei { get; set; }
    public DateTime? FechaAprobacionPei { get; set; }
    public string? ObjetivoPei { get; set; }
    public string? DescripcionPei { get; set; }
    public bool AlineadoPgd { get; set; }
    public string? RutaPdfPei { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public bool Activo { get; set; }
}
