using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;
using PCM.Application.Features.Com3EPGD.Queries.GetCom3EPGDByEntidad;
using PCM.Infrastructure.Data;

namespace PCM.Infrastructure.Handlers.Com3EPGD;

public class GetCom3EPGDByEntidadHandler : IRequestHandler<GetCom3EPGDByEntidadQuery, Result<Com3EPGDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<GetCom3EPGDByEntidadHandler> _logger;

    public GetCom3EPGDByEntidadHandler(PCMDbContext context, ILogger<GetCom3EPGDByEntidadHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com3EPGDResponse>> Handle(GetCom3EPGDByEntidadQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await _context.Com3EPGD
                .FirstOrDefaultAsync(c => c.CompromisoId == request.CompromisoId 
                    && c.EntidadId == request.EntidadId 
                    && c.Activo, cancellationToken);

            if (entity == null)
            {
                return Result<Com3EPGDResponse>.Success(null!);
            }

            // Cargar Personal TI
            var personalList = await _context.PersonalTI
                .Where(p => p.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            // Cargar Inventario Software
            var softwareList = await _context.InventarioSoftware
                .Where(s => s.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            // Cargar Inventario Sistemas
            var sistemasList = await _context.InventarioSistemasInfo
                .Where(s => s.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            // Cargar Inventario Red
            var redList = await _context.InventarioRed
                .Where(r => r.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            // Cargar Inventario Servidores
            var servidoresList = await _context.InventarioServidores
                .Where(s => s.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            // Cargar Seguridad Info
            var seguridadInfo = await _context.SeguridadInfo
                .FirstOrDefaultAsync(s => s.ComEntidadId == entity.ComepgdEntId, cancellationToken);

            List<CapacitacionSeginfoDto>? capacitacionesDto = null;
            if (seguridadInfo != null)
            {
                var capacitaciones = await _context.CapacitacionesSeginfo
                    .Where(c => c.ComEntidadId == seguridadInfo.SeginfoId)
                    .ToListAsync(cancellationToken);
                
                capacitacionesDto = capacitaciones.Select(c => new CapacitacionSeginfoDto
                {
                    CapsegId = c.CapsegId,
                    Curso = c.Curso,
                    CantidadPersonas = (int)c.CantidadPersonas
                }).ToList();
            }

            // Cargar Objetivos y sus Acciones
            var objetivosList = await _context.ObjetivosEntidades
                .Where(o => o.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            var objetivosDto = new List<ObjetivoEntidadDto>();
            foreach (var obj in objetivosList)
            {
                var acciones = await _context.AccionesObjetivosEntidades
                    .Where(a => a.ObjEntId == obj.ObjEntId)
                    .ToListAsync(cancellationToken);

                objetivosDto.Add(new ObjetivoEntidadDto
                {
                    ObjEntId = obj.ObjEntId,
                    TipoObj = obj.TipoObj,
                    NumeracionObj = obj.NumeracionObj,
                    DescripcionObjetivo = obj.DescripcionObjetivo,
                    Acciones = acciones.Select(a => new AccionObjetivoEntidadDto
                    {
                        AccObjEntId = a.AccObjEntId,
                        NumeracionAcc = a.NumeracionAcc,
                        DescripcionAccion = a.DescripcionAccion
                    }).ToList()
                });
            }

            // Cargar Proyectos
            var proyectosList = await _context.ProyectosEntidades
                .Where(p => p.ComEntidadId == entity.ComepgdEntId)
                .ToListAsync(cancellationToken);

            var response = new Com3EPGDResponse
            {
                ComepgdEntId = entity.ComepgdEntId,
                CompromisoId = entity.CompromisoId,
                EntidadId = entity.EntidadId,
                EtapaFormulario = entity.EtapaFormulario,
                Estado = entity.Estado,
                CheckPrivacidad = entity.CheckPrivacidad,
                CheckDdjj = entity.CheckDdjj,
                EstadoPcm = entity.EstadoPcm,
                ObservacionesPcm = entity.ObservacionesPcm,
                CreatedAt = entity.CreatedAt,
                FecRegistro = entity.FecRegistro,
                UsuarioRegistra = entity.UsuarioRegistra,
                Activo = entity.Activo,
                FechaReporte = entity.FechaReporte,
                Sede = entity.Sede,
                Observaciones = entity.Observaciones,
                UbicacionAreaTi = entity.UbicacionAreaTi,
                OrganigramaTi = entity.OrganigramaTi,
                DependenciaAreaTi = entity.DependenciaAreaTi,
                CostoAnualTi = entity.CostoAnualTi,
                ExisteComisionGdTi = entity.ExisteComisionGdTi,
                PersonalTI = personalList.Select(p => new PersonalTIDto
                {
                    PersonalId = p.PersonalId,
                    NombrePersona = p.NombrePersona,
                    Dni = p.Dni,
                    Cargo = p.Cargo,
                    Rol = p.Rol,
                    Especialidad = p.Especialidad,
                    GradoInstruccion = p.GradoInstruccion,
                    Certificacion = p.Certificacion,
                    Acreditadora = p.Acreditadora,
                    CodigoCertificacion = p.CodigoCertificacion,
                    Colegiatura = p.Colegiatura,
                    EmailPersonal = p.EmailPersonal,
                    Telefono = p.Telefono
                }).ToList(),
                InventariosSoftware = softwareList.Select(s => new InventarioSoftwareDto
                {
                    InvSoftId = s.InvSoftId,
                    CodProducto = s.CodProducto,
                    NombreProducto = s.NombreProducto,
                    Version = s.Version,
                    TipoSoftware = s.TipoSoftware,
                    CantidadInstalaciones = (int)s.CantidadInstalaciones,
                    CantidadLicencias = (int)s.CantidadLicencias,
                    ExcesoDeficiencia = (int)s.ExcesoDeficiencia,
                    CostoLicencias = s.CostoLicencias
                }).ToList(),
                InventariosSistemas = sistemasList.Select(s => new InventarioSistemasInfoDto
                {
                    InvSiId = s.InvSiId,
                    Codigo = s.Codigo,
                    NombreSistema = s.NombreSistema,
                    Descripcion = s.Descripcion,
                    TipoSistema = s.TipoSistema,
                    LenguajeProgramacion = s.LenguajeProgramacion,
                    BaseDatos = s.BaseDatos,
                    Plataforma = s.Plataforma
                }).ToList(),
                InventariosRed = redList.Select(r => new InventarioRedDto
                {
                    InvRedId = r.InvRedId,
                    TipoEquipo = r.TipoEquipo,
                    Cantidad = (int)r.Cantidad,
                    PuertosOperativos = (int)r.PuertosOperativos,
                    PuertosInoperativos = (int)r.PuertosInoperativos,
                    TotalPuertos = (int)r.TotalPuertos,
                    CostoMantenimientoAnual = r.CostoMantenimientoAnual,
                    Observaciones = r.Observaciones
                }).ToList(),
                InventariosServidores = servidoresList.Select(s => new InventarioServidoresDto
                {
                    InvSrvId = s.InvSrvId,
                    NombreEquipo = s.NombreEquipo,
                    TipoEquipo = s.TipoEquipo,
                    Estado = s.Estado,
                    Capa = s.Capa,
                    Propiedad = s.Propiedad,
                    Montaje = s.Montaje,
                    MarcaCpu = s.MarcaCpu,
                    ModeloCpu = s.ModeloCpu,
                    VelocidadGhz = s.VelocidadGhz,
                    Nucleos = (int)s.Nucleos,
                    MemoriaGb = (int)s.MemoriaGb,
                    CostoMantenimientoAnual = s.CostoMantenimientoAnual,
                    Observaciones = s.Observaciones
                }).ToList(),
                SeguridadInfo = seguridadInfo != null ? new SeguridadInfoDto
                {
                    SeginfoId = seguridadInfo.SeginfoId,
                    PlanSgsi = seguridadInfo.PlanSgsi,
                    ComiteSeguridad = seguridadInfo.ComiteSeguridad,
                    OficialSeguridadEnOrganigrama = seguridadInfo.OficialSeguridadEnOrganigrama,
                    PoliticaSeguridad = seguridadInfo.PoliticaSeguridad,
                    InventarioActivos = seguridadInfo.InventarioActivos,
                    AnalisisRiesgos = seguridadInfo.AnalisisRiesgos,
                    MetodologiaRiesgos = seguridadInfo.MetodologiaRiesgos,
                    PlanContinuidad = seguridadInfo.PlanContinuidad,
                    ProgramaAuditorias = seguridadInfo.ProgramaAuditorias,
                    InformesDireccion = seguridadInfo.InformesDireccion,
                    CertificacionIso27001 = seguridadInfo.CertificacionIso27001,
                    Observaciones = seguridadInfo.Observaciones,
                    Capacitaciones = capacitacionesDto
                } : null,
                Objetivos = objetivosDto,
                Proyectos = proyectosList.Select(p => new ProyectoEntidadDto
                {
                    ProyEntId = p.ProyEntId,
                    NumeracionProy = p.NumeracionProy,
                    Nombre = p.Nombre,
                    Alcance = p.Alcance,
                    Justificacion = p.Justificacion,
                    TipoProy = p.TipoProy,
                    AreaProy = p.AreaProy,
                    AreaEjecuta = p.AreaEjecuta,
                    TipoBeneficiario = p.TipoBeneficiario,
                    EtapaProyecto = p.EtapaProyecto,
                    AmbitoProyecto = p.AmbitoProyecto,
                    FecIniProg = p.FecIniProg,
                    FecFinProg = p.FecFinProg,
                    FecIniReal = p.FecIniReal,
                    FecFinReal = p.FecFinReal,
                    AlineadoPgd = p.AlineadoPgd,
                    ObjTranDig = p.ObjTranDig,
                    ObjEst = p.ObjEst,
                    AccEst = p.AccEst,
                    MontoInversion = p.MontoInversion,
                    EstadoProyecto = p.EstadoProyecto
                }).ToList()
            };

            return Result<Com3EPGDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener Com3EPGD por entidad");
            return Result<Com3EPGDResponse>.Failure($"Error al obtener el registro: {ex.Message}");
        }
    }
}
