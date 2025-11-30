using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.CompromisoGobiernoDigital;
using PCM.Application.Features.CompromisosGobiernoDigital.Queries.GetAllCompromisos;
using PCM.Domain.Entities;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.CompromisosGobiernoDigital;

public class GetAllCompromisosHandler : IRequestHandler<GetAllCompromisosQuery, Result<List<CompromisoResponseDto>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetAllCompromisosHandler> _logger;

    public GetAllCompromisosHandler(PCMDbContext context, ILogger<GetAllCompromisosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CompromisoResponseDto>>> Handle(GetAllCompromisosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Obtener la clasificación y entidadId del usuario (si está autenticado)
            // NOTA: Entidad.ClasificacionId apunta a subclasificacion_id en la BD
            // Necesitamos obtener el clasificacion_id padre de la subclasificación
            long? userClasificacionId = null;
            Guid? userEntidadId = null;
            if (request.UserId.HasValue)
            {
                var usuario = await _context.Usuarios
                    .Include(u => u.Entidad)
                        .ThenInclude(e => e!.Clasificacion) // Clasificacion es realmente Subclasificacion
                    .FirstOrDefaultAsync(u => u.UserId == request.UserId.Value, cancellationToken);
                
                if (usuario?.Entidad != null)
                {
                    // Entidad.ClasificacionId es subclasificacion_id
                    // Entidad.Clasificacion es la Subclasificacion
                    // Subclasificacion.ClasificacionId es el ID de la clasificación padre
                    userClasificacionId = usuario.Entidad?.Clasificacion?.ClasificacionId;
                    userEntidadId = usuario.Entidad?.EntidadId;
                }
            }

            var query = _context.CompromisosGobiernoDigital
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.TipoNorma)
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.NivelGobierno)
                .Include(c => c.Normativas)
                    .ThenInclude(n => n.Norma)
                        .ThenInclude(norma => norma.Sector)
                .Include(c => c.CriteriosEvaluacion)
                .Include(c => c.AlcancesCompromisos)
                    .ThenInclude(ac => ac.Clasificacion) // Clasificacion es Subclasificacion
                        .ThenInclude(s => s!.Clasificacion) // Cargar Clasificacion padre
                .AsQueryable();

            // Filtrar por clasificación de la entidad del usuario
            if (userClasificacionId.HasValue)
            {
                query = query.Where(c => c.AlcancesCompromisos.Any(ac => ac.ClasificacionId == userClasificacionId.Value && ac.Activo));
            }

            // Apply filters
            if (!string.IsNullOrEmpty(request.Nombre))
            {
                query = query.Where(c => EF.Functions.ILike(c.NombreCompromiso, $"%{request.Nombre}%"));
            }

            if (!string.IsNullOrEmpty(request.Alcance))
            {
                query = query.Where(c => EF.Functions.ILike(c.Alcances, $"%{request.Alcance}%"));
            }

            if (request.Estado.HasValue)
            {
                query = query.Where(c => c.Estado == request.Estado.Value);
            }
            
            // Only show active records
            query = query.Where(c => c.Activo);

            var compromisos = await query
                .OrderBy(c => c.CompromisoId)
                .ToListAsync(cancellationToken);

            // Obtener cumplimientos de la entidad del usuario
            var cumplimientosPorCompromiso = new Dictionary<long, PCM.Domain.Entities.CumplimientoNormativo>();
            if (userEntidadId.HasValue)
            {
                var cumplimientos = await _context.CumplimientosNormativos
                    .Where(cn => cn.EntidadId == userEntidadId.Value)
                    .ToListAsync(cancellationToken);
                
                cumplimientosPorCompromiso = cumplimientos.ToDictionary(c => c.CompromisoId);
            }

            // Obtener registros de tablas específicas (paso 1) para Com1, Com2, Com4-21
            var registrosEspecificos = new Dictionary<long, (DateTime fecha, string? estado)>();
            if (userEntidadId.HasValue)
            {
                // Com1: Líder GTD
                var com1 = await _context.Com1LiderGTD
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com1 != null)
                {
                    registrosEspecificos[1] = (com1.CreatedAt, com1.EstadoPCM);
                }

                // Com2: Comité GTD
                var com2 = await _context.Com2CGTD
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com2 != null)
                {
                    registrosEspecificos[2] = (com2.CreatedAt, com2.EstadoPcm);
                }

                // Com4: PEI
                var com4 = await _context.Com4PEI
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com4 != null)
                {
                    registrosEspecificos[4] = (com4.CreatedAt, com4.EstadoPCM);
                }

                // Com5: Estrategia Digital
                var com5 = await _context.Com5EstrategiaDigital
                    .Where(c => c.EntidadId == userEntidadId.Value && c.Activo)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                if (com5 != null)
                {
                    registrosEspecificos[5] = (com5.CreatedAt, com5.EstadoPCM);
                }

                // TODO: Agregar Com6-Com21 cuando estén listos
            }

            var response = compromisos.Select(c => MapToResponseDto(c, cumplimientosPorCompromiso, registrosEspecificos)).ToList();

            _logger.LogInformation("Retrieved {Count} compromisos", response.Count);
            return Result<List<CompromisoResponseDto>>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compromisos");
            return Result<List<CompromisoResponseDto>>.Failure($"Error al obtener compromisos: {ex.Message}");
        }
    }

    private CompromisoResponseDto MapToResponseDto(
        CompromisoGobiernoDigital compromiso, 
        Dictionary<long, PCM.Domain.Entities.CumplimientoNormativo> cumplimientosPorCompromiso,
        Dictionary<long, (DateTime fecha, string? estado)> registrosEspecificos)
    {
        // Obtener cumplimiento de este compromiso si existe
        cumplimientosPorCompromiso.TryGetValue(compromiso.CompromisoId, out var cumplimiento);
        
        // Obtener registro específico si existe (tabla específica paso 1)
        registrosEspecificos.TryGetValue(compromiso.CompromisoId, out var registroEspecifico);
        
        // Priorizar datos de registro específico si existe, sino usar cumplimiento genérico
        DateTime? fechaRegistro = registroEspecifico.fecha != default ? registroEspecifico.fecha : cumplimiento?.CreatedAt;
        int? estadoCumplimiento = null;
        
        // Convertir estado string a int si existe registro específico
        if (!string.IsNullOrEmpty(registroEspecifico.estado))
        {
            estadoCumplimiento = registroEspecifico.estado switch
            {
                "bandeja" => 1,
                "sin_reportar" => 2,
                "publicado" => 3,
                _ => cumplimiento?.EstadoId
            };
        }
        else if (cumplimiento != null)
        {
            estadoCumplimiento = cumplimiento.EstadoId;
        }
        
        return new CompromisoResponseDto
        {
            CompromisoId = compromiso.CompromisoId,
            NombreCompromiso = compromiso.NombreCompromiso,
            Descripcion = compromiso.Descripcion,
            Alcances = compromiso.AlcancesCompromisos?
                .Where(ac => ac.Activo)
                .Select(ac => ac.Clasificacion?.Clasificacion?.Nombre ?? ac.Clasificacion?.Nombre ?? string.Empty) // Mostrar nombre de clasificación padre o subclasificación
                .Where(nombre => !string.IsNullOrEmpty(nombre))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList() ?? new List<string>(),
            FechaInicio = compromiso.FechaInicio,
            FechaFin = compromiso.FechaFin,
            Estado = compromiso.Estado,
            Activo = compromiso.Activo,
            CreatedAt = compromiso.CreatedAt,
            UpdatedAt = compromiso.UpdatedAt,
            FechaRegistroCumplimiento = fechaRegistro,
            EstadoCumplimiento = estadoCumplimiento,
            Normativas = compromiso.Normativas?.Select(n => new CompromisoNormativaResponseDto
            {
                CompromisoNormativaId = n.CompromisoNormativaId,
                CompromisoId = n.CompromisoId,
                NormaId = n.NormaId,
                NombreNorma = n.Norma?.NombreNorma ?? string.Empty,
                Numero = n.Norma?.Numero ?? string.Empty,
                TipoNormaId = n.Norma?.TipoNormaId,
                TipoNorma = n.Norma?.TipoNorma?.Nombre ?? string.Empty,
                NivelGobierno = n.Norma?.NivelGobierno?.Nombre ?? string.Empty,
                Sector = n.Norma?.Sector?.Nombre ?? string.Empty,
                FechaPublicacion = n.Norma?.FechaPublicacion,
                CreatedAt = n.CreatedAt
            }).ToList() ?? new List<CompromisoNormativaResponseDto>(),
            CriteriosEvaluacion = compromiso.CriteriosEvaluacion?.Select(c => new CriterioEvaluacionResponseDto
            {
                CriterioEvaluacionId = c.CriterioEvaluacionId,
                CompromisoId = c.CompromisoId,
                Descripcion = c.Descripcion,
                Estado = c.IdEstado,
                Activo = c.Activo,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList() ?? new List<CriterioEvaluacionResponseDto>()
        };
    }
}
