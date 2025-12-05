using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.Auth;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Auth;

public class ForgotPasswordHandler
{
    private readonly PCMDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<ForgotPasswordHandler> _logger;
    private readonly string _frontendUrl;

    public ForgotPasswordHandler(
        PCMDbContext context,
        IEmailService emailService,
        IConfiguration configuration,
        ILogger<ForgotPasswordHandler> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
        _frontendUrl = configuration["Resend:FrontendUrl"] ?? "http://localhost:5173";
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

            // Generar enlace de recuperación
            var resetLink = $"{_frontendUrl}/reset-password/{token}";
            
            // Obtener nombre del usuario para el email
            var nombreUsuario = !string.IsNullOrEmpty(usuario.Nombres) 
                ? $"{usuario.Nombres} {usuario.ApePaterno}".Trim() 
                : usuario.Email;
            
            // Enviar email de recuperación
            var emailEnviado = await _emailService.SendPasswordResetEmailAsync(
                usuario.Email, 
                nombreUsuario, 
                resetLink
            );

            if (emailEnviado)
            {
                _logger.LogInformation("Email de recuperación enviado a {Email}", usuario.Email);
            }
            else
            {
                _logger.LogWarning("No se pudo enviar email de recuperación a {Email}", usuario.Email);
            }

            // En desarrollo, también mostramos en consola
            _logger.LogDebug("🔗 Reset Password Link: {ResetLink}", resetLink);
            _logger.LogDebug("📧 Email: {Email}", usuario.Email);
            _logger.LogDebug("⏰ Expira: {Expiry}", usuario.ResetPasswordExpiry);

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
