using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 19: Responder la Encuesta Nacional de Gobierno Digital (ENAD)
/// Tabla Supabase: com19_renad
/// </summary>
[Table("com19_renad")]
public class Com19EncuestaNacionalGobDigital
{
    [Key]
    [Column("comrenad_ent_id")]
    public long ComrenadEntId { get; set; }

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

    // Campos específicos de la Encuesta Nacional de Gobierno Digital
    [Column("anio_enad")]
    public long AnioEnad { get; set; }

    [Column("responsable_enad")]
    [MaxLength(100)]
    public string ResponsableEnad { get; set; } = "";

    [Column("cargo_responsable_enad")]
    [MaxLength(100)]
    public string CargoResponsableEnad { get; set; } = "";

    [Column("correo_enad")]
    [MaxLength(100)]
    public string CorreoEnad { get; set; } = "";

    [Column("telefono_enad")]
    [MaxLength(30)]
    public string TelefonoEnad { get; set; } = "";

    [Column("fecha_envio_enad")]
    public DateTime? FechaEnvioEnad { get; set; }

    [Column("estado_respuesta_enad")]
    [MaxLength(50)]
    public string EstadoRespuestaEnad { get; set; } = "";

    [Column("enlace_formulario_enad")]
    [MaxLength(200)]
    public string EnlaceFormularioEnad { get; set; } = "";

    [Column("observacion_enad")]
    [MaxLength(255)]
    public string ObservacionEnad { get; set; } = "";

    [Column("ruta_pdf_enad")]
    [MaxLength(255)]
    public string RutaPdfEnad { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    [Column("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaConexion { get => FechaEnvioEnad; set => FechaEnvioEnad = value; }
    
    [NotMapped]
    [JsonIgnore]
    public string? TipoConexion { get => EstadoRespuestaEnad; set => EstadoRespuestaEnad = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? AnchoBanda { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? Proveedor { get => ResponsableEnad; set => ResponsableEnad = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoContrato { get => RutaPdfEnad; set => RutaPdfEnad = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionEnad; set => ObservacionEnad = value ?? ""; }
}
