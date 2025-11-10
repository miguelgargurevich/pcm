namespace PCM.Application.Interfaces;

public interface IReCaptchaService
{
    Task<bool> ValidateTokenAsync(string token, string action = "login");
}
