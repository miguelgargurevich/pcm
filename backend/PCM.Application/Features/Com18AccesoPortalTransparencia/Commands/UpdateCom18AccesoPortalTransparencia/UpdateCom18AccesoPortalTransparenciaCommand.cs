using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com18AccesoPortalTransparencia.Commands.UpdateCom18AccesoPortalTransparencia;

public class UpdateCom18AccesoPortalTransparenciaCommand : IRequest<Result<Com18AccesoPortalTransparenciaResponse>>
{
    public long ComsapteEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
    public string? UrlPlataforma { get; set; }
    public DateTime? FechaImplementacion { get; set; }
    public int? TramitesDisponibles { get; set; }
    public int? UsuariosRegistrados { get; set; }
    public int? TramitesProcesados { get; set; }
    public string? ArchivoEvidencia { get; set; }
    public string? Descripcion { get; set; }
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
    public string? UrlPlataforma { get; set; }
    public DateTime? FechaImplementacion { get; set; }
    public int? TramitesDisponibles { get; set; }
    public int? UsuariosRegistrados { get; set; }
    public int? TramitesProcesados { get; set; }
    public string? ArchivoEvidencia { get; set; }
    public string? Descripcion { get; set; }
}
