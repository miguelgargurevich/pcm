using MediatR;
using PCM.Application.Common;
using System;

namespace PCM.Application.Features.Com10DatosAbiertos.Commands.CreateCom10DatosAbiertos
{
    public class CreateCom10DatosAbiertosCommand : IRequest<Result<Com10DatosAbiertosResponse>>
    {
        public long CompromisoId { get; set; }
        public Guid EntidadId { get; set; }
        public string Estado { get; set; } = "pendiente";
        public string EstadoPCM { get; set; } = "En Proceso";
        public string ObservacionesPCM { get; set; } = "";
        public string? UrlDatosAbiertos { get; set; }
        public long? TotalDatasets { get; set; }
        public DateTime? FechaUltimaActualizacionDa { get; set; }
        public string? ResponsableDa { get; set; }
        public string? CargoResponsableDa { get; set; }
        public string? CorreoResponsableDa { get; set; }
        public string? TelefonoResponsableDa { get; set; }
        public string? NumeroNormaResolucionDa { get; set; }
        public DateTime? FechaAprobacionDa { get; set; }
        public string? ObservacionDa { get; set; }
        public string? RutaPdfDa { get; set; }
        public bool CheckPrivacidad { get; set; }
        public bool CheckDdjj { get; set; }
        public Guid UsuarioRegistra { get; set; }
        public string? EtapaFormulario { get; set; }
    }

    public class Com10DatosAbiertosResponse
    {
        public long ComdaEntId { get; set; }
        public long CompromisoId { get; set; }
        public Guid EntidadId { get; set; }
        public string EstadoPCM { get; set; } = "En Proceso";
        public string ObservacionesPCM { get; set; } = "";
        public string? UrlDatosAbiertos { get; set; }
        public long? TotalDatasets { get; set; }
        public DateTime? FechaUltimaActualizacionDa { get; set; }
        public string? ResponsableDa { get; set; }
        public string? CargoResponsableDa { get; set; }
        public string? CorreoResponsableDa { get; set; }
        public string? TelefonoResponsableDa { get; set; }
        public string? NumeroNormaResolucionDa { get; set; }
        public DateTime? FechaAprobacionDa { get; set; }
        public string? ObservacionDa { get; set; }
        public string? RutaPdfDa { get; set; }
        public bool CheckPrivacidad { get; set; }
        public bool CheckDdjj { get; set; }
        public Guid UsuarioRegistra { get; set; }
        public string? EtapaFormulario { get; set; }
        public string? Estado { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? RutaPdfNormativa { get; set; }
        public string? CriteriosEvaluados { get; set; }
    }
}
