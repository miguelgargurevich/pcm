using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com4PEI.Commands.UpdateCom4PEI;

public class UpdateCom4PEICommand : IRequest<Result<Com4PEIResponse>>
{
    public long CompeiEntId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    
    // Campos del PEI
    public int AnioInicio { get; set; }
    public int AnioFin { get; set; }
    public DateTime FechaAprobacion { get; set; }
    public string ObjetivoEstrategico { get; set; } = string.Empty;
    public string DescripcionIncorporacion { get; set; } = string.Empty;
    public bool AlineadoPgd { get; set; }
    public string? UrlDocPei { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
    // Aceptaciones
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
}

public class Com4PEIResponse
{
    public long CompeiEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public int AnioInicio { get; set; }
    public int AnioFin { get; set; }
    public DateTime FechaAprobacion { get; set; }
    public string ObjetivoEstrategico { get; set; } = string.Empty;
    public string DescripcionIncorporacion { get; set; } = string.Empty;
    public bool AlineadoPgd { get; set; }
    public string? UrlDocPei { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
}
