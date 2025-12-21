using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com17PlanTransicionIPv6.Queries.GetCom17PlanTransicionIPv6;

public class GetCom17PlanTransicionIPv6Query : IRequest<Result<Com17PlanTransicionIPv6Response>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com17PlanTransicionIPv6Response
{
    public long Comptipv6EntId { get; set; }
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
    // Campos específicos del Plan de Transición a IPv6
    public string ResponsableIpv6 { get; set; } = string.Empty;
    public string CargoResponsableIpv6 { get; set; } = string.Empty;
    public string CorreoIpv6 { get; set; } = string.Empty;
    public string TelefonoIpv6 { get; set; } = string.Empty;
    public string EstadoPlanIpv6 { get; set; } = string.Empty;
    public DateTime? FechaFormulacionIpv6 { get; set; }
    public DateTime? FechaAprobacionIpv6 { get; set; }
    public DateTime? FechaInicioIpv6 { get; set; }
    public DateTime? FechaFinIpv6 { get; set; }
    public string DescripcionPlanIpv6 { get; set; } = string.Empty;
    public string RutaPdfPlanIpv6 { get; set; } = string.Empty;
    public string ObservacionIpv6 { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
}
