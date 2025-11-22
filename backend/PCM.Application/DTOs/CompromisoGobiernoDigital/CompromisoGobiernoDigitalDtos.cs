using System;
using System.Collections.Generic;

namespace PCM.Application.DTOs.CompromisoGobiernoDigital;

// Request DTOs
public class CreateCompromisoRequest
{
    public string NombreCompromiso { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public List<string> Alcances { get; set; } = new();
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Activo { get; set; } = true;
    public List<CompromisoNormativaDto> Normativas { get; set; } = new();
    public List<CriterioEvaluacionDto> CriteriosEvaluacion { get; set; } = new();
}

public class UpdateCompromisoRequest
{
    public int CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public List<string> Alcances { get; set; } = new();
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Activo { get; set; } = true;
    public List<CompromisoNormativaDto> Normativas { get; set; } = new();
    public List<CriterioEvaluacionDto> CriteriosEvaluacion { get; set; } = new();
}

// Response DTOs
public class CompromisoResponseDto
{
    public int CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public List<string> Alcances { get; set; } = new();
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public int Estado { get; set; } // FK a estado_compromiso
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<CompromisoNormativaResponseDto> Normativas { get; set; } = new();
    public List<CriterioEvaluacionResponseDto> CriteriosEvaluacion { get; set; } = new();
}

public class CompromisoNormativaDto
{
    public int NormaId { get; set; }
}

public class CompromisoNormativaResponseDto
{
    public int CompromisoNormativaId { get; set; }
    public int CompromisoId { get; set; }
    public int NormaId { get; set; }
    public string? NombreNorma { get; set; }
    public string? Numero { get; set; }
    public int? TipoNormaId { get; set; }
    public string? TipoNorma { get; set; }
    public string? NivelGobierno { get; set; }
    public string? Sector { get; set; }
    public DateTime? FechaPublicacion { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CriterioEvaluacionDto
{
    public int? CriterioEvaluacionId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int Estado { get; set; } = 1; // FK a estado_compromiso (1=pendiente)
}

public class CriterioEvaluacionResponseDto
{
    public int CriterioEvaluacionId { get; set; }
    public int CompromisoId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int Estado { get; set; } // FK a estado_compromiso
    public bool Activo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
