using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com8PublicacionTUPA.Commands.CreateCom8PublicacionTUPA;

public class CreateCom8PublicacionTUPACommand : IRequest<Result<Com8PublicacionTUPAResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    
    // Campos específicos de Publicación de TUPA
    public string? UrlTupa { get; set; }
    public string? NumeroResolucionTupa { get; set; }
    public DateTime? FechaAprobacionTupa { get; set; }
    public string? ResponsableTupa { get; set; }
    public string? CargoResponsableTupa { get; set; }
    public string? CorreoResponsableTupa { get; set; }
    public string? TelefonoResponsableTupa { get; set; }
    public bool ActualizadoTupa { get; set; }
    public string? ObservacionTupa { get; set; }
    public string? RutaPdfTupa { get; set; }
    
    // Aceptaciones
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    
    // Usuario que registra
    public Guid? UsuarioRegistra { get; set; }
}

public class Com8PublicacionTUPAResponse
{
    public long ComptupaEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? UrlTupa { get; set; }
    public string? NumeroResolucionTupa { get; set; }
    public DateTime? FechaAprobacionTupa { get; set; }
    public string? ResponsableTupa { get; set; }
    public string? CargoResponsableTupa { get; set; }
    public string? CorreoResponsableTupa { get; set; }
    public string? TelefonoResponsableTupa { get; set; }
    public bool ActualizadoTupa { get; set; }
    public string? ObservacionTupa { get; set; }
    public string? RutaPdfTupa { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public bool Activo { get; set; }
}
