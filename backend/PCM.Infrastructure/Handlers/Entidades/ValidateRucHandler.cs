using MediatR;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.DTOs.Entidad;
using PCM.Application.Features.Entidades.Queries.ValidateRuc;
using PCM.Application.Interfaces;

namespace PCM.Infrastructure.Handlers.Entidades;

public class ValidateRucHandler : IRequestHandler<ValidateRucQuery, Result<RucValidationResultDto>>
{
    private readonly ISunatService _sunatService;
    private readonly ILogger<ValidateRucHandler> _logger;

    public ValidateRucHandler(ISunatService sunatService, ILogger<ValidateRucHandler> logger)
    {
        _sunatService = sunatService;
        _logger = logger;
    }

    public async Task<Result<RucValidationResultDto>> Handle(ValidateRucQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Validando RUC: {Ruc}", request.Ruc);

            // Validación básica de formato
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

            // Consultar SUNAT
            var result = await _sunatService.ConsultarRucAsync(request.Ruc);
            
            _logger.LogInformation("Resultado validación RUC {Ruc}: {IsValid} - {RazonSocial}", 
                request.Ruc, result.IsValid, result.RazonSocial);

            return Result<RucValidationResultDto>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al validar RUC {Ruc}", request.Ruc);
            return Result<RucValidationResultDto>.Failure(
                "Error al validar RUC",
                new List<string> { ex.Message }
            );
        }
    }
}
