using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com7_impd")]
public class Com7ImplementacionMPD
{
    [Key]
    [Column("comimpd_ent_id")]
    public long ComimpdEntId { get; set; }

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
    public string? EstadoPCM { get; set; }

    [Column("observaciones_PCM")]
    [MaxLength(500)]
    public string? ObservacionesPCM { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("fec_registro")]
    public DateTime FecRegistro { get; set; } = DateTime.UtcNow;

    [Column("usuario_registra")]
    public Guid UsuarioRegistra { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    // Campos específicos de Implementación de Metodología de Proyectos Digitales
    [Column("url_mpd")]
    [MaxLength(150)]
    public string? UrlMpd { get; set; }

    [Column("fecha_implementacion_mpd")]
    public DateTime? FechaImplementacionMpd { get; set; }

    [Column("responsable_mpd")]
    [MaxLength(100)]
    public string? ResponsableMpd { get; set; }

    [Column("cargo_responsable_mpd")]
    [MaxLength(100)]
    public string? CargoResponsableMpd { get; set; }

    [Column("correo_responsable_mpd")]
    [MaxLength(100)]
    public string? CorreoResponsableMpd { get; set; }

    [Column("telefono_responsable_mpd")]
    [MaxLength(30)]
    public string? TelefonoResponsableMpd { get; set; }

    [Column("tipo_mpd")]
    [MaxLength(50)]
    public string? TipoMpd { get; set; }

    [Column("interoperabilidad_mpd")]
    public bool InteroperabilidadMpd { get; set; }

    [Column("observacion_mpd")]
    [MaxLength(255)]
    public string? ObservacionMpd { get; set; }

    [Column("ruta_pdf_mpd")]
    [MaxLength(255)]
    public string? RutaPdfMpd { get; set; }

    [Column("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }
}
