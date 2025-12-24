using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.CedaIndicadores.Commands.SaveCedaEvaluacion;
using PCM.Application.Features.CedaIndicadores.Queries.GetCedaEvaluacionDetalle;
using PCM.Application.Features.CedaIndicadores.Queries.GetCedaIndicadoresList;
using System.Threading.Tasks;

namespace PCM.API.Controllers
{
    /// <summary>
    /// Controlador para Indicadores CEDA del Compromiso 10
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class Com10IndicadoresCEDAController : ControllerBase
    {
        private readonly IMediator _mediator;

        public Com10IndicadoresCEDAController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Obtener lista de indicadores CEDA con su estado de evaluación
        /// </summary>
        /// <param name="compndaEntId">ID del registro com10_pnda</param>
        [HttpGet("list/{compndaEntId}")]
        public async Task<IActionResult> GetList(long compndaEntId)
        {
            var query = new GetCedaIndicadoresListQuery
            {
                CompndaEntId = compndaEntId
            };

            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Obtener detalle de evaluación de un indicador CEDA
        /// </summary>
        /// <param name="compndaEntId">ID del registro com10_pnda</param>
        /// <param name="indicadorId">ID del indicador</param>
        [HttpGet("detalle/{compndaEntId}/{indicadorId}")]
        public async Task<IActionResult> GetDetalle(long compndaEntId, long indicadorId)
        {
            var query = new GetCedaEvaluacionDetalleQuery
            {
                CompndaEntId = compndaEntId,
                IndicadorId = indicadorId
            };

            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Guardar o actualizar evaluación de un indicador CEDA
        /// </summary>
        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] SaveCedaEvaluacionCommand command)
        {
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
