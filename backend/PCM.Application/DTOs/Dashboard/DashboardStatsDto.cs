namespace PCM.Application.DTOs.Dashboard;

public record DashboardStatsDto
{
    public int TotalUsuarios { get; init; }
    public int TotalEntidades { get; init; }
    public int TotalMarcoNormativo { get; init; }
    public int TotalCompromisos { get; init; }
    public int UsuariosActivos { get; init; }
    public int EntidadesActivas { get; init; }
    public int CompromisosActivos { get; init; }
    public int CompromisosPendientes { get; init; }
    public int CompromisosCompletados { get; init; }
}
