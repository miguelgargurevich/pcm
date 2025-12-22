using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.CreateCom9ModeloGestionDocumental;
using PCM.Application.Features.Com9ModeloGestionDocumental.Commands.UpdateCom9ModeloGestionDocumental;
using PCM.Application.Features.Com9ModeloGestionDocumental.Queries.GetCom9ModeloGestionDocumental;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PCM.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class Com9ModeloGestionDocumentalController : ControllerBase
    {
        private readonly IMediator _mediator;

        public Com9ModeloGestionDocumentalController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{compromisoId}/entidad/{entidadId}")]
        public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
        {
            var query = new GetCom9ModeloGestionDocumentalQuery
            {
                CompromisoId = compromisoId,
                EntidadId = entidadId
            };

            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCom9ModeloGestionDocumentalCommand command)
        {
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCom9ModeloGestionDocumentalCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }
            
            command.CommgdEntId = id;
            command.UserId = userId;
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
