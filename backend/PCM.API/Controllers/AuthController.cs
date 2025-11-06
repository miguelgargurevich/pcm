using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.DTOs.Auth;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Handlers.Auth;
using System.Security.Claims;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly ForgotPasswordHandler _forgotPasswordHandler;
    private readonly ResetPasswordHandler _resetPasswordHandler;

    public AuthController(
        IAuthService authService, 
        ILogger<AuthController> logger,
        ForgotPasswordHandler forgotPasswordHandler,
        ResetPasswordHandler resetPasswordHandler)
    {
        _authService = authService;
        _logger = logger;
        _forgotPasswordHandler = forgotPasswordHandler;
        _resetPasswordHandler = resetPasswordHandler;
    }

    /// <summary>
    /// Iniciar sesión con email y contraseña
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(request);

        if (!result.IsSuccess)
        {
            _logger.LogWarning("Intento de login fallido para email: {Email}", request.Email);
            return Unauthorized(new { message = result.Message, errors = result.Errors });
        }

        _logger.LogInformation("Login exitoso para usuario: {Email}", request.Email);
        return Ok(result);
    }

    /// <summary>
    /// Refrescar token de acceso usando refresh token
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RefreshTokenAsync(request.RefreshToken);

        if (!result.IsSuccess)
        {
            _logger.LogWarning("Intento de refresh token fallido");
            return Unauthorized(new { message = result.Message, errors = result.Errors });
        }

        return Ok(result);
    }

    /// <summary>
    /// Cambiar contraseña del usuario autenticado
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (!Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized(new { message = "Token inválido" });
        }

        var result = await _authService.ChangePasswordAsync(userId, request);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message, errors = result.Errors });
        }

        _logger.LogInformation("Contraseña cambiada exitosamente para usuario ID: {UserId}", userId);
        return Ok(result);
    }

    /// <summary>
    /// Cerrar sesión (invalidar refresh token)
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (!Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized(new { message = "Token inválido" });
        }

        var result = await _authService.LogoutAsync(userId);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message, errors = result.Errors });
        }

        _logger.LogInformation("Logout exitoso para usuario ID: {UserId}", userId);
        return Ok(result);
    }

    /// <summary>
    /// Obtener información del usuario autenticado
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
        
        var userInfo = new
        {
            UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Email = User.FindFirst(ClaimTypes.Email)?.Value,
            Name = User.FindFirst(ClaimTypes.Name)?.Value,
            Dni = User.FindFirst("dni")?.Value,
            EntidadId = User.FindFirst("entidad_id")?.Value,
            PerfilId = User.FindFirst("perfil_id")?.Value
        };

        return Ok(new { success = true, data = userInfo, claims });
    }

    /// <summary>
    /// Solicitar recuperación de contraseña
    /// </summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _forgotPasswordHandler.Handle(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message, errors = result.Errors });
        }

        _logger.LogInformation("Solicitud de recuperación de contraseña para email: {Email}", request.Email);
        return Ok(result);
    }

    /// <summary>
    /// Restablecer contraseña con token
    /// </summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _resetPasswordHandler.Handle(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message, errors = result.Errors });
        }

        _logger.LogInformation("Contraseña restablecida exitosamente");
        return Ok(result);
    }

    /// <summary>
    /// Validar token de recuperación de contraseña
    /// </summary>
    [HttpGet("validate-reset-token/{token}")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateResetToken(string token)
    {
        var result = await _resetPasswordHandler.ValidateToken(token);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message, errors = result.Errors });
        }

        return Ok(result);
    }
}
