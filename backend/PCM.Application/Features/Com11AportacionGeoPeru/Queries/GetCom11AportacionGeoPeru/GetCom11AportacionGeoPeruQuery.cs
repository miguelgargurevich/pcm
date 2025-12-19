using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com11AportacionGeoPeru.Queries.GetCom11AportacionGeoPeru;

public class GetCom11AportacionGeoPeruQuery : IRequest<Result<Com11AportacionGeoPeruResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
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
    public string EstadoPCM { get; set; } = string.Empty;
    public string ObservacionesPCM { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    // Campos específicos de Aportación a GeoPeru
    public string UrlGeo { get; set; } = string.Empty;
    public string TipoInformacionGeo { get; set; } = string.Empty;
    public long TotalCapasPublicadas { get; set; }
    public DateTime? FechaUltimaActualizacionGeo { get; set; }
    public string ResponsableGeo { get; set; } = string.Empty;
    public string CargoResponsableGeo { get; set; } = string.Empty;
    public string CorreoResponsableGeo { get; set; } = string.Empty;
    public string TelefonoResponsableGeo { get; set; } = string.Empty;
    public string NormaAprobacionGeo { get; set; } = string.Empty;
    public DateTime? FechaAprobacionGeo { get; set; }
    public bool InteroperabilidadGeo { get; set; }
    public string ObservacionGeo { get; set; } = string.Empty;
    public string RutaPdfGeo { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
}
