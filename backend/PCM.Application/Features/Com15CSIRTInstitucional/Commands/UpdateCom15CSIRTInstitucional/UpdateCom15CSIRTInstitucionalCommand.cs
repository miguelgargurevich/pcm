using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com15CSIRTInstitucional.Commands.UpdateCom15CSIRTInstitucional;

public class UpdateCom15CSIRTInstitucionalCommand : IRequest<Result<Com15CSIRTInstitucionalResponse>>
{
    public long ComcsirtEntId { get; set; }
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
    public DateTime? FechaConformacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? Responsable { get; set; }
    public string? EmailContacto { get; set; }
    public string? TelefonoContacto { get; set; }
    public string? ArchivoProcedimientos { get; set; }
    public string? Descripcion { get; set; }
}

public class Com15CSIRTInstitucionalResponse
{
    public long ComcsirtEntId { get; set; }
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
    public DateTime? FechaConformacion { get; set; }
    public string? NumeroResolucion { get; set; }
    public string? Responsable { get; set; }
    public string? EmailContacto { get; set; }
    public string? TelefonoContacto { get; set; }
    public string? ArchivoProcedimientos { get; set; }
    public string? Descripcion { get; set; }
}
