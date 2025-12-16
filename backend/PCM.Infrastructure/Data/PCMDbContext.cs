using Microsoft.EntityFrameworkCore;
using PCM.Domain.Entities;
using System.Linq;

namespace PCM.Infrastructure.Data;

public class PCMDbContext : DbContext
{
    public PCMDbContext(DbContextOptions<PCMDbContext> options) : base(options)
    {
    }

    // DbSets principales
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Entidad> Entidades { get; set; }
    public DbSet<Perfil> Perfiles { get; set; }
    public DbSet<Ubigeo> Ubigeos { get; set; }
    public DbSet<Clasificacion> Clasificaciones { get; set; }
    public DbSet<Subclasificacion> Subclasificaciones { get; set; }
    public DbSet<NivelGobierno> NivelesGobierno { get; set; }
    public DbSet<Sector> Sectores { get; set; }
    public DbSet<TipoNorma> TiposNorma { get; set; }
    // NOTA: EstadoCompromiso NO se expone como DbSet para evitar que EF Core infiera navegaciones automáticas
    // Se puede acceder mediante: context.Set<EstadoCompromiso>() cuando sea necesario
    public DbSet<TablaTablas> TablaTablas { get; set; }
    public DbSet<MarcoNormativo> MarcosNormativos { get; set; }
    public DbSet<PermisoModulo> PermisosModulos { get; set; }
    public DbSet<PerfilPermiso> PerfilesPermisos { get; set; }
    public DbSet<CompromisoGobiernoDigital> CompromisosGobiernoDigital { get; set; }
    public DbSet<CompromisoNormativa> CompromisosNormativas { get; set; }
    public DbSet<CriterioEvaluacion> CriteriosEvaluacion { get; set; }
    public DbSet<AlcanceCompromiso> AlcancesCompromisos { get; set; }
    public DbSet<CumplimientoNormativo> CumplimientosNormativos { get; set; }
    public DbSet<Com1LiderGTD> Com1LiderGTD { get; set; }
    public DbSet<Com2CGTD> Com2CGTD { get; set; }
    public DbSet<ComiteMiembro> ComiteMiembros { get; set; }
    public DbSet<Com3EPGD> Com3EPGD { get; set; }
    public DbSet<PersonalTI> PersonalTI { get; set; }
    public DbSet<InventarioSoftware> InventarioSoftware { get; set; }
    public DbSet<InventarioSistemasInfo> InventarioSistemasInfo { get; set; }
    public DbSet<InventarioRed> InventarioRed { get; set; }
    public DbSet<InventarioServidores> InventarioServidores { get; set; }
    public DbSet<SeguridadInfo> SeguridadInfo { get; set; }
    public DbSet<CapacitacionSeginfo> CapacitacionesSeginfo { get; set; }
    public DbSet<ObjetivoEntidad> ObjetivosEntidades { get; set; }
    public DbSet<AccionObjetivoEntidad> AccionesObjetivosEntidades { get; set; }
    public DbSet<ProyectoEntidad> ProyectosEntidades { get; set; }
    public DbSet<Com4PEI> Com4PEI { get; set; }
    public DbSet<Com5EstrategiaDigital> Com5EstrategiaDigital { get; set; }
    public DbSet<Com6MigracionGobPe> Com6MigracionGobPe { get; set; }
    public DbSet<Com7ImplementacionMPD> Com7ImplementacionMPD { get; set; }
    public DbSet<Com8PublicacionTUPA> Com8PublicacionTUPA { get; set; }
    public DbSet<Com9ModeloGestionDocumental> Com9ModeloGestionDocumental { get; set; }
    public DbSet<Com10DatosAbiertos> Com10DatosAbiertos { get; set; }
    public DbSet<Com11AportacionGeoPeru> Com11AportacionGeoPeru { get; set; }
    public DbSet<Com12ResponsableSoftwarePublico> Com12ResponsableSoftwarePublico { get; set; }
    public DbSet<Com13InteroperabilidadPIDE> Com13InteroperabilidadPIDE { get; set; }
    public DbSet<Com14OficialSeguridadDigital> Com14OficialSeguridadDigital { get; set; }
    public DbSet<Com15CSIRTInstitucional> Com15CSIRTInstitucional { get; set; }
    public DbSet<Com16SistemaGestionSeguridad> Com16SistemaGestionSeguridad { get; set; }
    public DbSet<Com17PlanTransicionIPv6> Com17PlanTransicionIPv6 { get; set; }
    public DbSet<Com18AccesoPortalTransparencia> Com18AccesoPortalTransparencia { get; set; }
    public DbSet<Com19EncuestaNacionalGobDigital> Com19EncuestaNacionalGobDigital { get; set; }
    public DbSet<Com20DigitalizacionServiciosFacilita> Com20DigitalizacionServiciosFacilita { get; set; }
    public DbSet<Com21OficialGobiernoDatos> Com21OficialGobiernoDatos { get; set; }
    public DbSet<LogAuditoria> LogAuditoria { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de Usuario
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Password).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            entity.Property(e => e.NumDni).HasColumnName("num_dni").HasMaxLength(15).IsRequired();
            entity.Property(e => e.Nombres).HasColumnName("nombres").HasMaxLength(100).IsRequired();
            entity.Property(e => e.ApePaterno).HasColumnName("ape_paterno").HasMaxLength(60).IsRequired();
            entity.Property(e => e.ApeMaterno).HasColumnName("ape_materno").HasMaxLength(60).IsRequired();
            entity.Property(e => e.Direccion).HasColumnName("direccion").HasMaxLength(200);
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id");
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.PerfilId).HasColumnName("perfil_id").IsRequired();
            entity.Property(e => e.LastLogin).HasColumnName("last_login");
            entity.Property(e => e.ResetPasswordToken).HasColumnName("reset_password_token").HasMaxLength(100);
            entity.Property(e => e.ResetPasswordExpiry).HasColumnName("reset_password_expiry");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.NumDni).IsUnique();

            entity.HasOne(e => e.Entidad)
                .WithMany(e => e.Usuarios)
                .HasForeignKey(e => e.EntidadId)
                .HasConstraintName("fk_usuarios_entidad");

            entity.HasOne(e => e.Perfil)
                .WithMany(p => p.Usuarios)
                .HasForeignKey(e => e.PerfilId)
                .HasConstraintName("fk_usuarios_perfil");
        });

        // Configuración de Entidad
        modelBuilder.Entity<Entidad>(entity =>
        {
            entity.ToTable("entidades");
            entity.HasKey(e => e.EntidadId);
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id");
            entity.Property(e => e.Ruc).HasColumnName("ruc").HasMaxLength(11).IsRequired();
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(300).IsRequired();
            entity.Property(e => e.Direccion).HasColumnName("direccion").HasMaxLength(200);
            entity.Property(e => e.UbigeoId).HasColumnName("ubigeo_id");
            entity.Property(e => e.NivelGobiernoId).HasColumnName("nivel_gobierno_id");
            entity.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(20);
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100);
            entity.Property(e => e.Web).HasColumnName("web").HasMaxLength(100);
            entity.Property(e => e.SectorId).HasColumnName("sector_id");
            entity.Property(e => e.ClasificacionId).HasColumnName("subclasificacion_id");
            entity.Property(e => e.NombreAlcalde).HasColumnName("nombre_alcalde").HasMaxLength(100);
            entity.Property(e => e.ApePatAlcalde).HasColumnName("ape_pat_alcalde").HasMaxLength(60);
            entity.Property(e => e.ApeMatAlcalde).HasColumnName("ape_mat_alcalde").HasMaxLength(60);
            entity.Property(e => e.EmailAlcalde).HasColumnName("email_alcalde").HasMaxLength(100);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Ruc).IsUnique();

            entity.HasOne(e => e.Ubigeo)
                .WithMany(u => u.Entidades)
                .HasForeignKey(e => e.UbigeoId)
                .HasConstraintName("fk_entidades_ubigeo");

            entity.HasOne(e => e.Clasificacion)
                .WithMany(c => c.Entidades)
                .HasForeignKey(e => e.ClasificacionId)
                .HasPrincipalKey(c => c.SubclasificacionId)
                .HasConstraintName("fk_entidades_subclasificacion");

            entity.HasOne(e => e.NivelGobierno)
                .WithMany(n => n.Entidades)
                .HasForeignKey(e => e.NivelGobiernoId)
                .HasConstraintName("fk_entidades_nivel_gobierno");

            entity.HasOne(e => e.Sector)
                .WithMany(s => s.Entidades)
                .HasForeignKey(e => e.SectorId)
                .HasConstraintName("fk_entidades_sector");
        });

        // Configuración de Perfil
        modelBuilder.Entity<Perfil>(entity =>
        {
            entity.ToTable("perfiles");
            entity.HasKey(e => e.PerfilId);
            entity.Property(e => e.PerfilId).HasColumnName("perfil_id");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Nombre).IsUnique();
        });

        // Configuración de Ubigeo (estructura INEI)
        modelBuilder.Entity<Ubigeo>(entity =>
        {
            entity.ToTable("ubigeo");
            entity.HasKey(e => e.UbigeoId);
            entity.Property(e => e.UbigeoId).HasColumnName("ubigeo_id").HasDefaultValueSql("gen_random_uuid()");
            
            // Códigos INEI (tamaños flexibles)
            entity.Property(e => e.UBDEP).HasColumnName("UBDEP").HasMaxLength(10);
            entity.Property(e => e.UBPRV).HasColumnName("UBPRV").HasMaxLength(10);
            entity.Property(e => e.UBDIS).HasColumnName("UBDIS").HasMaxLength(10);
            entity.Property(e => e.UBLOC).HasColumnName("UBLOC").HasMaxLength(20);
            entity.Property(e => e.COREG).HasColumnName("COREG").HasMaxLength(10);
            
            // Nombres
            entity.Property(e => e.NODEP).HasColumnName("NODEP").HasMaxLength(150).IsRequired();
            entity.Property(e => e.NOPRV).HasColumnName("NOPRV").HasMaxLength(150).IsRequired();
            entity.Property(e => e.NODIS).HasColumnName("NODIS").HasMaxLength(150).IsRequired();
            
            // Código postal
            entity.Property(e => e.CPDIS).HasColumnName("CPDIS").HasMaxLength(20);
            
            // Estados
            entity.Property(e => e.STUBI).HasColumnName("STUBI").HasMaxLength(20);
            entity.Property(e => e.STSOB).HasColumnName("STSOB").HasMaxLength(20);
            
            // Información adicional
            entity.Property(e => e.FERES).HasColumnName("FERES").HasMaxLength(50);
            entity.Property(e => e.INUBI).HasColumnName("INUBI").HasMaxLength(300);
            entity.Property(e => e.UB_INEI).HasColumnName("UB_INEI").HasMaxLength(20);
            entity.Property(e => e.CCOD_TIPO_UBI).HasColumnName("CCOD_TIPO_UBI").HasMaxLength(10);
            
            // Propiedades calculadas (no se mapean a la BD)
            entity.Ignore(e => e.Codigo);
            entity.Ignore(e => e.Departamento);
            entity.Ignore(e => e.Provincia);
            entity.Ignore(e => e.Distrito);
            
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Índices (UBDIS no es único porque el CSV del INEI puede tener duplicados)
            entity.HasIndex(e => e.UBDIS);
            entity.HasIndex(e => new { e.UBDEP, e.UBPRV, e.UBDIS });
        });

        // Configuración de Clasificacion
        modelBuilder.Entity<Clasificacion>(entity =>
        {
            entity.ToTable("clasificacion");
            entity.HasKey(e => e.ClasificacionId);
            entity.Property(e => e.ClasificacionId).HasColumnName("clasificacion_id");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(255);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configuración de MarcoNormativo
        modelBuilder.Entity<MarcoNormativo>(entity =>
        {
            entity.ToTable("marco_normativo");
            entity.HasKey(e => e.NormaId);
            entity.Property(e => e.NormaId).HasColumnName("norma_id");
            entity.Property(e => e.TipoNormaId).HasColumnName("tipo_norma_id").IsRequired();
            entity.Property(e => e.Numero).HasColumnName("numero").HasMaxLength(20).IsRequired();
            entity.Property(e => e.NombreNorma).HasColumnName("nombre_norma").HasMaxLength(150).IsRequired();
            entity.Property(e => e.NivelGobiernoId).HasColumnName("nivel_gobierno_id").IsRequired();
            entity.Property(e => e.SectorId).HasColumnName("sector_id").IsRequired();
            entity.Property(e => e.FechaPublicacion).HasColumnName("fecha_publicacion").IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasColumnType("text");
            entity.Property(e => e.Url).HasColumnName("url").HasMaxLength(500);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd()
                .Metadata.SetAfterSaveBehavior(Microsoft.EntityFrameworkCore.Metadata.PropertySaveBehavior.Ignore);
            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configuración de LogAuditoria
        modelBuilder.Entity<LogAuditoria>(entity =>
        {
            entity.ToTable("log_auditoria");
            entity.HasKey(e => e.LogId);
            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id").IsRequired();
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.Accion).HasColumnName("accion").HasMaxLength(100).IsRequired();
            entity.Property(e => e.TablaAfectada).HasColumnName("tabla_afectada").HasMaxLength(100);
            entity.Property(e => e.RegistroId).HasColumnName("registro_id");
            entity.Property(e => e.Detalle).HasColumnName("detalle").HasColumnType("text");
            entity.Property(e => e.IpAddress).HasColumnName("ip_address").HasMaxLength(45);
            entity.Property(e => e.UserAgent).HasColumnName("user_agent").HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Entidad)
                .WithMany()
                .HasForeignKey(e => e.EntidadId)
                .HasConstraintName("fk_log_entidad");

            entity.HasOne(e => e.Usuario)
                .WithMany()
                .HasForeignKey(e => e.UsuarioId)
                .HasConstraintName("fk_log_usuario");
        });

        // Configuración de NivelGobierno
        modelBuilder.Entity<NivelGobierno>(entity =>
        {
            entity.ToTable("nivel_gobierno");
            entity.HasKey(e => e.NivelGobiernoId);
            entity.Property(e => e.NivelGobiernoId).HasColumnName("nivel_gobierno_id");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(200);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Nombre).IsUnique();

            // Seed data
            entity.HasData(
                new NivelGobierno { NivelGobiernoId = 1, Nombre = "Nacional", Descripcion = "Gobierno Nacional", Activo = true },
                new NivelGobierno { NivelGobiernoId = 2, Nombre = "Regional", Descripcion = "Gobierno Regional", Activo = true },
                new NivelGobierno { NivelGobiernoId = 3, Nombre = "Local", Descripcion = "Gobierno Local", Activo = true }
            );
        });

        // Configuración de Sector
        modelBuilder.Entity<Sector>(entity =>
        {
            entity.ToTable("sector");
            entity.HasKey(e => e.SectorId);
            entity.Property(e => e.SectorId).HasColumnName("sector_id");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(200);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Nombre).IsUnique();

            // Seed data con sectores del gobierno peruano
            entity.HasData(
                new Sector { SectorId = 1, Nombre = "Presidencia del Consejo de Ministros", Descripcion = "PCM", Activo = true },
                new Sector { SectorId = 2, Nombre = "Educación", Descripcion = "MINEDU", Activo = true },
                new Sector { SectorId = 3, Nombre = "Salud", Descripcion = "MINSA", Activo = true },
                new Sector { SectorId = 4, Nombre = "Economía y Finanzas", Descripcion = "MEF", Activo = true },
                new Sector { SectorId = 5, Nombre = "Interior", Descripcion = "MININTER", Activo = true },
                new Sector { SectorId = 6, Nombre = "Defensa", Descripcion = "MINDEF", Activo = true },
                new Sector { SectorId = 7, Nombre = "Justicia y Derechos Humanos", Descripcion = "MINJUSDH", Activo = true },
                new Sector { SectorId = 8, Nombre = "Relaciones Exteriores", Descripcion = "MRE", Activo = true },
                new Sector { SectorId = 9, Nombre = "Trabajo y Promoción del Empleo", Descripcion = "MTPE", Activo = true },
                new Sector { SectorId = 10, Nombre = "Agricultura y Riego", Descripcion = "MIDAGRI", Activo = true },
                new Sector { SectorId = 11, Nombre = "Producción", Descripcion = "PRODUCE", Activo = true },
                new Sector { SectorId = 12, Nombre = "Comercio Exterior y Turismo", Descripcion = "MINCETUR", Activo = true },
                new Sector { SectorId = 13, Nombre = "Energía y Minas", Descripcion = "MINEM", Activo = true },
                new Sector { SectorId = 14, Nombre = "Transportes y Comunicaciones", Descripcion = "MTC", Activo = true },
                new Sector { SectorId = 15, Nombre = "Vivienda, Construcción y Saneamiento", Descripcion = "MVCS", Activo = true },
                new Sector { SectorId = 16, Nombre = "Ambiente", Descripcion = "MINAM", Activo = true },
                new Sector { SectorId = 17, Nombre = "Mujer y Poblaciones Vulnerables", Descripcion = "MIMP", Activo = true },
                new Sector { SectorId = 18, Nombre = "Desarrollo e Inclusión Social", Descripcion = "MIDIS", Activo = true },
                new Sector { SectorId = 19, Nombre = "Cultura", Descripcion = "MINCU", Activo = true },
                new Sector { SectorId = 20, Nombre = "Desarrollo Agrario y Riego", Descripcion = "MIDAGRI", Activo = true }
            );
        });

        // Configuración de TipoNorma
        modelBuilder.Entity<TipoNorma>(entity =>
        {
            entity.ToTable("tipo_norma");
            entity.HasKey(e => e.TipoNormaId);
            entity.Property(e => e.TipoNormaId).HasColumnName("tipo_norma_id");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(200);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Nombre).IsUnique();

            // Seed data
            entity.HasData(
                new TipoNorma { TipoNormaId = 1, Nombre = "Ley", Descripcion = "Norma con rango de Ley", Activo = true },
                new TipoNorma { TipoNormaId = 2, Nombre = "Decreto Supremo", Descripcion = "Norma del Poder Ejecutivo", Activo = true },
                new TipoNorma { TipoNormaId = 3, Nombre = "Resolución Ministerial", Descripcion = "Norma de nivel ministerial", Activo = true },
                new TipoNorma { TipoNormaId = 4, Nombre = "Resolución Directoral", Descripcion = "Norma de nivel directoral", Activo = true },
                new TipoNorma { TipoNormaId = 5, Nombre = "Ordenanza", Descripcion = "Norma de gobierno local o regional", Activo = true },
                new TipoNorma { TipoNormaId = 6, Nombre = "Decreto Legislativo", Descripcion = "Norma con rango de Ley emitida por el Ejecutivo", Activo = true },
                new TipoNorma { TipoNormaId = 7, Nombre = "Resolución Jefatural", Descripcion = "Norma de nivel jefatural", Activo = true }
            );
        });

        // NOTA: EstadoCompromiso se comenta completamente para evitar que EF Core lo incluya en el modelo
        // y genere relaciones automáticas. La tabla existe en la BD y se puede consultar directamente con SQL.
        
        /*
        // Configuración de EstadoCompromiso
        modelBuilder.Entity<EstadoCompromiso>(entity =>
        {
            entity.ToTable("estado_compromiso");
            entity.HasKey(e => e.EstadoId);
            entity.Property(e => e.EstadoId).HasColumnName("estado_id");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(200);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Nombre).IsUnique();

            // Seed data
            entity.HasData(
                new EstadoCompromiso { EstadoId = 1, Nombre = "pendiente", Descripcion = "Compromiso pendiente de ejecución", Activo = true },
                new EstadoCompromiso { EstadoId = 2, Nombre = "en_proceso", Descripcion = "Compromiso en proceso de ejecución", Activo = true },
                new EstadoCompromiso { EstadoId = 3, Nombre = "completado", Descripcion = "Compromiso completado exitosamente", Activo = true },
                new EstadoCompromiso { EstadoId = 4, Nombre = "cancelado", Descripcion = "Compromiso cancelado", Activo = true }
            );
        });
        */

        // Configuración de TablaTablas
        modelBuilder.Entity<TablaTablas>(entity =>
        {
            entity.ToTable("tabla_tablas");
            entity.HasKey(e => e.TablaId);
            entity.Property(e => e.TablaId).HasColumnName("tabla_id");
            entity.Property(e => e.NombreTabla).HasColumnName("nombre_tabla").HasMaxLength(50).IsRequired();
            entity.Property(e => e.ColumnaId).HasColumnName("columna_id").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Valor).HasColumnName("valor").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Orden).HasColumnName("orden").HasDefaultValue((short)0);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);

            entity.HasIndex(e => e.NombreTabla);
        });

        // Configuración de CompromisoGobiernoDigital
        modelBuilder.Entity<CompromisoGobiernoDigital>(entity =>
        {
            entity.ToTable("compromiso_gobierno_digital");
            entity.HasKey(e => e.CompromisoId);
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id");
            entity.Property(e => e.NombreCompromiso).HasColumnName("nombre_compromiso").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasColumnType("text");
            entity.Property(e => e.Alcances).HasColumnName("alcances").HasMaxLength(500).IsRequired();
            entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio").IsRequired();
            entity.Property(e => e.FechaFin).HasColumnName("fecha_fin").IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").IsRequired().HasDefaultValue(1);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // Configuración de CompromisoNormativa
        modelBuilder.Entity<CompromisoNormativa>(entity =>
        {
            entity.ToTable("compromiso_normativa");
            entity.HasKey(e => e.CompromisoNormativaId);
            entity.Property(e => e.CompromisoNormativaId).HasColumnName("compromiso_normativa_id");
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.NormaId).HasColumnName("norma_id").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Compromiso)
                .WithMany(c => c.Normativas)
                .HasForeignKey(e => e.CompromisoId)
                .HasConstraintName("fk_compromiso_normativa_compromiso");

            entity.HasOne(e => e.Norma)
                .WithMany()
                .HasForeignKey(e => e.NormaId)
                .HasConstraintName("fk_compromiso_normativa_norma");
        });

        // Configuración de CriterioEvaluacion
        modelBuilder.Entity<CriterioEvaluacion>(entity =>
        {
            entity.ToTable("criterio_evaluacion");
            entity.HasKey(e => e.CriterioEvaluacionId);
            entity.Property(e => e.CriterioEvaluacionId).HasColumnName("criterio_evaluacion_id");
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasColumnType("text").IsRequired();
            entity.Property(e => e.IdEstado).HasColumnName("estado").IsRequired().HasDefaultValue(1);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(e => e.Compromiso)
                .WithMany(c => c.CriteriosEvaluacion)
                .HasForeignKey(e => e.CompromisoId)
                .HasConstraintName("fk_criterio_evaluacion_compromiso");
        });

        // Configuración de AlcanceCompromiso
        modelBuilder.Entity<AlcanceCompromiso>(entity =>
        {
            entity.ToTable("alcance_compromisos");
            entity.HasKey(e => e.AlcanceCompromisoId);
            entity.Property(e => e.AlcanceCompromisoId)
                .HasColumnName("alc_com_id")
                .ValueGeneratedOnAdd(); // Auto-increment desde la BD
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.ClasificacionId).HasColumnName("subclasificacion_id").IsRequired();
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Compromiso)
                .WithMany(c => c.AlcancesCompromisos)
                .HasForeignKey(e => e.CompromisoId)
                .HasConstraintName("fk_alcance_compromiso_compromiso");

            entity.HasOne(e => e.Clasificacion)
                .WithMany()
                .HasForeignKey(e => e.ClasificacionId)
                .HasPrincipalKey(c => c.SubclasificacionId)
                .HasConstraintName("fk_alcance_compromiso_subclasificacion");

            entity.HasIndex(e => new { e.CompromisoId, e.ClasificacionId }).IsUnique();
        });

        // Configuración de CumplimientoNormativo (adaptado a estructura Supabase)
        modelBuilder.Entity<CumplimientoNormativo>(entity =>
        {
            entity.ToTable("cumplimiento_normativo");
            entity.HasKey(e => e.CumplimientoId);
            entity.Property(e => e.CumplimientoId).HasColumnName("cumplimiento_id");
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id").IsRequired();
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.EstadoId).HasColumnName("estado_id").IsRequired().HasDefaultValue(1);
            entity.Property(e => e.OperadorId).HasColumnName("operador_id");
            entity.Property(e => e.FechaAsignacion).HasColumnName("fecha_asignacion");
            entity.Property(e => e.ObservacionPcm).HasColumnName("observacion_pcm").HasColumnType("text");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("now()");
            
            // Campos adicionales para formulario
            entity.Property(e => e.CriteriosEvaluados).HasColumnName("criterios_evaluados").HasColumnType("jsonb");
            entity.Property(e => e.DocumentoUrl).HasColumnName("documento_url").HasColumnType("text");
            entity.Property(e => e.AceptaPoliticaPrivacidad).HasColumnName("acepta_politica_privacidad").HasDefaultValue(false);
            entity.Property(e => e.AceptaDeclaracionJurada).HasColumnName("acepta_declaracion_jurada").HasDefaultValue(false);
            entity.Property(e => e.EtapaFormulario).HasColumnName("etapa_formulario").HasMaxLength(50);

            // Relaciones
            entity.HasOne(e => e.Compromiso)
                .WithMany()
                .HasForeignKey(e => e.CompromisoId)
                .HasConstraintName("fk_cumplimiento_compromiso");

            entity.HasOne(e => e.Entidad)
                .WithMany()
                .HasForeignKey(e => e.EntidadId)
                .HasConstraintName("fk_cumplimiento_entidad");

            // Constraint único: una entidad solo puede tener un cumplimiento por compromiso
            entity.HasIndex(e => new { e.EntidadId, e.CompromisoId })
                .IsUnique()
                .HasDatabaseName("uq_cumplimiento_entidad_compromiso");
        });

        // Configuración de Com1LiderGTD (Compromiso 1)
        modelBuilder.Entity<Com1LiderGTD>(entity =>
        {
            entity.ToTable("com1_liderg_td");
            entity.HasKey(e => e.ComlgtdEntId);
            entity.Property(e => e.ComlgtdEntId).HasColumnName("comlgtd_ent_id").ValueGeneratedOnAdd();
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id").IsRequired();
            entity.Property(e => e.EtapaFormulario).HasColumnName("etapa_formulario").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(15).IsRequired();
            entity.Property(e => e.CheckPrivacidad).HasColumnName("check_privacidad").IsRequired();
            entity.Property(e => e.CheckDdjj).HasColumnName("check_ddjj").IsRequired();
            entity.Property(e => e.EstadoPCM).HasColumnName("estado_PCM").HasMaxLength(50);
            entity.Property(e => e.ObservacionesPCM).HasColumnName("observaciones_PCM").HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.Property(e => e.FecRegistro).HasColumnName("fec_registro").IsRequired();
            entity.Property(e => e.UsuarioRegistra).HasColumnName("usuario_registra").IsRequired();
            entity.Property(e => e.Activo).HasColumnName("activo").IsRequired();
            entity.Property(e => e.DniLider).HasColumnName("dni_lider").HasMaxLength(12).IsRequired();
            entity.Property(e => e.NombreLider).HasColumnName("nombre_lider").HasMaxLength(60).IsRequired();
            entity.Property(e => e.ApePatLider).HasColumnName("ape_pat_lider").HasMaxLength(60).IsRequired();
            entity.Property(e => e.ApeMatLider).HasColumnName("ape_mat_lider").HasMaxLength(60).IsRequired();
            entity.Property(e => e.EmailLider).HasColumnName("email_lider").HasMaxLength(30).IsRequired();
            entity.Property(e => e.TelefonoLider).HasColumnName("telefono_lider").HasMaxLength(30).IsRequired();
            entity.Property(e => e.RolLider).HasColumnName("rol_lider").HasMaxLength(20).IsRequired();
            entity.Property(e => e.CargoLider).HasColumnName("cargo_lider").HasMaxLength(20).IsRequired();
            entity.Property(e => e.FecIniLider).HasColumnName("fec_ini_lider").IsRequired();
            entity.Property(e => e.UrlDocPcm).HasColumnName("url_doc_pcm");
            entity.Property(e => e.RutaPdfNormativa).HasColumnName("ruta_pdf_normativa");

            // Relaciones
            entity.HasOne(e => e.Compromiso)
                .WithMany()
                .HasForeignKey(e => e.CompromisoId)
                .HasConstraintName("com1_liderg_td_fk1");

            entity.HasOne(e => e.Entidad)
                .WithMany()
                .HasForeignKey(e => e.EntidadId)
                .HasConstraintName("com1_liderg_td_fk2");
        });

        // Configuración de Com2CGTD (Compromiso 2: Comité GTD)
        modelBuilder.Entity<Com2CGTD>(entity =>
        {
            entity.ToTable("com2_cgtd");
            entity.HasKey(e => e.ComcgtdEntId);
            entity.Property(e => e.ComcgtdEntId).HasColumnName("comcgtd_ent_id");
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id").IsRequired();
            entity.Property(e => e.EtapaFormulario).HasColumnName("etapa_formulario").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(15).IsRequired();
            entity.Property(e => e.CheckPrivacidad).HasColumnName("check_privacidad").IsRequired();
            entity.Property(e => e.CheckDdjj).HasColumnName("check_ddjj").IsRequired();
            entity.Property(e => e.EstadoPcm).HasColumnName("estado_PCM").HasMaxLength(50);
            entity.Property(e => e.ObservacionesPcm).HasColumnName("observaciones_PCM").HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.Property(e => e.FecRegistro).HasColumnName("fec_registro").IsRequired();
            entity.Property(e => e.UsuarioRegistra).HasColumnName("usuario_registra").IsRequired();
            entity.Property(e => e.Activo).HasColumnName("activo").IsRequired();
            entity.Property(e => e.UrlDocPcm).HasColumnName("url_doc_pcm");
        });

        // Configuración de ComiteMiembro
        modelBuilder.Entity<ComiteMiembro>(entity =>
        {
            entity.ToTable("comite_miembros");
            entity.HasKey(e => e.MiembroId);
            entity.Property(e => e.MiembroId).HasColumnName("miembro_id");
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id");
            entity.Property(e => e.Dni).HasColumnName("dni").HasMaxLength(12);
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100);
            entity.Property(e => e.ApellidoPaterno).HasColumnName("apellido_paterno").HasMaxLength(60);
            entity.Property(e => e.ApellidoMaterno).HasColumnName("apellido_materno").HasMaxLength(60);
            entity.Property(e => e.Cargo).HasColumnName("cargo").HasMaxLength(100);
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100);
            entity.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(30);
            entity.Property(e => e.Rol).HasColumnName("rol").HasMaxLength(50);
            entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
            entity.Property(e => e.FechaFin).HasColumnName("fecha_fin");
            entity.Property(e => e.Activo).HasColumnName("activo");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // Configuración de Com4PEI - Supabase: com4_tdpei
        // Ya no necesitamos configuración manual porque usamos Data Annotations en la entidad

        // Configuración de Com5EstrategiaDigital - Supabase: com5_destrategiad
        // Ya no necesitamos configuración manual porque usamos Data Annotations en la entidad

        // Configuración de PermisoModulo
        modelBuilder.Entity<PermisoModulo>(entity =>
        {
            entity.ToTable("permisos_modulos");
            entity.HasKey(e => e.PermisoModuloId);
            entity.Property(e => e.PermisoModuloId).HasColumnName("permiso_modulo_id");
            entity.Property(e => e.Codigo).HasColumnName("codigo").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Ruta).HasColumnName("ruta").HasMaxLength(200);
            entity.Property(e => e.Icono).HasColumnName("icono").HasMaxLength(50);
            entity.Property(e => e.Orden).HasColumnName("orden").HasDefaultValue(0);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Codigo).IsUnique();
        });

        // Configuración de PerfilPermiso
        modelBuilder.Entity<PerfilPermiso>(entity =>
        {
            entity.ToTable("perfiles_permisos");
            entity.HasKey(e => e.PerfilPermisoId);
            entity.Property(e => e.PerfilPermisoId).HasColumnName("perfil_permiso_id");
            entity.Property(e => e.PerfilId).HasColumnName("perfil_id").IsRequired();
            entity.Property(e => e.PermisoModuloId).HasColumnName("permiso_modulo_id").IsRequired();
            entity.Property(e => e.TipoAcceso).HasColumnName("tipo_acceso").HasMaxLength(1).HasDefaultValue('N');
            entity.Property(e => e.PuedeCrear).HasColumnName("puede_crear").HasDefaultValue(false);
            entity.Property(e => e.PuedeEditar).HasColumnName("puede_editar").HasDefaultValue(false);
            entity.Property(e => e.PuedeEliminar).HasColumnName("puede_eliminar").HasDefaultValue(false);
            entity.Property(e => e.PuedeConsultar).HasColumnName("puede_consultar").HasDefaultValue(false);
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Relaciones
            entity.HasOne(e => e.Perfil)
                .WithMany()
                .HasForeignKey(e => e.PerfilId)
                .HasConstraintName("fk_perfiles_permisos_perfil")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.PermisoModulo)
                .WithMany(pm => pm.PerfilesPermisos)
                .HasForeignKey(e => e.PermisoModuloId)
                .HasConstraintName("fk_perfiles_permisos_modulo")
                .OnDelete(DeleteBehavior.Cascade);

            // Constraint único: un perfil solo puede tener un permiso por módulo
            entity.HasIndex(e => new { e.PerfilId, e.PermisoModuloId })
                .IsUnique()
                .HasDatabaseName("uk_perfil_modulo");
        });

        // Configuración de Com3EPGD
        modelBuilder.Entity<Com3EPGD>(entity =>
        {
            entity.ToTable("com3_epgd");
            entity.HasKey(e => e.ComepgdEntId);
            entity.Property(e => e.ComepgdEntId).HasColumnName("comepgd_ent_id").ValueGeneratedOnAdd();
            entity.Property(e => e.CompromisoId).HasColumnName("compromiso_id").IsRequired();
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id").IsRequired();
            entity.Property(e => e.EtapaFormulario).HasColumnName("etapa_formulario").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(15).IsRequired();
            entity.Property(e => e.CheckPrivacidad).HasColumnName("check_privacidad").IsRequired();
            entity.Property(e => e.CheckDdjj).HasColumnName("check_ddjj").IsRequired();
            entity.Property(e => e.EstadoPcm).HasColumnName("estado_PCM").HasMaxLength(50).IsRequired();
            entity.Property(e => e.ObservacionesPcm).HasColumnName("observaciones_PCM").HasMaxLength(500).IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.Property(e => e.FecRegistro).HasColumnName("fec_registro").IsRequired();
            entity.Property(e => e.UsuarioRegistra).HasColumnName("usuario_registra").IsRequired();
            entity.Property(e => e.Activo).HasColumnName("activo").IsRequired();
            entity.Property(e => e.FechaReporte).HasColumnName("fecha_reporte").IsRequired();
            entity.Property(e => e.Sede).HasColumnName("sede").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Observaciones).HasColumnName("observaciones").HasMaxLength(255).IsRequired();
            entity.Property(e => e.UbicacionAreaTi).HasColumnName("ubicacion_area_ti").HasMaxLength(255).IsRequired();
            entity.Property(e => e.OrganigramaTi).HasColumnName("organigrama_ti").HasMaxLength(255).IsRequired();
            entity.Property(e => e.DependenciaAreaTi).HasColumnName("dependencia_area_ti").HasMaxLength(100).IsRequired();
            entity.Property(e => e.CostoAnualTi).HasColumnName("costo_anual_ti").HasColumnType("numeric(12,2)").IsRequired();
            entity.Property(e => e.ExisteComisionGdTi).HasColumnName("existe_comision_gd_ti").IsRequired();
            entity.Property(e => e.RutaPdfNormativa).HasColumnName("rutaPDF_normativa").HasMaxLength(500);
        });

        // Configuración de PersonalTI - NO tiene activo ni created_at en BD
        modelBuilder.Entity<PersonalTI>(entity =>
        {
            entity.ToTable("personal_ti");
            entity.HasKey(e => e.PersonalId);
            entity.Property(e => e.PersonalId).HasColumnName("personal_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.NombrePersona).HasColumnName("nombre_persona").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Dni).HasColumnName("dni").HasMaxLength(12).IsRequired();
            entity.Property(e => e.Cargo).HasColumnName("cargo").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Rol).HasColumnName("rol").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Especialidad).HasColumnName("especialidad").HasMaxLength(80).IsRequired();
            entity.Property(e => e.GradoInstruccion).HasColumnName("grado_instruccion").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Certificacion).HasColumnName("certificacion").HasMaxLength(80).IsRequired();
            entity.Property(e => e.Acreditadora).HasColumnName("acreditadora").HasMaxLength(80).IsRequired();
            entity.Property(e => e.CodigoCertificacion).HasColumnName("codigo_certificacion").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Colegiatura).HasColumnName("colegiatura").HasMaxLength(20).IsRequired();
            entity.Property(e => e.EmailPersonal).HasColumnName("email_personal").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(30).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de InventarioSoftware - NO tiene activo ni created_at en BD
        modelBuilder.Entity<InventarioSoftware>(entity =>
        {
            entity.ToTable("inventario_software");
            entity.HasKey(e => e.InvSoftId);
            entity.Property(e => e.InvSoftId).HasColumnName("inv_soft_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.CodProducto).HasColumnName("cod_producto").HasMaxLength(50).IsRequired();
            entity.Property(e => e.NombreProducto).HasColumnName("nombre_producto").HasMaxLength(150).IsRequired();
            entity.Property(e => e.Version).HasColumnName("version").HasMaxLength(50).IsRequired();
            entity.Property(e => e.TipoSoftware).HasColumnName("tipo_software").HasMaxLength(50).IsRequired();
            entity.Property(e => e.CantidadInstalaciones).HasColumnName("cantidad_instalaciones").IsRequired();
            entity.Property(e => e.CantidadLicencias).HasColumnName("cantidad_licencias").IsRequired();
            entity.Property(e => e.ExcesoDeficiencia).HasColumnName("exceso_deficiencia").IsRequired();
            entity.Property(e => e.CostoLicencias).HasColumnName("costo_licencias").HasColumnType("numeric(12,2)").IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de InventarioSistemasInfo - NO tiene activo ni created_at en BD
        modelBuilder.Entity<InventarioSistemasInfo>(entity =>
        {
            entity.ToTable("inventario_sistemas_info");
            entity.HasKey(e => e.InvSiId);
            entity.Property(e => e.InvSiId).HasColumnName("inv_si_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.Codigo).HasColumnName("codigo").HasMaxLength(20).IsRequired();
            entity.Property(e => e.NombreSistema).HasColumnName("nombre_sistema").HasMaxLength(150).IsRequired();
            entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(255).IsRequired();
            entity.Property(e => e.TipoSistema).HasColumnName("tipo_sistema").HasMaxLength(50).IsRequired();
            entity.Property(e => e.LenguajeProgramacion).HasColumnName("lenguaje_programacion").HasMaxLength(50).IsRequired();
            entity.Property(e => e.BaseDatos).HasColumnName("base_datos").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Plataforma).HasColumnName("plataforma").HasMaxLength(10).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de InventarioRed - NO tiene activo ni created_at en BD
        modelBuilder.Entity<InventarioRed>(entity =>
        {
            entity.ToTable("inventario_red");
            entity.HasKey(e => e.InvRedId);
            entity.Property(e => e.InvRedId).HasColumnName("inv_red_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.TipoEquipo).HasColumnName("tipo_equipo").HasMaxLength(80).IsRequired();
            entity.Property(e => e.Cantidad).HasColumnName("cantidad").IsRequired();
            entity.Property(e => e.PuertosOperativos).HasColumnName("puertos_operativos").IsRequired();
            entity.Property(e => e.PuertosInoperativos).HasColumnName("puertos_inoperativos").IsRequired();
            entity.Property(e => e.TotalPuertos).HasColumnName("total_puertos").IsRequired();
            entity.Property(e => e.CostoMantenimientoAnual).HasColumnName("costo_mantenimiento_anual").HasColumnType("numeric(12,2)").IsRequired();
            entity.Property(e => e.Observaciones).HasColumnName("observaciones").HasMaxLength(255).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de InventarioServidores - NO tiene activo ni created_at en BD
        modelBuilder.Entity<InventarioServidores>(entity =>
        {
            entity.ToTable("inventario_servidores");
            entity.HasKey(e => e.InvSrvId);
            entity.Property(e => e.InvSrvId).HasColumnName("inv_srv_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.NombreEquipo).HasColumnName("nombre_equipo").HasMaxLength(100).IsRequired();
            entity.Property(e => e.TipoEquipo).HasColumnName("tipo_equipo").HasMaxLength(10).IsRequired();
            entity.Property(e => e.Estado).HasColumnName("estado").HasMaxLength(30).IsRequired();
            entity.Property(e => e.Capa).HasColumnName("capa").HasMaxLength(30).IsRequired();
            entity.Property(e => e.Propiedad).HasColumnName("propiedad").HasMaxLength(20).IsRequired();
            entity.Property(e => e.Montaje).HasColumnName("montaje").HasMaxLength(20).IsRequired();
            entity.Property(e => e.MarcaCpu).HasColumnName("marca_cpu").HasMaxLength(50).IsRequired();
            entity.Property(e => e.ModeloCpu).HasColumnName("modelo_cpu").HasMaxLength(50).IsRequired();
            entity.Property(e => e.VelocidadGhz).HasColumnName("velocidad_ghz").HasColumnType("numeric(5,2)").IsRequired();
            entity.Property(e => e.Nucleos).HasColumnName("nucleos").IsRequired();
            entity.Property(e => e.MemoriaGb).HasColumnName("memoria_gb").IsRequired();
            entity.Property(e => e.MarcaMemoria).HasColumnName("marca_memoria").HasMaxLength(50).IsRequired();
            entity.Property(e => e.ModeloMemoria).HasColumnName("modelo_memoria").HasMaxLength(50).IsRequired();
            entity.Property(e => e.CantidadMemoria).HasColumnName("cantidad_memoria").IsRequired();
            entity.Property(e => e.CostoMantenimientoAnual).HasColumnName("costo_mantenimiento_anual").HasColumnType("numeric(12,2)").IsRequired();
            entity.Property(e => e.Observaciones).HasColumnName("observaciones").HasMaxLength(255).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de SeguridadInfo - NO tiene activo ni created_at en BD
        modelBuilder.Entity<SeguridadInfo>(entity =>
        {
            entity.ToTable("seguridad_info");
            entity.HasKey(e => e.SeginfoId);
            entity.Property(e => e.SeginfoId).HasColumnName("seginfo_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.PlanSgsi).HasColumnName("plan_sgsi").IsRequired();
            entity.Property(e => e.ComiteSeguridad).HasColumnName("comite_seguridad").IsRequired();
            entity.Property(e => e.OficialSeguridadEnOrganigrama).HasColumnName("oficial_seguridad_en_organigrama").IsRequired();
            entity.Property(e => e.PoliticaSeguridad).HasColumnName("politica_seguridad").IsRequired();
            entity.Property(e => e.InventarioActivos).HasColumnName("inventario_activos").IsRequired();
            entity.Property(e => e.AnalisisRiesgos).HasColumnName("analisis_riesgos").IsRequired();
            entity.Property(e => e.MetodologiaRiesgos).HasColumnName("metodologia_riesgos").IsRequired();
            entity.Property(e => e.PlanContinuidad).HasColumnName("plan_continuidad").IsRequired();
            entity.Property(e => e.ProgramaAuditorias).HasColumnName("programa_auditorias").IsRequired();
            entity.Property(e => e.InformesDireccion).HasColumnName("informes_direccion").IsRequired();
            entity.Property(e => e.CertificacionIso27001).HasColumnName("certificacion_iso27001").IsRequired();
            entity.Property(e => e.Observaciones).HasColumnName("observaciones").HasMaxLength(255).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
            
            // Configurar relación uno-a-uno con Com3EPGD
            // SeguridadInfo es el lado dependiente (tiene la FK)
            entity.HasOne(e => e.Com3EPGD)
                .WithOne(c => c.SeguridadInfo)
                .HasForeignKey<SeguridadInfo>(e => e.ComEntidadId)
                .HasPrincipalKey<Com3EPGD>(c => c.ComepgdEntId);
        });

        // Configuración de CapacitacionSeginfo - NO tiene activo ni created_at en BD
        modelBuilder.Entity<CapacitacionSeginfo>(entity =>
        {
            entity.ToTable("capacitaciones_seginfo");
            entity.HasKey(e => e.CapsegId);
            entity.Property(e => e.CapsegId).HasColumnName("capseg_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.Curso).HasColumnName("curso").HasMaxLength(100).IsRequired();
            entity.Property(e => e.CantidadPersonas).HasColumnName("cantidad_personas").IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de ObjetivoEntidad - NO tiene activo ni created_at en BD
        modelBuilder.Entity<ObjetivoEntidad>(entity =>
        {
            entity.ToTable("objetivos_entidades");
            entity.HasKey(e => e.ObjEntId);
            entity.Property(e => e.ObjEntId).HasColumnName("obj_ent_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.TipoObj).HasColumnName("tipo_obj").HasMaxLength(1).IsRequired();
            entity.Property(e => e.NumeracionObj).HasColumnName("numeracion_obj").HasMaxLength(5).IsRequired();
            entity.Property(e => e.DescripcionObjetivo).HasColumnName("descripcion_objetivo").HasMaxLength(240).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de AccionObjetivoEntidad - NO tiene activo ni created_at en BD
        modelBuilder.Entity<AccionObjetivoEntidad>(entity =>
        {
            entity.ToTable("acciones_objetivos_entidades");
            entity.HasKey(e => e.AccObjEntId);
            entity.Property(e => e.AccObjEntId).HasColumnName("acc_obj_ent_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ObjEntId).HasColumnName("obj_ent_id").IsRequired();
            entity.Property(e => e.NumeracionAcc).HasColumnName("numeracion_acc").HasMaxLength(5).IsRequired();
            entity.Property(e => e.DescripcionAccion).HasColumnName("descripcion_accion").HasMaxLength(240).IsRequired();
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });

        // Configuración de ProyectoEntidad - NO tiene activo ni created_at en BD
        // Columna "alienado_pgd" (typo en BD, no alineado_pgd)
        // Columnas porcentaje_avance e informo_avance tienen valores por defecto
        modelBuilder.Entity<ProyectoEntidad>(entity =>
        {
            entity.ToTable("proyectos_entidades");
            entity.HasKey(e => e.ProyEntId);
            entity.Property(e => e.ProyEntId).HasColumnName("proy_ent_id").ValueGeneratedOnAdd();
            entity.Property(e => e.ComEntidadId).HasColumnName("com_entidad_id").IsRequired();
            entity.Property(e => e.NumeracionProy).HasColumnName("numeracion_proy").HasMaxLength(5).IsRequired();
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Alcance).HasColumnName("alcance").HasMaxLength(240).IsRequired();
            entity.Property(e => e.Justificacion).HasColumnName("justificacion").HasMaxLength(240).IsRequired();
            entity.Property(e => e.TipoProy).HasColumnName("tipo_proy").HasMaxLength(100).IsRequired();
            entity.Property(e => e.AreaProy).HasColumnName("area_proy").HasMaxLength(50).IsRequired();
            entity.Property(e => e.AreaEjecuta).HasColumnName("area_ejecuta").HasMaxLength(50).IsRequired();
            entity.Property(e => e.TipoBeneficiario).HasColumnName("tipo_beneficiario").HasMaxLength(100).IsRequired();
            entity.Property(e => e.EtapaProyecto).HasColumnName("etapa_proyecto").HasMaxLength(100).IsRequired();
            entity.Property(e => e.AmbitoProyecto).HasColumnName("ambito_proyecto").HasMaxLength(100).IsRequired();
            entity.Property(e => e.FecIniProg).HasColumnName("fec_ini_prog").IsRequired();
            entity.Property(e => e.FecFinProg).HasColumnName("fec_fin_prog").IsRequired();
            entity.Property(e => e.FecIniReal).HasColumnName("fec_ini_real").IsRequired();
            entity.Property(e => e.FecFinReal).HasColumnName("fec_fin_real").IsRequired();
            entity.Property(e => e.AlineadoPgd).HasColumnName("alienado_pgd").HasMaxLength(100).IsRequired(); // Typo en BD: alienado
            entity.Property(e => e.ObjTranDig).HasColumnName("obj_tran_dig").HasMaxLength(100).IsRequired();
            entity.Property(e => e.ObjEst).HasColumnName("obj_est").HasMaxLength(100).IsRequired();
            entity.Property(e => e.AccEst).HasColumnName("acc_est").HasMaxLength(100).IsRequired();
            entity.Property(e => e.MontoInversion).HasColumnName("monto_inversion").HasColumnType("numeric(15,2)");
            entity.Property(e => e.EstadoProyecto).HasColumnName("estado_proyecto").IsRequired();
            entity.Property(e => e.PorcentajeAvance).HasColumnName("porcentaje_avance").HasDefaultValue((short)0);
            entity.Property(e => e.InformoAvance).HasColumnName("informo_avance").HasDefaultValue(false);
            // NO mapear Activo ni CreatedAt - no existen en la BD
        });
    }
}
