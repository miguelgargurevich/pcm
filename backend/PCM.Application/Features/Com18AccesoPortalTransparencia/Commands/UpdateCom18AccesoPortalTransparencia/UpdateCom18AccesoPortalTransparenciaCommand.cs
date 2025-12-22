using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com18AccesoPortalTransparencia.Commands.UpdateCom18AccesoPortalTransparencia;

public class UpdateCom18AccesoPortalTransparenciaCommand : IRequest<Result<Com18AccesoPortalTransparenciaResponse>>
{
    [JsonIgnore]
    public Guid UserId { get; set; }  // Usuario logueado que realiza la actualización
    
    public long ComsapteEntId { get; set; }
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
    public string? ResponsablePte { get; set; }
    public string? CargoResponsablePte { get; set; }
    public string? CorreoPte { get; set; }
    public string? TelefonoPte { get; set; }
    public DateTime? FechaSolicitudPte { get; set; }
    public DateTime? FechaAccesoPte { get; set; }
    public string? NumeroOficioPte { get; set; }
    public string? EstadoAccesoPte { get; set; }
    public string? EnlacePortalPte { get; set; }
    public string? DescripcionPte { get; set; }
    public string? RutaPdfPte { get; set; }
    public string? ObservacionPte { get; set; }

    // Campos heredados de compatibilidad
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
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public string? UrlPlataforma { get; set; }
    public DateTime? FechaImplementacion { get; set; }
    public int? TramitesDisponibles { get; set; }
    public int? UsuariosRegistrados { get; set; }
    public int? TramitesProcesados { get; set; }
    public string? ArchivoEvidencia { get; set; }
    public string? Descripcion { get; set; }
}
