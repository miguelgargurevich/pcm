using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class CompromisoGobiernoDigital
{
    public int CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Alcances { get; set; } = string.Empty; // Almacenado como JSON o CSV
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public int IdEstado { get; set; } = 1; // FK a estado_compromiso (1=pendiente por defecto)
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Relaciones
    public ICollection<CompromisoNormativa> Normativas { get; set; } = new List<CompromisoNormativa>();
    public ICollection<CriterioEvaluacion> CriteriosEvaluacion { get; set; } = new List<CriterioEvaluacion>();
    public ICollection<AlcanceCompromiso> AlcancesCompromisos { get; set; } = new List<AlcanceCompromiso>();
}
