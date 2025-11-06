using BCrypt.Net;
using Npgsql;

Console.WriteLine("=== Generador de Hash BCrypt y Creador de Usuario ===\n");

var password = "Admin123!";
var hash = BCrypt.Net.BCrypt.HashPassword(password);

Console.WriteLine($"Contraseña: {password}");
Console.WriteLine($"Hash BCrypt: {hash}");
Console.WriteLine();

// Insertar en la base de datos
var connectionString = "Host=localhost;Port=5433;Database=plataforma_cumplimiento_digital;Username=dashboard_user;Password=dashboard_pass";

try
{
    using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();
    Console.WriteLine("✓ Conectado a PostgreSQL");

    // Actualizar hash de contraseña del usuario existente
    var updateSql = @"
        UPDATE usuarios 
        SET password_hash = @password 
        WHERE email = 'admin@pcm.gob.pe'";

    using var updateCmd = new NpgsqlCommand(updateSql, conn);
    updateCmd.Parameters.AddWithValue("password", hash);
    
    var updated = await updateCmd.ExecuteNonQueryAsync();
    
    if (updated > 0)
    {
        Console.WriteLine("✓ Contraseña del usuario actualizada exitosamente");
        Console.WriteLine();
        Console.WriteLine("Credenciales:");
        Console.WriteLine("  Email: admin@pcm.gob.pe");
        Console.WriteLine("  Password: Admin123!");
    }
    else
    {
        Console.WriteLine("✗ Usuario no encontrado");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"✗ Error: {ex.Message}");
}
