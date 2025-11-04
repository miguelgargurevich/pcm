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

    // Eliminar usuario si existe
    using var deleteCmd = new NpgsqlCommand("DELETE FROM usuarios WHERE email = 'admin@pcm.gob.pe'", conn);
    var deleted = await deleteCmd.ExecuteNonQueryAsync();
    if (deleted > 0)
    {
        Console.WriteLine($"✓ Usuario existente eliminado");
    }

    // Insertar nuevo usuario
    var insertSql = @"
        INSERT INTO usuarios (email, password, num_dni, nombres, ape_paterno, ape_materno, entidad_id, perfil_id, activo) 
        VALUES (@email, @password, @dni, @nombres, @apePaterno, @apeMaterno, @entidadId, @perfilId, @activo)";

    using var insertCmd = new NpgsqlCommand(insertSql, conn);
    insertCmd.Parameters.AddWithValue("email", "admin@pcm.gob.pe");
    insertCmd.Parameters.AddWithValue("password", hash);
    insertCmd.Parameters.AddWithValue("dni", "12345678");
    insertCmd.Parameters.AddWithValue("nombres", "Administrador");
    insertCmd.Parameters.AddWithValue("apePaterno", "Sistema");
    insertCmd.Parameters.AddWithValue("apeMaterno", "PCM");
    insertCmd.Parameters.AddWithValue("entidadId", 1);
    insertCmd.Parameters.AddWithValue("perfilId", 1);
    insertCmd.Parameters.AddWithValue("activo", true);

    await insertCmd.ExecuteNonQueryAsync();
    Console.WriteLine("✓ Usuario creado exitosamente");
    Console.WriteLine();
    Console.WriteLine("Credenciales:");
    Console.WriteLine("  Email: admin@pcm.gob.pe");
    Console.WriteLine("  Password: Admin123!");
}
catch (Exception ex)
{
    Console.WriteLine($"✗ Error: {ex.Message}");
}
