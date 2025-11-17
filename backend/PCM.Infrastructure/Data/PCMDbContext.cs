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
    public DbSet<NivelGobierno> NivelesGobierno { get; set; }
    public DbSet<Sector> Sectores { get; set; }
    public DbSet<TipoNorma> TiposNorma { get; set; }
    // NOTA: EstadoCompromiso NO se expone como DbSet para evitar que EF Core infiera navegaciones automáticas
    // Se puede acceder mediante: context.Set<EstadoCompromiso>() cuando sea necesario
    public DbSet<TablaTablas> TablaTablas { get; set; }
    public DbSet<MarcoNormativo> MarcosNormativos { get; set; }
    public DbSet<CompromisoGobiernoDigital> CompromisosGobiernoDigital { get; set; }
    public DbSet<CompromisoNormativa> CompromisosNormativas { get; set; }
    public DbSet<CriterioEvaluacion> CriteriosEvaluacion { get; set; }
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
            entity.Property(e => e.Direccion).HasColumnName("direccion").HasMaxLength(200).IsRequired();
            entity.Property(e => e.UbigeoId).HasColumnName("ubigeo_id").IsRequired();
            entity.Property(e => e.NivelGobiernoId).HasColumnName("nivel_gobierno_id").IsRequired();
            entity.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(20);
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Web).HasColumnName("web").HasMaxLength(100);
            entity.Property(e => e.SectorId).HasColumnName("sector_id").IsRequired();
            entity.Property(e => e.ClasificacionId).HasColumnName("clasificacion_id").IsRequired();
            entity.Property(e => e.NombreAlcalde).HasColumnName("nombre_alcalde").HasMaxLength(100).IsRequired();
            entity.Property(e => e.ApePatAlcalde).HasColumnName("ape_pat_alcalde").HasMaxLength(60).IsRequired();
            entity.Property(e => e.ApeMatAlcalde).HasColumnName("ape_mat_alcalde").HasMaxLength(60).IsRequired();
            entity.Property(e => e.EmailAlcalde).HasColumnName("email_alcalde").HasMaxLength(100).IsRequired();
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
                .HasConstraintName("fk_entidades_clasificacion");

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
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
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
            entity.Property(e => e.IdEstado).HasColumnName("estado").IsRequired().HasDefaultValue(1);
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
    }
}
