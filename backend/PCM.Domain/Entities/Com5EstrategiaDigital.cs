namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para el Compromiso 5: Estrategia Digital
/// Tabla: com5_estrategia_digital
/// </summary>
public class Com5EstrategiaDigital
{
    /// <summary>
    /// ID único del registro (PK)
    /// </summary>
    public int ComedEntId { get; set; }

    /// <summary>
    /// ID del compromiso (siempre 5 para este caso)
    /// </summary>
    public int CompromisoId { get; set; }

    /// <summary>
    /// ID de la entidad pública (UUID)
    /// </summary>
    public Guid EntidadId { get; set; }

    /// <summary>
    /// Nombre de la estrategia digital
    /// </summary>
    public string? NombreEstrategia { get; set; }

    /// <summary>
    /// Año de inicio de la estrategia
    /// </summary>
    public int? AnioInicio { get; set; }

    /// <summary>
    /// Año de fin de la estrategia
    /// </summary>
    public int? AnioFin { get; set; }

    /// <summary>
    /// Fecha de aprobación de la estrategia
    /// </summary>
    public DateTime? FechaAprobacion { get; set; }

    /// <summary>
    /// Objetivos estratégicos de la estrategia digital
    /// </summary>
    public string? ObjetivosEstrategicos { get; set; }

    /// <summary>
    /// Líneas de acción de la estrategia
    /// </summary>
    public string? LineasAccion { get; set; }

    /// <summary>
    /// Indica si está alineado con el Plan de Gobierno Digital
    /// </summary>
    public bool AlineadoPgd { get; set; }

    /// <summary>
    /// Estado de implementación de la estrategia
    /// </summary>
    public string? EstadoImplementacion { get; set; }

    /// <summary>
    /// URL del documento de la estrategia digital
    /// </summary>
    public string? UrlDoc { get; set; }

    /// <summary>
    /// Criterios evaluados en formato JSON
    /// </summary>
    public string? CriteriosEvaluados { get; set; }

    /// <summary>
    /// Check de aceptación de política de privacidad
    /// </summary>
    public bool CheckPrivacidad { get; set; }

    /// <summary>
    /// Check de declaración jurada
    /// </summary>
    public bool CheckDdjj { get; set; }

    /// <summary>
    /// ID del usuario que registra (UUID)
    /// </summary>
    public Guid UsuarioRegistra { get; set; }

    /// <summary>
    /// Estado del registro: bandeja, sin_reportar, publicado
    /// </summary>
    public string Estado { get; set; } = "bandeja";

    /// <summary>
    /// Etapa del formulario: 1, 2, 3
    /// </summary>
    public int EtapaFormulario { get; set; }

    /// <summary>
    /// Fecha de creación del registro
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Fecha de última actualización
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
