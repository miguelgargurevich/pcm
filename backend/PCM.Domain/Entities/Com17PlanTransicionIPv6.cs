using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com17_ptipv6")]
public class Com17PlanTransicionIPv6
{
    [Key]
    [Column("comptipv6_ent_id")]
    public long Comptipv6EntId { get; set; }

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
    [Column("fecha_inicio_transicion")]
    public DateTime? FechaInicioTransicion { get; set; }

    [Column("fecha_fin_transicion")]
    public DateTime? FechaFinTransicion { get; set; }

    [Column("porcentaje_avance", TypeName = "decimal(5,2)")]
    public decimal? PorcentajeAvance { get; set; }

    [Column("sistemas_migrados")]
    public int? SistemasMigrados { get; set; }

    [Column("sistemas_total")]
    public int? SistemasTotal { get; set; }

    [Column("archivo_plan")]
    [MaxLength(500)]
    public string? ArchivoPlan { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }
}
