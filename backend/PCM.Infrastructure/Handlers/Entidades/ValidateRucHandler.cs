using MediatR;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Queries.ValidateRuc;

namespace PCM.Infrastructure.Handlers.Entidades;

public class ValidateRucHandler : IRequestHandler<ValidateRucQuery, Result<RucValidationResultDto>>
{
    public async Task<Result<RucValidationResultDto>> Handle(ValidateRucQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // TODO: Implementar integración con API de SUNAT
            // Por ahora, solo validamos el formato básico del RUC

            if (string.IsNullOrWhiteSpace(request.Ruc))
            {
                return Result<RucValidationResultDto>.Failure("El RUC no puede estar vacío");
            }

            if (request.Ruc.Length != 11)
            {
                return Result<RucValidationResultDto>.Failure("El RUC debe tener 11 dígitos");
            }

            if (!request.Ruc.All(char.IsDigit))
            {
                return Result<RucValidationResultDto>.Failure("El RUC solo debe contener números");
            }

            // Simulación de validación (reemplazar con API real de SUNAT)
            await Task.CompletedTask;

            var result = new RucValidationResultDto
            {
                IsValid = true,
                RazonSocial = "Validación con SUNAT pendiente de implementar",
                Direccion = "-",
                Estado = "Pendiente",
                Message = "Validación básica de formato exitosa. Integración con SUNAT pendiente."
            };

            return Result<RucValidationResultDto>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<RucValidationResultDto>.Failure(
                "Error al validar RUC",
                new List<string> { ex.Message }
            );
        }
    }
}
