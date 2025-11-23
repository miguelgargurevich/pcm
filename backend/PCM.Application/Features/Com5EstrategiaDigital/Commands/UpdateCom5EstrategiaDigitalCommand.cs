namespace PCM.Application.Features.Com5EstrategiaDigital.Commands;

public class UpdateCom5EstrategiaDigitalCommand
{
    public int ComedEntId { get; set; }
    public int CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string? NombreEstrategia { get; set; }
    public int? AnioInicio { get; set; }
    public int? AnioFin { get; set; }
    public DateTime? FechaAprobacion { get; set; }
    public string? ObjetivosEstrategicos { get; set; }
    public string? LineasAccion { get; set; }
    public bool AlineadoPgd { get; set; }
    public string? EstadoImplementacion { get; set; }
    public string? UrlDoc { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
}
