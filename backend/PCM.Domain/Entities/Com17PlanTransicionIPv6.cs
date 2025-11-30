using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 17: Plan de Transición a IPv6
/// Tabla Supabase: com17_ptipv6
/// </summary>
[Table("com17_ptipv6")]
public class Com17PlanTransicionIPv6
{
    [Key]
    [Column("comptipv6_ent_id")]
    public long Comptipv6EntId { get; set; }

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

    // Campos específicos del Plan de Transición a IPv6
    [Column("responsable_ipv6")]
    [MaxLength(100)]
    public string ResponsableIpv6 { get; set; } = "";

    [Column("cargo_responsable_ipv6")]
    [MaxLength(100)]
    public string CargoResponsableIpv6 { get; set; } = "";

    [Column("correo_ipv6")]
    [MaxLength(100)]
    public string CorreoIpv6 { get; set; } = "";

    [Column("telefono_ipv6")]
    [MaxLength(30)]
    public string TelefonoIpv6 { get; set; } = "";

    [Column("estado_plan_ipv6")]
    [MaxLength(50)]
    public string EstadoPlanIpv6 { get; set; } = "";

    [Column("fecha_formulacion_ipv6")]
    public DateTime? FechaFormulacionIpv6 { get; set; }

    [Column("fecha_aprobacion_ipv6")]
    public DateTime? FechaAprobacionIpv6 { get; set; }

    [Column("fecha_inicio_ipv6")]
    public DateTime? FechaInicioIpv6 { get; set; }

    [Column("fecha_fin_ipv6")]
    public DateTime? FechaFinIpv6 { get; set; }

    [Column("descripcion_plan_ipv6")]
    [MaxLength(255)]
    public string DescripcionPlanIpv6 { get; set; } = "";

    [Column("ruta_pdf_plan_ipv6")]
    [MaxLength(255)]
    public string RutaPdfPlanIpv6 { get; set; } = "";

    [Column("observacion_ipv6")]
    [MaxLength(255)]
    public string ObservacionIpv6 { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }

    // Propiedades de compatibilidad para handlers existentes
    [NotMapped]
    public DateTime? FechaInicioTransicion { get => FechaInicioIpv6; set => FechaInicioIpv6 = value; }
    
    [NotMapped]
    public DateTime? FechaFinTransicion { get => FechaFinIpv6; set => FechaFinIpv6 = value; }
    
    [NotMapped]
    public decimal? PorcentajeAvance { get; set; }
    
    [NotMapped]
    public int? SistemasMigrados { get; set; }
    
    [NotMapped]
    public int? SistemasTotal { get; set; }
    
    [NotMapped]
    public string? ArchivoPlan { get => RutaPdfPlanIpv6; set => RutaPdfPlanIpv6 = value ?? ""; }
    
    [NotMapped]
    public string? Descripcion { get => ObservacionIpv6; set => ObservacionIpv6 = value ?? ""; }
}
