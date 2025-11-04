using System;

namespace PCM.Domain.Entities;

public class Usuario
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string NumDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApePaterno { get; set; } = string.Empty;
    public string ApeMaterno { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public int EntidadId { get; set; }
    public bool Activo { get; set; } = true;
    public int PerfilId { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Entidad Entidad { get; set; } = null!;
    public virtual Perfil Perfil { get; set; } = null!;
}
