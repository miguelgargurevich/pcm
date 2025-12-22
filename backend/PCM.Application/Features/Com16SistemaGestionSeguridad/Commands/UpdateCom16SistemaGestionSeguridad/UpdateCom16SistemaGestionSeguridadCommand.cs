using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.UpdateCom16SistemaGestionSeguridad;

public class UpdateCom16SistemaGestionSeguridadCommand : IRequest<Result<Com16SistemaGestionSeguridadResponse>>
{
    [JsonIgnore]
    public Guid UserId { get; set; }  // Usuario logueado que realiza la actualización
    
    public long ComsgsiEntId { get; set; }
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
    public string? ResponsableSgsi { get; set; }
    public string? CargoResponsableSgsi { get; set; }
    public string? CorreoSgsi { get; set; }
    public string? TelefonoSgsi { get; set; }
    public string? EstadoImplementacionSgsi { get; set; }
    public string? AlcanceSgsi { get; set; }
    public DateTime? FechaInicioSgsi { get; set; }
    public DateTime? FechaCertificacionSgsi { get; set; }
    public string? EntidadCertificadoraSgsi { get; set; }
    public string? VersionNormaSgsi { get; set; }
    public string? RutaPdfCertificadoSgsi { get; set; }
    public string? RutaPdfPoliticasSgsi { get; set; }
    public string? ObservacionSgsi { get; set; }
    public DateTime? FechaImplementacionSgsi { get; set; }
    public string? NormaAplicadaSgsi { get; set; }
    public string? RutaPdfSgsi { get; set; }
    public string? NivelImplementacionSgsi { get; set; }

    // Campos heredados de compatibilidad
    public DateTime? FechaImplementacion { get; set; }
    public string? NormaAplicable { get; set; }
    public string? Certificacion { get; set; }
    public DateTime? FechaCertificacion { get; set; }
    public string? ArchivoCertificado { get; set; }
    public string? Descripcion { get; set; }
    public string? Alcance { get; set; }
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
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaImplementacion { get; set; }
    public string? NormaAplicable { get; set; }
    public string? Certificacion { get; set; }
    public DateTime? FechaCertificacion { get; set; }
    public string? ArchivoCertificado { get; set; }
    public string? Descripcion { get; set; }
    public string? Alcance { get; set; }
}
