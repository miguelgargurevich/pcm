using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;

namespace PCM.Application.Features.Entidades.Commands.UpdateEntidad;

public record UpdateEntidadCommand : IRequest<Result<EntidadDetailDto>>
{
    public required Guid EntidadId { get; init; }
    public required string Ruc { get; init; }
    public required string Nombre { get; init; }
    public required string Direccion { get; init; }
    public required Guid UbigeoId { get; init; }
    public required string Telefono { get; init; }
    public required string Email { get; init; }
    public string? Web { get; init; }
    public required int NivelGobiernoId { get; init; }
    public required int SectorId { get; init; }
    public required int ClasificacionId { get; init; }
    public required string NombreAlcalde { get; init; }
    public required string ApePatAlcalde { get; init; }
    public required string ApeMatAlcalde { get; init; }
    public required string EmailAlcalde { get; init; }
}
