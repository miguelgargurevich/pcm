using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;

namespace PCM.Application.Features.CompromisosGobiernoDigital.Commands.CreateCompromiso;

public class CreateCompromisoCommand : IRequest<Result<CompromisoResponseDto>>
{
    public string NombreCompromiso { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public List<string> Alcances { get; set; } = new();
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Activo { get; set; } = true;
    public List<CompromisoNormativaDto> Normativas { get; set; } = new();
    public List<CriterioEvaluacionDto> CriteriosEvaluacion { get; set; } = new();
}
