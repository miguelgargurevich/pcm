using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace PCM.Application.DTOs.EvaluacionCriterios;

// ============================================
// REQUEST DTOs
// ============================================

/// <summary>
/// Request para guardar/actualizar criterios evaluados de una entidad para un compromiso
/// </summary>
public class SaveCriteriosRequest
{
    [JsonPropertyName("entidadId")]
    public Guid EntidadId { get; set; }

    [JsonPropertyName("compromisoId")]
    public long CompromisoId { get; set; }

    /// <summary>
    /// Lista de criterios con su estado de cumplimiento
    /// </summary>
    [JsonPropertyName("criterios")]
    public List<CriterioEvaluadoDto> Criterios { get; set; } = new();
}

/// <summary>
/// DTO para un criterio evaluado individual
/// </summary>
public class CriterioEvaluadoDto
{
    [JsonPropertyName("criterioId")]
    public int CriterioId { get; set; }

    [JsonPropertyName("cumple")]
    public bool Cumple { get; set; }
}

// ============================================
// RESPONSE DTOs
// ============================================

/// <summary>
/// Response con los criterios evaluados de una entidad para un compromiso
/// </summary>
public class CriteriosEvaluadosResponse
{
    public Guid EntidadId { get; set; }
    public long CompromisoId { get; set; }
    public List<CriterioConRespuestaDto> Criterios { get; set; } = new();
    public DateTime? LastUpdated { get; set; }
}

/// <summary>
/// DTO que combina el criterio del catálogo con la respuesta de la entidad
/// </summary>
public class CriterioConRespuestaDto
{
    public int CriterioEvaluacionId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public bool Cumple { get; set; }
    public int? RespuestaId { get; set; } // null si no ha sido evaluado aún
}

/// <summary>
/// Response simple para operaciones de guardado
/// </summary>
public class SaveCriteriosResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int TotalCriteriosGuardados { get; set; }
    public DateTime UpdatedAt { get; set; }
}
