namespace PCM.Application.DTOs.Dashboard;

public record EntidadesStatsDto
{
    public List<EntidadStatsDto> Entidades { get; init; } = new();
}

public record EntidadStatsDto
{
    public Guid EntidadId { get; init; }
    public string Nombre { get; init; } = string.Empty;
    public string Ruc { get; init; } = string.Empty;
    public string? SectorNombre { get; init; }
    public string? ClasificacionNombre { get; init; }
    public bool Activo { get; init; }
    public int TotalCompromisos { get; init; }
    public int Pendientes { get; init; }
    public int SinReportar { get; init; }
    public int NoExigible { get; init; }
    public int EnProceso { get; init; }
    public int Enviados { get; init; }
    public int EnRevision { get; init; }
    public int Observados { get; init; }
    public int Aceptados { get; init; }
    public int PorcentajeCumplimiento { get; init; }
    public DateTime? UltimaActualizacion { get; init; }
}
