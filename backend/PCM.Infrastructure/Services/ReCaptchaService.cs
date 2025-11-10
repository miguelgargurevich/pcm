using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.Interfaces;
using System.Text.Json;

namespace PCM.Infrastructure.Services;

public class ReCaptchaService : IReCaptchaService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ReCaptchaService> _logger;
    private readonly HttpClient _httpClient;
    private readonly string _secretKey;
    private readonly string _verifyUrl;
    private readonly double _minScore;

    public ReCaptchaService(
        IConfiguration configuration,
        ILogger<ReCaptchaService> logger,
        HttpClient httpClient)
    {
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClient;
        
        _secretKey = configuration["ReCaptcha:SecretKey"] 
            ?? throw new InvalidOperationException("ReCaptcha SecretKey no configurada");
        _verifyUrl = configuration["ReCaptcha:VerifyUrl"] 
            ?? "https://www.google.com/recaptcha/api/siteverify";
        _minScore = double.Parse(configuration["ReCaptcha:MinScore"] ?? "0.5");
    }

    public async Task<bool> ValidateTokenAsync(string token, string action = "login")
    {
        // Si el token es null o vacío, permitir en desarrollo (para testing)
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning("ReCAPTCHA token no proporcionado. Permitiendo acceso (modo desarrollo).");
            return true; // En producción, podrías cambiar esto a false
        }

        try
        {
            var requestData = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("secret", _secretKey),
                new KeyValuePair<string, string>("response", token)
            });

            var response = await _httpClient.PostAsync(_verifyUrl, requestData);
            var jsonResponse = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("ReCAPTCHA Response: {Response}", jsonResponse);

            var result = JsonSerializer.Deserialize<ReCaptchaResponse>(jsonResponse);

            if (result == null)
            {
                _logger.LogError("Error al deserializar respuesta de reCAPTCHA");
                return false;
            }

            if (!result.Success)
            {
                _logger.LogWarning("ReCAPTCHA validación fallida. Errores: {Errors}", 
                    string.Join(", ", result.ErrorCodes ?? new string[0]));
                return false;
            }

            // Verificar la acción
            if (!string.IsNullOrEmpty(action) && result.Action != action)
            {
                _logger.LogWarning("ReCAPTCHA acción no coincide. Esperado: {Expected}, Recibido: {Actual}", 
                    action, result.Action);
                return false;
            }

            // Verificar el score (solo para reCAPTCHA v3)
            if (result.Score.HasValue && result.Score < _minScore)
            {
                _logger.LogWarning("ReCAPTCHA score muy bajo: {Score} (mínimo requerido: {MinScore})", 
                    result.Score, _minScore);
                return false;
            }

            _logger.LogInformation("ReCAPTCHA validación exitosa. Score: {Score}, Action: {Action}", 
                result.Score, result.Action);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al validar token de reCAPTCHA");
            // En caso de error, permitir acceso para no bloquear el sistema
            return true;
        }
    }

    private class ReCaptchaResponse
    {
        public bool Success { get; set; }
        
        public double? Score { get; set; }
        
        public string? Action { get; set; }
        
        public DateTime? ChallengeTs { get; set; }
        
        public string? Hostname { get; set; }
        
        public string[]? ErrorCodes { get; set; }
    }
}
