using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogosController : ControllerBase
{
    private readonly PCMDbContext _context;

    public CatalogosController(PCMDbContext context)
    {
        _context = context;
    }

    [HttpGet("niveles-gobierno")]
    public async Task<ActionResult<Result<List<object>>>> GetNivelesGobierno()
    {
        try
        {
            var niveles = await _context.NivelesGobierno
                .Where(n => n.Activo)
                .OrderBy(n => n.NivelGobiernoId)
                .Select(n => new
                {
                    nivelGobiernoId = n.NivelGobiernoId,
                    nombre = n.Nombre,
                    descripcion = n.Descripcion
                })
                .ToListAsync();

            return Ok(Result<List<object>>.Success(niveles.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener niveles de gobierno",
                new List<string> { ex.Message }
            ));
        }
    }

    [HttpGet("sectores")]
    public async Task<ActionResult<Result<List<object>>>> GetSectores()
    {
        try
        {
            var sectores = await _context.Sectores
                .Where(s => s.Activo)
                .OrderBy(s => s.Nombre)
                .Select(s => new
                {
                    sectorId = s.SectorId,
                    nombre = s.Nombre,
                    descripcion = s.Descripcion
                })
                .ToListAsync();

            return Ok(Result<List<object>>.Success(sectores.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener sectores",
                new List<string> { ex.Message }
            ));
        }
    }

    [HttpGet("clasificaciones")]
    public async Task<ActionResult<Result<List<object>>>> GetClasificaciones()
    {
        try
        {
            var clasificaciones = await _context.Clasificaciones
                .Where(c => c.Activo)
                .OrderBy(c => c.Nombre)
                .Select(c => new
                {
                    clasificacionId = c.ClasificacionId,
                    nombre = c.Nombre,
                    descripcion = c.Descripcion
                })
                .ToListAsync();

            return Ok(Result<List<object>>.Success(clasificaciones.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener clasificaciones",
                new List<string> { ex.Message }
            ));
        }
    }

    [HttpGet("perfiles")]
    public async Task<ActionResult<Result<List<object>>>> GetPerfiles()
    {
        try
        {
            var perfiles = await _context.Perfiles
                .Where(p => p.Activo)
                .OrderBy(p => p.Nombre)
                .Select(p => new
                {
                    perfilId = p.PerfilId,
                    nombre = p.Nombre,
                    descripcion = p.Descripcion
                })
                .ToListAsync();

            return Ok(Result<List<object>>.Success(perfiles.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener perfiles",
                new List<string> { ex.Message }
            ));
        }
    }
}
