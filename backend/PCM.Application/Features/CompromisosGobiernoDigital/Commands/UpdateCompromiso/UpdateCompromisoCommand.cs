using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;

namespace PCM.Application.Features.CompromisosGobiernoDigital.Commands.UpdateCompromiso;

public class UpdateCompromisoCommand : IRequest<Result<CompromisoResponseDto>>
{
    public int CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public List<string> Alcances { get; set; } = new();
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public int Estado { get; set; } = 1; // FK a estado_compromiso (1=pendiente por defecto)
    public List<CompromisoNormativaDto> Normativas { get; set; } = new();
    public List<CriterioEvaluacionDto> CriteriosEvaluacion { get; set; } = new();
}
