using MediatR;
using PCM.Application.Common;
using System;

namespace PCM.Application.Features.Com9ModeloGestionDocumental.Commands.CreateCom9ModeloGestionDocumental
{
    public class CreateCom9ModeloGestionDocumentalCommand : IRequest<Result<Com9ModeloGestionDocumentalResponse>>
    {
        public int CompromisoId { get; set; }
        public int EntidadId { get; set; }
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
        public bool? CheckPrivacidad { get; set; }
        public bool? CheckDdjj { get; set; }
        public int? UsuarioRegistra { get; set; }
        public string? EtapaFormulario { get; set; }
    }

    public class Com9ModeloGestionDocumentalResponse
    {
        public int CommgdEntId { get; set; }
        public int CompromisoId { get; set; }
        public int EntidadId { get; set; }
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
        public bool? CheckPrivacidad { get; set; }
        public bool? CheckDdjj { get; set; }
        public int? UsuarioRegistra { get; set; }
        public string? EtapaFormulario { get; set; }
        public string? Estado { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
