using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Queries.GetCom20DigitalizacionServiciosFacilita;

public class GetCom20DigitalizacionServiciosFacilitaQuery : IRequest<Result<Com20DigitalizacionServiciosFacilitaResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com20DigitalizacionServiciosFacilitaResponse
{
    public long ComdsfpeEntId { get; set; }
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
    public int? SistemasDocumentados { get; set; }
    public int? SistemasTotal { get; set; }
    public decimal? PorcentajeDocumentacion { get; set; }
    public string? ArchivoRepositorio { get; set; }
    public string? Descripcion { get; set; }
}
