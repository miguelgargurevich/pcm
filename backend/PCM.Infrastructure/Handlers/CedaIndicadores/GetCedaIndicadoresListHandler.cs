using MediatR;
using Microsoft.Extensions.Configuration;
using Npgsql;
using PCM.Application.Common;
using PCM.Application.Features.CedaIndicadores.Queries.GetCedaIndicadoresList;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.CedaIndicadores
{
    /// <summary>
    /// Handler para obtener lista de indicadores CEDA con su estado
    /// </summary>
    public class GetCedaIndicadoresListHandler : IRequestHandler<GetCedaIndicadoresListQuery, Result<List<CedaIndicadorResponse>>>
    {
        private readonly string _connectionString;

        public GetCedaIndicadoresListHandler(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<Result<List<CedaIndicadorResponse>>> Handle(GetCedaIndicadoresListQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var indicadores = new List<CedaIndicadorResponse>();

                await using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync(cancellationToken);

                var sql = @"
                    SELECT 
                        i.indicador_id,
                        i.numero_orden,
                        i.nombre_indicador,
                        i.descripcion_indicador,
                        e.eval_cab_id,
                        e.estado_indicador
                    FROM ceda_indicadores i
                    LEFT JOIN ceda_evaluacion_cab e 
                        ON i.indicador_id = e.indicador_id 
                        AND e.compnda_ent_id = @compndaEntId
                    ORDER BY i.numero_orden";

                await using var command = new NpgsqlCommand(sql, connection);
                command.Parameters.AddWithValue("@compndaEntId", request.CompndaEntId);

                await using var reader = await command.ExecuteReaderAsync(cancellationToken);
                while (await reader.ReadAsync(cancellationToken))
                {
                    indicadores.Add(new CedaIndicadorResponse
                    {
                        IndicadorId = reader.GetInt64(0),
                        NumeroOrden = reader.GetInt32(1),
                        NombreIndicador = reader.GetString(2),
                        DescripcionIndicador = reader.IsDBNull(3) ? null : reader.GetString(3),
                        EvalCabId = reader.IsDBNull(4) ? null : reader.GetInt64(4),
                        EstadoIndicador = reader.IsDBNull(5) ? null : reader.GetString(5)
                    });
                }

                return Result<List<CedaIndicadorResponse>>.Success(indicadores);
            }
            catch (Exception ex)
            {
                return Result<List<CedaIndicadorResponse>>.Failure($"Error al obtener indicadores CEDA: {ex.Message}");
            }
        }
    }
}
