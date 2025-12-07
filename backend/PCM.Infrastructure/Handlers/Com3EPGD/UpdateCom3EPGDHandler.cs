using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PCM.Application.Common;
using PCM.Application.Features.Com3EPGD.Commands.CreateCom3EPGD;
using PCM.Application.Features.Com3EPGD.Commands.UpdateCom3EPGD;
using PCM.Infrastructure.Data;
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

public class UpdateCom3EPGDHandler : IRequestHandler<UpdateCom3EPGDCommand, Result<Com3EPGDResponse>>
{
    private readonly PCMDbContext _context;
    private readonly ILogger<UpdateCom3EPGDHandler> _logger;

    public UpdateCom3EPGDHandler(PCMDbContext context, ILogger<UpdateCom3EPGDHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<Com3EPGDResponse>> Handle(UpdateCom3EPGDCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await _context.Com3EPGD
                .FirstOrDefaultAsync(c => c.ComepgdEntId == request.ComepgdEntId, cancellationToken);

            if (entity == null)
            {
                return Result<Com3EPGDResponse>.Failure("Registro no encontrado");
            }

            // Actualizar campos principales
            entity.EtapaFormulario = request.EtapaFormulario ?? entity.EtapaFormulario;
            entity.Estado = request.Estado ?? entity.Estado;
            entity.CheckPrivacidad = request.CheckPrivacidad;
            entity.CheckDdjj = request.CheckDdjj;
            entity.EstadoPcm = request.EstadoPcm ?? entity.EstadoPcm;
            entity.ObservacionesPcm = request.ObservacionesPcm ?? entity.ObservacionesPcm;
            entity.FechaReporte = request.FechaReporte;
            entity.Sede = request.Sede ?? entity.Sede;
            entity.Observaciones = request.Observaciones ?? entity.Observaciones;
            entity.UbicacionAreaTi = request.UbicacionAreaTi ?? entity.UbicacionAreaTi;
            entity.OrganigramaTi = request.OrganigramaTi ?? entity.OrganigramaTi;
            entity.DependenciaAreaTi = request.DependenciaAreaTi ?? entity.DependenciaAreaTi;
            entity.CostoAnualTi = request.CostoAnualTi ?? entity.CostoAnualTi;
            entity.ExisteComisionGdTi = request.ExisteComisionGdTi;

            _context.Com3EPGD.Update(entity);
            await _context.SaveChangesAsync(cancellationToken);

            // Actualizar Personal TI
            await UpdatePersonalTI(entity.ComepgdEntId, request.PersonalTI, cancellationToken);

            // Actualizar Inventario Software
            await UpdateInventarioSoftware(entity.ComepgdEntId, request.InventariosSoftware, cancellationToken);

            // Actualizar Inventario Sistemas
            await UpdateInventarioSistemas(entity.ComepgdEntId, request.InventariosSistemas, cancellationToken);

            // Actualizar Inventario Red
            await UpdateInventarioRed(entity.ComepgdEntId, request.InventariosRed, cancellationToken);

            // Actualizar Inventario Servidores
            await UpdateInventarioServidores(entity.ComepgdEntId, request.InventariosServidores, cancellationToken);

            // Actualizar Seguridad Info
            await UpdateSeguridadInfo(entity.ComepgdEntId, request.SeguridadInfo, cancellationToken);

            // Actualizar Objetivos
            await UpdateObjetivos(entity.ComepgdEntId, request.Objetivos, cancellationToken);

            // Actualizar Proyectos
            await UpdateProyectos(entity.ComepgdEntId, request.Proyectos, cancellationToken);

            var response = await BuildResponse(entity, cancellationToken);

            _logger.LogInformation("Com3EPGD actualizado exitosamente: {Id}", entity.ComepgdEntId);
            return Result<Com3EPGDResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar Com3EPGD");
            return Result<Com3EPGDResponse>.Failure($"Error al actualizar el registro: {ex.Message}");
        }
    }

    private async Task UpdatePersonalTI(long comEntidadId, List<PersonalTIDto>? personalList, CancellationToken cancellationToken)
    {
        if (personalList == null) return;

        // Marcar como inactivos los que no están en la lista
        var existingIds = personalList.Where(p => p.PersonalId.HasValue).Select(p => p.PersonalId!.Value).ToList();
        var toDeactivate = await _context.PersonalTI
            .Where(p => p.ComEntidadId == comEntidadId && p.Activo && !existingIds.Contains(p.PersonalId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
        }

        foreach (var dto in personalList)
        {
            if (dto.PersonalId.HasValue && dto.PersonalId.Value > 0)
            {
                var existing = await _context.PersonalTI.FindAsync(dto.PersonalId.Value);
                if (existing != null)
                {
                    existing.NombrePersona = dto.NombrePersona;
                    existing.Dni = dto.Dni;
                    existing.Cargo = dto.Cargo;
                    existing.Rol = dto.Rol;
                    existing.Especialidad = dto.Especialidad;
                    existing.GradoInstruccion = dto.GradoInstruccion;
                    existing.Certificacion = dto.Certificacion;
                    existing.EmailPersonal = dto.EmailPersonal;
                    existing.Telefono = dto.Telefono;
                    existing.Activo = dto.Activo;
                }
            }
            else
            {
                var newItem = new PersonalTIEntity
                {
                    ComEntidadId = comEntidadId,
                    NombrePersona = dto.NombrePersona,
                    Dni = dto.Dni,
                    Cargo = dto.Cargo,
                    Rol = dto.Rol,
                    Especialidad = dto.Especialidad,
                    GradoInstruccion = dto.GradoInstruccion,
                    Certificacion = dto.Certificacion,
                    EmailPersonal = dto.EmailPersonal,
                    Telefono = dto.Telefono,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PersonalTI.Add(newItem);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateInventarioSoftware(long comEntidadId, List<InventarioSoftwareDto>? softwareList, CancellationToken cancellationToken)
    {
        if (softwareList == null) return;

        var existingIds = softwareList.Where(s => s.InvSoftId.HasValue).Select(s => s.InvSoftId!.Value).ToList();
        var toDeactivate = await _context.InventarioSoftware
            .Where(s => s.ComEntidadId == comEntidadId && s.Activo && !existingIds.Contains(s.InvSoftId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
        }

        foreach (var dto in softwareList)
        {
            if (dto.InvSoftId.HasValue && dto.InvSoftId.Value > 0)
            {
                var existing = await _context.InventarioSoftware.FindAsync(dto.InvSoftId.Value);
                if (existing != null)
                {
                    existing.CodProducto = dto.CodProducto;
                    existing.NombreProducto = dto.NombreProducto;
                    existing.Version = dto.Version;
                    existing.TipoSoftware = dto.TipoSoftware;
                    existing.CantidadInstalaciones = dto.CantidadInstalaciones;
                    existing.CantidadLicencias = dto.CantidadLicencias;
                    existing.ExcesoDeficiencia = dto.ExcesoDeficiencia;
                    existing.CostoLicencias = dto.CostoLicencias;
                    existing.Activo = dto.Activo;
                }
            }
            else
            {
                var newItem = new InventarioSoftwareEntity
                {
                    ComEntidadId = comEntidadId,
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
                _context.InventarioSoftware.Add(newItem);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateInventarioSistemas(long comEntidadId, List<InventarioSistemasInfoDto>? sistemasList, CancellationToken cancellationToken)
    {
        if (sistemasList == null) return;

        var existingIds = sistemasList.Where(s => s.InvSiId.HasValue).Select(s => s.InvSiId!.Value).ToList();
        var toDeactivate = await _context.InventarioSistemasInfo
            .Where(s => s.ComEntidadId == comEntidadId && s.Activo && !existingIds.Contains(s.InvSiId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
        }

        foreach (var dto in sistemasList)
        {
            if (dto.InvSiId.HasValue && dto.InvSiId.Value > 0)
            {
                var existing = await _context.InventarioSistemasInfo.FindAsync(dto.InvSiId.Value);
                if (existing != null)
                {
                    existing.Codigo = dto.Codigo;
                    existing.NombreSistema = dto.NombreSistema;
                    existing.Descripcion = dto.Descripcion;
                    existing.TipoSistema = dto.TipoSistema;
                    existing.LenguajeProgramacion = dto.LenguajeProgramacion;
                    existing.BaseDatos = dto.BaseDatos;
                    existing.Plataforma = dto.Plataforma;
                    existing.Activo = dto.Activo;
                }
            }
            else
            {
                var newItem = new InventarioSistemasInfoEntity
                {
                    ComEntidadId = comEntidadId,
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
                _context.InventarioSistemasInfo.Add(newItem);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateInventarioRed(long comEntidadId, List<InventarioRedDto>? redList, CancellationToken cancellationToken)
    {
        if (redList == null) return;

        var existingIds = redList.Where(r => r.InvRedId.HasValue).Select(r => r.InvRedId!.Value).ToList();
        var toDeactivate = await _context.InventarioRed
            .Where(r => r.ComEntidadId == comEntidadId && r.Activo && !existingIds.Contains(r.InvRedId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
        }

        foreach (var dto in redList)
        {
            if (dto.InvRedId.HasValue && dto.InvRedId.Value > 0)
            {
                var existing = await _context.InventarioRed.FindAsync(dto.InvRedId.Value);
                if (existing != null)
                {
                    existing.TipoEquipo = dto.TipoEquipo;
                    existing.Cantidad = dto.Cantidad;
                    existing.PuertosOperativos = dto.PuertosOperativos;
                    existing.PuertosInoperativos = dto.PuertosInoperativos;
                    existing.TotalPuertos = dto.TotalPuertos;
                    existing.CostoMantenimientoAnual = dto.CostoMantenimientoAnual;
                    existing.Observaciones = dto.Observaciones;
                    existing.Activo = dto.Activo;
                }
            }
            else
            {
                var newItem = new InventarioRedEntity
                {
                    ComEntidadId = comEntidadId,
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
                _context.InventarioRed.Add(newItem);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateInventarioServidores(long comEntidadId, List<InventarioServidoresDto>? servidoresList, CancellationToken cancellationToken)
    {
        if (servidoresList == null) return;

        var existingIds = servidoresList.Where(s => s.InvSrvId.HasValue).Select(s => s.InvSrvId!.Value).ToList();
        var toDeactivate = await _context.InventarioServidores
            .Where(s => s.ComEntidadId == comEntidadId && s.Activo && !existingIds.Contains(s.InvSrvId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
        }

        foreach (var dto in servidoresList)
        {
            if (dto.InvSrvId.HasValue && dto.InvSrvId.Value > 0)
            {
                var existing = await _context.InventarioServidores.FindAsync(dto.InvSrvId.Value);
                if (existing != null)
                {
                    existing.NombreEquipo = dto.NombreEquipo;
                    existing.TipoEquipo = dto.TipoEquipo;
                    existing.Estado = dto.Estado;
                    existing.Capa = dto.Capa;
                    existing.Propiedad = dto.Propiedad;
                    existing.MemoriaGb = dto.MemoriaGb;
                    existing.CostoMantenimientoAnual = dto.CostoMantenimientoAnual;
                    existing.Observaciones = dto.Observaciones;
                    existing.Activo = dto.Activo;
                }
            }
            else
            {
                var newItem = new InventarioServidoresEntity
                {
                    ComEntidadId = comEntidadId,
                    NombreEquipo = dto.NombreEquipo,
                    TipoEquipo = dto.TipoEquipo,
                    Estado = dto.Estado,
                    Capa = dto.Capa,
                    Propiedad = dto.Propiedad,
                    MemoriaGb = dto.MemoriaGb,
                    CostoMantenimientoAnual = dto.CostoMantenimientoAnual,
                    Observaciones = dto.Observaciones,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
                };
                _context.InventarioServidores.Add(newItem);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateSeguridadInfo(long comEntidadId, SeguridadInfoDto? seguridadDto, CancellationToken cancellationToken)
    {
        if (seguridadDto == null) return;

        var existing = await _context.SeguridadInfo
            .FirstOrDefaultAsync(s => s.ComEntidadId == comEntidadId && s.Activo, cancellationToken);

        if (existing != null)
        {
            existing.PlanSgsi = seguridadDto.PlanSgsi;
            existing.ComiteSeguridad = seguridadDto.ComiteSeguridad;
            existing.OficialSeguridadEnOrganigrama = seguridadDto.OficialSeguridadEnOrganigrama;
            existing.PoliticaSeguridad = seguridadDto.PoliticaSeguridad;
            existing.InventarioActivos = seguridadDto.InventarioActivos;
            existing.AnalisisRiesgos = seguridadDto.AnalisisRiesgos;
            existing.MetodologiaRiesgos = seguridadDto.MetodologiaRiesgos;
            existing.PlanContinuidad = seguridadDto.PlanContinuidad;
            existing.ProgramaAuditorias = seguridadDto.ProgramaAuditorias;
            existing.InformesDireccion = seguridadDto.InformesDireccion;
            existing.CertificacionIso27001 = seguridadDto.CertificacionIso27001;
            existing.Observaciones = seguridadDto.Observaciones;

            // Actualizar capacitaciones
            if (seguridadDto.Capacitaciones != null)
            {
                var existingCapIds = seguridadDto.Capacitaciones.Where(c => c.CapsegId.HasValue).Select(c => c.CapsegId!.Value).ToList();
                var toDeactivate = await _context.CapacitacionesSeginfo
                    .Where(c => c.ComEntidadId == existing.SeginfoId && c.Activo && !existingCapIds.Contains(c.CapsegId))
                    .ToListAsync(cancellationToken);
                
                foreach (var item in toDeactivate)
                {
                    item.Activo = false;
                }

                foreach (var capDto in seguridadDto.Capacitaciones)
                {
                    if (capDto.CapsegId.HasValue && capDto.CapsegId.Value > 0)
                    {
                        var existingCap = await _context.CapacitacionesSeginfo.FindAsync(capDto.CapsegId.Value);
                        if (existingCap != null)
                        {
                            existingCap.Curso = capDto.Curso;
                            existingCap.CantidadPersonas = capDto.CantidadPersonas;
                            existingCap.Activo = capDto.Activo;
                        }
                    }
                    else
                    {
                        var newCap = new CapacitacionSeginfoEntity
                        {
                            ComEntidadId = existing.SeginfoId,
                            Curso = capDto.Curso,
                            CantidadPersonas = capDto.CantidadPersonas,
                            Activo = true,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.CapacitacionesSeginfo.Add(newCap);
                    }
                }
            }
        }
        else
        {
            var newSeguridad = new SeguridadInfoEntity
            {
                ComEntidadId = comEntidadId,
                PlanSgsi = seguridadDto.PlanSgsi,
                ComiteSeguridad = seguridadDto.ComiteSeguridad,
                OficialSeguridadEnOrganigrama = seguridadDto.OficialSeguridadEnOrganigrama,
                PoliticaSeguridad = seguridadDto.PoliticaSeguridad,
                InventarioActivos = seguridadDto.InventarioActivos,
                AnalisisRiesgos = seguridadDto.AnalisisRiesgos,
                MetodologiaRiesgos = seguridadDto.MetodologiaRiesgos,
                PlanContinuidad = seguridadDto.PlanContinuidad,
                ProgramaAuditorias = seguridadDto.ProgramaAuditorias,
                InformesDireccion = seguridadDto.InformesDireccion,
                CertificacionIso27001 = seguridadDto.CertificacionIso27001,
                Observaciones = seguridadDto.Observaciones,
                Activo = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.SeguridadInfo.Add(newSeguridad);
            await _context.SaveChangesAsync(cancellationToken);

            if (seguridadDto.Capacitaciones != null)
            {
                foreach (var capDto in seguridadDto.Capacitaciones)
                {
                    var newCap = new CapacitacionSeginfoEntity
                    {
                        ComEntidadId = newSeguridad.SeginfoId,
                        Curso = capDto.Curso,
                        CantidadPersonas = capDto.CantidadPersonas,
                        Activo = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.CapacitacionesSeginfo.Add(newCap);
                }
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateObjetivos(long comEntidadId, List<ObjetivoEntidadDto>? objetivosList, CancellationToken cancellationToken)
    {
        if (objetivosList == null) return;

        var existingIds = objetivosList.Where(o => o.ObjEntId.HasValue).Select(o => o.ObjEntId!.Value).ToList();
        var toDeactivate = await _context.ObjetivosEntidades
            .Where(o => o.ComEntidadId == comEntidadId && o.Activo && !existingIds.Contains(o.ObjEntId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
            // También desactivar acciones
            var acciones = await _context.AccionesObjetivosEntidades
                .Where(a => a.ObjEntId == item.ObjEntId && a.Activo)
                .ToListAsync(cancellationToken);
            foreach (var accion in acciones)
            {
                accion.Activo = false;
            }
        }

        foreach (var dto in objetivosList)
        {
            if (dto.ObjEntId.HasValue && dto.ObjEntId.Value > 0)
            {
                var existing = await _context.ObjetivosEntidades.FindAsync(dto.ObjEntId.Value);
                if (existing != null)
                {
                    existing.TipoObj = dto.TipoObj;
                    existing.NumeracionObj = dto.NumeracionObj;
                    existing.DescripcionObjetivo = dto.DescripcionObjetivo;
                    existing.Activo = dto.Activo;

                    // Actualizar acciones
                    if (dto.Acciones != null)
                    {
                        var existingAccIds = dto.Acciones.Where(a => a.AccObjEntId.HasValue).Select(a => a.AccObjEntId!.Value).ToList();
                        var toDeactivateAcc = await _context.AccionesObjetivosEntidades
                            .Where(a => a.ObjEntId == existing.ObjEntId && a.Activo && !existingAccIds.Contains(a.AccObjEntId))
                            .ToListAsync(cancellationToken);
                        
                        foreach (var acc in toDeactivateAcc)
                        {
                            acc.Activo = false;
                        }

                        foreach (var accDto in dto.Acciones)
                        {
                            if (accDto.AccObjEntId.HasValue && accDto.AccObjEntId.Value > 0)
                            {
                                var existingAcc = await _context.AccionesObjetivosEntidades.FindAsync(accDto.AccObjEntId.Value);
                                if (existingAcc != null)
                                {
                                    existingAcc.NumeracionAcc = accDto.NumeracionAcc;
                                    existingAcc.DescripcionAccion = accDto.DescripcionAccion;
                                    existingAcc.Activo = accDto.Activo;
                                }
                            }
                            else
                            {
                                var newAcc = new AccionObjetivoEntidadEntity
                                {
                                    ObjEntId = existing.ObjEntId,
                                    NumeracionAcc = accDto.NumeracionAcc,
                                    DescripcionAccion = accDto.DescripcionAccion,
                                    Activo = true,
                                    CreatedAt = DateTime.UtcNow
                                };
                                _context.AccionesObjetivosEntidades.Add(newAcc);
                            }
                        }
                    }
                }
            }
            else
            {
                var newObj = new ObjetivoEntidadEntity
                {
                    ComEntidadId = comEntidadId,
                    TipoObj = dto.TipoObj,
                    NumeracionObj = dto.NumeracionObj,
                    DescripcionObjetivo = dto.DescripcionObjetivo,
                    Activo = true,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ObjetivosEntidades.Add(newObj);
                await _context.SaveChangesAsync(cancellationToken);

                if (dto.Acciones != null)
                {
                    foreach (var accDto in dto.Acciones)
                    {
                        var newAcc = new AccionObjetivoEntidadEntity
                        {
                            ObjEntId = newObj.ObjEntId,
                            NumeracionAcc = accDto.NumeracionAcc,
                            DescripcionAccion = accDto.DescripcionAccion,
                            Activo = true,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.AccionesObjetivosEntidades.Add(newAcc);
                    }
                }
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateProyectos(long comEntidadId, List<ProyectoEntidadDto>? proyectosList, CancellationToken cancellationToken)
    {
        if (proyectosList == null) return;

        var existingIds = proyectosList.Where(p => p.ProyEntId.HasValue).Select(p => p.ProyEntId!.Value).ToList();
        var toDeactivate = await _context.ProyectosEntidades
            .Where(p => p.ComEntidadId == comEntidadId && p.Activo && !existingIds.Contains(p.ProyEntId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDeactivate)
        {
            item.Activo = false;
        }

        foreach (var dto in proyectosList)
        {
            if (dto.ProyEntId.HasValue && dto.ProyEntId.Value > 0)
            {
                var existing = await _context.ProyectosEntidades.FindAsync(dto.ProyEntId.Value);
                if (existing != null)
                {
                    existing.NumeracionProy = dto.NumeracionProy;
                    existing.Nombre = dto.Nombre;
                    existing.Alcance = dto.Alcance;
                    existing.Justificacion = dto.Justificacion;
                    existing.TipoProy = dto.TipoProy;
                    existing.AreaProy = dto.AreaProy;
                    existing.AreaEjecuta = dto.AreaEjecuta;
                    existing.TipoBeneficiario = dto.TipoBeneficiario;
                    existing.EtapaProyecto = dto.EtapaProyecto;
                    existing.AmbitoProyecto = dto.AmbitoProyecto;
                    existing.FecIniProg = dto.FecIniProg;
                    existing.FecFinProg = dto.FecFinProg;
                    existing.FecIniReal = dto.FecIniReal;
                    existing.FecFinReal = dto.FecFinReal;
                    existing.MontoInversion = dto.MontoInversion;
                    existing.EstadoProyecto = dto.EstadoProyecto;
                    existing.Activo = dto.Activo;
                }
            }
            else
            {
                var newProy = new ProyectoEntidadEntity
                {
                    ComEntidadId = comEntidadId,
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
                _context.ProyectosEntidades.Add(newProy);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<Com3EPGDResponse> BuildResponse(PCM.Domain.Entities.Com3EPGD entity, CancellationToken cancellationToken)
    {
        // Cargar datos relacionados
        var personalList = await _context.PersonalTI
            .Where(p => p.ComEntidadId == entity.ComepgdEntId && p.Activo)
            .ToListAsync(cancellationToken);

        var softwareList = await _context.InventarioSoftware
            .Where(s => s.ComEntidadId == entity.ComepgdEntId && s.Activo)
            .ToListAsync(cancellationToken);

        var sistemasList = await _context.InventarioSistemasInfo
            .Where(s => s.ComEntidadId == entity.ComepgdEntId && s.Activo)
            .ToListAsync(cancellationToken);

        var redList = await _context.InventarioRed
            .Where(r => r.ComEntidadId == entity.ComepgdEntId && r.Activo)
            .ToListAsync(cancellationToken);

        var servidoresList = await _context.InventarioServidores
            .Where(s => s.ComEntidadId == entity.ComepgdEntId && s.Activo)
            .ToListAsync(cancellationToken);

        var seguridadInfo = await _context.SeguridadInfo
            .FirstOrDefaultAsync(s => s.ComEntidadId == entity.ComepgdEntId && s.Activo, cancellationToken);

        var objetivosList = await _context.ObjetivosEntidades
            .Where(o => o.ComEntidadId == entity.ComepgdEntId && o.Activo)
            .ToListAsync(cancellationToken);

        var proyectosList = await _context.ProyectosEntidades
            .Where(p => p.ComEntidadId == entity.ComepgdEntId && p.Activo)
            .ToListAsync(cancellationToken);

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
                EmailPersonal = p.EmailPersonal,
                Telefono = p.Telefono,
                Activo = p.Activo
            }).ToList(),
            InventariosSoftware = softwareList.Select(s => new InventarioSoftwareDto
            {
                InvSoftId = s.InvSoftId,
                CodProducto = s.CodProducto,
                NombreProducto = s.NombreProducto,
                Version = s.Version,
                TipoSoftware = s.TipoSoftware,
                CantidadInstalaciones = s.CantidadInstalaciones,
                CantidadLicencias = s.CantidadLicencias,
                ExcesoDeficiencia = s.ExcesoDeficiencia,
                CostoLicencias = s.CostoLicencias,
                Activo = s.Activo
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
                Plataforma = s.Plataforma,
                Activo = s.Activo
            }).ToList(),
            InventariosRed = redList.Select(r => new InventarioRedDto
            {
                InvRedId = r.InvRedId,
                TipoEquipo = r.TipoEquipo,
                Cantidad = r.Cantidad,
                PuertosOperativos = r.PuertosOperativos,
                PuertosInoperativos = r.PuertosInoperativos,
                CostoMantenimientoAnual = r.CostoMantenimientoAnual,
                Observaciones = r.Observaciones,
                Activo = r.Activo
            }).ToList(),
            InventariosServidores = servidoresList.Select(s => new InventarioServidoresDto
            {
                InvSrvId = s.InvSrvId,
                NombreEquipo = s.NombreEquipo,
                TipoEquipo = s.TipoEquipo,
                Estado = s.Estado,
                Capa = s.Capa,
                Propiedad = s.Propiedad,
                MemoriaGb = s.MemoriaGb,
                CostoMantenimientoAnual = s.CostoMantenimientoAnual,
                Observaciones = s.Observaciones,
                Activo = s.Activo
            }).ToList(),
            Objetivos = objetivosList.Select(o => new ObjetivoEntidadDto
            {
                ObjEntId = o.ObjEntId,
                TipoObj = o.TipoObj,
                NumeracionObj = o.NumeracionObj,
                DescripcionObjetivo = o.DescripcionObjetivo,
                Activo = o.Activo
            }).ToList(),
            Proyectos = proyectosList.Select(p => new ProyectoEntidadDto
            {
                ProyEntId = p.ProyEntId,
                NumeracionProy = p.NumeracionProy,
                Nombre = p.Nombre,
                AreaProy = p.AreaProy,
                AreaEjecuta = p.AreaEjecuta,
                TipoBeneficiario = p.TipoBeneficiario,
                EtapaProyecto = p.EtapaProyecto,
                AmbitoProyecto = p.AmbitoProyecto,
                FecIniProg = p.FecIniProg,
                FecFinProg = p.FecFinProg,
                FecIniReal = p.FecIniReal,
                FecFinReal = p.FecFinReal,
                MontoInversion = p.MontoInversion,
                Activo = p.Activo
            }).ToList()
        };
    }
}
