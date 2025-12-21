using PCM.Application.Common;
using MediatR;

namespace PCM.Application.Features.Com2CGTD.Commands.UpdateCom2CGTD;

public class UpdateCom2CGTDCommand : IRequest<Result<Com2CGTDResponse>>
{
    public long ComcgtdEntId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; } = string.Empty;
    public string ObservacionesPcm { get; set; } = string.Empty;
    
    // Campos adicionales para persistencia
    public string? UrlDocUrl { get; set; }
    public string? RutaPdfNormativa { get; set; }
    
    // Lista de miembros del comité
    public List<ComiteMiembroDto>? Miembros { get; set; }
}

public class Com2CGTDResponse
{
    public long ComcgtdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; } = string.Empty;
    public string ObservacionesPcm { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public string? UrlDocPcm { get; set; }
    
    public List<ComiteMiembroDto>? Miembros { get; set; }
}

public class ComiteMiembroDto
{
    public long? MiembroId { get; set; }
    public string? Dni { get; set; }
    public string? Nombre { get; set; }
    public string? ApellidoPaterno { get; set; }
    public string? ApellidoMaterno { get; set; }
    public string? Cargo { get; set; }
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public DateTime? FechaInicio { get; set; }
    public bool? Activo { get; set; }
}
