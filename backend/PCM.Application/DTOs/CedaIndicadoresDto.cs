using System;
using System.Collections.Generic;

namespace PCM.Application.DTOs
{
    /// <summary>
    /// DTO para Indicador CEDA con su evaluación
    /// </summary>
    public class CedaIndicadorDto
    {
        public long IndicadorId { get; set; }
        public int NumeroOrden { get; set; }
        public string NombreIndicador { get; set; } = string.Empty;
        public string? DescripcionIndicador { get; set; }
        public string? EstadoIndicador { get; set; }
        public long? EvalCabId { get; set; } // ID de evaluación si existe
    }

    /// <summary>
    /// DTO para Criterio de un Indicador
    /// </summary>
    public class CedaCriterioDto
    {
        public long CriterioId { get; set; }
        public string DescripcionCriterio { get; set; } = string.Empty;
        public int? OrdenVisual { get; set; }
        public bool CumpleCriterio { get; set; }
    }

    /// <summary>
    /// DTO para Detalle de Evaluación CEDA (respuesta completa)
    /// </summary>
    public class CedaEvaluacionDetalleDto
    {
        public long? EvalCabId { get; set; }
        public long IndicadorId { get; set; }
        public string NombreIndicador { get; set; } = string.Empty;
        public string? DescripcionIndicador { get; set; }
        public string? EstadoIndicador { get; set; }
        public string? UrlEvidencia { get; set; }
        public string? NumeroResolucion { get; set; }
        public DateTime? FechaResolucion { get; set; }
        public List<CedaCriterioDto> Criterios { get; set; } = new();
    }
}
