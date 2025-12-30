using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.Interfaces;

namespace PCM.Infrastructure.Services;

/// <summary>
/// Servicio de email usando SMTP institucional
/// Reemplaza ResendEmailService para ambientes de producción
/// </summary>
public class SmtpEmailService : IEmailService
{
    private readonly ILogger<SmtpEmailService> _logger;
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly string _frontendUrl;
    private readonly bool _enableSsl;

    public SmtpEmailService(
        IConfiguration configuration,
        ILogger<SmtpEmailService> logger)
    {
        _logger = logger;

        // Configuración SMTP
        _smtpHost = configuration["Smtp:Host"] 
            ?? throw new InvalidOperationException("SMTP Host no configurado");
        _smtpPort = int.Parse(configuration["Smtp:Port"] ?? "587");
        _smtpUsername = configuration["Smtp:Username"] ?? "";
        _smtpPassword = configuration["Smtp:Password"] ?? "";
        _fromEmail = configuration["Smtp:FromEmail"] 
            ?? throw new InvalidOperationException("SMTP FromEmail no configurado");
        _fromName = configuration["Smtp:FromName"] ?? "Plataforma de Cumplimiento Digital";
        _frontendUrl = configuration["Smtp:FrontendUrl"] ?? "http://localhost:5173";
        _enableSsl = bool.Parse(configuration["Smtp:EnableSsl"] ?? "true");
        
        _logger.LogInformation("📧 SmtpEmailService inicializado");
        _logger.LogInformation("   Host: {Host}:{Port}", _smtpHost, _smtpPort);
        _logger.LogInformation("   From: {FromName} <{FromEmail}>", _fromName, _fromEmail);
        _logger.LogInformation("   SSL: {EnableSsl}", _enableSsl);
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlBody)
    {
        try
        {
            using var client = CreateSmtpClient();
            using var message = new MailMessage();

            message.From = new MailAddress(_fromEmail, _fromName);
            message.To.Add(new MailAddress(to));
            message.Subject = subject;
            message.Body = htmlBody;
            message.IsBodyHtml = true;

            _logger.LogInformation("📤 Enviando email via SMTP");
            _logger.LogInformation("   To: {To}", to);
            _logger.LogInformation("   From: {FromName} <{FromEmail}>", _fromName, _fromEmail);
            _logger.LogInformation("   Subject: {Subject}", subject);

            await client.SendMailAsync(message);

            _logger.LogInformation("✅ Email enviado exitosamente a {To}", to);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al enviar email a {To}", to);
            return false;
        }
    }

    public async Task<bool> SendPasswordResetEmailAsync(string to, string nombreUsuario, string resetLink)
    {
        var subject = "Recuperación de Contraseña - Plataforma de Cumplimiento Digital";
        
        var htmlBody = $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Recuperación de Contraseña</title>
</head>
<body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"">
    <div style=""background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"">
        <h1 style=""color: white; margin: 0; font-size: 24px;"">Plataforma de Cumplimiento Digital</h1>
        <p style=""color: #e2e8f0; margin: 10px 0 0 0; font-size: 14px;"">Presidencia del Consejo de Ministros</p>
    </div>
    
    <div style=""background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;"">
        <h2 style=""color: #1e3a5f; margin-top: 0;"">Recuperación de Contraseña</h2>
        
        <p>Hola <strong>{nombreUsuario}</strong>,</p>
        
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la Plataforma de Cumplimiento Digital.</p>
        
        <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
        
        <div style=""text-align: center; margin: 30px 0;"">
            <a href=""{resetLink}"" style=""background-color: #c53030; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;"">
                Restablecer Contraseña
            </a>
        </div>
        
        <p style=""font-size: 14px; color: #64748b;"">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
        </p>
        <p style=""font-size: 12px; color: #64748b; word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 5px;"">
            {resetLink}
        </p>
        
        <div style=""margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;"">
            <p style=""font-size: 13px; color: #64748b; margin: 0;"">
                <strong>⚠️ Importante:</strong>
            </p>
            <ul style=""font-size: 13px; color: #64748b; margin: 10px 0; padding-left: 20px;"">
                <li>Este enlace expirará en <strong>1 hora</strong>.</li>
                <li>Si no solicitaste este cambio, puedes ignorar este correo.</li>
                <li>Nunca compartas este enlace con nadie.</li>
            </ul>
        </div>
    </div>
    
    <div style=""background: #1e3a5f; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;"">
        <p style=""color: #e2e8f0; margin: 0; font-size: 12px;"">
            © {DateTime.Now.Year} Presidencia del Consejo de Ministros<br>
            Secretaría de Gobierno y Transformación Digital
        </p>
        <p style=""color: #94a3b8; margin: 10px 0 0 0; font-size: 11px;"">
            Este es un correo automático, por favor no responder.
        </p>
    </div>
</body>
</html>";

        return await SendEmailAsync(to, subject, htmlBody);
    }

    private SmtpClient CreateSmtpClient()
    {
        var client = new SmtpClient(_smtpHost, _smtpPort)
        {
            EnableSsl = _enableSsl,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Timeout = 30000 // 30 segundos
        };

        // Configurar credenciales si están proporcionadas
        if (!string.IsNullOrEmpty(_smtpUsername) && !string.IsNullOrEmpty(_smtpPassword))
        {
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
        }

        return client;
    }
}
