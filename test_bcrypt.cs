using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        string password = "Admin123!";
        string hash = "$2a$11$vqE0rJ8bVvWYZYqk6SXxR.gKbAOXjnVe6.4t9LbKNnYGmhQGbVV6a";
        
        bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Hash: {hash}");
        Console.WriteLine($"Is Valid: {isValid}");
    }
}
