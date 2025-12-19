using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com15CSIRTInstitucional.Queries.GetCom15CSIRTInstitucional;

public class GetCom15CSIRTInstitucionalQuery : IRequest<Result<Com15CSIRTInstitucionalResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com15CSIRTInstitucionalResponse
{
    public long ComcsirtEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPCM { get; set; } = string.Empty;
    public string ObservacionesPCM { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    // Campos específicos del CSIRT Institucional
    public string NombreCsirt { get; set; } = string.Empty;
    public DateTime? FechaConformacionCsirt { get; set; }
    public string NumeroResolucionCsirt { get; set; } = string.Empty;
    public string ResponsableCsirt { get; set; } = string.Empty;
    public string CargoResponsableCsirt { get; set; } = string.Empty;
    public string CorreoCsirt { get; set; } = string.Empty;
    public string TelefonoCsirt { get; set; } = string.Empty;
    public bool ProtocoloIncidentesCsirt { get; set; }
    public bool ComunicadoPcmCsirt { get; set; }
    public string RutaPdfCsirt { get; set; } = string.Empty;
    public string ObservacionCsirt { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
}
