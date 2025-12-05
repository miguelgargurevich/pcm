using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.Interfaces;

namespace PCM.Infrastructure.Services;

public class ResendEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ResendEmailService> _logger;
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly string _frontendUrl;
    private const string RESEND_API_URL = "https://api.resend.com/emails";

    public ResendEmailService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<ResendEmailService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _apiKey = configuration["Resend:ApiKey"]
            ?? throw new InvalidOperationException("Resend ApiKey no configurada");
        _fromEmail = configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";
        _fromName = configuration["Resend:FromName"] ?? "Plataforma de Cumplimiento Digital";
        _frontendUrl = configuration["Resend:FrontendUrl"] ?? "http://localhost:5173";

        // Configurar el HttpClient con la API key de Resend
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlBody)
    {
        try
        {
            var emailRequest = new ResendEmailRequest
            {
                From = $"{_fromName} <{_fromEmail}>",
                To = new[] { to },
                Subject = subject,
                Html = htmlBody
            };

            var jsonContent = JsonSerializer.Serialize(emailRequest, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _logger.LogInformation("Enviando email a {To} con asunto: {Subject}", to, subject);

            var response = await _httpClient.PostAsync(RESEND_API_URL, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email enviado exitosamente a {To}", to);
                return true;
            }
            else
            {
                _logger.LogError("Error al enviar email. Status: {StatusCode}, Response: {Response}", 
                    response.StatusCode, responseBody);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar email a {To}", to);
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
</head>
<body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;"">
    <table role=""presentation"" style=""width: 100%; border-collapse: collapse;"">
        <tr>
            <td align=""center"" style=""padding: 40px 0;"">
                <table role=""presentation"" style=""width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"">
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%); padding: 30px 40px; border-radius: 8px 8px 0 0;"">
                            <h1 style=""color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;"">
                                🔐 Recuperación de Contraseña
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style=""padding: 40px;"">
                            <p style=""color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;"">
                                Hola <strong>{nombreUsuario}</strong>,
                            </p>
                            
                            <p style=""color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;"">
                                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la 
                                <strong>Plataforma de Cumplimiento Digital</strong>.
                            </p>
                            
                            <p style=""color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;"">
                                Haz clic en el siguiente botón para crear una nueva contraseña:
                            </p>
                            
                            <!-- Button -->
                            <table role=""presentation"" style=""width: 100%; border-collapse: collapse;"">
                                <tr>
                                    <td align=""center"">
                                        <a href=""{resetLink}"" 
                                           style=""display: inline-block; background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); 
                                                  color: #ffffff; text-decoration: none; padding: 14px 40px; 
                                                  border-radius: 6px; font-size: 16px; font-weight: 600;
                                                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);"">
                                            Restablecer Contraseña
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style=""color: #777777; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;"">
                                Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
                            </p>
                            <p style=""color: #3182ce; font-size: 12px; word-break: break-all; margin: 10px 0 0 0;"">
                                {resetLink}
                            </p>
                            
                            <!-- Warning -->
                            <div style=""background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-top: 30px; border-radius: 0 4px 4px 0;"">
                                <p style=""color: #92400e; font-size: 14px; margin: 0;"">
                                    ⚠️ <strong>Importante:</strong> Este enlace expirará en <strong>1 hora</strong>.
                                </p>
                            </div>
                            
                            <p style=""color: #777777; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;"">
                                Si no solicitaste este cambio, puedes ignorar este correo de manera segura. 
                                Tu contraseña actual seguirá siendo válida.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f8fafc; padding: 25px 40px; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;"">
                            <p style=""color: #64748b; font-size: 12px; margin: 0; text-align: center;"">
                                Este es un correo automático de la Plataforma de Cumplimiento Digital.<br>
                                Por favor, no respondas a este mensaje.
                            </p>
                            <p style=""color: #94a3b8; font-size: 11px; margin: 15px 0 0 0; text-align: center;"">
                                © {DateTime.UtcNow.Year} Presidencia del Consejo de Ministros - Perú
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";

        return await SendEmailAsync(to, subject, htmlBody);
    }

    // Clase para el request de Resend API
    private class ResendEmailRequest
    {
        [JsonPropertyName("from")]
        public string From { get; set; } = string.Empty;

        [JsonPropertyName("to")]
        public string[] To { get; set; } = Array.Empty<string>();

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("html")]
        public string Html { get; set; } = string.Empty;
    }
}
