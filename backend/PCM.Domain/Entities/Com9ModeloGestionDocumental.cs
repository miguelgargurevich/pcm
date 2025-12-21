using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 9: Implementación del Modelo de Gestión Documental
/// Tabla Supabase: com9_imgd
/// </summary>
[Table("com9_imgd")]
public class Com9ModeloGestionDocumental
{
    [Key]
    [Column("comimgd_ent_id")]
    public long CommgdEntId { get; set; }

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

    // Campos específicos del Modelo de Gestión Documental
    [Column("fecha_aprobacion_mgd")]
    public DateTime? FechaAprobacionMgd { get; set; }

    [Column("numero_resolucion_mgd")]
    [MaxLength(50)]
    public string? NumeroResolucionMgd { get; set; }

    [Column("responsable_mgd")]
    [MaxLength(100)]
    public string? ResponsableMgd { get; set; }

    [Column("cargo_responsable_mgd")]
    [MaxLength(100)]
    public string? CargoResponsableMgd { get; set; }

    [Column("correo_responsable_mgd")]
    [MaxLength(100)]
    public string? CorreoResponsableMgd { get; set; }

    [Column("telefono_responsable_mgd")]
    [MaxLength(30)]
    public string? TelefonoResponsableMgd { get; set; }

    [Column("sistema_gestion_doc")]
    [MaxLength(100)]
    public string? SistemaPlataformaMgd { get; set; }

    [Column("tipo_implantacion_mgd")]
    [MaxLength(50)]
    public string? TipoImplantacionMgd { get; set; }

    [Column("interoperabilidad_mgd")]
    public bool InteroperaSistemasMgd { get; set; }

    [Column("observacion_mgd")]
    [MaxLength(255)]
    public string? ObservacionMgd { get; set; }

    [Column("ruta_pdf_mgd")]
    [MaxLength(255)]
    public string? RutaPdfMgd { get; set; }

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    [Column("criterios_evaluados")]
    public string? CriteriosEvaluados { get; set; }

    [NotMapped]
    public DateTime? UpdatedAt { get; set; }
}
