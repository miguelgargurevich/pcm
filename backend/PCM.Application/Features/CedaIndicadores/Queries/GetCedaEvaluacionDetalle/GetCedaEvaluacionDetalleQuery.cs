using MediatR;
using PCM.Application.Common;
using System;
using System.Collections.Generic;

namespace PCM.Application.Features.CedaIndicadores.Queries.GetCedaEvaluacionDetalle
{
    /// <summary>
    /// Query para obtener detalle de evaluación de un indicador CEDA
    /// </summary>
    public class GetCedaEvaluacionDetalleQuery : IRequest<Result<CedaEvaluacionDetalleResponse>>
    {
        public long CompndaEntId { get; set; } // ID del registro com10_pnda
        public long IndicadorId { get; set; }
    }

    public class CedaEvaluacionDetalleResponse
    {
        public long? EvalCabId { get; set; }
        public long IndicadorId { get; set; }
        public string NombreIndicador { get; set; } = string.Empty;
        public string? DescripcionIndicador { get; set; }
        public string? EstadoIndicador { get; set; }
        public string? UrlEvidencia { get; set; }
        public string? NumeroResolucion { get; set; }
        public DateTime? FechaResolucion { get; set; }
        public List<CedaCriterioResponse> Criterios { get; set; } = new();
    }

    public class CedaCriterioResponse
    {
        public long CriterioId { get; set; }
        public string DescripcionCriterio { get; set; } = string.Empty;
        public int? OrdenVisual { get; set; }
        public bool CumpleCriterio { get; set; }
    }
}
