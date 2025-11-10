using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;

namespace PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetCompromisoById;

public class GetCompromisoByIdQuery : IRequest<Result<CompromisoResponseDto>>
{
    public int CompromisoId { get; set; }
}
