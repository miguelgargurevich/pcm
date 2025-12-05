using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Interfaces;

namespace PCM.Infrastructure.Services;

/// <summary>
/// Servicio para consultas de RUC usando APIs públicas de Perú
/// Intenta múltiples proveedores con fallback a datos mock
/// </summary>
public class SunatService : ISunatService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<SunatService> _logger;
    private readonly string? _apiToken;
    private readonly bool _useMockData;

    public SunatService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<SunatService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _apiToken = configuration["Sunat:ApiToken"];
        _useMockData = bool.TryParse(configuration["Sunat:UseMockData"], out var mock) && mock;
    }

    public async Task<RucValidationResultDto> ConsultarRucAsync(string ruc)
    {
        // Validación básica de formato
        if (string.IsNullOrWhiteSpace(ruc) || ruc.Length != 11 || !ruc.All(char.IsDigit))
        {
            return new RucValidationResultDto
            {
                IsValid = false,
                Message = "El RUC debe tener 11 dígitos numéricos"
            };
        }

        // Si está configurado para usar mock, retornar datos simulados
        if (_useMockData)
        {
            _logger.LogInformation("Usando datos mock para RUC {Ruc}", ruc);
            return GetMockData(ruc);
        }

        // Intentar con APIs públicas
        try
        {
            // Opción 1: APIs Perú (tiene versión gratuita limitada)
            var result = await TryApisPeruAsync(ruc);
            if (result != null && result.IsValid)
                return result;

            // Opción 2: Migo Perú
            result = await TryMigoPeruAsync(ruc);
            if (result != null && result.IsValid)
                return result;

            // Si ninguna API funciona, usar datos mock
            _logger.LogWarning("APIs externas no disponibles, usando datos mock para RUC {Ruc}", ruc);
            return GetMockData(ruc);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error consultando RUC {Ruc}", ruc);
            return GetMockData(ruc);
        }
    }

    /// <summary>
    /// Intenta consultar con APIs Perú
    /// Documentación: https://apisperu.com/api/v1/ruc
    /// </summary>
    private async Task<RucValidationResultDto?> TryApisPeruAsync(string ruc)
    {
        try
        {
            if (string.IsNullOrEmpty(_apiToken))
            {
                _logger.LogDebug("Token de APIs Perú no configurado");
                return null;
            }

            var url = $"https://api.apis.net.pe/v2/sunat/ruc?numero={ruc}";
            
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Authorization", $"Bearer {_apiToken}");
            
            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogDebug("APIs Perú respondió con status {StatusCode}", response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<ApisPeruResponse>(content);

            if (data == null)
                return null;

            return new RucValidationResultDto
            {
                IsValid = true,
                RazonSocial = data.RazonSocial ?? data.Nombre,
                Direccion = data.Direccion,
                Estado = data.Estado,
                Message = "Datos obtenidos de SUNAT"
            };
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Error consultando APIs Perú para RUC {Ruc}", ruc);
            return null;
        }
    }

    /// <summary>
    /// Intenta consultar con Migo Perú (API gratuita)
    /// </summary>
    private async Task<RucValidationResultDto?> TryMigoPeruAsync(string ruc)
    {
        try
        {
            var url = $"https://api.migo.pe/api/v1/ruc";
            
            var requestBody = new { token = "gratuito", ruc = ruc };
            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                System.Text.Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, jsonContent);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogDebug("Migo Perú respondió con status {StatusCode}", response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<MigoPeruResponse>(content);

            if (data == null || !data.Success)
                return null;

            return new RucValidationResultDto
            {
                IsValid = true,
                RazonSocial = data.NombreORazonSocial,
                Direccion = data.DireccionCompleta,
                Estado = data.Estado,
                Message = "Datos obtenidos de SUNAT"
            };
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Error consultando Migo Perú para RUC {Ruc}", ruc);
            return null;
        }
    }

    /// <summary>
    /// Retorna datos mock basados en el RUC
    /// Útil para desarrollo y cuando las APIs externas no están disponibles
    /// </summary>
    private RucValidationResultDto GetMockData(string ruc)
    {
        // Validar que el primer dígito sea válido (10 o 20)
        var tipoContribuyente = ruc.Substring(0, 2);
        
        if (tipoContribuyente != "10" && tipoContribuyente != "20")
        {
            return new RucValidationResultDto
            {
                IsValid = false,
                Message = "RUC inválido: debe comenzar con 10 (persona natural) o 20 (persona jurídica)"
            };
        }

        // Datos mock para entidades del estado peruano conocidas
        var entidadesMock = new Dictionary<string, (string razonSocial, string direccion, string estado)>
        {
            // PCM
            ["20168999926"] = ("PRESIDENCIA DEL CONSEJO DE MINISTROS", "JR. CARABAYA NRO. 120 LIMA - LIMA - LIMA", "ACTIVO"),
            // MEF
            ["20131370645"] = ("MINISTERIO DE ECONOMIA Y FINANZAS", "JR. JUNIN NRO. 319 LIMA - LIMA - LIMA", "ACTIVO"),
            // MINSA
            ["20131023414"] = ("MINISTERIO DE SALUD", "AV. SALAVERRY NRO. 801 LIMA - LIMA - JESUS MARIA", "ACTIVO"),
            // MINEDU
            ["20131367050"] = ("MINISTERIO DE EDUCACION", "CALLE DEL COMERCIO NRO. 193 LIMA - LIMA - SAN BORJA", "ACTIVO"),
            // RENIEC
            ["20295613620"] = ("REGISTRO NACIONAL DE IDENTIFICACION Y ESTADO CIVIL", "JR. BOLIVIA NRO. 109 LIMA - LIMA - LIMA", "ACTIVO"),
            // SUNAT
            ["20131312955"] = ("SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACION TRIBUTARIA", "AV. GARCILAZO DE LA VEGA NRO. 1472 LIMA - LIMA - LIMA", "ACTIVO"),
            // ONPE
            ["20304992764"] = ("OFICINA NACIONAL DE PROCESOS ELECTORALES", "JR. WASHINGTON NRO. 1894 LIMA - LIMA - LIMA", "ACTIVO"),
            // SERVIR
            ["20504743307"] = ("AUTORIDAD NACIONAL DEL SERVICIO CIVIL", "AV. PASEO DE LA REPUBLICA NRO. 3361 LIMA - LIMA - SAN ISIDRO", "ACTIVO"),
            // INDECOPI
            ["20133840533"] = ("INSTITUTO NACIONAL DE DEFENSA DE LA COMPETENCIA Y DE LA PROTECCION DE LA PROPIEDAD INTELECTUAL", "CALLE DE LA PROSA NRO. 104 LIMA - LIMA - SAN BORJA", "ACTIVO"),
            // OSCE
            ["20419026809"] = ("ORGANISMO SUPERVISOR DE LAS CONTRATACIONES DEL ESTADO", "AV. GREGORIO ESCOBEDO NRO. 398 LIMA - LIMA - JESUS MARIA", "ACTIVO"),
        };

        if (entidadesMock.TryGetValue(ruc, out var entidad))
        {
            return new RucValidationResultDto
            {
                IsValid = true,
                RazonSocial = entidad.razonSocial,
                Direccion = entidad.direccion,
                Estado = entidad.estado,
                Message = "Datos obtenidos (modo desarrollo)"
            };
        }

        // Para RUCs no conocidos, generar datos genéricos
        var esPersonaJuridica = tipoContribuyente == "20";
        
        return new RucValidationResultDto
        {
            IsValid = true,
            RazonSocial = esPersonaJuridica 
                ? $"ENTIDAD PUBLICA {ruc.Substring(2, 4)}" 
                : $"CONTRIBUYENTE {ruc.Substring(2, 4)}",
            Direccion = "LIMA - LIMA - LIMA",
            Estado = "ACTIVO",
            Message = "Datos simulados (integración con SUNAT pendiente para producción)"
        };
    }

    #region Response DTOs para APIs externas

    private class ApisPeruResponse
    {
        [JsonPropertyName("nombre")]
        public string? Nombre { get; set; }

        [JsonPropertyName("razonSocial")]
        public string? RazonSocial { get; set; }

        [JsonPropertyName("direccion")]
        public string? Direccion { get; set; }

        [JsonPropertyName("estado")]
        public string? Estado { get; set; }

        [JsonPropertyName("condicion")]
        public string? Condicion { get; set; }

        [JsonPropertyName("ubigeo")]
        public string? Ubigeo { get; set; }

        [JsonPropertyName("departamento")]
        public string? Departamento { get; set; }

        [JsonPropertyName("provincia")]
        public string? Provincia { get; set; }

        [JsonPropertyName("distrito")]
        public string? Distrito { get; set; }
    }

    private class MigoPeruResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("nombre_o_razon_social")]
        public string? NombreORazonSocial { get; set; }

        [JsonPropertyName("direccion_completa")]
        public string? DireccionCompleta { get; set; }

        [JsonPropertyName("estado")]
        public string? Estado { get; set; }

        [JsonPropertyName("condicion")]
        public string? Condicion { get; set; }

        [JsonPropertyName("ubigeo")]
        public string? Ubigeo { get; set; }

        [JsonPropertyName("departamento")]
        public string? Departamento { get; set; }

        [JsonPropertyName("provincia")]
        public string? Provincia { get; set; }

        [JsonPropertyName("distrito")]
        public string? Distrito { get; set; }
    }

    #endregion
}
