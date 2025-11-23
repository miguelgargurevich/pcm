using MediatR;
using PCM.Application.Common;
using System;

namespace PCM.Application.Features.Com9ModeloGestionDocumental.Commands.UpdateCom9ModeloGestionDocumental
{
    public class UpdateCom9ModeloGestionDocumentalCommand : IRequest<Result<bool>>
    {
        public int CommgdEntId { get; set; }
        public DateTime? FechaAprobacionMgd { get; set; }
        public string? NumeroResolucionMgd { get; set; }
        public string? ResponsableMgd { get; set; }
        public string? CargoResponsableMgd { get; set; }
        public string? CorreoResponsableMgd { get; set; }
        public string? TelefonoResponsableMgd { get; set; }
        public string? SistemaPlataformaMgd { get; set; }
        public string? TipoImplantacionMgd { get; set; }
        public bool? InteroperaSistemasMgd { get; set; }
        public string? ObservacionMgd { get; set; }
        public string? RutaPdfMgd { get; set; }
        public string? CriteriosEvaluados { get; set; }
        public bool? CheckPrivacidad { get; set; }
        public bool? CheckDdjj { get; set; }
        public int? UsuarioRegistra { get; set; }
        public string? EtapaFormulario { get; set; }
    }
}
