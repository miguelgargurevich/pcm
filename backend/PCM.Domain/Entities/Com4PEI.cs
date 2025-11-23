using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities
{
    /// <summary>
    /// Compromiso 4: Incorporar TD en el PEI
    /// Tabla Supabase: com4_tdpei
    /// </summary>
    [Table("com4_tdpei")]
    public class Com4PEI
    {
        [Key]
        [Column("comtdpei_ent_id")]
        public long ComtdpeiEntId { get; set; }

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

        [Column("estado_PCM")]
        [MaxLength(50)]
        public string? EstadoPCM { get; set; }

        [Column("observaciones_PCM")]
        [MaxLength(500)]
        public string? ObservacionesPCM { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("fec_registro")]
        public DateTime FecRegistro { get; set; }

        [Column("usuario_registra")]
        public Guid UsuarioRegistra { get; set; }

        [Column("activo")]
        public bool Activo { get; set; }

        [Column("anio_inicio_pei")]
        public long? AnioInicioPei { get; set; }

        [Column("anio_fin_pei")]
        public long? AnioFinPei { get; set; }

        [Column("objetivo_pei")]
        [StringLength(1000)]
        public string? ObjetivoPei { get; set; }

        [Column("descripcion_pei")]
        [StringLength(2000)]
        public string? DescripcionPei { get; set; }

        [Column("alineado_pgd")]
        public bool AlineadoPgd { get; set; }

        [Column("fecha_aprobacion_pei")]
        public DateTime? FechaAprobacionPei { get; set; }

        [Column("ruta_pdf_pei")]
        [StringLength(255)]
        public string? RutaPdfPei { get; set; }

        [Column("criterios_evaluados", TypeName = "jsonb")]
        public string? CriteriosEvaluados { get; set; }
    }
}
