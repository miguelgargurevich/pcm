using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com14OficialSeguridadDigital.Queries.GetCom14OficialSeguridadDigital;

public class GetCom14OficialSeguridadDigitalQuery : IRequest<Result<Com14OficialSeguridadDigitalResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com14OficialSeguridadDigitalResponse
{
    public long ComdoscdEntId { get; set; }
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
    // Campos específicos del Oficial de Seguridad y Confianza Digital
    public string DniOscd { get; set; } = string.Empty;
    public string NombreOscd { get; set; } = string.Empty;
    public string ApePatOscd { get; set; } = string.Empty;
    public string ApeMatOscd { get; set; } = string.Empty;
    public string CargoOscd { get; set; } = string.Empty;
    public string CorreoOscd { get; set; } = string.Empty;
    public string TelefonoOscd { get; set; } = string.Empty;
    public DateTime? FechaDesignacionOscd { get; set; }
    public string NumeroResolucionOscd { get; set; } = string.Empty;
    public bool ComunicadoPcmOscd { get; set; }
    public string RutaPdfOscd { get; set; } = string.Empty;
    public string ObservacionOscd { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
}
