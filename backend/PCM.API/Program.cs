using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PCM.Application.Interfaces;
using PCM.Infrastructure.Data;
using PCM.Infrastructure.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configurar el puerto desde la variable de entorno (para Render u otros servicios en la nube)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5164";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Configuración de servicios
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Permitir deserialización case-insensitive (acepta tanto PascalCase como snake_case)
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();

// Configuración de Swagger con JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PCM API - Plataforma de Cumplimiento Digital",
        Version = "v1",
        Description = "API para la gestión de cumplimiento de compromisos de Gobierno Digital",
        Contact = new OpenApiContact
        {
            Name = "PCM - SGTD",
            Email = "soporte@pcm.gob.pe"
        }
    });

    // Configuración de autenticación JWT en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configuración de Base de Datos PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PCMDbContext>(options =>
    options.UseNpgsql(connectionString,
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null))
);

// Registro de MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(PCM.Application.Features.Usuarios.Commands.CreateUsuario.CreateUsuarioCommand).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(PCM.Infrastructure.Handlers.Usuarios.CreateUsuarioHandler).Assembly);
});

// Registro de servicios de aplicación
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddHttpClient<IReCaptchaService, ReCaptchaService>();

// Registro de handlers de Auth
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Auth.ForgotPasswordHandler>();
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Auth.ResetPasswordHandler>();

// Registro de handlers Com4 PEI
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Com4PEI.CreateCom4PEIHandler>();
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Com4PEI.UpdateCom4PEIHandler>();
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Com4PEI.GetCom4PEIHandler>();

// Registro de handlers Com5 Estrategia Digital
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Com5EstrategiaDigital.CreateCom5EstrategiaDigitalHandler>();
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Com5EstrategiaDigital.UpdateCom5EstrategiaDigitalHandler>();
builder.Services.AddScoped<PCM.Infrastructure.Handlers.Com5EstrategiaDigital.GetCom5EstrategiaDigitalHandler>();

// Configuración de CORS
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? new[] { "http://localhost:5173" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configuración de JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurada");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configuración del pipeline HTTP
// Habilitar Swagger en todos los ambientes para debugging
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PCM API v1");
    c.RoutePrefix = string.Empty; // Swagger en la raíz
});

// Solo usar HTTPS redirection en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Endpoint de salud básico (para health check de Render)
app.MapGet("/", () => Results.Ok(new
{
    api = "PCM API",
    status = "running",
    timestamp = DateTime.UtcNow,
    version = "1.0"
}))
.WithName("Root")
.WithTags("Health")
.AllowAnonymous();

// Endpoint de salud con verificación real de DB
app.MapGet("/health", async (PCMDbContext dbContext) =>
{
    try
    {
        // Verificar conexión a la base de datos
        await dbContext.Database.CanConnectAsync();
        
        return Results.Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            database = "connected",
            environment = app.Environment.EnvironmentName
        });
    }
    catch (Exception ex)
    {
        return Results.Ok(new
        {
            status = "unhealthy",
            timestamp = DateTime.UtcNow,
            database = "disconnected",
            error = ex.Message,
            environment = app.Environment.EnvironmentName
        });
    }
})
.WithName("HealthCheck")
.WithTags("Health")
.AllowAnonymous();

app.Run();
