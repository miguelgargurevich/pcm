using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.CreateCom13InteroperabilidadPIDE;

public class CreateCom13InteroperabilidadPIDECommand : IRequest<Result<Com13InteroperabilidadPIDEResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
    public DateTime? FechaAprobacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public string? RiesgosIdentificados { get; set; }
    public string? EstrategiasMitigacion { get; set; }
    public DateTime? FechaRevision { get; set; }
    public string? Responsable { get; set; }
}

public class Com13InteroperabilidadPIDEResponse
{
    public long CompcpideEntId { get; set; }
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
    public DateTime? FechaAprobacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public string? RiesgosIdentificados { get; set; }
    public string? EstrategiasMitigacion { get; set; }
    public DateTime? FechaRevision { get; set; }
    public string? Responsable { get; set; }
}
