using MediatR;
using PCM.Application.Common;
using System;

namespace PCM.Application.Features.Com10DatosAbiertos.Commands.UpdateCom10DatosAbiertos
{
    public class UpdateCom10DatosAbiertosCommand : IRequest<Result<bool>>
    {
        public long ComdaEntId { get; set; }
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
}
