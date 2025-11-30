using System;
using System.Text.Json.Serialization;

namespace PCM.Application.DTOs.CumplimientoNormativo;

// ============================================
// REQUEST DTOs (adaptados a estructura Supabase)
// ============================================

public class CreateCumplimientoRequest
{
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public int EstadoId { get; set; } = 1; // 1=pendiente, 2=en_proceso, 3=completado
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
}

public class UpdateCumplimientoRequest
{
    public long CumplimientoId { get; set; }
    public int EstadoId { get; set; }
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
}

// ============================================
// RESPONSE DTOs
// ============================================

public class CumplimientoResponseDto
{
    public long CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }
    public int EstadoId { get; set; }
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
    
    // Datos del Compromiso (para mostrar en listado)
    public string? NombreCompromiso { get; set; }
    
    // Datos de la Entidad (para mostrar en listado)
    public string? NombreEntidad { get; set; }
    
    // Estado descriptivo
    public string? EstadoNombre { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// DTO simplificado para listado
public class CumplimientoListItemDto
{
    public long CumplimientoId { get; set; }
    public long CompromisoId { get; set; }
    public string NombreCompromiso { get; set; } = string.Empty;
    public Guid EntidadId { get; set; }
    public string NombreEntidad { get; set; } = string.Empty;
    public int EstadoId { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public Guid? OperadorId { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public string? ObservacionPcm { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
