using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("com18_sapte")]
public class Com18AccesoPortalTransparencia
{
    [Key]
    [Column("comsapte_ent_id")]
    public long ComsapteEntId { get; set; }

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
    [Column("url_plataforma")]
    [MaxLength(200)]
    public string? UrlPlataforma { get; set; }

    [Column("fecha_implementacion")]
    public DateTime? FechaImplementacion { get; set; }

    [Column("tramites_disponibles")]
    public int? TramitesDisponibles { get; set; }

    [Column("usuarios_registrados")]
    public int? UsuariosRegistrados { get; set; }

    [Column("tramites_procesados")]
    public int? TramitesProcesados { get; set; }

    [Column("archivo_evidencia")]
    [MaxLength(500)]
    public string? ArchivoEvidencia { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }
}
