using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCM.Application.Interfaces;

namespace PCM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailController> _logger;

    public EmailController(IEmailService emailService, ILogger<EmailController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Envía un correo de notificación de cumplimiento normativo
    /// </summary>
    [HttpPost("send-cumplimiento-notification")]
    public async Task<IActionResult> SendCumplimientoNotification([FromBody] SendCumplimientoEmailRequest request)
    {
        try
        {
            _logger.LogInformation("📧 Recibiendo solicitud de envío de correo para compromiso {CompromisoId} a {ToEmail}", 
                request.CompromisoId, request.ToEmail);

            if (string.IsNullOrWhiteSpace(request.ToEmail))
            {
                return BadRequest(new { message = "El email del destinatario es requerido" });
            }

            if (string.IsNullOrWhiteSpace(request.HtmlContent))
            {
                return BadRequest(new { message = "El contenido HTML del correo es requerido" });
            }

            // Determinar el tipo de notificación basado en el contenido HTML
            string subject;
            if (request.HtmlContent.Contains("APROBADO") || request.HtmlContent.Contains("aprobado satisfactoriamente"))
            {
                subject = $"✅ APROBADO | C{request.CompromisoId}: {request.CompromisoNombre} | {request.EntidadNombre}";
            }
            else if (request.HtmlContent.Contains("OBSERVADO") || request.HtmlContent.Contains("observaciones y realice las correcciones"))
            {
                subject = $"⚠️ OBSERVADO | C{request.CompromisoId}: {request.CompromisoNombre} | {request.EntidadNombre}";
            }
            else
            {
                // Envío de cumplimiento para revisión
                subject = $"📋 ENVIADO PARA REVISIÓN | C{request.CompromisoId}: {request.CompromisoNombre} | {request.EntidadNombre}";
            }
            
            var success = await _emailService.SendEmailAsync(
                request.ToEmail,
                subject,
                request.HtmlContent
            );

            if (success)
            {
                _logger.LogInformation("✅ Correo enviado exitosamente a {ToEmail}", request.ToEmail);
                return Ok(new 
                { 
                    success = true, 
                    message = "Correo enviado exitosamente",
                    destinatario = request.ToEmail
                });
            }
            else
            {
                _logger.LogWarning("⚠️ No se pudo enviar el correo a {ToEmail}", request.ToEmail);
                return StatusCode(500, new { success = false, message = "No se pudo enviar el correo" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al enviar correo de cumplimiento");
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error al enviar el correo",
                error = ex.Message 
            });
        }
    }
}

public class SendCumplimientoEmailRequest
{
    public required string ToEmail { get; set; }
    public int CompromisoId { get; set; }
    public string? CompromisoNombre { get; set; }
    public string? EntidadNombre { get; set; }
    public required string HtmlContent { get; set; }
}
