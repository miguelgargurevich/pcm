using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Dashboard;

namespace PCM.Application.Features.Dashboard.Queries.GetEntidadesStats;

public record GetEntidadesStatsQuery : IRequest<Result<EntidadesStatsDto>>;
