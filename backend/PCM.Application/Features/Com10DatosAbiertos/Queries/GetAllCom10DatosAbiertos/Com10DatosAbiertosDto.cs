namespace PCM.Application.Features.Com10DatosAbiertos.Queries.GetAllCom10DatosAbiertos;

public class Com10DatosAbiertosDto
{
    public long ComdaEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EntidadNombre { get; set; } = string.Empty;
    public string EntidadRuc { get; set; } = string.Empty;
    public string? Estado { get; set; }
    public string? EstadoPCM { get; set; }
    public string? UrlDatosAbiertos { get; set; }
    public long TotalDatasets { get; set; }
    public DateTime? FechaUltimaActualizacionDa { get; set; }
    public string? ResponsableDa { get; set; }
    public string? CargoResponsableDa { get; set; }
    public string? CorreoResponsableDa { get; set; }
    public string? TelefonoResponsableDa { get; set; }
    public string? NumeroNormaResolucionDa { get; set; }
    public DateTime? FechaAprobacionDa { get; set; }
    public DateTime? FecRegistro { get; set; }
    
    // Indicadores calculados
    public bool TieneResponsable { get; set; }
    public bool TieneUrlPnda { get; set; }
    public bool TieneNormaAprobacion { get; set; }
    public bool TienePdfEvidencia { get; set; }
}
