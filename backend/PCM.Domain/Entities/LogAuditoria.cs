using System;

namespace PCM.Domain.Entities;

public class LogAuditoria
{
    public int LogId { get; set; }
    public int EntidadId { get; set; }
    public int? CompromisoId { get; set; }
    public int UsuarioId { get; set; }
    public string Accion { get; set; } = string.Empty;
    public string? TablaAfectada { get; set; }
    public int? RegistroId { get; set; }
    public string? Detalle { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Entidad Entidad { get; set; } = null!;
    public virtual Usuario Usuario { get; set; } = null!;
}
