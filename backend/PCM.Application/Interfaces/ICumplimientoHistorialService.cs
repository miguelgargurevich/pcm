using PCM.Application.DTOs.CumplimientoHistorial;

namespace PCM.Application.Interfaces;

/// <summary>
/// Interfaz para el servicio de historial de cumplimiento.
/// Gestiona el registro y consulta de cambios de estado de compromisos.
/// </summary>
public interface ICumplimientoHistorialService
{
    /// <summary>
    /// Registra un cambio de estado en el historial.
    /// </summary>
    /// <param name="dto">Datos del cambio de estado</param>
    /// <returns>ID del historial creado</returns>
    Task<long> RegistrarCambioEstadoAsync(CreateCumplimientoHistorialDto dto);
    
    /// <summary>
    /// Registra un cambio de estado con snapshot automático de datos del compromiso.
    /// </summary>
    /// <param name="cumplimientoId">ID del cumplimiento</param>
    /// <param name="compromisoId">ID del compromiso (para obtener datos de tabla específica)</param>
    /// <param name="entidadId">ID de la entidad</param>
    /// <param name="estadoAnteriorId">Estado anterior (null si es nuevo)</param>
    /// <param name="estadoNuevoId">Nuevo estado</param>
    /// <param name="usuarioId">Usuario que realiza la acción</param>
    /// <param name="observacion">Observación del operador (opcional)</param>
    /// <param name="tipoAccion">Tipo de acción: ENVIO, APROBACION, OBSERVACION, CORRECCION</param>
    /// <param name="ipOrigen">IP de origen de la solicitud</param>
    /// <returns>ID del historial creado</returns>
    Task<long> RegistrarCambioConSnapshotAsync(
        long cumplimientoId,
        long compromisoId,
        Guid entidadId,
        int? estadoAnteriorId,
        int estadoNuevoId,
        Guid usuarioId,
        string? observacion,
        string tipoAccion,
        string? ipOrigen = null);
    
    /// <summary>
    /// Obtiene el historial de un cumplimiento específico.
    /// </summary>
    /// <param name="cumplimientoId">ID del cumplimiento</param>
    /// <returns>Lista de registros de historial</returns>
    Task<List<CumplimientoHistorialResponseDto>> ObtenerHistorialPorCumplimientoAsync(long cumplimientoId);
    
    /// <summary>
    /// Obtiene el historial de una entidad para todos sus compromisos.
    /// </summary>
    /// <param name="entidadId">ID de la entidad</param>
    /// <returns>Lista de registros de historial</returns>
    Task<List<CumplimientoHistorialResponseDto>> ObtenerHistorialPorEntidadAsync(Guid entidadId);
    
    /// <summary>
    /// Obtiene el historial filtrado y paginado.
    /// </summary>
    /// <param name="filtro">Filtros de búsqueda</param>
    /// <returns>Respuesta paginada con registros de historial</returns>
    Task<CumplimientoHistorialPaginatedResponseDto> ObtenerHistorialFiltradoAsync(CumplimientoHistorialFilterDto filtro);
    
    /// <summary>
    /// Obtiene un registro de historial específico por ID.
    /// </summary>
    /// <param name="historialId">ID del historial</param>
    /// <returns>Registro de historial o null</returns>
    Task<CumplimientoHistorialResponseDto?> ObtenerPorIdAsync(long historialId);
    
    /// <summary>
    /// Genera el snapshot de datos para un compromiso específico.
    /// </summary>
    /// <param name="compromisoId">ID del compromiso</param>
    /// <param name="entidadId">ID de la entidad</param>
    /// <param name="cumplimientoId">ID del cumplimiento</param>
    /// <param name="tipoAccion">Tipo de acción</param>
    /// <param name="ipOrigen">IP de origen</param>
    /// <returns>DTO con el snapshot de datos</returns>
    Task<DatosSnapshotDto> GenerarSnapshotAsync(
        long compromisoId, 
        Guid entidadId, 
        long cumplimientoId,
        string tipoAccion,
        string? ipOrigen = null);
    
    /// <summary>
    /// Registra un cambio de estado cuando una entidad envía un formulario.
    /// Automáticamente busca o crea el registro de cumplimiento.
    /// </summary>
    /// <param name="compromisoId">ID del compromiso</param>
    /// <param name="entidadId">ID de la entidad</param>
    /// <param name="estadoAnterior">Estado anterior en texto (ej: "en_proceso")</param>
    /// <param name="estadoNuevo">Nuevo estado en texto (ej: "enviado")</param>
    /// <param name="usuarioId">Usuario que realiza la acción</param>
    /// <param name="observacion">Observación opcional</param>
    /// <param name="tipoAccion">Tipo de acción: ENVIO, BORRADOR, CORRECCION</param>
    /// <param name="ipOrigen">IP de origen</param>
    /// <returns>ID del historial creado, 0 si no se creó</returns>
    Task<long> RegistrarCambioDesdeFormularioAsync(
        long compromisoId,
        Guid entidadId,
        string? estadoAnterior,
        string estadoNuevo,
        Guid usuarioId,
        string? observacion = null,
        string tipoAccion = "ENVIO",
        string? ipOrigen = null);
}
