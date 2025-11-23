using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities
{
    [Table("com9_mgd")]
    public class Com9ModeloGestionDocumental
    {
        [Key]
        [Column("commgd_ent_id")]
        public int CommgdEntId { get; set; }

        [Column("compromiso_id")]
        public int CompromisoId { get; set; }

        [Column("entidad_id")]
        public int EntidadId { get; set; }

        [Column("fecha_aprobacion_mgd")]
        public DateTime? FechaAprobacionMgd { get; set; }

        [Column("numero_resolucion_mgd")]
        [StringLength(100)]
        public string? NumeroResolucionMgd { get; set; }

        [Column("responsable_mgd")]
        [StringLength(200)]
        public string? ResponsableMgd { get; set; }

        [Column("cargo_responsable_mgd")]
        [StringLength(200)]
        public string? CargoResponsableMgd { get; set; }

        [Column("correo_responsable_mgd")]
        [StringLength(100)]
        public string? CorreoResponsableMgd { get; set; }

        [Column("telefono_responsable_mgd")]
        [StringLength(20)]
        public string? TelefonoResponsableMgd { get; set; }

        [Column("sistema_plataforma_mgd")]
        [StringLength(200)]
        public string? SistemaPlataformaMgd { get; set; }

        [Column("tipo_implantacion_mgd")]
        [StringLength(50)]
        public string? TipoImplantacionMgd { get; set; }

        [Column("interopera_sistemas_mgd")]
        public bool? InteroperaSistemasMgd { get; set; }

        [Column("observacion_mgd")]
        [StringLength(1000)]
        public string? ObservacionMgd { get; set; }

        [Column("ruta_pdf_mgd")]
        [StringLength(500)]
        public string? RutaPdfMgd { get; set; }

        [Column("criterios_evaluados")]
        public string? CriteriosEvaluados { get; set; }

        [Column("check_privacidad")]
        public bool? CheckPrivacidad { get; set; }

        [Column("check_ddjj")]
        public bool? CheckDdjj { get; set; }

        [Column("usuario_registra")]
        public int? UsuarioRegistra { get; set; }

        [Column("etapa_formulario")]
        [StringLength(20)]
        public string? EtapaFormulario { get; set; }

        [Column("estado")]
        [StringLength(20)]
        public string? Estado { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
