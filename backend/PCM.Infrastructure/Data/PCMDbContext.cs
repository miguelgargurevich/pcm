using Microsoft.EntityFrameworkCore;
using PCM.Domain.Entities;

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
    public DbSet<MarcoNormativo> MarcosNormativos { get; set; }
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
            entity.Property(e => e.EntidadId).HasColumnName("entidad_id").IsRequired();
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

        // Configuración de Ubigeo
        modelBuilder.Entity<Ubigeo>(entity =>
        {
            entity.ToTable("ubigeo");
            entity.HasKey(e => e.UbigeoId);
            entity.Property(e => e.UbigeoId).HasColumnName("ubigeo_id").HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.Codigo).HasColumnName("codigo").HasMaxLength(6).IsRequired();
            entity.Property(e => e.Departamento).HasColumnName("departamento").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Provincia).HasColumnName("provincia").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Distrito).HasColumnName("distrito").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(e => e.Codigo).IsUnique();
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
    }
}
