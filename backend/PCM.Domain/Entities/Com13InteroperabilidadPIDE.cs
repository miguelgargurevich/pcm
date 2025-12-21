using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 13: Publicación de Servicios o Consumo de PIDE
/// Tabla Supabase: com13_pcpide
/// </summary>
[Table("com13_pcpide")]
public class Com13InteroperabilidadPIDE
{
    [Key]
    [Column("compcpide_ent_id")]
    public long CompcpideEntId { get; set; }

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

    // Campos específicos de Interoperabilidad PIDE
    [Column("tipo_integracion_pide")]
    [MaxLength(30)]
    public string TipoIntegracionPide { get; set; } = "";

    [Column("nombre_servicio_pide")]
    [MaxLength(150)]
    public string NombreServicioPide { get; set; } = "";

    [Column("descripcion_servicio_pide")]
    [MaxLength(255)]
    public string DescripcionServicioPide { get; set; } = "";

    [Column("fecha_inicio_operacion_pide")]
    public DateTime? FechaInicioOperacionPide { get; set; }

    [Column("responsable_pide")]
    [MaxLength(100)]
    public string ResponsablePide { get; set; } = "";

    [Column("cargo_responsable_pide")]
    [MaxLength(100)]
    public string CargoResponsablePide { get; set; } = "";

    [Column("correo_responsable_pide")]
    [MaxLength(100)]
    public string CorreoResponsablePide { get; set; } = "";

    [Column("telefono_responsable_pide")]
    [MaxLength(30)]
    public string TelefonoResponsablePide { get; set; } = "";

    [Column("numero_convenio_pide")]
    [MaxLength(50)]
    public string NumeroConvenioPide { get; set; } = "";

    [Column("fecha_convenio_pide")]
    public DateTime? FechaConvenioPide { get; set; }

    [Column("interoperabilidad_pide")]
    public bool InteroperabilidadPide { get; set; }

    [Column("url_servicio_pide")]
    [MaxLength(200)]
    public string UrlServicioPide { get; set; } = "";

    [Column("observacion_pide")]
    [MaxLength(255)]
    public string ObservacionPide { get; set; } = "";

    [Column("ruta_pdf_pide")]
    [MaxLength(255)]
    public string RutaPdfPide { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    [Column("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }

    [Column("fecha_integracion_pide")]
    public DateTime? FechaIntegracionPide { get; set; }

    [Column("servicios_publicados_pide")]
    public int? ServiciosPublicadosPide { get; set; }

    [Column("servicios_consumidos_pide")]
    public int? ServiciosConsumidosPide { get; set; }

    [Column("total_transacciones_pide")]
    public long? TotalTransaccionesPide { get; set; }

    [Column("enlace_portal_pide")]
    [MaxLength(255)]
    public string? EnlacePortalPide { get; set; }

    [Column("integrado_pide")]
    public bool? IntegradoPide { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaConexion { get => FechaIntegracionPide; set => FechaIntegracionPide = value; }
    
    [NotMapped]
    [JsonIgnore]
    public int? ServiciosPublicados { get => ServiciosPublicadosPide.HasValue ? (int?)ServiciosPublicadosPide.Value : null; set => ServiciosPublicadosPide = value; }
    
    [NotMapped]
    [JsonIgnore]
    public int? ServiciosConsumidos { get => ServiciosConsumidosPide.HasValue ? (int?)ServiciosConsumidosPide.Value : null; set => ServiciosConsumidosPide = value; }
    
    [NotMapped]
    [JsonIgnore]
    public int? TransaccionesTotales { get => TotalTransaccionesPide.HasValue ? (int?)TotalTransaccionesPide.Value : null; set => TotalTransaccionesPide = value.HasValue ? (long?)value.Value : null; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoAcuerdo { get => RutaPdfPide; set => RutaPdfPide = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionPide; set => ObservacionPide = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? UrlPlataforma { get => EnlacePortalPide; set => EnlacePortalPide = value; }
    
    [NotMapped]
    [JsonIgnore]
    public bool? ConectadoPIDE { get => IntegradoPide; set => IntegradoPide = value; }

    // Alias adicionales para handlers
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaAprobacion { get => FechaConvenioPide; set => FechaConvenioPide = value; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NumeroResolucion { get => NumeroConvenioPide; set => NumeroConvenioPide = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoPlan { get => RutaPdfPide; set => RutaPdfPide = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? RiesgosIdentificados { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? EstrategiasMitigacion { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaRevision { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? Responsable { get => ResponsablePide; set => ResponsablePide = value ?? ""; }
}
