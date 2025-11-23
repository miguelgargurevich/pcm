using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com12ResponsableSoftwarePublico.Queries.GetCom12ResponsableSoftwarePublico;

public class GetCom12ResponsableSoftwarePublicoQuery : IRequest<Result<Com12ResponsableSoftwarePublicoResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com12ResponsableSoftwarePublicoResponse
{
    public long ComdrspEntId { get; set; }
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
    public DateTime? FechaElaboracion { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? ArchivoDocumento { get; set; }
    public string? Descripcion { get; set; }
    public string? RequisitosSeguridad { get; set; }
    public string? RequisitosPrivacidad { get; set; }
    public DateTime? FechaVigencia { get; set; }
}
