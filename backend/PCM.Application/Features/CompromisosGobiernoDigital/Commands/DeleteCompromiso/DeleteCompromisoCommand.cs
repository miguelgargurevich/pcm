using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.CompromisosGobiernoDigital.Commands.DeleteCompromiso;

public class DeleteCompromisoCommand : IRequest<Result<bool>>
{
    public int CompromisoId { get; set; }
}
