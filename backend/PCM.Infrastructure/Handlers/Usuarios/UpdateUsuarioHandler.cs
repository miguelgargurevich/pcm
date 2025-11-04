using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;
using PCM.Application.Features.Usuarios.Commands.UpdateUsuario;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Usuarios;

public class UpdateUsuarioHandler : IRequestHandler<UpdateUsuarioCommand, Result<UsuarioDetailDto>>
{
    private readonly PCMDbContext _context;

    public UpdateUsuarioHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<UsuarioDetailDto>> Handle(UpdateUsuarioCommand request, CancellationToken cancellationToken)
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

            // Validar email único (excepto el actual)
            var existeEmail = await _context.Usuarios
                .AnyAsync(u => u.Email == request.Email && u.UserId != request.UserId, cancellationToken);

            if (existeEmail)
            {
                return Result<UsuarioDetailDto>.Failure("El email ya está registrado");
            }

            // Validar DNI único (excepto el actual)
            var existeDni = await _context.Usuarios
                .AnyAsync(u => u.NumDni == request.NumDni && u.UserId != request.UserId, cancellationToken);

            if (existeDni)
            {
                return Result<UsuarioDetailDto>.Failure("El DNI ya está registrado");
            }

            // Validar entidad
            var entidadExiste = await _context.Entidades
                .AnyAsync(e => e.EntidadId == request.EntidadId, cancellationToken);

            if (!entidadExiste)
            {
                return Result<UsuarioDetailDto>.Failure("La entidad especificada no existe");
            }

            // Validar perfil
            var perfilExiste = await _context.Perfiles
                .AnyAsync(p => p.PerfilId == request.PerfilId, cancellationToken);

            if (!perfilExiste)
            {
                return Result<UsuarioDetailDto>.Failure("El perfil especificado no existe");
            }

            // Actualizar datos
            usuario.Email = request.Email;
            usuario.NumDni = request.NumDni;
            usuario.Nombres = request.Nombres;
            usuario.ApePaterno = request.ApePaterno;
            usuario.ApeMaterno = request.ApeMaterno;
            usuario.Direccion = request.Direccion;
            usuario.EntidadId = request.EntidadId;
            usuario.PerfilId = request.PerfilId;
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            // Recargar relaciones
            await _context.Entry(usuario).Reference(u => u.Entidad).LoadAsync(cancellationToken);
            await _context.Entry(usuario).Reference(u => u.Perfil).LoadAsync(cancellationToken);

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

            return Result<UsuarioDetailDto>.Success(usuarioDto, "Usuario actualizado exitosamente");
        }
        catch (Exception ex)
        {
            return Result<UsuarioDetailDto>.Failure(
                "Error al actualizar usuario",
                new List<string> { ex.Message }
            );
        }
    }
}
