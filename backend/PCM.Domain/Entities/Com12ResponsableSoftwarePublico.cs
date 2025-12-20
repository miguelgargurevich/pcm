using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 12: Designación del Responsable de Software Público
/// Tabla Supabase: com12_drsp
/// </summary>
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

    // Campos específicos del Responsable de Software Público
    [Column("dni_rsp")]
    [MaxLength(12)]
    public string DniRsp { get; set; } = "";

    [Column("nombre_rsp")]
    [MaxLength(100)]
    public string NombreRsp { get; set; } = "";

    [Column("ape_pat_rsp")]
    [MaxLength(60)]
    public string ApePatRsp { get; set; } = "";

    [Column("ape_mat_rsp")]
    [MaxLength(60)]
    public string ApeMatRsp { get; set; } = "";

    [Column("cargo_rsp")]
    [MaxLength(100)]
    public string CargoRsp { get; set; } = "";

    [Column("correo_rsp")]
    [MaxLength(100)]
    public string CorreoRsp { get; set; } = "";

    [Column("telefono_rsp")]
    [MaxLength(30)]
    public string TelefonoRsp { get; set; } = "";

    [Column("fecha_designacion_rsp")]
    public DateTime? FechaDesignacionRsp { get; set; }

    [Column("numero_resolucion_rsp")]
    [MaxLength(50)]
    public string NumeroResolucionRsp { get; set; } = "";

    [Column("ruta_pdf_rsp")]
    [MaxLength(255)]
    public string RutaPdfRsp { get; set; } = "";

    [Column("observacion_rsp")]
    [MaxLength(255)]
    public string ObservacionRsp { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaElaboracion { get => FechaDesignacionRsp; set => FechaDesignacionRsp = value; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NumeroDocumento { get => NumeroResolucionRsp; set => NumeroResolucionRsp = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? ArchivoDocumento { get => RutaPdfRsp; set => RutaPdfRsp = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Descripcion { get => ObservacionRsp; set => ObservacionRsp = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? NombreCompleto { get => $"{NombreRsp} {ApePatRsp} {ApeMatRsp}"; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? CorreoElectronico { get => CorreoRsp; set => CorreoRsp = value ?? ""; }
    
    [NotMapped]
    [JsonIgnore]
    public string? Telefono { get => TelefonoRsp; set => TelefonoRsp = value ?? ""; }

    // Alias adicionales para handlers
    [NotMapped]
    [JsonIgnore]
    public string? RequisitosSeguridad { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public string? RequisitosPrivacidad { get => null; set { } }
    
    [NotMapped]
    [JsonIgnore]
    public DateTime? FechaVigencia { get => null; set { } }
}
