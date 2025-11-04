using PCM.Application.DTOs.Auth;
using PCM.Application.Common;

namespace PCM.Application.Interfaces;

public interface IAuthService
{
    Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto request);
    Task<Result<LoginResponseDto>> RefreshTokenAsync(string refreshToken);
    Task<Result> ChangePasswordAsync(int userId, ChangePasswordRequestDto request);
    Task<Result> LogoutAsync(int userId);
}
