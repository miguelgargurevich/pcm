using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;

namespace PCM.Application.Features.Usuarios.Commands.CreateUsuario;

public record CreateUsuarioCommand : IRequest<Result<UsuarioDetailDto>>
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string NumDni { get; init; }
    public required string Nombres { get; init; }
    public required string ApePaterno { get; init; }
    public required string ApeMaterno { get; init; }
    public string? Direccion { get; init; }
    public required Guid? EntidadId { get; init; }
    public required int PerfilId { get; init; }
}
