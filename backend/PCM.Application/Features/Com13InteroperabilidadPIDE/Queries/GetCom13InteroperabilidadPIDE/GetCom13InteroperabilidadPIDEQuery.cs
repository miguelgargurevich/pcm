using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com13InteroperabilidadPIDE.Queries.GetCom13InteroperabilidadPIDE;

public class GetCom13InteroperabilidadPIDEQuery : IRequest<Result<Com13InteroperabilidadPIDEResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
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
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    // Campos específicos de Interoperabilidad PIDE
    public string TipoIntegracionPide { get; set; } = string.Empty;
    public string NombreServicioPide { get; set; } = string.Empty;
    public string DescripcionServicioPide { get; set; } = string.Empty;
    public DateTime? FechaInicioOperacionPide { get; set; }
    public string ResponsablePide { get; set; } = string.Empty;
    public string CargoResponsablePide { get; set; } = string.Empty;
    public string CorreoResponsablePide { get; set; } = string.Empty;
    public string TelefonoResponsablePide { get; set; } = string.Empty;
    public string NumeroConvenioPide { get; set; } = string.Empty;
    public DateTime? FechaConvenioPide { get; set; }
    public bool InteroperabilidadPide { get; set; }
    public string UrlServicioPide { get; set; } = string.Empty;
    public string ObservacionPide { get; set; } = string.Empty;
    public string RutaPdfPide { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public DateTime? FechaIntegracionPide { get; set; }
    public int? ServiciosPublicadosPide { get; set; }
}
