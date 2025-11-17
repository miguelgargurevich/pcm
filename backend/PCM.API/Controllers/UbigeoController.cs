using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCM.Application.Common;
using PCM.Infrastructure.Data;

namespace PCM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UbigeoController : ControllerBase
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UbigeoController> _logger;

    public UbigeoController(PCMDbContext context, ILogger<UbigeoController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Obtener todos los departamentos únicos
    /// </summary>
    [HttpGet("departamentos")]
    public async Task<ActionResult<Result<List<string>>>> GetDepartamentos()
    {
        try
        {
            var departamentos = await _context.Ubigeos
                .Where(u => u.Activo 
                    && u.UBPRV == "00" 
                    && u.UBDIS == "00"
                    && (u.CCOD_TIPO_UBI == "NACIONAL" || u.CCOD_TIPO_UBI == "LOCAL"))
                .Select(u => u.NODEP)
                .Distinct()
                .OrderBy(d => d)
                .ToListAsync();

            return Ok(Result<List<string>>.Success(departamentos));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener departamentos");
            return StatusCode(500, Result<List<string>>.Failure(
                "Error al obtener departamentos",
                new List<string> { ex.Message }
            ));
        }
    }

    /// <summary>
    /// Obtener provincias por departamento
    /// </summary>
    [HttpGet("provincias/{departamento}")]
    public async Task<ActionResult<Result<List<string>>>> GetProvincias(string departamento)
    {
        try
        {
            var provincias = await _context.Ubigeos
                .Where(u => u.Activo 
                    && u.NODEP == departamento 
                    && u.UBDIS == "00" 
                    && !string.IsNullOrEmpty(u.NOPRV)
                    && (u.CCOD_TIPO_UBI == "NACIONAL" || u.CCOD_TIPO_UBI == "LOCAL"))
                .Select(u => u.NOPRV)
                .Distinct()
                .ToListAsync();

            // Filtrar provincias vacías o con solo espacios en blanco
            var provinciasFiltradas = provincias
                .Where(p => !string.IsNullOrWhiteSpace(p))
                .OrderBy(p => p)
                .ToList();

            return Ok(Result<List<string>>.Success(provinciasFiltradas));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener provincias para {Departamento}", departamento);
            return StatusCode(500, Result<List<string>>.Failure(
                "Error al obtener provincias",
                new List<string> { ex.Message }
            ));
        }
    }

    /// <summary>
    /// Obtener distritos por departamento y provincia
    /// </summary>
    [HttpGet("distritos/{departamento}/{provincia}")]
    public async Task<ActionResult<Result<List<object>>>> GetDistritos(string departamento, string provincia)
    {
        try
        {
            var distritos = await _context.Ubigeos
                .Where(u => u.Activo 
                    && u.NODEP == departamento 
                    && u.NOPRV == provincia 
                    && !string.IsNullOrEmpty(u.NODIS)
                    && (u.CCOD_TIPO_UBI == "NACIONAL" || u.CCOD_TIPO_UBI == "LOCAL"))
                .Select(u => new
                {
                    ubigeoId = u.UbigeoId,
                    codigo = u.UBDIS,
                    distrito = u.NODIS,
                    departamento = u.NODEP,
                    provincia = u.NOPRV
                })
                .ToListAsync();

            // Filtrar distritos vacíos o con solo espacios en blanco
            var distritosFiltrados = distritos
                .Where(d => !string.IsNullOrWhiteSpace(d.distrito))
                .OrderBy(d => d.distrito)
                .ToList();

            return Ok(Result<List<object>>.Success(distritosFiltrados.Cast<object>().ToList()));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener distritos para {Departamento}/{Provincia}", 
                departamento, provincia);
            return StatusCode(500, Result<List<object>>.Failure(
                "Error al obtener distritos",
                new List<string> { ex.Message }
            ));
        }
    }

    /// <summary>
    /// Buscar ubigeo por código
    /// </summary>
    [HttpGet("codigo/{codigo}")]
    public async Task<ActionResult<Result<object>>> GetByCodigo(string codigo)
    {
        try
        {
            var ubigeo = await _context.Ubigeos
                .Where(u => u.UBDIS == codigo)
                .Select(u => new
                {
                    ubigeoId = u.UbigeoId,
                    codigo = u.UBDIS,
                    departamento = u.NODEP,
                    provincia = u.NOPRV,
                    distrito = u.NODIS
                })
                .FirstOrDefaultAsync();

            if (ubigeo == null)
            {
                return NotFound(Result<object>.Failure("Ubigeo no encontrado"));
            }

            return Ok(Result<object>.Success(ubigeo));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al buscar ubigeo por código {Codigo}", codigo);
            return StatusCode(500, Result<object>.Failure(
                "Error al buscar ubigeo",
                new List<string> { ex.Message }
            ));
        }
    }

    /// <summary>
    /// Buscar ubigeo por departamento, provincia, distrito
    /// </summary>
    [HttpGet("buscar")]
    public async Task<ActionResult<Result<object>>> Buscar(
        [FromQuery] string departamento,
        [FromQuery] string provincia,
        [FromQuery] string distrito)
    {
        try
        {
            var ubigeo = await _context.Ubigeos
                .Where(u => u.NODEP == departamento 
                         && u.NOPRV == provincia 
                         && u.NODIS == distrito)
                .Select(u => new
                {
                    ubigeoId = u.UbigeoId,
                    codigo = u.UBDIS,
                    departamento = u.NODEP,
                    provincia = u.NOPRV,
                    distrito = u.NODIS
                })
                .FirstOrDefaultAsync();

            if (ubigeo == null)
            {
                return NotFound(Result<object>.Failure("Ubigeo no encontrado"));
            }

            return Ok(Result<object>.Success(ubigeo));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al buscar ubigeo");
            return StatusCode(500, Result<object>.Failure(
                "Error al buscar ubigeo",
                new List<string> { ex.Message }
            ));
        }
    }
}
