using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com8_ptupa")]
public class Com8PublicacionTUPA
{
    [Key]
    [Column("comptupa_ent_id")]
    public long ComptupaEntId { get; set; }

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

    [Column("estado_pcm")]
    [MaxLength(50)]
    public string? EstadoPCM { get; set; }

    [Column("observaciones_pcm")]
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

    // Campos específicos de Publicación de TUPA
    [Column("url_tupa")]
    [MaxLength(150)]
    public string? UrlTupa { get; set; }

    [Column("numero_resolucion_tupa")]
    [MaxLength(50)]
    public string? NumeroResolucionTupa { get; set; }

    [Column("fecha_aprobacion_tupa")]
    public DateTime? FechaAprobacionTupa { get; set; }

    [Column("responsable_tupa")]
    [MaxLength(100)]
    public string? ResponsableTupa { get; set; }

    [Column("cargo_responsable_tupa")]
    [MaxLength(100)]
    public string? CargoResponsableTupa { get; set; }

    [Column("correo_responsable_tupa")]
    [MaxLength(100)]
    public string? CorreoResponsableTupa { get; set; }

    [Column("telefono_responsable_tupa")]
    [MaxLength(30)]
    public string? TelefonoResponsableTupa { get; set; }

    [Column("actualizado_tupa")]
    public bool ActualizadoTupa { get; set; }

    [Column("observacion_tupa")]
    [MaxLength(255)]
    public string? ObservacionTupa { get; set; }

    [Column("ruta_pdf_tupa")]
    [MaxLength(255)]
    public string? RutaPdfTupa { get; set; }

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedad no mapeada para compatibilidad con handlers
    [NotMapped]
    public DateTime? UpdatedAt { get; set; }
}
