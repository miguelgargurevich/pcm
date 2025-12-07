using PCM.Application.Common;
using MediatR;
using PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;

namespace PCM.Application.Features.Com3EPGD.Commands.UpdateCom3EPGD;

public class UpdateCom3EPGDCommand : IRequest<Result<Com3EPGDResponse>>
{
    public long ComepgdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; } = string.Empty;
    public string ObservacionesPcm { get; set; } = string.Empty;
    public Guid UsuarioRegistra { get; set; }
    public DateTime? FechaReporte { get; set; }
    public string? Sede { get; set; }
    public string? Observaciones { get; set; }
    
    // Campos de Estructura Organizacional TI
    public string? UbicacionAreaTi { get; set; }
    public string? OrganigramaTi { get; set; }
    public string? DependenciaAreaTi { get; set; }
    public decimal? CostoAnualTi { get; set; }
    public bool ExisteComisionGdTi { get; set; }
    
    // Listas de datos relacionados
    public List<PersonalTIDto>? PersonalTI { get; set; }
    public List<InventarioSoftwareDto>? InventariosSoftware { get; set; }
    public List<InventarioSistemasInfoDto>? InventariosSistemas { get; set; }
    public List<InventarioRedDto>? InventariosRed { get; set; }
    public List<InventarioServidoresDto>? InventariosServidores { get; set; }
    public SeguridadInfoDto? SeguridadInfo { get; set; }
    public List<ObjetivoEntidadDto>? Objetivos { get; set; }
    public List<ProyectoEntidadDto>? Proyectos { get; set; }
}
