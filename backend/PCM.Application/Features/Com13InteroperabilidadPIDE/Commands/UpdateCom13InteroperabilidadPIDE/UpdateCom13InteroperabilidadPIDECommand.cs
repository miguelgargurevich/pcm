using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com13InteroperabilidadPIDE.Commands.UpdateCom13InteroperabilidadPIDE;

public class UpdateCom13InteroperabilidadPIDECommand : IRequest<Result<Com13InteroperabilidadPIDEResponse>>
{
    public long CompcpideEntId { get; set; }
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
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaAprobacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public string? RiesgosIdentificados { get; set; }
    public string? EstrategiasMitigacion { get; set; }
    public DateTime? FechaRevision { get; set; }
    public string? Responsable { get; set; }
}
