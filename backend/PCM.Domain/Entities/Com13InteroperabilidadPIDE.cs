using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com13_pcpide")]
public class Com13InteroperabilidadPIDE
{
    [Key]
    [Column("compcpide_ent_id")]
    public long CompcpideEntId { get; set; }

    [Column("compromiso_id")]
    public long CompromisoId { get; set; }

    [Column("entidad_id")]
    public Guid EntidadId { get; set; }

    [Column("etapa_formulario")]
    [MaxLength(20)]
    public string EtapaFormulario { get; set; } = "paso1";

    [Column("estado")]
    [MaxLength(15)]
    public string Estado { get; set; } = "bandeja";

    [Column("check_privacidad")]
    public bool CheckPrivacidad { get; set; }

    [Column("check_ddjj")]
    public bool CheckDdjj { get; set; }

    [Column("estado_PCM")]
    [MaxLength(50)]
    public string EstadoPCM { get; set; } = "";

    [Column("observaciones_PCM")]
    [MaxLength(500)]
    public string ObservacionesPCM { get; set; } = "";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("fec_registro")]
    public DateTime FecRegistro { get; set; } = DateTime.UtcNow;

    [Column("usuario_registra")]
    public Guid UsuarioRegistra { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    // Campos específicos
    [Column("fecha_aprobacion")]
    public DateTime? FechaAprobacion { get; set; }

    [Column("numero_resolucion")]
    [MaxLength(50)]
    public string? NumeroResolucion { get; set; }

    [Column("archivo_plan")]
    [MaxLength(500)]
    public string? ArchivoPlan { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("riesgos_identificados")]
    public string? RiesgosIdentificados { get; set; }

    [Column("estrategias_mitigacion")]
    public string? EstrategiasMitigacion { get; set; }

    [Column("fecha_revision")]
    public DateTime? FechaRevision { get; set; }

    [Column("responsable")]
    [MaxLength(200)]
    public string? Responsable { get; set; }
}
