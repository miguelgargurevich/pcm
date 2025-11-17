using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Dashboard;

namespace PCM.Application.Features.Dashboard.Queries.GetDashboardStats;

public record GetDashboardStatsQuery : IRequest<Result<DashboardStatsDto>>;
