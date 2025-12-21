using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com19EncuestaNacionalGobDigital.Queries.GetCom19EncuestaNacionalGobDigital;

public class GetCom19EncuestaNacionalGobDigitalQuery : IRequest<Result<Com19EncuestaNacionalGobDigitalResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com19EncuestaNacionalGobDigitalResponse
{
    public long ComrenadEntId { get; set; }
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
    // Campos específicos de la Encuesta Nacional de Gobierno Digital
    public long AnioEnad { get; set; }
    public string ResponsableEnad { get; set; } = string.Empty;
    public string CargoResponsableEnad { get; set; } = string.Empty;
    public string CorreoEnad { get; set; } = string.Empty;
    public string TelefonoEnad { get; set; } = string.Empty;
    public DateTime? FechaEnvioEnad { get; set; }
    public string EstadoRespuestaEnad { get; set; } = string.Empty;
    public string EnlaceFormularioEnad { get; set; } = string.Empty;
    public string ObservacionEnad { get; set; } = string.Empty;
    public string RutaPdfEnad { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
}
