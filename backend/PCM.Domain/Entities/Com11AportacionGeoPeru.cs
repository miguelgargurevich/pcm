using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 11: Aportación a GeoPeru
/// Tabla Supabase: com11_ageop
/// </summary>
[Table("com11_ageop")]
public class Com11AportacionGeoPeru
{
    [Key]
    [Column("comageop_ent_id")]
    public long ComageopEntId { get; set; }

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

    // Campos específicos de Aportación a GeoPeru
    [Column("url_geo")]
    [MaxLength(200)]
    public string UrlGeo { get; set; } = "";

    [Column("tipo_informacion_geo")]
    [MaxLength(100)]
    public string TipoInformacionGeo { get; set; } = "";

    [Column("total_capas_publicadas")]
    public long TotalCapasPublicadas { get; set; }

    [Column("fecha_ultima_actualizacion_geo")]
    public DateTime? FechaUltimaActualizacionGeo { get; set; }

    [Column("responsable_geo")]
    [MaxLength(100)]
    public string ResponsableGeo { get; set; } = "";

    [Column("cargo_responsable_geo")]
    [MaxLength(100)]
    public string CargoResponsableGeo { get; set; } = "";

    [Column("correo_responsable_geo")]
    [MaxLength(100)]
    public string CorreoResponsableGeo { get; set; } = "";

    [Column("telefono_responsable_geo")]
    [MaxLength(30)]
    public string TelefonoResponsableGeo { get; set; } = "";

    [Column("norma_aprobacion_geo")]
    [MaxLength(100)]
    public string NormaAprobacionGeo { get; set; } = "";

    [Column("fecha_aprobacion_geo")]
    public DateTime? FechaAprobacionGeo { get; set; }

    [Column("interoperabilidad_geo")]
    public bool InteroperabilidadGeo { get; set; }

    [Column("observacion_geo")]
    [MaxLength(255)]
    public string ObservacionGeo { get; set; } = "";

    [Column("ruta_pdf_geo")]
    [MaxLength(255)]
    public string RutaPdfGeo { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public string? UrlPlataforma { get => UrlGeo; set => UrlGeo = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaImplementacion { get => FechaUltimaActualizacionGeo; set => FechaUltimaActualizacionGeo = value; }
    
    [NotMapped]
    [JsonIgnore]
    public int? CapasPublicadas { get => (int?)TotalCapasPublicadas; set => TotalCapasPublicadas = value ?? 0; }
    
    [NotMapped]
    [JsonIgnore]
    public int? CapasTotal { get => (int?)TotalCapasPublicadas; set => TotalCapasPublicadas = value ?? 0; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoEvidencia { get => RutaPdfGeo; set => RutaPdfGeo = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionGeo; set => ObservacionGeo = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public int? DatosPublicados { get => (int?)TotalCapasPublicadas; set => TotalCapasPublicadas = value ?? 0; }
    
    [NotMapped]
    [JsonIgnore]
    public string? TipoDatos { get => TipoInformacionGeo; set => TipoInformacionGeo = value ?? ""; }

    // Alias adicionales para handlers
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaInicio { get => FechaUltimaActualizacionGeo; set => FechaUltimaActualizacionGeo = value; }
    
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaFin { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public int? ServiciosDigitalizados { get => (int?)TotalCapasPublicadas; set => TotalCapasPublicadas = value ?? 0; }
    
    [NotMapped]
    [JsonIgnore]
    public int? ServiciosTotal { get => (int?)TotalCapasPublicadas; set => TotalCapasPublicadas = value ?? 0; }
    
    [NotMapped]
    [JsonIgnore]
    public decimal? PorcentajeDigitalizacion { get => 100; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoPlan { get => RutaPdfGeo; set => RutaPdfGeo = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public int? BeneficiariosEstimados { get => null; set { } }
}
