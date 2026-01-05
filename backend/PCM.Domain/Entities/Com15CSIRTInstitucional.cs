using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 15: Conformación del CSIRT Institucional
/// Tabla Supabase: com15_csirt
/// </summary>
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

    // Campos específicos del CSIRT Institucional
    [Column("nombre_csirt")]
    [MaxLength(150)]
    public string NombreCsirt { get; set; } = "";

    [Column("fecha_conformacion_csirt")]
    public DateTime FechaConformacionCsirt { get; set; } = DateTime.UtcNow;

    [Column("numero_resolucion_csirt")]
    [MaxLength(50)]
    public string NumeroResolucionCsirt { get; set; } = "";

    [Column("responsable_csirt")]
    [MaxLength(100)]
    public string ResponsableCsirt { get; set; } = "";

    [Column("cargo_responsable_csirt")]
    [MaxLength(100)]
    public string CargoResponsableCsirt { get; set; } = "";

    [Column("correo_csirt")]
    [MaxLength(100)]
    public string CorreoCsirt { get; set; } = "";

    [Column("telefono_csirt")]
    [MaxLength(30)]
    public string TelefonoCsirt { get; set; } = "";

    [Column("protocolo_incidentes_csirt")]
    public bool ProtocoloIncidentesCsirt { get; set; }

    [Column("comunicado_pcm_csirt")]
    public bool ComunicadoPcmCsirt { get; set; }

    [Column("ruta_pdf_csirt")]
    [MaxLength(255)]
    public string RutaPdfCsirt { get; set; } = "";

    [Column("observacion_csirt")]
    [MaxLength(255)]
    public string ObservacionCsirt { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaElaboracion { get => FechaConformacionCsirt; set => FechaConformacionCsirt = value ?? DateTime.UtcNow; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NumeroDocumento { get => NumeroResolucionCsirt; set => NumeroResolucionCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoDocumento { get => RutaPdfCsirt; set => RutaPdfCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionCsirt; set => ObservacionCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? TipoCSIRT { get => NombreCsirt; set => NombreCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public int? IncidentesAtendidos { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public int? TiempoPromedioRespuesta { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? NombreCompleto { get => ResponsableCsirt; set => ResponsableCsirt = value ?? ""; }

    // Alias adicionales para handlers
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaConformacion { get => FechaConformacionCsirt; set => FechaConformacionCsirt = value ?? DateTime.UtcNow; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NumeroResolucion { get => NumeroResolucionCsirt; set => NumeroResolucionCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Responsable { get => ResponsableCsirt; set => ResponsableCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? EmailContacto { get => CorreoCsirt; set => CorreoCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? TelefonoContacto { get => TelefonoCsirt; set => TelefonoCsirt = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoProcedimientos { get => RutaPdfCsirt; set => RutaPdfCsirt = value ?? ""; }
}
