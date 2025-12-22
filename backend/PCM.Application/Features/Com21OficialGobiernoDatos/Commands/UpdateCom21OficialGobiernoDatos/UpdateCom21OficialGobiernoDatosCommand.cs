using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com21OficialGobiernoDatos.Commands.UpdateCom21OficialGobiernoDatos;

public class UpdateCom21OficialGobiernoDatosCommand : IRequest<Result<Com21OficialGobiernoDatosResponse>>
{
    [JsonIgnore]
    public Guid UserId { get; set; }  // Usuario logueado que realiza la actualización
    
    public long ComdogdEntId { get; set; }
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
    public string? DniOgd { get; set; }
    public string? NombreOgd { get; set; }
    public string? ApePatOgd { get; set; }
    public string? ApeMatOgd { get; set; }
    public string? CargoOgd { get; set; }
    public string? CorreoOgd { get; set; }
    public string? TelefonoOgd { get; set; }
    public DateTime? FechaDesignacionOgd { get; set; }
    public string? NumeroResolucionOgd { get; set; }
    public bool? ComunicadoPcmOgd { get; set; }
    public string? RutaPdfOgd { get; set; }
    public string? ObservacionOgd { get; set; }

    // Campos heredados de compatibilidad
    public DateTime? FechaElaboracion { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? ArchivoDocumento { get; set; }
    public string? Descripcion { get; set; }
    public string? Procedimientos { get; set; }
    public string? Responsables { get; set; }
    public DateTime? FechaVigencia { get; set; }
}

public class Com21OficialGobiernoDatosResponse
{
    public long ComdogdEntId { get; set; }
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
    public string? Procedimientos { get; set; }
    public string? Responsables { get; set; }
    public DateTime? FechaVigencia { get; set; }
}
