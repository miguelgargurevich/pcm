using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 16: Implementación del Sistema de Gestión de Seguridad de la Información
/// Tabla Supabase: com16_sgsi
/// </summary>
[Table("com16_sgsi")]
public class Com16SistemaGestionSeguridad
{
    [Key]
    [Column("comsgsi_ent_id")]
    public long ComsgsiEntId { get; set; }

    [Column("compromiso_id")]
    public long CompromisoId { get; set; }

    [Column("entidad_id")]
    public Guid EntidadId { get; set; }

    [Column("etapa_formulario")]
    [MaxLength(20)]
    public string EtapaFormulario { get; set; } = "paso1";

    [Column("estado")]
    [MaxLength(15)]
    public string Estado { get; set; } = "pendiente";

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

    // Campos específicos del Sistema de Gestión de Seguridad de la Información
    [Column("responsable_sgsi")]
    [MaxLength(100)]
    public string ResponsableSgsi { get; set; } = "";

    [Column("cargo_responsable_sgsi")]
    [MaxLength(100)]
    public string CargoResponsableSgsi { get; set; } = "";

    [Column("correo_sgsi")]
    [MaxLength(100)]
    public string CorreoSgsi { get; set; } = "";

    [Column("telefono_sgsi")]
    [MaxLength(30)]
    public string TelefonoSgsi { get; set; } = "";

    [Column("estado_implementacion_sgsi")]
    [MaxLength(50)]
    public string EstadoImplementacionSgsi { get; set; } = "";

    [Column("alcance_sgsi")]
    [MaxLength(255)]
    public string AlcanceSgsi { get; set; } = "";

    [Column("fecha_inicio_sgsi")]
    public DateTime? FechaInicioSgsi { get; set; }

    [Column("fecha_certificacion_sgsi")]
    public DateTime? FechaCertificacionSgsi { get; set; }

    [Column("entidad_certificadora_sgsi")]
    [MaxLength(150)]
    public string EntidadCertificadoraSgsi { get; set; } = "";

    [Column("version_norma_sgsi")]
    [MaxLength(20)]
    public string VersionNormaSgsi { get; set; } = "";

    [Column("ruta_pdf_certificado_sgsi")]
    [MaxLength(255)]
    public string RutaPdfCertificadoSgsi { get; set; } = "";

    [Column("ruta_pdf_politicas_sgsi")]
    [MaxLength(255)]
    public string RutaPdfPoliticasSgsi { get; set; } = "";

    [Column("observacion_sgsi")]
    [MaxLength(255)]
    public string ObservacionSgsi { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    [Column("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }

    // Campos adicionales necesarios para los alias de compatibilidad
    [Column("fecha_implementacion_sgsi")]
    public DateTime? FechaImplementacionSgsi { get; set; }

    [Column("norma_aplicada_sgsi")]
    [MaxLength(100)]
    public string NormaAplicadaSgsi { get; set; } = "";

    [Column("ruta_pdf_sgsi")]
    [MaxLength(255)]
    public string RutaPdfSgsi { get; set; } = "";

    [Column("nivel_implementacion_sgsi")]
    [MaxLength(50)]
    public string NivelImplementacionSgsi { get; set; } = "";

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaImplementacion { get => FechaImplementacionSgsi; set => FechaImplementacionSgsi = value; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NumeroDocumento { get => NormaAplicadaSgsi; set => NormaAplicadaSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoEvidencia { get => RutaPdfSgsi; set => RutaPdfSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionSgsi; set => ObservacionSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? AlcanceSGSI { get => AlcanceSgsi; set => AlcanceSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NivelMadurez { get => NivelImplementacionSgsi; set => NivelImplementacionSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaCertificacion { get => FechaCertificacionSgsi; set => FechaCertificacionSgsi = value; }

    // Alias adicionales para handlers
    [NotMapped]
    [JsonIgnore]
    public string? NormaAplicable { get => VersionNormaSgsi; set => VersionNormaSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Certificacion { get => EntidadCertificadoraSgsi; set => EntidadCertificadoraSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoCertificado { get => RutaPdfCertificadoSgsi; set => RutaPdfCertificadoSgsi = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Alcance { get => AlcanceSgsi; set => AlcanceSgsi = value ?? ""; }
}
