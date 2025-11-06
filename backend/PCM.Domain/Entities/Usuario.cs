using System;

namespace PCM.Domain.Entities;

public class Usuario
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string NumDni { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApePaterno { get; set; } = string.Empty;
    public string ApeMaterno { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public Guid? EntidadId { get; set; }
    public bool Activo { get; set; } = true;
    public int PerfilId { get; set; }
    public DateTime? LastLogin { get; set; }
    public string? ResetPasswordToken { get; set; }
    public DateTime? ResetPasswordExpiry { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Entidad? Entidad { get; set; }
    public virtual Perfil Perfil { get; set; } = null!;
}
