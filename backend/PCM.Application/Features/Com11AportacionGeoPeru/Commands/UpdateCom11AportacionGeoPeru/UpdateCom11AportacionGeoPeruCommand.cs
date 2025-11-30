using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com11AportacionGeoPeru.Commands.UpdateCom11AportacionGeoPeru;

public class UpdateCom11AportacionGeoPeruCommand : IRequest<Result<Com11AportacionGeoPeruResponse>>
{
    public long ComageopEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos de Aportación a GeoPeru
    public string? UrlGeo { get; set; }
    public string? TipoInformacionGeo { get; set; }
    public long? TotalCapasPublicadas { get; set; }
    public DateTime? FechaUltimaActualizacionGeo { get; set; }
    public string? ResponsableGeo { get; set; }
    public string? CargoResponsableGeo { get; set; }
    public string? CorreoResponsableGeo { get; set; }
    public string? TelefonoResponsableGeo { get; set; }
    public string? NormaAprobacionGeo { get; set; }
    public DateTime? FechaAprobacionGeo { get; set; }
    public bool? InteroperabilidadGeo { get; set; }
    public string? ObservacionGeo { get; set; }
    public string? RutaPdfGeo { get; set; }
}

public class Com11AportacionGeoPeruResponse
{
    public long ComageopEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    
    // Campos específicos de Aportación a GeoPeru
    public string? UrlGeo { get; set; }
    public string? TipoInformacionGeo { get; set; }
    public long TotalCapasPublicadas { get; set; }
    public DateTime? FechaUltimaActualizacionGeo { get; set; }
    public string? ResponsableGeo { get; set; }
    public string? CargoResponsableGeo { get; set; }
    public string? CorreoResponsableGeo { get; set; }
    public string? TelefonoResponsableGeo { get; set; }
    public string? NormaAprobacionGeo { get; set; }
    public DateTime? FechaAprobacionGeo { get; set; }
    public bool InteroperabilidadGeo { get; set; }
    public string? ObservacionGeo { get; set; }
    public string? RutaPdfGeo { get; set; }
}
