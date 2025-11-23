using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com11AportacionGeoPeru.Commands.UpdateCom11AportacionGeoPeru;

public class UpdateCom11AportacionGeoPeruCommand : IRequest<Result<Com11AportacionGeoPeruResponse>>
{
    public long ComageopEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public int? ServiciosDigitalizados { get; set; }
    public int? ServiciosTotal { get; set; }
    public decimal? PorcentajeDigitalizacion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public int? BeneficiariosEstimados { get; set; }
}

public class Com11AportacionGeoPeruResponse
{
    public long ComageopEntId { get; set; }
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
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public int? ServiciosDigitalizados { get; set; }
    public int? ServiciosTotal { get; set; }
    public decimal? PorcentajeDigitalizacion { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
    public int? BeneficiariosEstimados { get; set; }
}
