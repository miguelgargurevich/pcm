using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com7ImplementacionMPD.Queries.GetCom7ImplementacionMPD;

public class GetCom7ImplementacionMPDQuery : IRequest<Result<Com7ImplementacionMPDResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com7ImplementacionMPDResponse
{
    public long ComimpdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? UrlMpd { get; set; }
    public DateTime? FechaImplementacionMpd { get; set; }
    public string? ResponsableMpd { get; set; }
    public string? CargoResponsableMpd { get; set; }
    public string? CorreoResponsableMpd { get; set; }
    public string? TelefonoResponsableMpd { get; set; }
    public string? TipoMpd { get; set; }
    public bool InteroperabilidadMpd { get; set; }
    public string? ObservacionMpd { get; set; }
    public string? RutaPdfMpd { get; set; }
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public bool Activo { get; set; }
}
