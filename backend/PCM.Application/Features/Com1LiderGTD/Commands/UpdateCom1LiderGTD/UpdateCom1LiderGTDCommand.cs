using MediatR;
using PCM.Application.Common;
using PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;

namespace PCM.Application.Features.Com1LiderGTD.Commands.UpdateCom1LiderGTD;

public class UpdateCom1LiderGTDCommand : IRequest<Result<Com1LiderGTDResponse>>
{
    public long ComlgtdEntId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    
    // Campos del Líder de GTD
    public string? DniLider { get; set; }
    public string? NombreLider { get; set; }
    public string? ApePatLider { get; set; }
    public string? ApeMatLider { get; set; }
    public string? EmailLider { get; set; }
    public string? TelefonoLider { get; set; }
    public string? RolLider { get; set; }
    public string? CargoLider { get; set; }
    public DateTime? FecIniLider { get; set; }
    
    // Documento y criterios
    public string? UrlDocUrl { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
    // Aceptaciones
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    
    // Estado PCM (solo para admin)
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
}
