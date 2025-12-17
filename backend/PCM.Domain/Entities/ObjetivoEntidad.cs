namespace PCM.Domain.Entities;

/// <summary>
/// Objetivos de Entidad (Estratégicos y de Gobierno Digital)
/// Tabla: objetivos_entidades
/// tipo_obj: 'E' = Estratégico, 'G' = Gobierno Digital
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class ObjetivoEntidad
{
    public long ObjEntId { get; set; }
    public long ComEntidadId { get; set; }
    public string TipoObj { get; set; } = "E"; // 'E' = Estratégico, 'G' = Gobierno Digital
    public string NumeracionObj { get; set; } = string.Empty; // Ej: "OE-01", "OGD-01"
    public string DescripcionObjetivo { get; set; } = string.Empty;
    // NO tiene Activo ni CreatedAt en la BD
}
