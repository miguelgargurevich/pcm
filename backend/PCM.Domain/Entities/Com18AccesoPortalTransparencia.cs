using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 18: Solicitud de Acceso al Portal de Transparencia Estándar
/// Tabla Supabase: com18_sapte
/// </summary>
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

    // Campos específicos del Portal de Transparencia Estándar
    [Column("responsable_pte")]
    [MaxLength(100)]
    public string ResponsablePte { get; set; } = "";

    [Column("cargo_responsable_pte")]
    [MaxLength(100)]
    public string CargoResponsablePte { get; set; } = "";

    [Column("correo_pte")]
    [MaxLength(100)]
    public string CorreoPte { get; set; } = "";

    [Column("telefono_pte")]
    [MaxLength(30)]
    public string TelefonoPte { get; set; } = "";

    [Column("fecha_solicitud_pte")]
    public DateTime? FechaSolicitudPte { get; set; }

    [Column("fecha_acceso_pte")]
    public DateTime? FechaAccesoPte { get; set; }

    [Column("numero_oficio_pte")]
    [MaxLength(50)]
    public string NumeroOficioPte { get; set; } = "";

    [Column("estado_acceso_pte")]
    [MaxLength(50)]
    public string EstadoAccesoPte { get; set; } = "";

    [Column("enlace_portal_pte")]
    [MaxLength(200)]
    public string EnlacePortalPte { get; set; } = "";

    [Column("descripcion_pte")]
    [MaxLength(255)]
    public string DescripcionPte { get; set; } = "";

    [Column("ruta_pdf_pte")]
    [MaxLength(255)]
    public string RutaPdfPte { get; set; } = "";

    [Column("observacion_pte")]
    [MaxLength(255)]
    public string ObservacionPte { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    public string? UrlPlataforma { get => EnlacePortalPte; set => EnlacePortalPte = value ?? ""; }
    
    [NotMapped]
    public DateTime? FechaImplementacion { get => FechaAccesoPte; set => FechaAccesoPte = value; }
    
    [NotMapped]
    public int? TramitesDisponibles { get => null; set { } }
    
    [NotMapped]
    public int? UsuariosRegistrados { get => null; set { } }
    
    [NotMapped]
    public int? TramitesProcesados { get => null; set { } }
    
    [NotMapped]
    public string? ArchivoEvidencia { get => RutaPdfPte; set => RutaPdfPte = value ?? ""; }
    
    [NotMapped]
    public string? Descripcion { get => DescripcionPte ?? ObservacionPte; set => ObservacionPte = value ?? ""; }
}
