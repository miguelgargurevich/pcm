using MediatR;
using Microsoft.Extensions.Configuration;
using Npgsql;
using PCM.Application.Common;
using PCM.Application.Features.CedaIndicadores.Commands.SaveCedaEvaluacion;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PCM.Infrastructure.Handlers.CedaIndicadores
{
    /// <summary>
    /// Handler para guardar/actualizar evaluación de un indicador CEDA
    /// </summary>
    public class SaveCedaEvaluacionHandler : IRequestHandler<SaveCedaEvaluacionCommand, Result<SaveCedaEvaluacionResponse>>
    {
        private readonly string _connectionString;

        public SaveCedaEvaluacionHandler(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<Result<SaveCedaEvaluacionResponse>> Handle(SaveCedaEvaluacionCommand request, CancellationToken cancellationToken)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync(cancellationToken);

            await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

            try
            {
                long evalCabId;

                // 1. Insertar o actualizar cabecera
                if (request.EvalCabId == null || request.EvalCabId == 0)
                {
                    // Insertar nueva evaluación
                    var sqlInsert = @"
                        INSERT INTO ceda_evaluacion_cab 
                        (compnda_ent_id, indicador_id, estado_indicador, url_evidencia, numero_resolucion, fecha_resolucion, created_at)
                        VALUES 
                        (@compndaEntId, @indicadorId, @estadoIndicador, @urlEvidencia, @numeroResolucion, @fechaResolucion, @createdAt)
                        RETURNING eval_cab_id";

                    await using var cmdInsert = new NpgsqlCommand(sqlInsert, connection, transaction);
                    cmdInsert.Parameters.AddWithValue("@compndaEntId", request.CompndaEntId);
                    cmdInsert.Parameters.AddWithValue("@indicadorId", request.IndicadorId);
                    cmdInsert.Parameters.AddWithValue("@estadoIndicador", (object?)request.EstadoIndicador ?? DBNull.Value);
                    cmdInsert.Parameters.AddWithValue("@urlEvidencia", (object?)request.UrlEvidencia ?? DBNull.Value);
                    cmdInsert.Parameters.AddWithValue("@numeroResolucion", (object?)request.NumeroResolucion ?? DBNull.Value);
                    cmdInsert.Parameters.AddWithValue("@fechaResolucion", (object?)request.FechaResolucion ?? DBNull.Value);
                    cmdInsert.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);

                    evalCabId = (long)(await cmdInsert.ExecuteScalarAsync(cancellationToken) ?? 0);
                }
                else
                {
                    // Actualizar evaluación existente
                    evalCabId = request.EvalCabId.Value;

                    var sqlUpdate = @"
                        UPDATE ceda_evaluacion_cab 
                        SET estado_indicador = @estadoIndicador,
                            url_evidencia = @urlEvidencia,
                            numero_resolucion = @numeroResolucion,
                            fecha_resolucion = @fechaResolucion,
                            updated_at = @updatedAt
                        WHERE eval_cab_id = @evalCabId";

                    await using var cmdUpdate = new NpgsqlCommand(sqlUpdate, connection, transaction);
                    cmdUpdate.Parameters.AddWithValue("@evalCabId", evalCabId);
                    cmdUpdate.Parameters.AddWithValue("@estadoIndicador", (object?)request.EstadoIndicador ?? DBNull.Value);
                    cmdUpdate.Parameters.AddWithValue("@urlEvidencia", (object?)request.UrlEvidencia ?? DBNull.Value);
                    cmdUpdate.Parameters.AddWithValue("@numeroResolucion", (object?)request.NumeroResolucion ?? DBNull.Value);
                    cmdUpdate.Parameters.AddWithValue("@fechaResolucion", (object?)request.FechaResolucion ?? DBNull.Value);
                    cmdUpdate.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);

                    await cmdUpdate.ExecuteNonQueryAsync(cancellationToken);

                    // Eliminar detalles anteriores
                    var sqlDelete = "DELETE FROM ceda_evaluacion_det WHERE eval_cab_id = @evalCabId";
                    await using var cmdDelete = new NpgsqlCommand(sqlDelete, connection, transaction);
                    cmdDelete.Parameters.AddWithValue("@evalCabId", evalCabId);
                    await cmdDelete.ExecuteNonQueryAsync(cancellationToken);
                }

                // 2. Insertar detalles (criterios)
                foreach (var criterio in request.Criterios)
                {
                    var sqlDetalle = @"
                        INSERT INTO ceda_evaluacion_det 
                        (eval_cab_id, criterio_id, cumple_criterio)
                        VALUES 
                        (@evalCabId, @criterioId, @cumpleCriterio)";

                    await using var cmdDetalle = new NpgsqlCommand(sqlDetalle, connection, transaction);
                    cmdDetalle.Parameters.AddWithValue("@evalCabId", evalCabId);
                    cmdDetalle.Parameters.AddWithValue("@criterioId", criterio.CriterioId);
                    cmdDetalle.Parameters.AddWithValue("@cumpleCriterio", criterio.CumpleCriterio);

                    await cmdDetalle.ExecuteNonQueryAsync(cancellationToken);
                }

                await transaction.CommitAsync(cancellationToken);

                return Result<SaveCedaEvaluacionResponse>.Success(new SaveCedaEvaluacionResponse
                {
                    EvalCabId = evalCabId,
                    Message = request.EvalCabId == null ? "Evaluación creada exitosamente" : "Evaluación actualizada exitosamente"
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return Result<SaveCedaEvaluacionResponse>.Failure($"Error al guardar evaluación: {ex.Message}");
            }
        }
    }
}
