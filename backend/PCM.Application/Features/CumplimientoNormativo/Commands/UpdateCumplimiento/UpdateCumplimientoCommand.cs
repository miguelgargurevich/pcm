using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CumplimientoNormativo;

namespace PCM.Application.Features.CumplimientoNormativo.Commands.UpdateCumplimiento;

public class UpdateCumplimientoCommand : IRequest<Result<CumplimientoResponseDto>>
{
    public int CumplimientoId { get; set; }
    
    // Paso 1: Datos Generales
    public string NroDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string CorreoElectronico { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Rol { get; set; }
    public string? Cargo { get; set; }
    public DateTime FechaInicio { get; set; }
    
    // Paso 2: Normativa
    public string? DocumentoUrl { get; set; }
    public string? DocumentoNombre { get; set; }
    public long? DocumentoTamano { get; set; }
    public string? DocumentoTipo { get; set; }
    public bool ValidacionResolucionAutoridad { get; set; }
    public bool ValidacionLiderFuncionario { get; set; }
    public bool ValidacionDesignacionArticulo { get; set; }
    public bool ValidacionFuncionesDefinidas { get; set; }
    public string? CriteriosEvaluados { get; set; }
    
    // Paso 3: Confirmación
    public bool AceptaPoliticaPrivacidad { get; set; }
    public bool AceptaDeclaracionJurada { get; set; }
    
    public string? EtapaFormulario { get; set; }
    public int Estado { get; set; }
}
