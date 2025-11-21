using MediatR;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Application.DTOs.Usuario;
using PCM.Application.Features.Usuarios.Queries.GetAllUsuarios;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Usuarios;

public class GetAllUsuariosHandler : IRequestHandler<GetAllUsuariosQuery, Result<List<UsuarioListDto>>>
{
    private readonly PCMDbContext _context;

    public GetAllUsuariosHandler(PCMDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<UsuarioListDto>>> Handle(GetAllUsuariosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Usuarios
                .Include(u => u.Entidad)
                .Include(u => u.Perfil)
                .AsQueryable();

            // Filtros opcionales
            if (request.EntidadId.HasValue)
            {
                query = query.Where(u => u.EntidadId == request.EntidadId.Value);
            }

            if (request.PerfilId.HasValue)
            {
                query = query.Where(u => u.PerfilId == request.PerfilId.Value);
            }

            if (request.Activo.HasValue)
            {
                query = query.Where(u => u.Activo == request.Activo.Value);
            }

            var usuarios = await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UsuarioListDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    NombreCompleto = $"{u.Nombres} {u.ApePaterno} {u.ApeMaterno}",
                    Nombres = u.Nombres,
                    ApePaterno = u.ApePaterno,
                    ApeMaterno = u.ApeMaterno,
                    NumDni = u.NumDni,
                    Direccion = u.Direccion,
                    EntidadId = u.EntidadId,
                    NombreEntidad = u.Entidad != null ? u.Entidad.Nombre : string.Empty,
                    PerfilId = u.PerfilId,
                    NombrePerfil = u.Perfil != null ? u.Perfil.Nombre : string.Empty,
                    Activo = u.Activo,
                    LastLogin = u.LastLogin
                })
                .ToListAsync(cancellationToken);

            return Result<List<UsuarioListDto>>.Success(usuarios);
        }
        catch (Exception ex)
        {
            return Result<List<UsuarioListDto>>.Failure(
                "Error al obtener usuarios",
                new List<string> { ex.Message }
            );
        }
    }
}
