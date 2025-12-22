using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com17PlanTransicionIPv6.Commands.UpdateCom17PlanTransicionIPv6;

public class UpdateCom17PlanTransicionIPv6Command : IRequest<Result<Com17PlanTransicionIPv6Response>>
{
    [JsonIgnore]
    public Guid UserId { get; set; }  // Usuario logueado que realiza la actualización
    
    public long Comptipv6EntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    [JsonPropertyName("rutaPdfNormativa")]
    public string? RutaPdfNormativa { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
    public string? ResponsableIpv6 { get; set; }
    public string? CargoResponsableIpv6 { get; set; }
    public string? CorreoIpv6 { get; set; }
    public string? TelefonoIpv6 { get; set; }
    public string? EstadoPlanIpv6 { get; set; }
    public DateTime? FechaFormulacionIpv6 { get; set; }
    public DateTime? FechaAprobacionIpv6 { get; set; }
    public DateTime? FechaInicioIpv6 { get; set; }
    public DateTime? FechaFinIpv6 { get; set; }
    public string? DescripcionPlanIpv6 { get; set; }
    public string? RutaPdfPlanIpv6 { get; set; }
    public string? ObservacionIpv6 { get; set; }

    // Campos heredados de compatibilidad
    public DateTime? FechaInicioTransicion { get; set; }
    public DateTime? FechaFinTransicion { get; set; }
    public decimal? PorcentajeAvance { get; set; }
    public int? SistemasMigrados { get; set; }
    public int? SistemasTotal { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
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
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaInicioTransicion { get; set; }
    public DateTime? FechaFinTransicion { get; set; }
    public decimal? PorcentajeAvance { get; set; }
    public int? SistemasMigrados { get; set; }
    public int? SistemasTotal { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
}
