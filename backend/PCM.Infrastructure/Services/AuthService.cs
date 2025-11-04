using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PCM.Application.Common;
using PCM.Application.DTOs.Auth;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;
using BCrypt.Net;

namespace PCM.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly PCMDbContext _context;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;

    public AuthService(
        PCMDbContext context,
        IJwtTokenService jwtTokenService,
        IConfiguration configuration)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
    }

    public async Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto request)
    {
        try
        {
            // Buscar usuario por email
            var usuario = await _context.Usuarios
                .Include(u => u.Entidad)
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null)
            {
                return Result<LoginResponseDto>.Failure("Credenciales inválidas");
            }

            // Verificar si el usuario está activo
            if (!usuario.Activo)
            {
                return Result<LoginResponseDto>.Failure("Usuario inactivo. Contacte al administrador.");
            }

            // Verificar contraseña
            if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.Password))
            {
                return Result<LoginResponseDto>.Failure("Credenciales inválidas");
            }

            // Generar tokens
            var accessToken = _jwtTokenService.GenerateAccessToken(usuario);
            var refreshToken = _jwtTokenService.GenerateRefreshToken();

            // Actualizar último login
            usuario.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var expirationMinutes = int.Parse(_configuration["JwtSettings:ExpirationMinutes"] ?? "60");

            var response = new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Usuario = new UsuarioDto
                {
                    UserId = usuario.UserId,
                    Email = usuario.Email,
                    NumDni = usuario.NumDni,
                    NombreCompleto = $"{usuario.Nombres} {usuario.ApePaterno} {usuario.ApeMaterno}",
                    EntidadId = usuario.EntidadId,
                    NombreEntidad = usuario.Entidad?.Nombre ?? "",
                    PerfilId = usuario.PerfilId,
                    NombrePerfil = usuario.Perfil?.Nombre ?? "",
                    Activo = usuario.Activo
                }
            };

            return Result<LoginResponseDto>.Success(response, "Login exitoso");
        }
        catch (Exception ex)
        {
            return Result<LoginResponseDto>.Failure(
                "Error al procesar el login",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<Result<LoginResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // TODO: Implementar almacenamiento de refresh tokens en base de datos
            // Por ahora retornamos error
            return Result<LoginResponseDto>.Failure("Refresh token no implementado aún");
        }
        catch (Exception ex)
        {
            return Result<LoginResponseDto>.Failure(
                "Error al refrescar token",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<Result> ChangePasswordAsync(int userId, ChangePasswordRequestDto request)
    {
        try
        {
            var usuario = await _context.Usuarios.FindAsync(userId);

            if (usuario == null)
            {
                return Result.Failure("Usuario no encontrado");
            }

            // Verificar contraseña actual
            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, usuario.Password))
            {
                return Result.Failure("Contraseña actual incorrecta");
            }

            // Validar nueva contraseña
            if (request.NewPassword.Length < 8)
            {
                return Result.Failure("La nueva contraseña debe tener al menos 8 caracteres");
            }

            // Hash de la nueva contraseña
            usuario.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Result.Success("Contraseña actualizada correctamente");
        }
        catch (Exception ex)
        {
            return Result.Failure(
                "Error al cambiar contraseña",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<Result> LogoutAsync(int userId)
    {
        try
        {
            // TODO: Invalidar refresh token en base de datos
            // Por ahora solo retornamos éxito
            await Task.CompletedTask;
            return Result.Success("Logout exitoso");
        }
        catch (Exception ex)
        {
            return Result.Failure(
                "Error al cerrar sesión",
                new List<string> { ex.Message }
            );
        }
    }
}
