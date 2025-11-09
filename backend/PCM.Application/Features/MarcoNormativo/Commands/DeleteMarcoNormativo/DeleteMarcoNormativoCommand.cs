using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.MarcoNormativo.Commands.DeleteMarcoNormativo;

public class DeleteMarcoNormativoCommand : IRequest<Result<bool>>
{
    public int NormaId { get; set; }

    public DeleteMarcoNormativoCommand(int normaId)
    {
        NormaId = normaId;
    }
}
