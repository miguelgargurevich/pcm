using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;
using PCM.Application.Features.Usuarios.Commands.CreateUsuario;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Usuarios;

public class CreateUsuarioHandler : IRequestHandler<CreateUsuarioCommand, Result<UsuarioDetailDto>>
{
    private readonly PCMDbContext _context;

    public CreateUsuarioHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<UsuarioDetailDto>> Handle(CreateUsuarioCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validar email único
            var existeEmail = await _context.Usuarios
                .AnyAsync(u => u.Email == request.Email, cancellationToken);

            if (existeEmail)
            {
                return Result<UsuarioDetailDto>.Failure("El email ya está registrado");
            }

            // Validar DNI único
            var existeDni = await _context.Usuarios
                .AnyAsync(u => u.NumDni == request.NumDni, cancellationToken);

            if (existeDni)
            {
                return Result<UsuarioDetailDto>.Failure("El DNI ya está registrado");
            }

            // Validar que la entidad existe
            var entidad = await _context.Entidades
                .FirstOrDefaultAsync(e => e.EntidadId == request.EntidadId, cancellationToken);

            if (entidad == null)
            {
                return Result<UsuarioDetailDto>.Failure("La entidad especificada no existe");
            }

            // Validar que el perfil existe
            var perfil = await _context.Perfiles
                .FirstOrDefaultAsync(p => p.PerfilId == request.PerfilId, cancellationToken);

            if (perfil == null)
            {
                return Result<UsuarioDetailDto>.Failure("El perfil especificado no existe");
            }

            // Hash de contraseña
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Crear usuario
            var usuario = new Usuario
            {
                Email = request.Email,
                Password = passwordHash,
                NumDni = request.NumDni,
                Nombres = request.Nombres,
                ApePaterno = request.ApePaterno,
                ApeMaterno = request.ApeMaterno,
                Direccion = request.Direccion,
                EntidadId = request.EntidadId,
                PerfilId = request.PerfilId,
                Activo = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync(cancellationToken);

            // Recargar con navegación
            await _context.Entry(usuario)
                .Reference(u => u.Entidad)
                .LoadAsync(cancellationToken);

            await _context.Entry(usuario)
                .Reference(u => u.Perfil)
                .LoadAsync(cancellationToken);

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

            return Result<UsuarioDetailDto>.Success(usuarioDto, "Usuario creado exitosamente");
        }
        catch (Exception ex)
        {
            return Result<UsuarioDetailDto>.Failure(
                "Error al crear usuario",
                new List<string> { ex.Message }
            );
        }
    }
}
