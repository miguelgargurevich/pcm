using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

/// <summary>
/// Compromiso 20: Digitalización de Servicios mediante Facilita Perú
/// Tabla Supabase: com20_dsfpe
/// </summary>
[Table("com20_dsfpe")]
public class Com20DigitalizacionServiciosFacilita
{
    [Key]
    [Column("comdsfpe_ent_id")]
    public long ComdsfpeEntId { get; set; }

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

    // Campos específicos de Digitalización de Servicios Facilita Perú
    [Column("responsable_facilita")]
    [MaxLength(100)]
    public string ResponsableFacilita { get; set; } = "";

    [Column("cargo_responsable_facilita")]
    [MaxLength(100)]
    public string CargoResponsableFacilita { get; set; } = "";

    [Column("correo_facilita")]
    [MaxLength(100)]
    public string CorreoFacilita { get; set; } = "";

    [Column("telefono_facilita")]
    [MaxLength(30)]
    public string TelefonoFacilita { get; set; } = "";

    [Column("estado_implementacion_facilita")]
    [MaxLength(50)]
    public string EstadoImplementacionFacilita { get; set; } = "";

    [Column("fecha_inicio_facilita")]
    public DateTime? FechaInicioFacilita { get; set; }

    [Column("fecha_ultimo_avance_facilita")]
    public DateTime? FechaUltimoAvanceFacilita { get; set; }

    [Column("total_servicios_digitalizados")]
    public long TotalServiciosDigitalizados { get; set; }

    [Column("ruta_pdf_facilita")]
    [MaxLength(255)]
    public string RutaPdfFacilita { get; set; } = "";

    [Column("observacion_facilita")]
    [MaxLength(255)]
    public string ObservacionFacilita { get; set; } = "";

    [Column("rutaPDF_normativa")]
    [MaxLength(500)]
    public string? RutaPdfNormativa { get; set; }
}
