using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Features.Com20DigitalizacionServiciosFacilita.Queries.GetCom20DigitalizacionServiciosFacilita;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com20DigitalizacionServiciosFacilita;

public class GetCom20DigitalizacionServiciosFacilitaHandler : IRequestHandler<GetCom20DigitalizacionServiciosFacilitaQuery, Result<Com20DigitalizacionServiciosFacilitaResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom20DigitalizacionServiciosFacilitaHandler> _logger;

    public GetCom20DigitalizacionServiciosFacilitaHandler(PCMDbContext context, ILogger<GetCom20DigitalizacionServiciosFacilitaHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com20DigitalizacionServiciosFacilitaResponse>> Handle(GetCom20DigitalizacionServiciosFacilitaQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Obteniendo Com20DigitalizacionServiciosFacilita para Compromiso {CompromisoId}, Entidad {EntidadId}", 
                request.CompromisoId, request.EntidadId);

            var entity = await _context.Com20DigitalizacionServiciosFacilita
                .FirstOrDefaultAsync(x => x.CompromisoId == request.CompromisoId && x.EntidadId == request.EntidadId, cancellationToken);

            if (entity == null)
            {
                return Result<Com20DigitalizacionServiciosFacilitaResponse>.Failure("Registro no encontrado");
            }

            var response = new Com20DigitalizacionServiciosFacilitaResponse
            {
                ComdsfpeEntId = entity.ComdsfpeEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPCM = entity.EstadoPCM,
                ObservacionesPCM = entity.ObservacionesPCM,
                UsuarioRegistra = entity.UsuarioRegistra,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                Activo = entity.Activo,
                SistemasDocumentados = entity.SistemasDocumentados,
                SistemasTotal = entity.SistemasTotal,
                PorcentajeDocumentacion = entity.PorcentajeDocumentacion,
                ArchivoRepositorio = entity.ArchivoRepositorio,
                Descripcion = entity.Descripcion,
            };

            return Result<Com20DigitalizacionServiciosFacilitaResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com20DigitalizacionServiciosFacilita");
            return Result<Com20DigitalizacionServiciosFacilitaResponse>.Failure($"Error al obtener registro: {ex.Message}");
        }
    }
}
