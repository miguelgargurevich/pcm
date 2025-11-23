namespace PCM.Application.Features.Com5EstrategiaDigital.Commands;

public class CreateCom5EstrategiaDigitalCommand
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string? NombreEstrategia { get; set; }
    public long? PeriodoInicioEstrategia { get; set; }
    public long? PeriodoFinEstrategia { get; set; }
    public DateTime? FechaAprobacionEstrategia { get; set; }
    public string? ObjetivosEstrategicos { get; set; }
    public string? LineasAccion { get; set; }
    public bool AlineadoPgdEstrategia { get; set; }
    public string? EstadoImplementacionEstrategia { get; set; }
    public string? RutaPdfEstrategia { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
}

public class Com5EstrategiaDigitalResponse
{
    public long ComdedEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string? NombreEstrategia { get; set; }
    public long? PeriodoInicioEstrategia { get; set; }
    public long? PeriodoFinEstrategia { get; set; }
    public DateTime? FechaAprobacionEstrategia { get; set; }
    public string? ObjetivosEstrategicos { get; set; }
    public string? LineasAccion { get; set; }
    public bool AlineadoPgdEstrategia { get; set; }
    public string? EstadoImplementacionEstrategia { get; set; }
    public string? RutaPdfEstrategia { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public string Estado { get; set; } = "bandeja";
    public string EtapaFormulario { get; set; } = "paso1";
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public bool Activo { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
}
