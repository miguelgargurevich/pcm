using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com21OficialGobiernoDatos.Commands.UpdateCom21OficialGobiernoDatos;

public class UpdateCom21OficialGobiernoDatosCommand : IRequest<Result<Com21OficialGobiernoDatosResponse>>
{
    public long ComdogdEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
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
