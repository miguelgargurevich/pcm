using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com12_drsp")]
public class Com12ResponsableSoftwarePublico
{
    [Key]
    [Column("comdrsp_ent_id")]
    public long ComdrspEntId { get; set; }

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
    [Column("fecha_elaboracion")]
    public DateTime? FechaElaboracion { get; set; }

    [Column("numero_documento")]
    [MaxLength(50)]
    public string? NumeroDocumento { get; set; }

    [Column("archivo_documento")]
    [MaxLength(500)]
    public string? ArchivoDocumento { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("requisitos_seguridad")]
    public string? RequisitosSeguridad { get; set; }

    [Column("requisitos_privacidad")]
    public string? RequisitosPrivacidad { get; set; }

    [Column("fecha_vigencia")]
    public DateTime? FechaVigencia { get; set; }
}
