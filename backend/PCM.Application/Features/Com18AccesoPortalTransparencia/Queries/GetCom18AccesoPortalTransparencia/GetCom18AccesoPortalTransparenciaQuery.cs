using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com18AccesoPortalTransparencia.Queries.GetCom18AccesoPortalTransparencia;

public class GetCom18AccesoPortalTransparenciaQuery : IRequest<Result<Com18AccesoPortalTransparenciaResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com18AccesoPortalTransparenciaResponse
{
    public long ComsapteEntId { get; set; }
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
    // Campos específicos del Portal de Transparencia Estándar
    public string ResponsablePte { get; set; } = string.Empty;
    public string CargoResponsablePte { get; set; } = string.Empty;
    public string CorreoPte { get; set; } = string.Empty;
    public string TelefonoPte { get; set; } = string.Empty;
    public DateTime? FechaSolicitudPte { get; set; }
    public DateTime? FechaAccesoPte { get; set; }
    public string NumeroOficioPte { get; set; } = string.Empty;
    public string EstadoAccesoPte { get; set; } = string.Empty;
    public string EnlacePortalPte { get; set; } = string.Empty;
    public string DescripcionPte { get; set; } = string.Empty;
    public string RutaPdfPte { get; set; } = string.Empty;
    public string ObservacionPte { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
}
