namespace PCM.Application.DTOs.Auth;

public class LoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? RecaptchaToken { get; set; }
}

public class LoginResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UsuarioDto Usuario { get; set; } = null!;
}

public class UsuarioDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string NumDni { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public int EntidadId { get; set; }
    public string NombreEntidad { get; set; } = string.Empty;
    public int PerfilId { get; set; }
    public string NombrePerfil { get; set; } = string.Empty;
    public bool Activo { get; set; }
}

public class RefreshTokenRequestDto
{
    public string RefreshToken { get; set; } = string.Empty;
}

public class ChangePasswordRequestDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class ForgotPasswordRequestDto
{
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequestDto
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
