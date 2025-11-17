using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;

namespace PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetAllCompromisos;

public class GetAllCompromisosQuery : IRequest<Result<List<CompromisoResponseDto>>>
{
    public string? Nombre { get; set; }
    public string? Alcance { get; set; }
    public int? Estado { get; set; } // FK a estado_compromiso
}
