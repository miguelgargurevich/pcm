using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Auth;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Auth;

public class ResetPasswordHandler
{
    private readonly PCMDbContext _context;

    public ResetPasswordHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<string>> Handle(ResetPasswordRequestDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Token))
            {
                return Result<string>.Failure(
                    "Token inválido",
                    new List<string> { "El token es requerido" }
                );
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return Result<string>.Failure(
                    "Contraseña inválida",
                    new List<string> { "La nueva contraseña es requerida" }
                );
            }

            if (request.NewPassword.Length < 8)
            {
                return Result<string>.Failure(
                    "Contraseña inválida",
                    new List<string> { "La contraseña debe tener al menos 8 caracteres" }
                );
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.ResetPasswordToken == request.Token);

            if (usuario == null)
            {
                return Result<string>.Failure(
                    "Token inválido",
                    new List<string> { "El enlace de recuperación es inválido" }
                );
            }

            // Verificar que el token no haya expirado
            if (usuario.ResetPasswordExpiry == null || usuario.ResetPasswordExpiry < DateTime.UtcNow)
            {
                // Limpiar el token expirado
                usuario.ResetPasswordToken = null;
                usuario.ResetPasswordExpiry = null;
                await _context.SaveChangesAsync();

                return Result<string>.Failure(
                    "Token expirado",
                    new List<string> { "El enlace de recuperación ha expirado. Por favor, solicita uno nuevo." }
                );
            }

            // Hashear la nueva contraseña
            usuario.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            
            // Limpiar el token de reset
            usuario.ResetPasswordToken = null;
            usuario.ResetPasswordExpiry = null;
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ Contraseña restablecida para: {usuario.Email}");

            return Result<string>.Success("Contraseña restablecida exitosamente");
        }
        catch (Exception ex)
        {
            return Result<string>.Failure(
                "Error al restablecer la contraseña",
                new List<string> { ex.Message }
            );
        }
    }

    public async Task<Result<bool>> ValidateToken(string token)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return Result<bool>.Failure(
                    "Token inválido",
                    new List<string> { "El token es requerido" }
                );
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.ResetPasswordToken == token);

            if (usuario == null)
            {
                return Result<bool>.Failure(
                    "Token inválido",
                    new List<string> { "El enlace de recuperación es inválido" }
                );
            }

            // Verificar que el token no haya expirado
            if (usuario.ResetPasswordExpiry == null || usuario.ResetPasswordExpiry < DateTime.UtcNow)
            {
                return Result<bool>.Failure(
                    "Token expirado",
                    new List<string> { "El enlace de recuperación ha expirado" }
                );
            }

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(
                "Error al validar el token",
                new List<string> { ex.Message }
            );
        }
    }
}
