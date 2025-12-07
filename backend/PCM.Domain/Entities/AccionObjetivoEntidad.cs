namespace PCM.Domain.Entities;

/// <summary>
/// Acciones para Objetivos de Entidad
/// Tabla: acciones_objetivos_entidades
/// </summary>
public class AccionObjetivoEntidad
{
    public long AccObjEntId { get; set; }
    public long ObjEntId { get; set; }
    public string? NumeracionAcc { get; set; } // Ej: "OE-01.01", "OGD-01.01"
    public string? DescripcionAccion { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navegación
    public virtual ObjetivoEntidad? ObjetivoEntidad { get; set; }
}
