using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com1LiderGTD.Commands.CreateCom1LiderGTD;

public class CreateCom1LiderGTDCommand : IRequest<Result<Com1LiderGTDResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1"; // paso1, paso2, paso3, completado
    public string Estado { get; set; } = "pendiente"; // pendiente, sin_reportar, no_exigible, en_proceso, enviado, en_revision, observado, aceptado
    
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
    public string? UrlDocUrl { get; set; }
    
    // Aceptaciones
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    
    // Usuario que registra
    public Guid? UsuarioRegistra { get; set; }
}

public class Com1LiderGTDResponse
{
    public long ComlgtdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    
    // Campos del Líder
    public string? DniLider { get; set; }
    public string? NombreLider { get; set; }
    public string? ApePatLider { get; set; }
    public string? ApeMatLider { get; set; }
    public string? EmailLider { get; set; }
    public string? TelefonoLider { get; set; }
    public string? RolLider { get; set; }
    public string? CargoLider { get; set; }
    public DateTime? FecIniLider { get; set; }
    public string? UrlDocPcm { get; set; }
    
    // Paso 2: Documento y Criterios
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
    // Auditoría
    public DateTime CreatedAt { get; set; }
    public DateTime? FecRegistro { get; set; }
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
}
