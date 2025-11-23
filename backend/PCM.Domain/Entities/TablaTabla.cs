using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCM.Domain.Entities;

[Table("tabla_tablas")]
public class TablaTabla
{
    [Key]
    [Column("tabla_id")]
    public int TablaId { get; set; }

    [Required]
    [Column("nombre_tabla")]
    [StringLength(50)]
    public string NombreTabla { get; set; } = string.Empty;

    [Required]
    [Column("columna_id")]
    [StringLength(20)]
    public string ColumnaId { get; set; } = string.Empty;

    [Required]
    [Column("descripcion")]
    [StringLength(200)]
    public string Descripcion { get; set; } = string.Empty;

    [Required]
    [Column("valor")]
    [StringLength(200)]
    public string Valor { get; set; } = string.Empty;

    [Column("orden")]
    public short Orden { get; set; } = 0;

    [Required]
    [Column("activo")]
    public bool Activo { get; set; } = true;
}
