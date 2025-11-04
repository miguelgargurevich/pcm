using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Auth;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Auth;

public class ForgotPasswordHandler
{
    private readonly PCMDbContext _context;

    public ForgotPasswordHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<string>> Handle(ForgotPasswordRequestDto request)
    {
        try
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            // Por seguridad, siempre devolvemos éxito incluso si el usuario no existe
            // Esto evita que alguien pueda determinar qué emails están registrados
            if (usuario == null)
            {
                return Result<string>.Success("Si el correo existe, recibirás un enlace de recuperación.");
            }

            // Generar token único
            var token = GenerateSecureToken();
            
            // El token expira en 1 hora
            usuario.ResetPasswordToken = token;
            usuario.ResetPasswordExpiry = DateTime.UtcNow.AddHours(1);
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // TODO: Enviar email con el enlace de recuperación
            // Por ahora, devolvemos el token en la consola (solo para desarrollo)
            var resetLink = $"http://localhost:5173/reset-password/{token}";
            Console.WriteLine($"🔗 Reset Password Link: {resetLink}");
            Console.WriteLine($"📧 Email: {usuario.Email}");
            Console.WriteLine($"⏰ Expira: {usuario.ResetPasswordExpiry}");

            return Result<string>.Success("Si el correo existe, recibirás un enlace de recuperación.");
        }
        catch (Exception ex)
        {
            return Result<string>.Failure(
                "Error al procesar la solicitud",
                new List<string> { ex.Message }
            );
        }
    }

    private string GenerateSecureToken()
    {
        // Generar un token seguro de 32 bytes (256 bits)
        using var rng = RandomNumberGenerator.Create();
        var tokenBytes = new byte[32];
        rng.GetBytes(tokenBytes);
        
        // Convertir a string base64 URL-safe
        return Convert.ToBase64String(tokenBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }
}
