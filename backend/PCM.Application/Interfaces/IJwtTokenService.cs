using PCM.Domain.Entities;

namespace PCM.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(Usuario usuario);
    string GenerateRefreshToken();
    int? ValidateToken(string token);
}
