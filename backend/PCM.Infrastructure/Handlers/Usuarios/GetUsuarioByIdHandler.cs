using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;
using PCM.Application.Features.Usuarios.Queries.GetUsuarioById;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Usuarios;

public class GetUsuarioByIdHandler : IRequestHandler<GetUsuarioByIdQuery, Result<UsuarioDetailDto>>
{
    private readonly PCMDbContext _context;

    public GetUsuarioByIdHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<UsuarioDetailDto>> Handle(GetUsuarioByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Entidad)
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

            if (usuario == null)
            {
                return Result<UsuarioDetailDto>.Failure("Usuario no encontrado");
            }

            var usuarioDto = new UsuarioDetailDto
            {
                UserId = usuario.UserId,
                Email = usuario.Email,
                NumDni = usuario.NumDni,
                Nombres = usuario.Nombres,
                ApePaterno = usuario.ApePaterno,
                ApeMaterno = usuario.ApeMaterno,
                NombreCompleto = $"{usuario.Nombres} {usuario.ApePaterno} {usuario.ApeMaterno}",
                Direccion = usuario.Direccion,
                EntidadId = usuario.EntidadId,
                NombreEntidad = usuario.Entidad?.Nombre ?? "",
                RucEntidad = usuario.Entidad?.Ruc ?? "",
                PerfilId = usuario.PerfilId,
                NombrePerfil = usuario.Perfil?.Nombre ?? "",
                Activo = usuario.Activo,
                LastLogin = usuario.LastLogin,
                CreatedAt = usuario.CreatedAt,
                UpdatedAt = usuario.UpdatedAt
            };

            return Result<UsuarioDetailDto>.Success(usuarioDto);
        }
        catch (Exception ex)
        {
            return Result<UsuarioDetailDto>.Failure(
                "Error al obtener usuario",
                new List<string> { ex.Message }
            );
        }
    }
}
