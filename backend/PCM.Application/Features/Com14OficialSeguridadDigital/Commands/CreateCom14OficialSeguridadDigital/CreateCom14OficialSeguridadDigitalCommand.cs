using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com14OficialSeguridadDigital.Commands.CreateCom14OficialSeguridadDigital;

public class CreateCom14OficialSeguridadDigitalCommand : IRequest<Result<Com14OficialSeguridadDigitalResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
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
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }

    // Campos específicos
    public DateTime? FechaElaboracion { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? ArchivoDocumento { get; set; }
    public string? Descripcion { get; set; }
    public string? PoliticasSeguridad { get; set; }
    public string? Certificaciones { get; set; }
    public DateTime? FechaVigencia { get; set; }
}
