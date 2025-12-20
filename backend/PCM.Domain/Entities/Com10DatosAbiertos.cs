using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 10: Publicación de datos en la PNDA
/// Tabla Supabase: com10_pnda
/// </summary>
[Table("com10_pnda")]
public class Com10DatosAbiertos
{
    [Key]
    [Column("compnda_ent_id")]
    public long ComdaEntId { get; set; }

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
    public string? EstadoPCM { get; set; }

    [Column("observaciones_PCM")]
    [MaxLength(500)]
    public string? ObservacionesPCM { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("fec_registro")]
    public DateTime FecRegistro { get; set; } = DateTime.UtcNow;

    [Column("usuario_registra")]
    public Guid UsuarioRegistra { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    // Campos específicos de Datos Abiertos (PNDA) - Nombres alineados con handlers
    [Column("url_pnda")]
    [MaxLength(200)]
    public string? UrlDatosAbiertos { get; set; }

    [Column("total_datasets_publicados")]
    public long? TotalDatasets { get; set; }

    [Column("fecha_ultima_actualizacion_pnda")]
    public DateTime? FechaUltimaActualizacionDa { get; set; }

    [Column("responsable_pnda")]
    [MaxLength(100)]
    public string? ResponsableDa { get; set; }

    [Column("cargo_responsable_pnda")]
    [MaxLength(100)]
    public string? CargoResponsableDa { get; set; }

    [Column("correo_responsable_pnda")]
    [MaxLength(100)]
    public string? CorreoResponsableDa { get; set; }

    [Column("telefono_responsable_pnda")]
    [MaxLength(30)]
    public string? TelefonoResponsableDa { get; set; }

    [Column("norma_aprobacion_pnda")]
    [MaxLength(100)]
    public string? NumeroNormaResolucionDa { get; set; }

    [Column("fecha_aprobacion_pnda")]
    public DateTime? FechaAprobacionDa { get; set; }

    [Column("observacion_pnda")]
    [MaxLength(255)]
    public string? ObservacionDa { get; set; }

    [Column("ruta_pdf_pnda")]
    [MaxLength(255)]
    public string? RutaPdfDa { get; set; }

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    [NotMapped]
    [JsonIgnore]
    public DateTime? UpdatedAt { get; set; }
}
