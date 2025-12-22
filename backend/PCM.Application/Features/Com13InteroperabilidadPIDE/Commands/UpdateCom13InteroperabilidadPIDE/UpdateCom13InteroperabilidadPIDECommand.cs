using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.UpdateCom13InteroperabilidadPIDE;

public class UpdateCom13InteroperabilidadPIDECommand : IRequest<Result<Com13InteroperabilidadPIDEResponse>>
{
    [JsonIgnore]
    public Guid UserId { get; set; }  // Usuario logueado que realiza la actualización
    
    public long CompcpideEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    [JsonPropertyName("rutaPdfNormativa")]
    public string? RutaPdfNormativa { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos del Paso 1 - Interoperabilidad PIDE
    public string? TipoIntegracionPide { get; set; }
    public string? NombreServicioPide { get; set; }
    public string? DescripcionServicioPide { get; set; }
    public DateTime? FechaInicioOperacionPide { get; set; }
    public string? ResponsablePide { get; set; }
    public string? CargoResponsablePide { get; set; }
    public string? CorreoResponsablePide { get; set; }
    public string? TelefonoResponsablePide { get; set; }
    public string? NumeroConvenioPide { get; set; }
    public DateTime? FechaConvenioPide { get; set; }
    public bool? InteroperabilidadPide { get; set; }
    public string? UrlServicioPide { get; set; }
    public string? ObservacionPide { get; set; }
    public string? RutaPdfPide { get; set; }
    public DateTime? FechaIntegracionPide { get; set; }
    public int? ServiciosPublicadosPide { get; set; }
    public int? ServiciosConsumidosPide { get; set; }
    public long? TotalTransaccionesPide { get; set; }
    public string? EnlacePortalPide { get; set; }
    public bool? IntegradoPide { get; set; }

    // Campos específicos heredados (compatibilidad con handlers anteriores)
    public DateTime? FechaAprobacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public string? RiesgosIdentificados { get; set; }
    public string? EstrategiasMitigacion { get; set; }
    public DateTime? FechaRevision { get; set; }
    public string? Responsable { get; set; }
}

public class Com13InteroperabilidadPIDEResponse
{
    public long CompcpideEntId { get; set; }
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
    public DateTime? FechaAprobacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public string? RiesgosIdentificados { get; set; }
    public string? EstrategiasMitigacion { get; set; }
    public DateTime? FechaRevision { get; set; }
    public string? Responsable { get; set; }
}
