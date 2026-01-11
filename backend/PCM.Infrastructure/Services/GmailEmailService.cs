using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.Interfaces;

namespace PCM.Infrastructure.Services;

public class GmailEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GmailEmailService> _logger;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _refreshToken;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private string? _accessToken;
    private DateTime _tokenExpiration;

    public GmailEmailService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<GmailEmailService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _clientId = configuration["Gmail:ClientId"]
            ?? throw new InvalidOperationException("Gmail ClientId no configurada");
        _clientSecret = configuration["Gmail:ClientSecret"]
            ?? throw new InvalidOperationException("Gmail ClientSecret no configurada");
        _refreshToken = configuration["Gmail:RefreshToken"]
            ?? throw new InvalidOperationException("Gmail RefreshToken no configurado");
        _fromEmail = configuration["Gmail:FromEmail"] ?? "tidragon1981@gmail.com";
        _fromName = configuration["Gmail:FromName"] ?? "Plataforma de Cumplimiento Digital";
    }

    private async Task<string> GetAccessTokenAsync()
    {
        // Si ya tenemos un token válido, lo retornamos
        if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiration)
        {
            return _accessToken;
        }

        try
        {
            var tokenRequest = new
            {
                client_id = _clientId,
                client_secret = _clientSecret,
                refresh_token = _refreshToken,
                grant_type = "refresh_token"
            };

            var jsonContent = JsonSerializer.Serialize(tokenRequest);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://oauth2.googleapis.com/token", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseBody);
                if (tokenResponse?.AccessToken != null)
                {
                    _accessToken = tokenResponse.AccessToken;
                    // Los tokens de Google expiran en 1 hora, guardamos el tiempo de expiración
                    _tokenExpiration = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 60); // 60 segundos de margen
                    _logger.LogInformation("✅ Access token obtenido exitosamente");
                    return _accessToken;
                }
            }

            _logger.LogError("❌ Error al obtener access token: {Response}", responseBody);
            throw new Exception($"No se pudo obtener el access token: {responseBody}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "💥 Excepción al obtener access token");
            throw;
        }
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlBody)
    {
        try
        {
            // Obtener access token
            var accessToken = await GetAccessTokenAsync();

            // Construir el mensaje en formato RFC 2822
            var message = BuildEmailMessage(to, subject, htmlBody);

            // Codificar en base64url
            var base64Message = Convert.ToBase64String(Encoding.UTF8.GetBytes(message))
                .Replace('+', '-')
                .Replace('/', '_')
                .Replace("=", "");

            var gmailRequest = new { raw = base64Message };
            var jsonContent = JsonSerializer.Serialize(gmailRequest);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Configurar el HttpClient con el access token
            using var request = new HttpRequestMessage(HttpMethod.Post, $"https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Content = content;

            _logger.LogInformation("📤 Enviando email via Gmail API");
            _logger.LogInformation("   To: {To}", to);
            _logger.LogInformation("   From: {FromName} <{FromEmail}>", _fromName, _fromEmail);
            _logger.LogInformation("   Subject: {Subject}", subject);

            var response = await _httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("📨 Gmail API Response Status: {StatusCode}", response.StatusCode);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("✅ Email enviado exitosamente a {To}", to);
                _logger.LogDebug("Response Body: {ResponseBody}", responseBody);
                return true;
            }
            else
            {
                _logger.LogError("❌ Error al enviar email via Gmail");
                _logger.LogError("   Status Code: {StatusCode}", response.StatusCode);
                _logger.LogError("   Response: {Response}", responseBody);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "💥 Excepción al enviar email a {To}", to);
            return false;
        }
    }

    private string BuildEmailMessage(string to, string subject, string htmlBody)
    {
        var message = new StringBuilder();
        message.AppendLine($"From: {_fromName} <{_fromEmail}>");
        message.AppendLine($"To: {to}");
        // Codificar el subject en UTF-8 para evitar problemas con acentos
        message.AppendLine($"Subject: =?UTF-8?B?{Convert.ToBase64String(Encoding.UTF8.GetBytes(subject))}?=");
        message.AppendLine("MIME-Version: 1.0");
        message.AppendLine("Content-Type: text/html; charset=utf-8");
        message.AppendLine();
        message.AppendLine(htmlBody);

        return message.ToString();
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

    private class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; } = string.Empty;
    }
}
