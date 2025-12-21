using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com12ResponsableSoftwarePublico.Queries.GetCom12ResponsableSoftwarePublico;

public class GetCom12ResponsableSoftwarePublicoQuery : IRequest<Result<Com12ResponsableSoftwarePublicoResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com12ResponsableSoftwarePublicoResponse
{
    public long ComdrspEntId { get; set; }
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
    // Campos específicos del Responsable de Software Público
    public string DniRsp { get; set; } = string.Empty;
    public string NombreRsp { get; set; } = string.Empty;
    public string ApePatRsp { get; set; } = string.Empty;
    public string ApeMatRsp { get; set; } = string.Empty;
    public string CargoRsp { get; set; } = string.Empty;
    public string CorreoRsp { get; set; } = string.Empty;
    public string TelefonoRsp { get; set; } = string.Empty;
    public DateTime? FechaDesignacionRsp { get; set; }
    public string NumeroResolucionRsp { get; set; } = string.Empty;
    public string RutaPdfRsp { get; set; } = string.Empty;
    public string ObservacionRsp { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
}
