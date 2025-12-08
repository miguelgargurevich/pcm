using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;
using PCM.Infrastructure.Data;
using Com3EPGDEntity = PCM.Domain.Entities.Com3EPGD;
using PersonalTIEntity = PCM.Domain.Entities.PersonalTI;
using InventarioSoftwareEntity = PCM.Domain.Entities.InventarioSoftware;
using InventarioSistemasInfoEntity = PCM.Domain.Entities.InventarioSistemasInfo;
using InventarioRedEntity = PCM.Domain.Entities.InventarioRed;
using InventarioServidoresEntity = PCM.Domain.Entities.InventarioServidores;
using SeguridadInfoEntity = PCM.Domain.Entities.SeguridadInfo;
using CapacitacionSeginfoEntity = PCM.Domain.Entities.CapacitacionSeginfo;
using ObjetivoEntidadEntity = PCM.Domain.Entities.ObjetivoEntidad;
using AccionObjetivoEntidadEntity = PCM.Domain.Entities.AccionObjetivoEntidad;
using ProyectoEntidadEntity = PCM.Domain.Entities.ProyectoEntidad;

namespace PCM.Infrastructure.Handlers.Com3EPGD;

public class CreateCom3EPGDHandler : IRequestHandler<CreateCom3EPGDCommand, Result<Com3EPGDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<CreateCom3EPGDHandler> _logger;

    public CreateCom3EPGDHandler(PCMDbContext context, ILogger<CreateCom3EPGDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com3EPGDResponse>> Handle(CreateCom3EPGDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Crear registro principal
            var entity = new Com3EPGDEntity
            {
                CompromisoId = request.CompromisoId,
                EntidadId = request.EntidadId,
                EtapaFormulario = request.EtapaFormulario ?? string.Empty,
                Estado = request.Estado ?? string.Empty,
                CheckPrivacidad = request.CheckPrivacidad,
                CheckDdjj = request.CheckDdjj,
                EstadoPcm = request.EstadoPcm ?? string.Empty,
                ObservacionesPcm = request.ObservacionesPcm ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                FecRegistro = DateTime.UtcNow,
                UsuarioRegistra = request.UsuarioRegistra,
                Activo = true,
                FechaReporte = request.FechaReporte ?? DateTime.UtcNow,
                Sede = request.Sede ?? string.Empty,
                Observaciones = request.Observaciones ?? string.Empty,
                UbicacionAreaTi = request.UbicacionAreaTi ?? string.Empty,
                OrganigramaTi = request.OrganigramaTi ?? string.Empty,
                DependenciaAreaTi = request.DependenciaAreaTi ?? string.Empty,
                CostoAnualTi = request.CostoAnualTi ?? 0,
                ExisteComisionGdTi = request.ExisteComisionGdTi
            };

            _context.Com3EPGD.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            var response = await BuildResponse(entity, request, cancellationToken);

            _logger.LogInformation("Com3EPGD creado exitosamente: {Id}", entity.ComepgdEntId);
            return Result<Com3EPGDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear Com3EPGD");
            return Result<Com3EPGDResponse>.Failure($"Error al crear el registro: {ex.Message}");
        }
    }

    private async Task<Com3EPGDResponse> BuildResponse(Com3EPGDEntity entity, CreateCom3EPGDCommand request, CancellationToken cancellationToken)
    {
        var personalResponse = new List<PersonalTIDto>();
        var softwareResponse = new List<InventarioSoftwareDto>();
        var sistemasResponse = new List<InventarioSistemasInfoDto>();
        var redResponse = new List<InventarioRedDto>();
        var servidoresResponse = new List<InventarioServidoresDto>();
        var objetivosResponse = new List<ObjetivoEntidadDto>();
        var proyectosResponse = new List<ProyectoEntidadDto>();
        SeguridadInfoDto? seguridadResponse = null;

        // Guardar Personal TI
        if (request.PersonalTI != null && request.PersonalTI.Any())
        {
            foreach (var dto in request.PersonalTI)
            {
                var personal = new PersonalTIEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    NombrePersona = dto.NombrePersona ?? string.Empty,
                    Dni = dto.Dni ?? string.Empty,
                    Cargo = dto.Cargo ?? string.Empty,
                    Rol = dto.Rol ?? string.Empty,
                    Especialidad = dto.Especialidad ?? string.Empty,
                    GradoInstruccion = dto.GradoInstruccion ?? string.Empty,
                    Certificacion = dto.Certificacion ?? string.Empty,
                    Acreditadora = dto.Acreditadora ?? string.Empty,
                    CodigoCertificacion = dto.CodigoCertificacion ?? string.Empty,
                    Colegiatura = dto.Colegiatura ?? string.Empty,
                    EmailPersonal = dto.EmailPersonal ?? string.Empty,
                    Telefono = dto.Telefono ?? string.Empty
                };
                _context.PersonalTI.Add(personal);
                await _context.SaveChangesAsync(cancellationToken);

                personalResponse.Add(new PersonalTIDto
                {
                    PersonalId = personal.PersonalId,
                    NombrePersona = personal.NombrePersona,
                    Dni = personal.Dni,
                    Cargo = personal.Cargo,
                    Rol = personal.Rol,
                    Especialidad = personal.Especialidad,
                    GradoInstruccion = personal.GradoInstruccion,
                    Certificacion = personal.Certificacion,
                    EmailPersonal = personal.EmailPersonal,
                    Telefono = personal.Telefono
                });
            }
        }

        // Guardar Inventario Software
        if (request.InventariosSoftware != null && request.InventariosSoftware.Any())
        {
            foreach (var dto in request.InventariosSoftware)
            {
                var software = new InventarioSoftwareEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    CodProducto = dto.CodProducto ?? string.Empty,
                    NombreProducto = dto.NombreProducto ?? string.Empty,
                    Version = dto.Version ?? string.Empty,
                    TipoSoftware = dto.TipoSoftware ?? string.Empty,
                    CantidadInstalaciones = dto.CantidadInstalaciones,
                    CantidadLicencias = dto.CantidadLicencias,
                    ExcesoDeficiencia = dto.ExcesoDeficiencia,
                    CostoLicencias = dto.CostoLicencias
                };
                _context.InventarioSoftware.Add(software);
                await _context.SaveChangesAsync(cancellationToken);

                softwareResponse.Add(new InventarioSoftwareDto
                {
                    InvSoftId = software.InvSoftId,
                    CodProducto = software.CodProducto,
                    NombreProducto = software.NombreProducto,
                    Version = software.Version,
                    TipoSoftware = software.TipoSoftware,
                    CantidadInstalaciones = (int)software.CantidadInstalaciones,
                    CantidadLicencias = (int)software.CantidadLicencias,
                    ExcesoDeficiencia = (int)software.ExcesoDeficiencia,
                    CostoLicencias = software.CostoLicencias
                });
            }
        }

        // Guardar Inventario Sistemas
        if (request.InventariosSistemas != null && request.InventariosSistemas.Any())
        {
            foreach (var dto in request.InventariosSistemas)
            {
                var sistema = new InventarioSistemasInfoEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    Codigo = dto.Codigo ?? string.Empty,
                    NombreSistema = dto.NombreSistema ?? string.Empty,
                    Descripcion = dto.Descripcion ?? string.Empty,
                    TipoSistema = dto.TipoSistema ?? string.Empty,
                    LenguajeProgramacion = dto.LenguajeProgramacion ?? string.Empty,
                    BaseDatos = dto.BaseDatos ?? string.Empty,
                    Plataforma = dto.Plataforma ?? string.Empty
                };
                _context.InventarioSistemasInfo.Add(sistema);
                await _context.SaveChangesAsync(cancellationToken);

                sistemasResponse.Add(new InventarioSistemasInfoDto
                {
                    InvSiId = sistema.InvSiId,
                    Codigo = sistema.Codigo,
                    NombreSistema = sistema.NombreSistema,
                    Descripcion = sistema.Descripcion,
                    TipoSistema = sistema.TipoSistema,
                    LenguajeProgramacion = sistema.LenguajeProgramacion,
                    BaseDatos = sistema.BaseDatos,
                    Plataforma = sistema.Plataforma
                });
            }
        }

        // Guardar Inventario Red
        if (request.InventariosRed != null && request.InventariosRed.Any())
        {
            foreach (var dto in request.InventariosRed)
            {
                var red = new InventarioRedEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    TipoEquipo = dto.TipoEquipo ?? string.Empty,
                    Cantidad = dto.Cantidad,
                    PuertosOperativos = dto.PuertosOperativos,
                    PuertosInoperativos = dto.PuertosInoperativos,
                    TotalPuertos = dto.TotalPuertos,
                    CostoMantenimientoAnual = dto.CostoMantenimientoAnual,
                    Observaciones = dto.Observaciones ?? string.Empty
                };
                _context.InventarioRed.Add(red);
                await _context.SaveChangesAsync(cancellationToken);

                redResponse.Add(new InventarioRedDto
                {
                    InvRedId = red.InvRedId,
                    TipoEquipo = red.TipoEquipo,
                    Cantidad = (int)red.Cantidad,
                    PuertosOperativos = (int)red.PuertosOperativos,
                    PuertosInoperativos = (int)red.PuertosInoperativos,
                    TotalPuertos = (int)red.TotalPuertos,
                    CostoMantenimientoAnual = red.CostoMantenimientoAnual,
                    Observaciones = red.Observaciones
                });
            }
        }

        // Guardar Inventario Servidores
        if (request.InventariosServidores != null && request.InventariosServidores.Any())
        {
            foreach (var dto in request.InventariosServidores)
            {
                var servidor = new InventarioServidoresEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    NombreEquipo = dto.NombreEquipo ?? string.Empty,
                    TipoEquipo = dto.TipoEquipo ?? string.Empty,
                    Estado = dto.Estado ?? string.Empty,
                    Capa = dto.Capa ?? string.Empty,
                    Propiedad = dto.Propiedad ?? string.Empty,
                    Montaje = dto.Montaje ?? string.Empty,
                    MarcaCpu = dto.MarcaCpu ?? string.Empty,
                    ModeloCpu = dto.ModeloCpu ?? string.Empty,
                    VelocidadGhz = dto.VelocidadGhz ?? 0,
                    Nucleos = dto.Nucleos ?? 0,
                    MemoriaGb = dto.MemoriaGb ?? 0,
                    MarcaMemoria = dto.MarcaMemoria ?? string.Empty,
                    ModeloMemoria = dto.ModeloMemoria ?? string.Empty,
                    CantidadMemoria = dto.CantidadMemoria ?? 0,
                    CostoMantenimientoAnual = dto.CostoMantenimientoAnual,
                    Observaciones = dto.Observaciones ?? string.Empty
                };
                _context.InventarioServidores.Add(servidor);
                await _context.SaveChangesAsync(cancellationToken);

                servidoresResponse.Add(new InventarioServidoresDto
                {
                    InvSrvId = servidor.InvSrvId,
                    NombreEquipo = servidor.NombreEquipo,
                    TipoEquipo = servidor.TipoEquipo,
                    Estado = servidor.Estado,
                    Capa = servidor.Capa,
                    Propiedad = servidor.Propiedad,
                    MemoriaGb = (int)servidor.MemoriaGb,
                    CostoMantenimientoAnual = servidor.CostoMantenimientoAnual,
                    Observaciones = servidor.Observaciones
                });
            }
        }

        // Guardar Seguridad Info
        if (request.SeguridadInfo != null)
        {
            var seguridad = new SeguridadInfoEntity
            {
                ComEntidadId = entity.ComepgdEntId,
                PlanSgsi = request.SeguridadInfo.PlanSgsi,
                ComiteSeguridad = request.SeguridadInfo.ComiteSeguridad,
                OficialSeguridadEnOrganigrama = request.SeguridadInfo.OficialSeguridadEnOrganigrama,
                PoliticaSeguridad = request.SeguridadInfo.PoliticaSeguridad,
                InventarioActivos = request.SeguridadInfo.InventarioActivos,
                AnalisisRiesgos = request.SeguridadInfo.AnalisisRiesgos,
                MetodologiaRiesgos = request.SeguridadInfo.MetodologiaRiesgos,
                PlanContinuidad = request.SeguridadInfo.PlanContinuidad,
                ProgramaAuditorias = request.SeguridadInfo.ProgramaAuditorias,
                InformesDireccion = request.SeguridadInfo.InformesDireccion,
                CertificacionIso27001 = request.SeguridadInfo.CertificacionIso27001,
                Observaciones = request.SeguridadInfo.Observaciones ?? string.Empty
            };
            _context.SeguridadInfo.Add(seguridad);
            await _context.SaveChangesAsync(cancellationToken);

            var capsResponse = new List<CapacitacionSeginfoDto>();
            if (request.SeguridadInfo.Capacitaciones != null)
            {
                foreach (var capDto in request.SeguridadInfo.Capacitaciones)
                {
                    var cap = new CapacitacionSeginfoEntity
                    {
                        ComEntidadId = seguridad.SeginfoId,
                        Curso = capDto.Curso ?? string.Empty,
                        CantidadPersonas = capDto.CantidadPersonas
                    };
                    _context.CapacitacionesSeginfo.Add(cap);
                    await _context.SaveChangesAsync(cancellationToken);

                    capsResponse.Add(new CapacitacionSeginfoDto
                    {
                        CapsegId = cap.CapsegId,
                        Curso = cap.Curso,
                        CantidadPersonas = (int)cap.CantidadPersonas
                    });
                }
            }

            seguridadResponse = new SeguridadInfoDto
            {
                SeginfoId = seguridad.SeginfoId,
                PlanSgsi = seguridad.PlanSgsi,
                ComiteSeguridad = seguridad.ComiteSeguridad,
                OficialSeguridadEnOrganigrama = seguridad.OficialSeguridadEnOrganigrama,
                PoliticaSeguridad = seguridad.PoliticaSeguridad,
                CertificacionIso27001 = seguridad.CertificacionIso27001,
                Observaciones = seguridad.Observaciones,
                Capacitaciones = capsResponse
            };
        }

        // Guardar Objetivos
        if (request.Objetivos != null && request.Objetivos.Any())
        {
            foreach (var dto in request.Objetivos)
            {
                var objetivo = new ObjetivoEntidadEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    TipoObj = dto.TipoObj ?? "E",
                    NumeracionObj = dto.NumeracionObj ?? string.Empty,
                    DescripcionObjetivo = dto.DescripcionObjetivo ?? string.Empty
                };
                _context.ObjetivosEntidades.Add(objetivo);
                await _context.SaveChangesAsync(cancellationToken);

                var accionesResponse = new List<AccionObjetivoEntidadDto>();
                if (dto.Acciones != null)
                {
                    foreach (var accDto in dto.Acciones)
                    {
                        var accion = new AccionObjetivoEntidadEntity
                        {
                            ObjEntId = objetivo.ObjEntId,
                            NumeracionAcc = accDto.NumeracionAcc ?? string.Empty,
                            DescripcionAccion = accDto.DescripcionAccion ?? string.Empty
                        };
                        _context.AccionesObjetivosEntidades.Add(accion);
                        await _context.SaveChangesAsync(cancellationToken);

                        accionesResponse.Add(new AccionObjetivoEntidadDto
                        {
                            AccObjEntId = accion.AccObjEntId,
                            NumeracionAcc = accion.NumeracionAcc,
                            DescripcionAccion = accion.DescripcionAccion
                        });
                    }
                }

                objetivosResponse.Add(new ObjetivoEntidadDto
                {
                    ObjEntId = objetivo.ObjEntId,
                    TipoObj = objetivo.TipoObj,
                    NumeracionObj = objetivo.NumeracionObj,
                    DescripcionObjetivo = objetivo.DescripcionObjetivo,
                    Acciones = accionesResponse
                });
            }
        }

        // Guardar Proyectos
        if (request.Proyectos != null && request.Proyectos.Any())
        {
            foreach (var dto in request.Proyectos)
            {
                var proyecto = new ProyectoEntidadEntity
                {
                    ComEntidadId = entity.ComepgdEntId,
                    NumeracionProy = dto.NumeracionProy ?? string.Empty,
                    Nombre = dto.Nombre ?? string.Empty,
                    Alcance = dto.Alcance ?? string.Empty,
                    Justificacion = dto.Justificacion ?? string.Empty,
                    TipoProy = dto.TipoProy ?? string.Empty,
                    AreaProy = dto.AreaProy ?? string.Empty,
                    AreaEjecuta = dto.AreaEjecuta ?? string.Empty,
                    TipoBeneficiario = dto.TipoBeneficiario ?? string.Empty,
                    EtapaProyecto = dto.EtapaProyecto ?? string.Empty,
                    AmbitoProyecto = dto.AmbitoProyecto ?? string.Empty,
                    FecIniProg = dto.FecIniProg ?? DateTime.UtcNow,
                    FecFinProg = dto.FecFinProg ?? DateTime.UtcNow,
                    FecIniReal = dto.FecIniReal ?? DateTime.UtcNow,
                    FecFinReal = dto.FecFinReal ?? DateTime.UtcNow,
                    MontoInversion = dto.MontoInversion,
                    EstadoProyecto = dto.EstadoProyecto,
                    AlineadoPgd = dto.AlineadoPgd ?? string.Empty,
                    ObjTranDig = dto.ObjTranDig ?? string.Empty,
                    ObjEst = dto.ObjEst ?? string.Empty,
                    AccEst = dto.AccEst ?? string.Empty
                };
                _context.ProyectosEntidades.Add(proyecto);
                await _context.SaveChangesAsync(cancellationToken);

                proyectosResponse.Add(new ProyectoEntidadDto
                {
                    ProyEntId = proyecto.ProyEntId,
                    NumeracionProy = proyecto.NumeracionProy,
                    Nombre = proyecto.Nombre,
                    AreaProy = proyecto.AreaProy,
                    AreaEjecuta = proyecto.AreaEjecuta,
                    TipoBeneficiario = proyecto.TipoBeneficiario,
                    EtapaProyecto = proyecto.EtapaProyecto,
                    AmbitoProyecto = proyecto.AmbitoProyecto,
                    FecIniProg = proyecto.FecIniProg,
                    FecFinProg = proyecto.FecFinProg,
                    FecIniReal = proyecto.FecIniReal,
                    FecFinReal = proyecto.FecFinReal,
                    MontoInversion = proyecto.MontoInversion
                });
            }
        }

        return new Com3EPGDResponse
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
            UbicacionAreaTi = entity.UbicacionAreaTi,
            OrganigramaTi = entity.OrganigramaTi,
            DependenciaAreaTi = entity.DependenciaAreaTi,
            CostoAnualTi = entity.CostoAnualTi,
            ExisteComisionGdTi = entity.ExisteComisionGdTi,
            PersonalTI = personalResponse,
            InventariosSoftware = softwareResponse,
            InventariosSistemas = sistemasResponse,
            InventariosRed = redResponse,
            InventariosServidores = servidoresResponse,
            SeguridadInfo = seguridadResponse,
            Objetivos = objetivosResponse,
            Proyectos = proyectosResponse
        };
    }
}
