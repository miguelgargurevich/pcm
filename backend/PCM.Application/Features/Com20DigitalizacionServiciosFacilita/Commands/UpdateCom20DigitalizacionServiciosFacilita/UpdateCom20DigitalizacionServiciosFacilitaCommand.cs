using MediatR;
using PCM.Application.Common;
using System.Text.Json.Serialization;

namespace PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Commands.UpdateCom20DigitalizacionServiciosFacilita;

public class UpdateCom20DigitalizacionServiciosFacilitaCommand : IRequest<Result<Com20DigitalizacionServiciosFacilitaResponse>>
{
    public long ComdsfpeEntId { get; set; }
    public long? CompromisoId { get; set; }
    public Guid? EntidadId { get; set; }
    public string? EtapaFormulario { get; set; }
    public string? Estado { get; set; }
    [JsonPropertyName("rutaPdfNormativa")]
    public string? RutaPdfNormativa { get; set; }
    public bool? CheckPrivacidad { get; set; }
    public bool? CheckDdjj { get; set; }
    public Guid? UsuarioRegistra { get; set; }

    // Campos específicos de Digitalización de Servicios Facilita Perú
    public string? ResponsableFacilita { get; set; }
    public string? CargoResponsableFacilita { get; set; }
    public string? CorreoFacilita { get; set; }
    public string? TelefonoFacilita { get; set; }
    public string? EstadoImplementacionFacilita { get; set; }
    public DateTime? FechaInicioFacilita { get; set; }
    public DateTime? FechaUltimoAvanceFacilita { get; set; }
    public long? TotalServiciosDigitalizados { get; set; }
    public string? RutaPdfFacilita { get; set; }
    public string? ObservacionFacilita { get; set; }
}

public class Com20DigitalizacionServiciosFacilitaResponse
{
    public long ComdsfpeEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string? EstadoPCM { get; set; }
    public string? ObservacionesPCM { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid? UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    
    // Campos específicos de Digitalización de Servicios Facilita Perú
    public string? ResponsableFacilita { get; set; }
    public string? CargoResponsableFacilita { get; set; }
    public string? CorreoFacilita { get; set; }
    public string? TelefonoFacilita { get; set; }
    public string? EstadoImplementacionFacilita { get; set; }
    public DateTime? FechaInicioFacilita { get; set; }
    public DateTime? FechaUltimoAvanceFacilita { get; set; }
    public long TotalServiciosDigitalizados { get; set; }
    public string? RutaPdfFacilita { get; set; }
    public string? ObservacionFacilita { get; set; }
}
