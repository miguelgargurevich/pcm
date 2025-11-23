using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com17PlanTransicionIPv6.Commands.CreateCom17PlanTransicionIPv6;

public class CreateCom17PlanTransicionIPv6Command : IRequest<Result<Com17PlanTransicionIPv6Response>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos
    public DateTime? FechaInicioTransicion { get; set; }
    public DateTime? FechaFinTransicion { get; set; }
    public decimal? PorcentajeAvance { get; set; }
    public int? SistemasMigrados { get; set; }
    public int? SistemasTotal { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
}

public class Com17PlanTransicionIPv6Response
{
    public long Comptipv6EntId { get; set; }
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
    public DateTime? FechaInicioTransicion { get; set; }
    public DateTime? FechaFinTransicion { get; set; }
    public decimal? PorcentajeAvance { get; set; }
    public int? SistemasMigrados { get; set; }
    public int? SistemasTotal { get; set; }
    public string? ArchivoPlan { get; set; }
    public string? Descripcion { get; set; }
}
