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
            if (request.RutaPdfNormativa != null)
                entity.RutaPdfNormativa = request.RutaPdfNormativa;
            entity.EstadoPcm = request.EstadoPcm ?? entity.EstadoPcm;
            entity.ObservacionesPcm = request.ObservacionesPcm ?? entity.ObservacionesPcm;
            entity.FechaReporte = request.FechaReporte ?? entity.FechaReporte;
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

        // Eliminar los que no están en la lista (hard delete, ya que no hay columna activo)
        var existingIds = personalList.Where(p => p.PersonalId.HasValue).Select(p => p.PersonalId!.Value).ToList();
        var toDelete = await _context.PersonalTI
            .Where(p => p.ComEntidadId == comEntidadId && !existingIds.Contains(p.PersonalId))
            .ToListAsync(cancellationToken);
        
        _context.PersonalTI.RemoveRange(toDelete);

        foreach (var dto in personalList)
        {
            if (dto.PersonalId.HasValue && dto.PersonalId.Value > 0)
            {
                var existing = await _context.PersonalTI.FindAsync(dto.PersonalId.Value);
                if (existing != null)
                {
                    existing.NombrePersona = dto.NombrePersona ?? existing.NombrePersona;
                    existing.Dni = dto.Dni ?? existing.Dni;
                    existing.Cargo = dto.Cargo ?? existing.Cargo;
                    existing.Rol = dto.Rol ?? existing.Rol;
                    existing.Especialidad = dto.Especialidad ?? existing.Especialidad;
                    existing.GradoInstruccion = dto.GradoInstruccion ?? existing.GradoInstruccion;
                    existing.Certificacion = dto.Certificacion ?? existing.Certificacion;
                    existing.EmailPersonal = dto.EmailPersonal ?? existing.EmailPersonal;
                    existing.Telefono = dto.Telefono ?? existing.Telefono;
                }
            }
            else
            {
                var newItem = new PersonalTIEntity
                {
                    ComEntidadId = comEntidadId,
                    NombrePersona = dto.NombrePersona ?? string.Empty,
                    Dni = dto.Dni ?? string.Empty,
                    Cargo = dto.Cargo ?? string.Empty,
                    Rol = dto.Rol ?? string.Empty,
                    Especialidad = dto.Especialidad ?? string.Empty,
                    GradoInstruccion = dto.GradoInstruccion ?? string.Empty,
                    Certificacion = dto.Certificacion ?? string.Empty,
                    EmailPersonal = dto.EmailPersonal ?? string.Empty,
                    Telefono = dto.Telefono ?? string.Empty
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
        var toDelete = await _context.InventarioSoftware
            .Where(s => s.ComEntidadId == comEntidadId && !existingIds.Contains(s.InvSoftId))
            .ToListAsync(cancellationToken);
        
        _context.InventarioSoftware.RemoveRange(toDelete);

        foreach (var dto in softwareList)
        {
            if (dto.InvSoftId.HasValue && dto.InvSoftId.Value > 0)
            {
                var existing = await _context.InventarioSoftware.FindAsync(dto.InvSoftId.Value);
                if (existing != null)
                {
                    existing.CodProducto = dto.CodProducto ?? existing.CodProducto;
                    existing.NombreProducto = dto.NombreProducto ?? existing.NombreProducto;
                    existing.Version = dto.Version ?? existing.Version;
                    existing.TipoSoftware = dto.TipoSoftware ?? existing.TipoSoftware;
                    existing.CantidadInstalaciones = dto.CantidadInstalaciones;
                    existing.CantidadLicencias = dto.CantidadLicencias;
                    existing.ExcesoDeficiencia = dto.ExcesoDeficiencia;
                    existing.CostoLicencias = dto.CostoLicencias;
                }
            }
            else
            {
                var newItem = new InventarioSoftwareEntity
                {
                    ComEntidadId = comEntidadId,
                    CodProducto = dto.CodProducto ?? string.Empty,
                    NombreProducto = dto.NombreProducto ?? string.Empty,
                    Version = dto.Version ?? string.Empty,
                    TipoSoftware = dto.TipoSoftware ?? string.Empty,
                    CantidadInstalaciones = dto.CantidadInstalaciones,
                    CantidadLicencias = dto.CantidadLicencias,
                    ExcesoDeficiencia = dto.ExcesoDeficiencia,
                    CostoLicencias = dto.CostoLicencias
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
        var toDelete = await _context.InventarioSistemasInfo
            .Where(s => s.ComEntidadId == comEntidadId && !existingIds.Contains(s.InvSiId))
            .ToListAsync(cancellationToken);
        
        _context.InventarioSistemasInfo.RemoveRange(toDelete);

        foreach (var dto in sistemasList)
        {
            if (dto.InvSiId.HasValue && dto.InvSiId.Value > 0)
            {
                var existing = await _context.InventarioSistemasInfo.FindAsync(dto.InvSiId.Value);
                if (existing != null)
                {
                    existing.Codigo = dto.Codigo ?? existing.Codigo;
                    existing.NombreSistema = dto.NombreSistema ?? existing.NombreSistema;
                    existing.Descripcion = dto.Descripcion ?? existing.Descripcion;
                    existing.TipoSistema = dto.TipoSistema ?? existing.TipoSistema;
                    existing.LenguajeProgramacion = dto.LenguajeProgramacion ?? existing.LenguajeProgramacion;
                    existing.BaseDatos = dto.BaseDatos ?? existing.BaseDatos;
                    existing.Plataforma = dto.Plataforma ?? existing.Plataforma;
                }
            }
            else
            {
                var newItem = new InventarioSistemasInfoEntity
                {
                    ComEntidadId = comEntidadId,
                    Codigo = dto.Codigo ?? string.Empty,
                    NombreSistema = dto.NombreSistema ?? string.Empty,
                    Descripcion = dto.Descripcion ?? string.Empty,
                    TipoSistema = dto.TipoSistema ?? string.Empty,
                    LenguajeProgramacion = dto.LenguajeProgramacion ?? string.Empty,
                    BaseDatos = dto.BaseDatos ?? string.Empty,
                    Plataforma = dto.Plataforma ?? string.Empty
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
        var toDelete = await _context.InventarioRed
            .Where(r => r.ComEntidadId == comEntidadId && !existingIds.Contains(r.InvRedId))
            .ToListAsync(cancellationToken);
        
        _context.InventarioRed.RemoveRange(toDelete);

        foreach (var dto in redList)
        {
            if (dto.InvRedId.HasValue && dto.InvRedId.Value > 0)
            {
                var existing = await _context.InventarioRed.FindAsync(dto.InvRedId.Value);
                if (existing != null)
                {
                    existing.TipoEquipo = dto.TipoEquipo ?? existing.TipoEquipo;
                    existing.Cantidad = dto.Cantidad;
                    existing.PuertosOperativos = dto.PuertosOperativos;
                    existing.PuertosInoperativos = dto.PuertosInoperativos;
                    existing.TotalPuertos = dto.TotalPuertos;
                    existing.CostoMantenimientoAnual = dto.CostoMantenimientoAnual;
                    existing.Observaciones = dto.Observaciones ?? existing.Observaciones;
                }
            }
            else
            {
                var newItem = new InventarioRedEntity
                {
                    ComEntidadId = comEntidadId,
                    TipoEquipo = dto.TipoEquipo ?? string.Empty,
                    Cantidad = dto.Cantidad,
                    PuertosOperativos = dto.PuertosOperativos,
                    PuertosInoperativos = dto.PuertosInoperativos,
                    TotalPuertos = dto.TotalPuertos,
                    CostoMantenimientoAnual = dto.CostoMantenimientoAnual,
                    Observaciones = dto.Observaciones ?? string.Empty
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
        var toDelete = await _context.InventarioServidores
            .Where(s => s.ComEntidadId == comEntidadId && !existingIds.Contains(s.InvSrvId))
            .ToListAsync(cancellationToken);
        
        _context.InventarioServidores.RemoveRange(toDelete);

        foreach (var dto in servidoresList)
        {
            if (dto.InvSrvId.HasValue && dto.InvSrvId.Value > 0)
            {
                var existing = await _context.InventarioServidores.FindAsync(dto.InvSrvId.Value);
                if (existing != null)
                {
                    existing.NombreEquipo = dto.NombreEquipo ?? existing.NombreEquipo;
                    existing.TipoEquipo = dto.TipoEquipo ?? existing.TipoEquipo;
                    existing.Estado = dto.Estado ?? existing.Estado;
                    existing.Capa = dto.Capa ?? existing.Capa;
                    existing.Propiedad = dto.Propiedad ?? existing.Propiedad;
                    existing.Montaje = dto.Montaje ?? existing.Montaje;
                    existing.MarcaCpu = dto.MarcaCpu ?? existing.MarcaCpu;
                    existing.ModeloCpu = dto.ModeloCpu ?? existing.ModeloCpu;
                    existing.VelocidadGhz = dto.VelocidadGhz ?? existing.VelocidadGhz;
                    existing.Nucleos = dto.Nucleos ?? existing.Nucleos;
                    existing.MemoriaGb = dto.MemoriaGb ?? existing.MemoriaGb;
                    existing.MarcaMemoria = dto.MarcaMemoria ?? existing.MarcaMemoria;
                    existing.ModeloMemoria = dto.ModeloMemoria ?? existing.ModeloMemoria;
                    existing.CantidadMemoria = dto.CantidadMemoria ?? existing.CantidadMemoria;
                    existing.CostoMantenimientoAnual = dto.CostoMantenimientoAnual;
                    existing.Observaciones = dto.Observaciones ?? existing.Observaciones;
                }
            }
            else
            {
                var newItem = new InventarioServidoresEntity
                {
                    ComEntidadId = comEntidadId,
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
                _context.InventarioServidores.Add(newItem);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdateSeguridadInfo(long comEntidadId, SeguridadInfoDto? seguridadDto, CancellationToken cancellationToken)
    {
        if (seguridadDto == null) return;

        var existing = await _context.SeguridadInfo
            .FirstOrDefaultAsync(s => s.ComEntidadId == comEntidadId, cancellationToken);

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
            existing.Observaciones = seguridadDto.Observaciones ?? existing.Observaciones;

            // Actualizar capacitaciones
            if (seguridadDto.Capacitaciones != null)
            {
                var existingCapIds = seguridadDto.Capacitaciones.Where(c => c.CapsegId.HasValue).Select(c => c.CapsegId!.Value).ToList();
                var toDeleteCaps = await _context.CapacitacionesSeginfo
                    .Where(c => c.ComEntidadId == existing.SeginfoId && !existingCapIds.Contains(c.CapsegId))
                    .ToListAsync(cancellationToken);
                
                _context.CapacitacionesSeginfo.RemoveRange(toDeleteCaps);

                foreach (var capDto in seguridadDto.Capacitaciones)
                {
                    if (capDto.CapsegId.HasValue && capDto.CapsegId.Value > 0)
                    {
                        var existingCap = await _context.CapacitacionesSeginfo.FindAsync(capDto.CapsegId.Value);
                        if (existingCap != null)
                        {
                            existingCap.Curso = capDto.Curso ?? existingCap.Curso;
                            existingCap.CantidadPersonas = capDto.CantidadPersonas;
                        }
                    }
                    else
                    {
                        var newCap = new CapacitacionSeginfoEntity
                        {
                            ComEntidadId = comEntidadId, // Debe ser el ID de Com3EPGD, no SeginfoId
                            Curso = capDto.Curso ?? string.Empty,
                            CantidadPersonas = capDto.CantidadPersonas
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
                Observaciones = seguridadDto.Observaciones ?? string.Empty
            };
            _context.SeguridadInfo.Add(newSeguridad);
            await _context.SaveChangesAsync(cancellationToken);

            if (seguridadDto.Capacitaciones != null)
            {
                foreach (var capDto in seguridadDto.Capacitaciones)
                {
                    var newCap = new CapacitacionSeginfoEntity
                    {
                        ComEntidadId = comEntidadId, // Debe ser el ID de Com3EPGD, no SeginfoId
                        Curso = capDto.Curso ?? string.Empty,
                        CantidadPersonas = capDto.CantidadPersonas
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

        // Eliminar objetivos que ya no están en la lista (hard delete, ya que no hay columna activo)
        var existingIds = objetivosList.Where(o => o.ObjEntId.HasValue).Select(o => o.ObjEntId!.Value).ToList();
        var toDelete = await _context.ObjetivosEntidades
            .Where(o => o.ComEntidadId == comEntidadId && !existingIds.Contains(o.ObjEntId))
            .ToListAsync(cancellationToken);
        
        foreach (var item in toDelete)
        {
            // Primero eliminar acciones asociadas
            var acciones = await _context.AccionesObjetivosEntidades
                .Where(a => a.ObjEntId == item.ObjEntId)
                .ToListAsync(cancellationToken);
            _context.AccionesObjetivosEntidades.RemoveRange(acciones);
        }
        _context.ObjetivosEntidades.RemoveRange(toDelete);

        foreach (var dto in objetivosList)
        {
            if (dto.ObjEntId.HasValue && dto.ObjEntId.Value > 0)
            {
                var existing = await _context.ObjetivosEntidades.FindAsync(dto.ObjEntId.Value);
                if (existing != null)
                {
                    existing.TipoObj = dto.TipoObj ?? existing.TipoObj;
                    existing.NumeracionObj = dto.NumeracionObj ?? existing.NumeracionObj;
                    existing.DescripcionObjetivo = dto.DescripcionObjetivo ?? existing.DescripcionObjetivo;

                    // Actualizar acciones
                    if (dto.Acciones != null)
                    {
                        var existingAccIds = dto.Acciones.Where(a => a.AccObjEntId.HasValue).Select(a => a.AccObjEntId!.Value).ToList();
                        var toDeleteAcc = await _context.AccionesObjetivosEntidades
                            .Where(a => a.ObjEntId == existing.ObjEntId && !existingAccIds.Contains(a.AccObjEntId))
                            .ToListAsync(cancellationToken);
                        
                        _context.AccionesObjetivosEntidades.RemoveRange(toDeleteAcc);

                        foreach (var accDto in dto.Acciones)
                        {
                            if (accDto.AccObjEntId.HasValue && accDto.AccObjEntId.Value > 0)
                            {
                                var existingAcc = await _context.AccionesObjetivosEntidades.FindAsync(accDto.AccObjEntId.Value);
                                if (existingAcc != null)
                                {
                                    existingAcc.NumeracionAcc = accDto.NumeracionAcc ?? existingAcc.NumeracionAcc;
                                    existingAcc.DescripcionAccion = accDto.DescripcionAccion ?? existingAcc.DescripcionAccion;
                                }
                            }
                            else
                            {
                                var newAcc = new AccionObjetivoEntidadEntity
                                {
                                    ObjEntId = existing.ObjEntId,
                                    NumeracionAcc = accDto.NumeracionAcc ?? string.Empty,
                                    DescripcionAccion = accDto.DescripcionAccion ?? string.Empty
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
                    TipoObj = dto.TipoObj ?? "E",
                    NumeracionObj = dto.NumeracionObj ?? string.Empty,
                    DescripcionObjetivo = dto.DescripcionObjetivo ?? string.Empty
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
                            NumeracionAcc = accDto.NumeracionAcc ?? string.Empty,
                            DescripcionAccion = accDto.DescripcionAccion ?? string.Empty
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

        // Eliminar proyectos que ya no están en la lista (hard delete, ya que no hay columna activo)
        var existingIds = proyectosList.Where(p => p.ProyEntId.HasValue).Select(p => p.ProyEntId!.Value).ToList();
        var toDelete = await _context.ProyectosEntidades
            .Where(p => p.ComEntidadId == comEntidadId && !existingIds.Contains(p.ProyEntId))
            .ToListAsync(cancellationToken);
        
        _context.ProyectosEntidades.RemoveRange(toDelete);

        foreach (var dto in proyectosList)
        {
            if (dto.ProyEntId.HasValue && dto.ProyEntId.Value > 0)
            {
                var existing = await _context.ProyectosEntidades.FindAsync(dto.ProyEntId.Value);
                if (existing != null)
                {
                    existing.NumeracionProy = dto.NumeracionProy ?? existing.NumeracionProy;
                    existing.Nombre = dto.Nombre ?? existing.Nombre;
                    existing.Alcance = dto.Alcance ?? existing.Alcance;
                    existing.Justificacion = dto.Justificacion ?? existing.Justificacion;
                    existing.TipoProy = dto.TipoProy ?? existing.TipoProy;
                    existing.AreaProy = dto.AreaProy ?? existing.AreaProy;
                    existing.AreaEjecuta = dto.AreaEjecuta ?? existing.AreaEjecuta;
                    existing.TipoBeneficiario = dto.TipoBeneficiario ?? existing.TipoBeneficiario;
                    existing.EtapaProyecto = dto.EtapaProyecto ?? existing.EtapaProyecto;
                    existing.AmbitoProyecto = dto.AmbitoProyecto ?? existing.AmbitoProyecto;
                    existing.FecIniProg = dto.FecIniProg ?? existing.FecIniProg;
                    existing.FecFinProg = dto.FecFinProg ?? existing.FecFinProg;
                    existing.FecIniReal = dto.FecIniReal ?? existing.FecIniReal;
                    existing.FecFinReal = dto.FecFinReal ?? existing.FecFinReal;
                    // existing.MontoInversion = dto.MontoInversion; // COLUMNA NO EXISTE EN BD
                    existing.EstadoProyecto = dto.EstadoProyecto;
                    existing.AlineadoPgd = dto.AlineadoPgd ?? existing.AlineadoPgd;
                    existing.ObjTranDig = dto.ObjTranDig ?? existing.ObjTranDig;
                    existing.ObjEst = dto.ObjEst ?? existing.ObjEst;
                    existing.AccEst = dto.AccEst ?? existing.AccEst;
                }
            }
            else
            {
                var newProy = new ProyectoEntidadEntity
                {
                    ComEntidadId = comEntidadId,
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
                    // MontoInversion = dto.MontoInversion, // COLUMNA NO EXISTE EN BD
                    EstadoProyecto = dto.EstadoProyecto,
                    AlineadoPgd = dto.AlineadoPgd ?? string.Empty,
                    ObjTranDig = dto.ObjTranDig ?? string.Empty,
                    ObjEst = dto.ObjEst ?? string.Empty,
                    AccEst = dto.AccEst ?? string.Empty
                };
                _context.ProyectosEntidades.Add(newProy);
            }
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<Com3EPGDResponse> BuildResponse(PCM.Domain.Entities.Com3EPGD entity, CancellationToken cancellationToken)
    {
        // Cargar datos relacionados - Sin filtro de Activo porque las tablas hijas no tienen esa columna
        var personalList = await _context.PersonalTI
            .Where(p => p.ComEntidadId == entity.ComepgdEntId)
            .ToListAsync(cancellationToken);

        var softwareList = await _context.InventarioSoftware
            .Where(s => s.ComEntidadId == entity.ComepgdEntId)
            .ToListAsync(cancellationToken);

        var sistemasList = await _context.InventarioSistemasInfo
            .Where(s => s.ComEntidadId == entity.ComepgdEntId)
            .ToListAsync(cancellationToken);

        var redList = await _context.InventarioRed
            .Where(r => r.ComEntidadId == entity.ComepgdEntId)
            .ToListAsync(cancellationToken);

        var servidoresList = await _context.InventarioServidores
            .Where(s => s.ComEntidadId == entity.ComepgdEntId)
            .ToListAsync(cancellationToken);

        var seguridadInfo = await _context.SeguridadInfo
            .FirstOrDefaultAsync(s => s.ComEntidadId == entity.ComepgdEntId, cancellationToken);

        var objetivosList = await _context.ObjetivosEntidades
            .Where(o => o.ComEntidadId == entity.ComepgdEntId)
            .ToListAsync(cancellationToken);

        var proyectosList = await _context.ProyectosEntidades
            .Where(p => p.ComEntidadId == entity.ComepgdEntId)
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
                MemoriaGb = (int)s.MemoriaGb,
                CostoMantenimientoAnual = s.CostoMantenimientoAnual,
                Observaciones = s.Observaciones
            }).ToList(),
            Objetivos = objetivosList.Select(o => new ObjetivoEntidadDto
            {
                ObjEntId = o.ObjEntId,
                TipoObj = o.TipoObj,
                NumeracionObj = o.NumeracionObj,
                DescripcionObjetivo = o.DescripcionObjetivo
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
                FecFinReal = p.FecFinReal
                // MontoInversion = p.MontoInversion // COLUMNA NO EXISTE EN BD
            }).ToList()
        };
    }
}
