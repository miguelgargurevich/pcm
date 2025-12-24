using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com10DatosAbiertos.Queries.GetAllCom10DatosAbiertos;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com10DatosAbiertos;

public class GetAllCom10DatosAbiertosHandler : IRequestHandler<GetAllCom10DatosAbiertosQuery, Result<List<Com10DatosAbiertosDto>>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetAllCom10DatosAbiertosHandler> _logger;

    public GetAllCom10DatosAbiertosHandler(PCMDbContext context, ILogger<GetAllCom10DatosAbiertosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<Com10DatosAbiertosDto>>> Handle(GetAllCom10DatosAbiertosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("🔍 Obteniendo todos los registros de Com10 Datos Abiertos");

            var com10Data = await _context.Com10DatosAbiertos
                .Where(c => c.Activo)
                .Select(c => new
                {
                    c.ComdaEntId,
                    c.CompromisoId,
                    c.EntidadId,
                    c.Estado,
                    c.EstadoPCM,
                    c.UrlDatosAbiertos,
                    c.TotalDatasets,
                    c.FechaUltimaActualizacionDa,
                    c.ResponsableDa,
                    c.CargoResponsableDa,
                    c.CorreoResponsableDa,
                    c.TelefonoResponsableDa,
                    c.NumeroNormaResolucionDa,
                    c.FechaAprobacionDa,
                    c.RutaPdfDa,
                    c.RutaPdfNormativa,
                    c.FecRegistro
                })
                .ToListAsync(cancellationToken);

            _logger.LogInformation($"✅ Se encontraron {com10Data.Count} registros Com10");

            // Cargar entidades para obtener nombres
            var entidadIds = com10Data.Select(c => c.EntidadId).Distinct().ToList();
            var entidades = await _context.Entidades
                .Where(e => entidadIds.Contains(e.EntidadId))
                .Select(e => new { e.EntidadId, e.Nombre, e.Ruc })
                .ToListAsync(cancellationToken);

            _logger.LogInformation($"👥 Se cargaron {entidades.Count} entidades");

            var result = com10Data.Select(c =>
            {
                var entidad = entidades.FirstOrDefault(e => e.EntidadId == c.EntidadId);
                return new Com10DatosAbiertosDto
                {
                    ComdaEntId = c.ComdaEntId,
                    CompromisoId = c.CompromisoId,
                    EntidadId = c.EntidadId,
                    EntidadNombre = entidad?.Nombre ?? "Sin nombre",
                    EntidadRuc = entidad?.Ruc ?? "",
                    Estado = c.Estado,
                    EstadoPCM = c.EstadoPCM,
                    UrlDatosAbiertos = c.UrlDatosAbiertos,
                    TotalDatasets = c.TotalDatasets ?? 0,
                    FechaUltimaActualizacionDa = c.FechaUltimaActualizacionDa,
                    ResponsableDa = c.ResponsableDa,
                    CargoResponsableDa = c.CargoResponsableDa,
                    CorreoResponsableDa = c.CorreoResponsableDa,
                    TelefonoResponsableDa = c.TelefonoResponsableDa,
                    NumeroNormaResolucionDa = c.NumeroNormaResolucionDa,
                    FechaAprobacionDa = c.FechaAprobacionDa,
                    TieneResponsable = !string.IsNullOrEmpty(c.ResponsableDa),
                    TieneUrlPnda = !string.IsNullOrEmpty(c.UrlDatosAbiertos),
                    TieneNormaAprobacion = !string.IsNullOrEmpty(c.NumeroNormaResolucionDa),
                    TienePdfEvidencia = !string.IsNullOrEmpty(c.RutaPdfDa) || !string.IsNullOrEmpty(c.RutaPdfNormativa),
                    FecRegistro = c.FecRegistro
                };
            }).ToList();

            _logger.LogInformation($"📊 Retornando {result.Count} registros procesados");

            return Result<List<Com10DatosAbiertosDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al obtener todos los Com10 Datos Abiertos");
            return Result<List<Com10DatosAbiertosDto>>.Failure($"Error al obtener datos: {ex.Message}");
        }
    }
}
