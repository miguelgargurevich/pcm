using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities
{
    [Table("com10_da")]
    public class Com10DatosAbiertos
    {
        [Key]
        [Column("comda_ent_id")]
        public int ComdaEntId { get; set; }

        [Column("compromiso_id")]
        public int CompromisoId { get; set; }

        [Column("entidad_id")]
        public int EntidadId { get; set; }

        [Column("url_datos_abiertos")]
        [StringLength(500)]
        public string? UrlDatosAbiertos { get; set; }

        [Column("total_datasets")]
        public int? TotalDatasets { get; set; }

        [Column("fecha_ultima_actualizacion_da")]
        public DateTime? FechaUltimaActualizacionDa { get; set; }

        [Column("responsable_da")]
        [StringLength(200)]
        public string? ResponsableDa { get; set; }

        [Column("cargo_responsable_da")]
        [StringLength(200)]
        public string? CargoResponsableDa { get; set; }

        [Column("correo_responsable_da")]
        [StringLength(100)]
        public string? CorreoResponsableDa { get; set; }

        [Column("telefono_responsable_da")]
        [StringLength(20)]
        public string? TelefonoResponsableDa { get; set; }

        [Column("numero_norma_resolucion_da")]
        [StringLength(100)]
        public string? NumeroNormaResolucionDa { get; set; }

        [Column("fecha_aprobacion_da")]
        public DateTime? FechaAprobacionDa { get; set; }

        [Column("observacion_da")]
        [StringLength(1000)]
        public string? ObservacionDa { get; set; }

        [Column("ruta_pdf_da")]
        [StringLength(500)]
        public string? RutaPdfDa { get; set; }

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
