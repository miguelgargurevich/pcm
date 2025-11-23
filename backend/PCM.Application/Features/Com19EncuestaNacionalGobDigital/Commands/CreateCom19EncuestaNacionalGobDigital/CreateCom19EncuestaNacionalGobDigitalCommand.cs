using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com19EncuestaNacionalGobDigital.Commands.CreateCom19EncuestaNacionalGobDigital;

public class CreateCom19EncuestaNacionalGobDigitalCommand : IRequest<Result<Com19EncuestaNacionalGobDigitalResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
    public DateTime? FechaConexion { get; set; }
    public string? TipoConexion { get; set; }
    public string? AnchoBanda { get; set; }
    public string? Proveedor { get; set; }
    public string? ArchivoContrato { get; set; }
    public string? Descripcion { get; set; }
}

public class Com19EncuestaNacionalGobDigitalResponse
{
    public long ComrenadEntId { get; set; }
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

    // Campos específicos
    public DateTime? FechaConexion { get; set; }
    public string? TipoConexion { get; set; }
    public string? AnchoBanda { get; set; }
    public string? Proveedor { get; set; }
    public string? ArchivoContrato { get; set; }
    public string? Descripcion { get; set; }
}
