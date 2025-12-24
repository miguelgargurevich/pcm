using MediatR;
using PCM.Application.Common;
using System;
using System.Collections.Generic;

namespace PCM.Application.Features.CedaIndicadores.Commands.SaveCedaEvaluacion
{
    /// <summary>
    /// Command para guardar/actualizar evaluación de un indicador CEDA
    /// </summary>
    public class SaveCedaEvaluacionCommand : IRequest<Result<SaveCedaEvaluacionResponse>>
    {
        public long? EvalCabId { get; set; } // Null para crear, con valor para actualizar
        public long CompndaEntId { get; set; } // ID del registro com10_pnda
        public long IndicadorId { get; set; }
        public string? EstadoIndicador { get; set; } // Cumple, Parcial, No cumple, No aplica
        public string? UrlEvidencia { get; set; }
        public string? NumeroResolucion { get; set; }
        public DateTime? FechaResolucion { get; set; }
        public List<CedaCriterioCheckDto> Criterios { get; set; } = new();
    }

    public class CedaCriterioCheckDto
    {
        public long CriterioId { get; set; }
        public bool CumpleCriterio { get; set; }
    }

    public class SaveCedaEvaluacionResponse
    {
        public long EvalCabId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
