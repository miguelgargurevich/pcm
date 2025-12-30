using PCM.Application.Common;
using PCM.Application.Features.Com2CGTD.DTOs;
using MediatR;

namespace PCM.Application.Features.Com2CGTD.Commands.CreateCom2CGTD;

public class CreateCom2CGTDCommand : IRequest<Result<Com2CGTDResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; } = string.Empty;
    public string ObservacionesPcm { get; set; } = string.Empty;
    public Guid UsuarioRegistra { get; set; }
    
    // Campos adicionales para persistencia
    public string? UrlDocUrl { get; set; }
    
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
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public string? UrlDocPcm { get; set; }
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
    public List<ComiteMiembroDto>? Miembros { get; set; }
}
