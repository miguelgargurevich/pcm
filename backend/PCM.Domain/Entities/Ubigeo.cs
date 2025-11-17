using System;
using System.Collections.Generic;

namespace PCM.Domain.Entities;

public class Ubigeo
{
    public Guid UbigeoId { get; set; }
    
    // Códigos INEI
    public string? UBDEP { get; set; } // Código departamento (2 dígitos)
    public string? UBPRV { get; set; } // Código provincia (4 dígitos)
    public string? UBDIS { get; set; } // Código distrito (6 dígitos)
    public string? UBLOC { get; set; } // Código localidad
    
    // Códigos adicionales
    public string? COREG { get; set; } // Código región
    
    // Nombres
    public string NODEP { get; set; } = string.Empty; // Nombre departamento
    public string NOPRV { get; set; } = string.Empty; // Nombre provincia
    public string NODIS { get; set; } = string.Empty; // Nombre distrito
    
    // Código postal
    public string? CPDIS { get; set; } // Código postal distrito
    
    // Estados
    public string? STUBI { get; set; } // Estado ubigeo
    public string? STSOB { get; set; } // Estado sobre
    
    // Información adicional
    public string? FERES { get; set; } // Fecha resolución
    public string? INUBI { get; set; } // Información ubigeo
    public string? UB_INEI { get; set; } // Código ubigeo INEI
    public string? CCOD_TIPO_UBI { get; set; } // Tipo ubigeo
    
    // Campos para compatibilidad (calculados o mapeados)
    public string Codigo => UBDIS ?? string.Empty; // Código completo (6 dígitos)
    public string Departamento => NODEP; // Nombre departamento
    public string Provincia => NOPRV; // Nombre provincia
    public string Distrito => NODIS; // Nombre distrito
    
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Entidad> Entidades { get; set; } = new List<Entidad>();
}
