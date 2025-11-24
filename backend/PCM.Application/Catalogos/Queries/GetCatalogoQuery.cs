using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Catalogos.Queries;

public class GetCatalogoQuery : IRequest<Result<List<CatalogoItemResponse>>>
{
    public string NombreTabla { get; set; } = string.Empty;
}

public class CatalogoItemResponse
{
    public string Id { get; set; } = string.Empty;
    public string ColumnaId { get; set; } = string.Empty; // Alias de Id para compatibilidad con frontend
    public string Valor { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public short Orden { get; set; }
}
