using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com16SistemaGestionSeguridad.Commands.UpdateCom16SistemaGestionSeguridad;

public class UpdateCom16SistemaGestionSeguridadCommand : IRequest<Result<Com16SistemaGestionSeguridadResponse>>
{
    public long ComsgsiEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
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
