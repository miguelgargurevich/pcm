using PCM.Application.DTOs.Entidad;

namespace PCM.Application.Interfaces;

/// <summary>
/// Servicio para consultas a SUNAT (RUC)
/// </summary>
public interface ISunatService
{
    /// <summary>
    /// Consulta información de un RUC en SUNAT
    /// </summary>
    /// <param name="ruc">Número de RUC (11 dígitos)</param>
    /// <returns>Información del contribuyente</returns>
    Task<RucValidationResultDto> ConsultarRucAsync(string ruc);
}
