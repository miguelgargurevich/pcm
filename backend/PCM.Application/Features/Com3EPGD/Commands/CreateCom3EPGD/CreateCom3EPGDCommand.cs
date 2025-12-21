using PCM.Application.Common;
using MediatR;

namespace PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;

public class CreateCom3EPGDCommand : IRequest<Result<Com3EPGDResponse>>
{
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

public class Com3EPGDResponse
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
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaReporte { get; set; }
    public string? Sede { get; set; }
    public string? Observaciones { get; set; }
    
    // Campos de Estructura Organizacional TI
    public string? UbicacionAreaTi { get; set; }
    public string? OrganigramaTi { get; set; }
    public string? DependenciaAreaTi { get; set; }
    public decimal? CostoAnualTi { get; set; }
    public bool ExisteComisionGdTi { get; set; }
    
    // Campos de Paso 2 (Documento y Criterios)
    public string? RutaPdfNormativa { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
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

// DTOs para las entidades relacionadas
public class PersonalTIDto
{
    public long? PersonalId { get; set; }
    public string? NombrePersona { get; set; }
    public string? Dni { get; set; }
    public string? Cargo { get; set; }
    public string? Rol { get; set; }
    public string? Especialidad { get; set; }
    public string? GradoInstruccion { get; set; }
    public string? Certificacion { get; set; }
    public string? Acreditadora { get; set; }
    public string? CodigoCertificacion { get; set; }
    public string? Colegiatura { get; set; }
    public string? EmailPersonal { get; set; }
    public string? Telefono { get; set; }
    public bool Activo { get; set; } = true;
}

public class InventarioSoftwareDto
{
    public long? InvSoftId { get; set; }
    public string? CodProducto { get; set; }
    public string? NombreProducto { get; set; }
    public string? Version { get; set; }
    public string? TipoSoftware { get; set; }
    public int CantidadInstalaciones { get; set; }
    public int CantidadLicencias { get; set; }
    public int ExcesoDeficiencia { get; set; }
    public decimal CostoLicencias { get; set; }
    public bool Activo { get; set; } = true;
}

public class InventarioSistemasInfoDto
{
    public long? InvSiId { get; set; }
    public string? Codigo { get; set; }
    public string? NombreSistema { get; set; }
    public string? Descripcion { get; set; }
    public string? TipoSistema { get; set; }
    public string? LenguajeProgramacion { get; set; }
    public string? BaseDatos { get; set; }
    public string? Plataforma { get; set; }
    public bool Activo { get; set; } = true;
}

public class InventarioRedDto
{
    public long? InvRedId { get; set; }
    public string? TipoEquipo { get; set; }
    public int Cantidad { get; set; }
    public int PuertosOperativos { get; set; }
    public int PuertosInoperativos { get; set; }
    public int TotalPuertos { get; set; }
    public decimal CostoMantenimientoAnual { get; set; }
    public string? Observaciones { get; set; }
    public bool Activo { get; set; } = true;
}

public class InventarioServidoresDto
{
    public long? InvSrvId { get; set; }
    public string? NombreEquipo { get; set; }
    public string? TipoEquipo { get; set; }
    public string? Estado { get; set; }
    public string? Capa { get; set; }
    public string? Propiedad { get; set; }
    public string? Montaje { get; set; }
    public string? MarcaCpu { get; set; }
    public string? ModeloCpu { get; set; }
    public decimal? VelocidadGhz { get; set; }
    public int? Nucleos { get; set; }
    public int? MemoriaGb { get; set; }
    public string? MarcaMemoria { get; set; }
    public string? ModeloMemoria { get; set; }
    public int? CantidadMemoria { get; set; }
    public decimal CostoMantenimientoAnual { get; set; }
    public string? Observaciones { get; set; }
    public bool Activo { get; set; } = true;
}

public class SeguridadInfoDto
{
    public long? SeginfoId { get; set; }
    public bool PlanSgsi { get; set; }
    public bool ComiteSeguridad { get; set; }
    public bool OficialSeguridadEnOrganigrama { get; set; }
    public bool PoliticaSeguridad { get; set; }
    public bool InventarioActivos { get; set; }
    public bool AnalisisRiesgos { get; set; }
    public bool MetodologiaRiesgos { get; set; }
    public bool PlanContinuidad { get; set; }
    public bool ProgramaAuditorias { get; set; }
    public bool InformesDireccion { get; set; }
    public bool CertificacionIso27001 { get; set; }
    public string? Observaciones { get; set; }
    public List<CapacitacionSeginfoDto>? Capacitaciones { get; set; }
}

public class CapacitacionSeginfoDto
{
    public long? CapsegId { get; set; }
    public string? Curso { get; set; }
    public int CantidadPersonas { get; set; }
    public bool Activo { get; set; } = true;
}

public class ObjetivoEntidadDto
{
    public long? ObjEntId { get; set; }
    public string TipoObj { get; set; } = "E"; // 'E' = Estratégico, 'G' = Gobierno Digital
    public string? NumeracionObj { get; set; }
    public string? DescripcionObjetivo { get; set; }
    public List<AccionObjetivoEntidadDto>? Acciones { get; set; }
    public bool Activo { get; set; } = true;
}

public class AccionObjetivoEntidadDto
{
    public long? AccObjEntId { get; set; }
    public string? NumeracionAcc { get; set; }
    public string? DescripcionAccion { get; set; }
    public bool Activo { get; set; } = true;
}

public class ProyectoEntidadDto
{
    public long? ProyEntId { get; set; }
    public string? NumeracionProy { get; set; }
    public string? Nombre { get; set; }
    public string? Alcance { get; set; }
    public string? Justificacion { get; set; }
    public string? TipoProy { get; set; }
    public string? AreaProy { get; set; }
    public string? AreaEjecuta { get; set; }
    public string? TipoBeneficiario { get; set; }
    public string? EtapaProyecto { get; set; }
    public string? AmbitoProyecto { get; set; }
    public DateTime? FecIniProg { get; set; }
    public DateTime? FecFinProg { get; set; }
    public DateTime? FecIniReal { get; set; }
    public DateTime? FecFinReal { get; set; }
    public string? AlineadoPgd { get; set; }
    public string? ObjTranDig { get; set; }
    public string? ObjEst { get; set; }
    public string? AccEst { get; set; }
    public decimal? MontoInversion { get; set; }
    public bool EstadoProyecto { get; set; } = true;
    public bool Activo { get; set; } = true;
}
