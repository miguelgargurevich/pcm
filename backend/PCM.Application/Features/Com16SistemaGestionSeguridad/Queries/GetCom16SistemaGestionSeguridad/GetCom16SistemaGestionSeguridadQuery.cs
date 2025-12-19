using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com16SistemaGestionSeguridad.Queries.GetCom16SistemaGestionSeguridad;

public class GetCom16SistemaGestionSeguridadQuery : IRequest<Result<Com16SistemaGestionSeguridadResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com16SistemaGestionSeguridadResponse
{
    public long ComsgsiEntId { get; set; }
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
    // Campos específicos del Sistema de Gestión de Seguridad
    public string ResponsableSgsi { get; set; } = string.Empty;
    public string CargoResponsableSgsi { get; set; } = string.Empty;
    public string CorreoSgsi { get; set; } = string.Empty;
    public string TelefonoSgsi { get; set; } = string.Empty;
    public string EstadoImplementacionSgsi { get; set; } = string.Empty;
    public string AlcanceSgsi { get; set; } = string.Empty;
    public DateTime? FechaInicioSgsi { get; set; }
    public DateTime? FechaCertificacionSgsi { get; set; }
    public string EntidadCertificadoraSgsi { get; set; } = string.Empty;
    public string VersionNormaSgsi { get; set; } = string.Empty;
    public string RutaPdfCertificadoSgsi { get; set; } = string.Empty;
    public string RutaPdfPoliticasSgsi { get; set; } = string.Empty;
    public string ObservacionSgsi { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public DateTime? FechaImplementacionSgsi { get; set; }
    public string NormaAplicadaSgsi { get; set; } = string.Empty;
    public string RutaPdfSgsi { get; set; } = string.Empty;
    public string NivelImplementacionSgsi { get; set; } = string.Empty;
}
