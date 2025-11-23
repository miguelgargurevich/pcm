using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com15_csirt")]
public class Com15CSIRTInstitucional
{
    [Key]
    [Column("comcsirt_ent_id")]
    public long ComcsirtEntId { get; set; }

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
    [Column("fecha_conformacion")]
    public DateTime? FechaConformacion { get; set; }

    [Column("numero_resolucion")]
    [MaxLength(50)]
    public string? NumeroResolucion { get; set; }

    [Column("responsable")]
    [MaxLength(200)]
    public string? Responsable { get; set; }

    [Column("email_contacto")]
    [MaxLength(100)]
    public string? EmailContacto { get; set; }

    [Column("telefono_contacto")]
    [MaxLength(30)]
    public string? TelefonoContacto { get; set; }

    [Column("archivo_procedimientos")]
    [MaxLength(500)]
    public string? ArchivoProcedimientos { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }
}
