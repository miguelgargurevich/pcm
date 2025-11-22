using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;

namespace PCM.Application.Features.Usuarios.Commands.UpdateUsuario;

public record UpdateUsuarioCommand : IRequest<Result<UsuarioDetailDto>>
{
    public required Guid UserId { get; init; }
    public required string Email { get; init; }
    public required string NumDni { get; init; }
    public required string Nombres { get; init; }
    public required string ApePaterno { get; init; }
    public required string ApeMaterno { get; init; }
    public string? Direccion { get; init; }
    public required Guid? EntidadId { get; init; }
    public required int PerfilId { get; init; }
    public bool Activo { get; init; } = true;
}
