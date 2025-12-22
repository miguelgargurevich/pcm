using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com10DatosAbiertos.Commands.CreateCom10DatosAbiertos;
using PCM.Application.Features.Com10DatosAbiertos.Commands.UpdateCom10DatosAbiertos;
using PCM.Application.Features.Com10DatosAbiertos.Queries.GetCom10DatosAbiertos;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PCM.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class Com10DatosAbiertosController : ControllerBase
    {
        private readonly IMediator _mediator;

        public Com10DatosAbiertosController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{compromisoId}/entidad/{entidadId}")]
        public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
        {
            var query = new GetCom10DatosAbiertosQuery
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
        public async Task<IActionResult> Create([FromBody] CreateCom10DatosAbiertosCommand command)
        {
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCom10DatosAbiertosCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }
            
            command.ComdaEntId = id;
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
