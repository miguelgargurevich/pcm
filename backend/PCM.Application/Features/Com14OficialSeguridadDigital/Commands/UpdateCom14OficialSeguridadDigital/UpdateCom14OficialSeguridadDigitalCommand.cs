using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com14OficialSeguridadDigital.Commands.UpdateCom14OficialSeguridadDigital;

public class UpdateCom14OficialSeguridadDigitalCommand : IRequest<Result<Com14OficialSeguridadDigitalResponse>>
{
    [JsonIgnore]
    public Guid UserId { get; set; }  // Usuario logueado que realiza la actualización
    
    public long ComdoscdEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    [JsonPropertyName("rutaPdfNormativa")]
    public string? RutaPdfNormativa { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos del Oficial de Seguridad Digital
    public string? DniOscd { get; set; }
    public string? NombreOscd { get; set; }
    public string? ApePatOscd { get; set; }
    public string? ApeMatOscd { get; set; }
    public string? CargoOscd { get; set; }
    public string? CorreoOscd { get; set; }
    public string? TelefonoOscd { get; set; }
    public DateTime? FechaDesignacionOscd { get; set; }
    public string? NumeroResolucionOscd { get; set; }
    public bool? ComunicadoPcmOscd { get; set; }
    public string? RutaPdfOscd { get; set; }
    public string? ObservacionOscd { get; set; }

    // Campos específicos heredados (compatibilidad)
    public DateTime? FechaElaboracion { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? ArchivoDocumento { get; set; }
    public string? Descripcion { get; set; }
    public string? PoliticasSeguridad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime? FechaVigencia { get; set; }
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
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaElaboracion { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? ArchivoDocumento { get; set; }
    public string? Descripcion { get; set; }
    public string? PoliticasSeguridad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime? FechaVigencia { get; set; }
}
