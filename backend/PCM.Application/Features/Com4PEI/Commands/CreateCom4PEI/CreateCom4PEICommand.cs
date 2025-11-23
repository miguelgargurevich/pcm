using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com4PEI.Commands.CreateCom4PEI;

public class CreateCom4PEICommand : IRequest<Result<Com4PEIResponse>>
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = "paso1";
    public string Estado { get; set; } = "bandeja";
    
    // Campos del PEI - Supabase schema
    public long? AnioInicioPei { get; set; }
    public long? AnioFinPei { get; set; }
    public DateTime? FechaAprobacionPei { get; set; }
    public string? ObjetivoPei { get; set; }
    public string? DescripcionPei { get; set; }
    public bool AlineadoPgd { get; set; }
    public string? RutaPdfPei { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
    // Aceptaciones
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    
    // Usuario que registra
    public Guid? UsuarioRegistra { get; set; }
}

public class Com4PEIResponse
{
    public long ComtdpeiEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public long? AnioInicioPei { get; set; }
    public long? AnioFinPei { get; set; }
    public DateTime? FechaAprobacionPei { get; set; }
    public string? ObjetivoPei { get; set; }
    public string? DescripcionPei { get; set; }
    public bool AlineadoPgd { get; set; }
    public string? RutaPdfPei { get; set; }
    public string? CriteriosEvaluados { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public bool Activo { get; set; }
}
