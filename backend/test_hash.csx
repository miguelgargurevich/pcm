#!/usr/bin/env dotnet-script
#r "nuget: BCrypt.Net-Next, 4.0.3"

using BCrypt.Net;

var password = "Admin123!";
var hash = BCrypt.Net.BCrypt.HashPassword(password, 11);

Console.WriteLine($"Password: {password}");
Console.WriteLine($"Hash generado: {hash}");
Console.WriteLine();

// Verificar que funciona
var isValid = BCrypt.Net.BCrypt.Verify(password, hash);
Console.WriteLine($"Verificación: {isValid}");
