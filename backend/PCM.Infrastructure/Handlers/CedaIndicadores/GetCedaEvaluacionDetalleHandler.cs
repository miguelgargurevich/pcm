using MediatR;
using Microsoft.Extensions.Configuration;
using Npgsql;
using PCM.Application.Common;
using PCM.Application.Features.CedaIndicadores.Queries.GetCedaEvaluacionDetalle;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.CedaIndicadores
{
    /// <summary>
    /// Handler para obtener detalle de evaluación de un indicador CEDA
    /// </summary>
    public class GetCedaEvaluacionDetalleHandler : IRequestHandler<GetCedaEvaluacionDetalleQuery, Result<CedaEvaluacionDetalleResponse>>
    {
        private readonly string _connectionString;

        public GetCedaEvaluacionDetalleHandler(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<Result<CedaEvaluacionDetalleResponse>> Handle(GetCedaEvaluacionDetalleQuery request, CancellationToken cancellationToken)
        {
            try
            {
                await using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync(cancellationToken);

                // Obtener datos del indicador y evaluación
                var sqlIndicador = @"
                    SELECT 
                        i.indicador_id,
                        i.nombre_indicador,
                        i.descripcion_indicador,
                        e.eval_cab_id,
                        e.estado_indicador,
                        e.url_evidencia,
                        e.numero_resolucion,
                        e.fecha_resolucion
                    FROM ceda_indicadores i
                    LEFT JOIN ceda_evaluacion_cab e 
                        ON i.indicador_id = e.indicador_id 
                        AND e.compnda_ent_id = @compndaEntId
                    WHERE i.indicador_id = @indicadorId";

                CedaEvaluacionDetalleResponse response;

                await using (var command = new NpgsqlCommand(sqlIndicador, connection))
                {
                    command.Parameters.AddWithValue("@compndaEntId", request.CompndaEntId);
                    command.Parameters.AddWithValue("@indicadorId", request.IndicadorId);

                    await using var reader = await command.ExecuteReaderAsync(cancellationToken);
                    if (!await reader.ReadAsync(cancellationToken))
                    {
                        return Result<CedaEvaluacionDetalleResponse>.Failure("Indicador no encontrado");
                    }

                    response = new CedaEvaluacionDetalleResponse
                    {
                        IndicadorId = reader.GetInt64(0),
                        NombreIndicador = reader.GetString(1),
                        DescripcionIndicador = reader.IsDBNull(2) ? null : reader.GetString(2),
                        EvalCabId = reader.IsDBNull(3) ? null : reader.GetInt64(3),
                        EstadoIndicador = reader.IsDBNull(4) ? null : reader.GetString(4),
                        UrlEvidencia = reader.IsDBNull(5) ? null : reader.GetString(5),
                        NumeroResolucion = reader.IsDBNull(6) ? null : reader.GetString(6),
                        FechaResolucion = reader.IsDBNull(7) ? null : reader.GetDateTime(7)
                    };
                }

                // Obtener criterios con su estado
                var sqlCriterios = @"
                    SELECT 
                        c.criterio_id,
                        c.descripcion_criterio,
                        c.orden_visual,
                        COALESCE(d.cumple_criterio, false) as cumple_criterio
                    FROM ceda_criterios c
                    LEFT JOIN ceda_evaluacion_det d 
                        ON c.criterio_id = d.criterio_id 
                        AND d.eval_cab_id = @evalCabId
                    WHERE c.indicador_id = @indicadorId
                    ORDER BY c.orden_visual, c.criterio_id";

                var criterios = new List<CedaCriterioResponse>();

                await using (var command = new NpgsqlCommand(sqlCriterios, connection))
                {
                    command.Parameters.AddWithValue("@indicadorId", request.IndicadorId);
                    command.Parameters.AddWithValue("@evalCabId", (object?)response.EvalCabId ?? DBNull.Value);

                    await using var reader = await command.ExecuteReaderAsync(cancellationToken);
                    while (await reader.ReadAsync(cancellationToken))
                    {
                        criterios.Add(new CedaCriterioResponse
                        {
                            CriterioId = reader.GetInt64(0),
                            DescripcionCriterio = reader.GetString(1),
                            OrdenVisual = reader.IsDBNull(2) ? null : reader.GetInt32(2),
                            CumpleCriterio = reader.GetBoolean(3)
                        });
                    }
                }

                response.Criterios = criterios;

                return Result<CedaEvaluacionDetalleResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<CedaEvaluacionDetalleResponse>.Failure($"Error al obtener detalle de evaluación: {ex.Message}");
            }
        }
    }
}
