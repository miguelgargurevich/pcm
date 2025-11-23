using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities
{
    [Table("com4_pei")]
    public class Com4PEI
    {
        [Key]
        [Column("compei_ent_id")]
        public int CompeiEntId { get; set; }

        [Column("compromiso_id")]
        public int CompromisoId { get; set; }

        [Column("entidad_id")]
        public Guid EntidadId { get; set; }

        [Column("etapa_formulario")]
        public int EtapaFormulario { get; set; }

        [Column("estado")]
        [StringLength(50)]
        public string? Estado { get; set; }

        [Column("anio_inicio")]
        public int AnioInicio { get; set; }

        [Column("anio_fin")]
        public int AnioFin { get; set; }

        [Column("fecha_aprobacion")]
        public DateTime FechaAprobacion { get; set; }

        [Column("objetivo_estrategico")]
        [StringLength(1000)]
        public string ObjetivoEstrategico { get; set; } = string.Empty;

        [Column("descripcion_incorporacion")]
        [StringLength(2000)]
        public string DescripcionIncorporacion { get; set; } = string.Empty;

        [Column("alineado_pgd")]
        public bool AlineadoPgd { get; set; }

        [Column("url_doc_pei")]
        [StringLength(500)]
        public string? UrlDocPei { get; set; }

        [Column("criterios_evaluados")]
        [StringLength(4000)]
        public string? CriteriosEvaluados { get; set; }

        [Column("check_privacidad")]
        public bool CheckPrivacidad { get; set; }

        [Column("check_ddjj")]
        public bool CheckDdjj { get; set; }

        [Column("usuario_registra")]
        public Guid UsuarioRegistra { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
