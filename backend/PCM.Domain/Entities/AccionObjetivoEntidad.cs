namespace PCM.Domain.Entities;

/// <summary>
/// Acciones para Objetivos de Entidad
/// Tabla: acciones_objetivos_entidades
/// NOTA: Esta tabla NO tiene columnas activo ni created_at en la BD
/// </summary>
public class AccionObjetivoEntidad
{
    public long AccObjEntId { get; set; }
    public long ObjEntId { get; set; }
    public string NumeracionAcc { get; set; } = string.Empty; // Ej: "OE-01.01", "OGD-01.01"
    public string DescripcionAccion { get; set; } = string.Empty;
    // NO tiene Activo ni CreatedAt en la BD
    
    // Navegación
    public virtual ObjetivoEntidad? ObjetivoEntidad { get; set; }
}
