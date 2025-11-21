using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.API.Controllers;

// DTO para consulta SQL de EstadoCompromiso
public class EstadoCompromisoDto
{
    public int EstadoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
}

[Authorize]
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

    [HttpGet("tipos-norma")]
    public async Task<ActionResult<Result<List<object>>>> GetTiposNorma()
    {
        try
        {
            var tiposNorma = await _context.TiposNorma
                .Where(t => t.Activo)
                .OrderBy(t => t.TipoNormaId)
                .Select(t => new
                {
                    tipoNormaId = t.TipoNormaId,
                    nombre = t.Nombre,
                    descripcion = t.Descripcion
                })
                .ToListAsync();

            return Ok(Result<List<object>>.Success(tiposNorma.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener tipos de norma",
                new List<string> { ex.Message }
            ));
        }
    }

    [HttpGet("estados")]
    public async Task<ActionResult<Result<List<object>>>> GetEstados()
    {
        try
        {
            // Consulta directa con SQL ya que EstadoCompromiso no está en el modelo EF
            var estados = await _context.Database
                .SqlQuery<EstadoCompromisoDto>($@"
                    SELECT estado_id AS EstadoId, nombre AS Nombre, descripcion AS Descripcion
                    FROM estado_compromiso 
                    WHERE activo = true 
                    ORDER BY estado_id")
                .ToListAsync();

            var result = estados.Select(e => new
            {
                estadoId = e.EstadoId,
                nombre = e.Nombre,
                descripcion = e.Descripcion
            }).Cast<object>().ToList();

            return Ok(Result<List<object>>.Success(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener estados",
                new List<string> { ex.Message }
            ));
        }
    }

    [HttpGet("alcances")]
    public async Task<ActionResult<Result<List<object>>>> GetAlcances()
    {
        try
        {
            // Ahora los alcances vienen de la tabla clasificacion
            var alcances = await _context.Clasificaciones
                .Where(c => c.Activo)
                .OrderBy(c => c.Nombre)
                .Select(c => new
                {
                    clasificacionId = c.ClasificacionId,
                    nombre = c.Nombre,
                    descripcion = c.Descripcion
                })
                .ToListAsync();

            return Ok(Result<List<object>>.Success(alcances.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener alcances",
                new List<string> { ex.Message }
            ));
        }
    }
}
