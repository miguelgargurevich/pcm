using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com21OficialGobiernoDatos.Queries.GetCom21OficialGobiernoDatos;

public class GetCom21OficialGobiernoDatosQuery : IRequest<Result<Com21OficialGobiernoDatosResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
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
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    // Campos de compatibilidad
    public DateTime? FechaElaboracion { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? ArchivoDocumento { get; set; }
    public string? Descripcion { get; set; }
    public string? Procedimientos { get; set; }
    public string? Responsables { get; set; }
    public DateTime? FechaVigencia { get; set; }
    // Campos específicos del Oficial de Gobierno de Datos
    public string DniOgd { get; set; } = string.Empty;
    public string NombreOgd { get; set; } = string.Empty;
    public string ApePatOgd { get; set; } = string.Empty;
    public string ApeMatOgd { get; set; } = string.Empty;
    public string CargoOgd { get; set; } = string.Empty;
    public string CorreoOgd { get; set; } = string.Empty;
    public string TelefonoOgd { get; set; } = string.Empty;
    public DateTime? FechaDesignacionOgd { get; set; }
    public string NumeroResolucionOgd { get; set; } = string.Empty;
    public bool ComunicadoPcmOgd { get; set; }
    public string RutaPdfOgd { get; set; } = string.Empty;
    public string ObservacionOgd { get; set; } = string.Empty;
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
}
