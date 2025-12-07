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
                FechaReporte = request.FechaReporte,
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
                    NombrePersona = dto.NombrePersona,
                    Dni = dto.Dni,
                    Cargo = dto.Cargo,
                    Rol = dto.Rol,
                    Especialidad = dto.Especialidad,
                    GradoInstruccion = dto.GradoInstruccion,
                    Certificacion = dto.Certificacion,
                    Acreditadora = dto.Acreditadora,
                    CodigoCertificacion = dto.CodigoCertificacion,
                    Colegiatura = dto.Colegiatura,
                    EmailPersonal = dto.EmailPersonal,
                    Telefono = dto.Telefono,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
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
                    Telefono = personal.Telefono,
                    Activo = personal.Activo
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
                    CodProducto = dto.CodProducto,
                    NombreProducto = dto.NombreProducto,
                    Version = dto.Version,
                    TipoSoftware = dto.TipoSoftware,
                    CantidadInstalaciones = dto.CantidadInstalaciones,
                    CantidadLicencias = dto.CantidadLicencias,
                    ExcesoDeficiencia = dto.ExcesoDeficiencia,
                    CostoLicencias = dto.CostoLicencias,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
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
                    CantidadInstalaciones = software.CantidadInstalaciones,
                    CantidadLicencias = software.CantidadLicencias,
                    ExcesoDeficiencia = software.ExcesoDeficiencia,
                    CostoLicencias = software.CostoLicencias,
                    Activo = software.Activo
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
                    Codigo = dto.Codigo,
                    NombreSistema = dto.NombreSistema,
                    Descripcion = dto.Descripcion,
                    TipoSistema = dto.TipoSistema,
                    LenguajeProgramacion = dto.LenguajeProgramacion,
                    BaseDatos = dto.BaseDatos,
                    Plataforma = dto.Plataforma,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
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
                    Plataforma = sistema.Plataforma,
                    Activo = sistema.Activo
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
                    TipoEquipo = dto.TipoEquipo,
                    Cantidad = dto.Cantidad,
                    PuertosOperativos = dto.PuertosOperativos,
                    PuertosInoperativos = dto.PuertosInoperativos,
                    TotalPuertos = dto.TotalPuertos,
                    CostoMantenimientoAnual = dto.CostoMantenimientoAnual,
                    Observaciones = dto.Observaciones,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
                };
                _context.InventarioRed.Add(red);
                await _context.SaveChangesAsync(cancellationToken);

                redResponse.Add(new InventarioRedDto
                {
                    InvRedId = red.InvRedId,
                    TipoEquipo = red.TipoEquipo,
                    Cantidad = red.Cantidad,
                    PuertosOperativos = red.PuertosOperativos,
                    PuertosInoperativos = red.PuertosInoperativos,
                    TotalPuertos = red.TotalPuertos,
                    CostoMantenimientoAnual = red.CostoMantenimientoAnual,
                    Observaciones = red.Observaciones,
                    Activo = red.Activo
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
                    NombreEquipo = dto.NombreEquipo,
                    TipoEquipo = dto.TipoEquipo,
                    Estado = dto.Estado,
                    Capa = dto.Capa,
                    Propiedad = dto.Propiedad,
                    Montaje = dto.Montaje,
                    MarcaCpu = dto.MarcaCpu,
                    ModeloCpu = dto.ModeloCpu,
                    VelocidadGhz = dto.VelocidadGhz,
                    Nucleos = dto.Nucleos,
                    MemoriaGb = dto.MemoriaGb,
                    MarcaMemoria = dto.MarcaMemoria,
                    ModeloMemoria = dto.ModeloMemoria,
                    CantidadMemoria = dto.CantidadMemoria,
                    CostoMantenimientoAnual = dto.CostoMantenimientoAnual,
                    Observaciones = dto.Observaciones,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
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
                    MemoriaGb = servidor.MemoriaGb,
                    CostoMantenimientoAnual = servidor.CostoMantenimientoAnual,
                    Observaciones = servidor.Observaciones,
                    Activo = servidor.Activo
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
                Observaciones = request.SeguridadInfo.Observaciones,
                Activo = true,
                CreatedAt = DateTime.UtcNow
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
                        Curso = capDto.Curso,
                        CantidadPersonas = capDto.CantidadPersonas,
                        Activo = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CapacitacionesSeginfo.Add(cap);
                    await _context.SaveChangesAsync(cancellationToken);

                    capsResponse.Add(new CapacitacionSeginfoDto
                    {
                        CapsegId = cap.CapsegId,
                        Curso = cap.Curso,
                        CantidadPersonas = cap.CantidadPersonas,
                        Activo = cap.Activo
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
                    TipoObj = dto.TipoObj,
                    NumeracionObj = dto.NumeracionObj,
                    DescripcionObjetivo = dto.DescripcionObjetivo,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
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
                            NumeracionAcc = accDto.NumeracionAcc,
                            DescripcionAccion = accDto.DescripcionAccion,
                            Activo = true,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.AccionesObjetivosEntidades.Add(accion);
                        await _context.SaveChangesAsync(cancellationToken);

                        accionesResponse.Add(new AccionObjetivoEntidadDto
                        {
                            AccObjEntId = accion.AccObjEntId,
                            NumeracionAcc = accion.NumeracionAcc,
                            DescripcionAccion = accion.DescripcionAccion,
                            Activo = accion.Activo
                        });
                    }
                }

                objetivosResponse.Add(new ObjetivoEntidadDto
                {
                    ObjEntId = objetivo.ObjEntId,
                    TipoObj = objetivo.TipoObj,
                    NumeracionObj = objetivo.NumeracionObj,
                    DescripcionObjetivo = objetivo.DescripcionObjetivo,
                    Acciones = accionesResponse,
                    Activo = objetivo.Activo
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
                    NumeracionProy = dto.NumeracionProy,
                    Nombre = dto.Nombre,
                    Alcance = dto.Alcance,
                    Justificacion = dto.Justificacion,
                    TipoProy = dto.TipoProy,
                    AreaProy = dto.AreaProy,
                    AreaEjecuta = dto.AreaEjecuta,
                    TipoBeneficiario = dto.TipoBeneficiario,
                    EtapaProyecto = dto.EtapaProyecto,
                    AmbitoProyecto = dto.AmbitoProyecto,
                    FecIniProg = dto.FecIniProg,
                    FecFinProg = dto.FecFinProg,
                    FecIniReal = dto.FecIniReal,
                    FecFinReal = dto.FecFinReal,
                    MontoInversion = dto.MontoInversion,
                    EstadoProyecto = dto.EstadoProyecto,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
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
                    MontoInversion = proyecto.MontoInversion,
                    Activo = proyecto.Activo
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
