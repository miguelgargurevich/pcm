namespace PCM.Application.Interfaces;

public interface IEmailService
{
    /// <summary>
    /// Envía un correo electrónico
    /// </summary>
    /// <param name="to">Dirección de destino</param>
    /// <param name="subject">Asunto del correo</param>
    /// <param name="htmlBody">Cuerpo del correo en HTML</param>
    /// <returns>True si el envío fue exitoso</returns>
    Task<bool> SendEmailAsync(string to, string subject, string htmlBody);

    /// <summary>
    /// Envía un correo de recuperación de contraseña
    /// </summary>
    /// <param name="to">Dirección de destino</param>
    /// <param name="nombreUsuario">Nombre del usuario</param>
    /// <param name="resetLink">Enlace de recuperación</param>
    /// <returns>True si el envío fue exitoso</returns>
    Task<bool> SendPasswordResetEmailAsync(string to, string nombreUsuario, string resetLink);
}
