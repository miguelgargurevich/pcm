using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;

namespace PCM.Application.Features.CumplimientoNormativo.Queries.GetAllCumplimientos;

public class GetAllCumplimientosQuery : IRequest<Result<List<CumplimientoListItemDto>>>
{
    public int? CompromisoId { get; set; } // Filtro por compromiso
    public int? Estado { get; set; } // Filtro por estado
    public Guid? EntidadId { get; set; } // Filtro por entidad
}
