using MediatR;
using PCM.Application.Common;

namespace PCM.Application.Features.Com10DatosAbiertos.Queries.GetAllCom10DatosAbiertos;

public class GetAllCom10DatosAbiertosQuery : IRequest<Result<List<Com10DatosAbiertosDto>>>
{
}
