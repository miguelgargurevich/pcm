using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 21: Designación del Oficial de Gobierno de Datos
/// Tabla Supabase: com21_dogd
/// </summary>
[Table("com21_dogd")]
public class Com21OficialGobiernoDatos
{
    [Key]
    [Column("comdogd_ent_id")]
    public long ComdogdEntId { get; set; }

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

    // Campos específicos del Oficial de Gobierno de Datos
    [Column("dni_ogd")]
    [MaxLength(12)]
    public string DniOgd { get; set; } = "";

    [Column("nombre_ogd")]
    [MaxLength(100)]
    public string NombreOgd { get; set; } = "";

    [Column("ape_pat_ogd")]
    [MaxLength(60)]
    public string ApePatOgd { get; set; } = "";

    [Column("ape_mat_ogd")]
    [MaxLength(60)]
    public string ApeMatOgd { get; set; } = "";

    [Column("cargo_ogd")]
    [MaxLength(100)]
    public string CargoOgd { get; set; } = "";

    [Column("correo_ogd")]
    [MaxLength(100)]
    public string CorreoOgd { get; set; } = "";

    [Column("telefono_ogd")]
    [MaxLength(30)]
    public string TelefonoOgd { get; set; } = "";

    [Column("fecha_designacion_ogd")]
    public DateTime? FechaDesignacionOgd { get; set; }

    [Column("numero_resolucion_ogd")]
    [MaxLength(50)]
    public string NumeroResolucionOgd { get; set; } = "";

    [Column("comunicado_pcm_ogd")]
    public bool ComunicadoPcmOgd { get; set; }

    [Column("ruta_pdf_ogd")]
    [MaxLength(255)]
    public string RutaPdfOgd { get; set; } = "";

    [Column("observacion_ogd")]
    [MaxLength(255)]
    public string ObservacionOgd { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    public DateTime? FechaElaboracion { get => FechaDesignacionOgd; set => FechaDesignacionOgd = value; }
    
    [NotMapped]
    public string? NumeroDocumento { get => NumeroResolucionOgd; set => NumeroResolucionOgd = value ?? ""; }
    
    [NotMapped]
    public string? ArchivoDocumento { get => RutaPdfOgd; set => RutaPdfOgd = value ?? ""; }
    
    [NotMapped]
    public string? Descripcion { get => ObservacionOgd; set => ObservacionOgd = value ?? ""; }
    
    [NotMapped]
    public string? NombreCompleto { get => $"{NombreOgd} {ApePatOgd} {ApeMatOgd}"; set { } }
    
    [NotMapped]
    public string? CorreoElectronico { get => CorreoOgd; set => CorreoOgd = value ?? ""; }
    
    [NotMapped]
    public string? Telefono { get => TelefonoOgd; set => TelefonoOgd = value ?? ""; }

    // Alias adicionales para handlers
    [NotMapped]
    public string? Procedimientos { get => null; set { } }
    
    [NotMapped]
    public string? Responsables { get => NombreOgd; set { } }
    
    [NotMapped]
    public DateTime? FechaVigencia { get => null; set { } }
}
