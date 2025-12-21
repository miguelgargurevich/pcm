using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com6MigracionGobPe.Queries.GetCom6MigracionGobPe;

public class GetCom6MigracionGobPeQuery : IRequest<Result<Com6MigracionGobPeResponse?>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
}

public class Com6MigracionGobPeResponse
{
    public long CommpgobpeEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? UrlGobPe { get; set; }
    public DateTime? FechaMigracionGobPe { get; set; }
    public DateTime? FechaActualizacionGobPe { get; set; }
    public string? ResponsableGobPe { get; set; }
    public string? CorreoResponsableGobPe { get; set; }
    public string? TelefonoResponsableGobPe { get; set; }
    public string? TipoMigracionGobPe { get; set; }
    public string? ObservacionGobPe { get; set; }
    public string? RutaPdfGobPe { get; set; }
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public bool Activo { get; set; }
}
