using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Features.Com4PEI.Commands.CreateCom4PEI;
using PCM.Application.Features.Com4PEI.Commands.UpdateCom4PEI;
using PCM.Application.Features.Com4PEI.Queries.GetCom4PEI;
using System.Security.Claims;

namespace PCM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class Com4PEIController : ControllerBase
    {
        private readonly IMediator _mediator;

        public Com4PEIController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{compromisoId}/entidad/{entidadId}")]
        public async Task<IActionResult> GetByEntidad(long compromisoId, Guid entidadId)
        {
            var query = new GetCom4PEIQuery
            {
                CompromisoId = compromisoId,
                EntidadId = entidadId
            };

            var result = await _mediator.Send(query);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            if (result.Data == null)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCom4PEICommand command)
        {
            // Obtener entidad_id del claim del JWT
            var entidadIdClaim = User.FindFirst("entidad_id")?.Value;
            if (string.IsNullOrEmpty(entidadIdClaim) || !Guid.TryParse(entidadIdClaim, out var entidadId))
            {
                return Unauthorized(new { success = false, message = "Token inválido o sin entidad_id" });
            }

            // Obtener user_id del claim del JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { success = false, message = "Token inválido o sin user_id" });
            }

            command.EntidadId = entidadId;
            command.UsuarioRegistra = userId;

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCom4PEICommand command)
        {
            command.CompeiEntId = id;

            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
