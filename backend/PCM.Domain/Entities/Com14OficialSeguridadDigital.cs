using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 14: Designación del Oficial de Seguridad y Confianza Digital
/// Tabla Supabase: com14_doscd
/// </summary>
[Table("com14_doscd")]
public class Com14OficialSeguridadDigital
{
    [Key]
    [Column("comdoscd_ent_id")]
    public long ComdoscdEntId { get; set; }

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

    // Campos específicos del Oficial de Seguridad y Confianza Digital
    [Column("dni_oscd")]
    [MaxLength(12)]
    public string DniOscd { get; set; } = "";

    [Column("nombre_oscd")]
    [MaxLength(100)]
    public string NombreOscd { get; set; } = "";

    [Column("ape_pat_oscd")]
    [MaxLength(60)]
    public string ApePatOscd { get; set; } = "";

    [Column("ape_mat_oscd")]
    [MaxLength(60)]
    public string ApeMatOscd { get; set; } = "";

    [Column("cargo_oscd")]
    [MaxLength(100)]
    public string CargoOscd { get; set; } = "";

    [Column("correo_oscd")]
    [MaxLength(100)]
    public string CorreoOscd { get; set; } = "";

    [Column("telefono_oscd")]
    [MaxLength(30)]
    public string TelefonoOscd { get; set; } = "";

    [Column("fecha_designacion_oscd")]
    public DateTime? FechaDesignacionOscd { get; set; }

    [Column("numero_resolucion_oscd")]
    [MaxLength(50)]
    public string NumeroResolucionOscd { get; set; } = "";

    [Column("comunicado_pcm_oscd")]
    public bool ComunicadoPcmOscd { get; set; }

    [Column("ruta_pdf_oscd")]
    [MaxLength(255)]
    public string RutaPdfOscd { get; set; } = "";

    [Column("observacion_oscd")]
    [MaxLength(255)]
    public string ObservacionOscd { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaElaboracion { get => FechaDesignacionOscd; set => FechaDesignacionOscd = value; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NumeroDocumento { get => NumeroResolucionOscd; set => NumeroResolucionOscd = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoDocumento { get => RutaPdfOscd; set => RutaPdfOscd = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionOscd; set => ObservacionOscd = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? PoliticasSeguridad { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? Certificaciones { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaVigencia { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? NombreCompleto { get => $"{NombreOscd} {ApePatOscd} {ApeMatOscd}"; set { } }
}
