using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com6_mpgobpe")]
public class Com6MigracionGobPe
{
    [Key]
    [Column("commpgobpe_ent_id")]
    public long CommpgobpeEntId { get; set; }

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

    // Campos específicos de Migración GOB.PE
    [Column("url_gobpe")]
    [MaxLength(150)]
    public string? UrlGobPe { get; set; }

    [Column("fecha_migracion_gobpe")]
    public DateTime? FechaMigracionGobPe { get; set; }

    [Column("fecha_actualizacion_gobpe")]
    public DateTime? FechaActualizacionGobPe { get; set; }

    [Column("responsable_gobpe")]
    [MaxLength(100)]
    public string? ResponsableGobPe { get; set; }

    [Column("correo_responsable_gobpe")]
    [MaxLength(100)]
    public string? CorreoResponsableGobPe { get; set; }

    [Column("telefono_responsable_gobpe")]
    [MaxLength(30)]
    public string? TelefonoResponsableGobPe { get; set; }

    [Column("tipo_migracion_gobpe")]
    [MaxLength(50)]
    public string? TipoMigracionGobPe { get; set; }

    [Column("observacion_gobpe")]
    [MaxLength(255)]
    public string? ObservacionGobPe { get; set; }

    [Column("ruta_pdf_gobpe")]
    [MaxLength(255)]
    public string? RutaPdfGobPe { get; set; }

    [Column("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }
}
