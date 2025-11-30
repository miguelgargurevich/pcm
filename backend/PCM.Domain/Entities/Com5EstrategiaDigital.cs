using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 5: Estrategia Digital
/// Tabla Supabase: com5_destrategiad
/// </summary>
[Table("com5_destrategiad")]
public class Com5EstrategiaDigital
{
    [Key]
    [Column("comded_ent_id")]
    public long ComdedEntId { get; set; }

    [Column("compromiso_id")]
    public long CompromisoId { get; set; }

    [Column("entidad_id")]
    public Guid EntidadId { get; set; }

    [Column("etapa_formulario")]
    [StringLength(20)]
    public string EtapaFormulario { get; set; } = string.Empty;

    [Column("estado")]
    [StringLength(15)]
    public string Estado { get; set; } = string.Empty;

    [Column("check_privacidad")]
    public bool CheckPrivacidad { get; set; }

    [Column("check_ddjj")]
    public bool CheckDdjj { get; set; }

    [Column("estado_pcm")]
    [StringLength(50)]
    public string? EstadoPCM { get; set; }

    [Column("observaciones_pcm")]
    [StringLength(500)]
    public string? ObservacionesPCM { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("fec_registro")]
    public DateTime FecRegistro { get; set; }

    [Column("usuario_registra")]
    public Guid UsuarioRegistra { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [Column("nombre_estrategia")]
    [StringLength(150)]
    public string? NombreEstrategia { get; set; }

    [Column("periodo_inicio_estrategia")]
    public long? PeriodoInicioEstrategia { get; set; }

    [Column("periodo_fin_estrategia")]
    public long? PeriodoFinEstrategia { get; set; }

    [Column("objetivos_estrategicos")]
    [StringLength(2000)]
    public string? ObjetivosEstrategicos { get; set; }

    [Column("lineas_accion")]
    [StringLength(2000)]
    public string? LineasAccion { get; set; }

    [Column("fecha_aprobacion_estrategia")]
    public DateTime? FechaAprobacionEstrategia { get; set; }

    [Column("alineado_pgd_estrategia")]
    public bool AlineadoPgdEstrategia { get; set; }

    [Column("estado_implementacion_estrategia")]
    [StringLength(50)]
    public string? EstadoImplementacionEstrategia { get; set; }

    [Column("ruta_pdf_estrategia")]
    [StringLength(255)]
    public string? RutaPdfEstrategia { get; set; }

    [Column("rutaPDF_normativa")]
    [StringLength(500)]
    public string? RutaPdfNormativa { get; set; }
}
