using MediatR;
using PCM.Application.Common;
using System;
using System.Collections.Generic;

namespace PCM.Application.Features.CedaIndicadores.Queries.GetCedaIndicadoresList
{
    /// <summary>
    /// Query para obtener lista de indicadores CEDA con estado de evaluación
    /// </summary>
    public class GetCedaIndicadoresListQuery : IRequest<Result<List<CedaIndicadorResponse>>>
    {
        public long CompndaEntId { get; set; } // ID del registro com10_pnda
    }

    public class CedaIndicadorResponse
    {
        public long IndicadorId { get; set; }
        public int NumeroOrden { get; set; }
        public string NombreIndicador { get; set; } = string.Empty;
        public string? DescripcionIndicador { get; set; }
        public string? EstadoIndicador { get; set; } // Cumple, Parcial, No cumple, No aplica
        public long? EvalCabId { get; set; } // ID de evaluación si existe
    }
}
