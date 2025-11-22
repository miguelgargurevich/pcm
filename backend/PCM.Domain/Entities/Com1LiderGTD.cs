using System;

namespace PCM.Domain.Entities;

/// <summary>
/// Entidad para el Compromiso 1: Designar al Líder de Gobierno y Transformación Digital
/// </summary>
public class Com1LiderGTD
{
    public long ComlgtdEntId { get; set; }
    public int CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public string EtapaFormulario { get; set; } = string.Empty; // paso1, paso2, paso3, completado
    public string Estado { get; set; } = string.Empty; // bandeja, sin_reportar, publicado
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPCM { get; set; } = string.Empty; // en_revision, validado, observado
    public string ObservacionesPCM { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }
    public bool Activo { get; set; }
    
    // Datos del Líder
    public string DniLider { get; set; } = string.Empty;
    public string NombreLider { get; set; } = string.Empty;
    public string ApePatLider { get; set; } = string.Empty;
    public string ApeMatLider { get; set; } = string.Empty;
    public string EmailLider { get; set; } = string.Empty;
    public string TelefonoLider { get; set; } = string.Empty;
    public string RolLider { get; set; } = string.Empty;
    public string CargoLider { get; set; } = string.Empty;
    public DateTime FecIniLider { get; set; }
    
    // Navegación
    public virtual CompromisoGobiernoDigital? Compromiso { get; set; }
    public virtual Entidad? Entidad { get; set; }
}
