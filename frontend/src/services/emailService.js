/**
 * Servicio para envío de correos usando FormSubmit
 * https://formsubmit.co/
 */

// Email con copia para pruebas
const EMAIL_COPIA_PRUEBAS = 'miguel.gargurevich@gmail.com';

const emailService = {
  /**
   * Envía un correo de confirmación de cumplimiento normativo
   * @param {Object} params - Parámetros del correo
   * @param {string} params.toEmail - Email del destinatario (correo del Compromiso 1)
   * @param {string} params.entidadNombre - Nombre de la entidad
   * @param {number} params.compromisoId - ID del compromiso (1-21)
   * @param {string} params.compromisoNombre - Nombre del compromiso
   * @param {string} params.paso1Html - HTML específico del paso 1 del compromiso
   * @param {string} params.paso2Html - HTML del paso 2 (normativa)
   * @param {string} params.paso3Html - HTML del paso 3 (aceptaciones)
   * @param {string} params.estadoFinal - Estado final del cumplimiento
   * @returns {Promise<boolean>} - true si se envió correctamente
   */
  async sendCumplimientoConfirmation({
    toEmail,
    entidadNombre,
    compromisoId,
    compromisoNombre,
    paso1Html,
    paso2Html,
    paso3Html,
    estadoFinal
  }) {
    try {
      console.log('📧 Enviando correo de confirmación a:', toEmail);

      // Construir el HTML completo del email
      const emailHtml = this.buildEmailTemplate({
        entidadNombre,
        compromisoId,
        compromisoNombre,
        paso1Html,
        paso2Html,
        paso3Html,
        estadoFinal
      });

      // Crear FormData para FormSubmit
      const formData = new FormData();
      formData.append('_subject', `✅ Cumplimiento Normativo - ${compromisoNombre}`);
      formData.append('_template', 'box'); // Template prediseñado de FormSubmit
      formData.append('_captcha', 'false'); // Desactivar captcha
      formData.append('_cc', `${toEmail},${EMAIL_COPIA_PRUEBAS}`); // Copia al remitente y email de pruebas
      formData.append('message', emailHtml); // Contenido HTML

      // Enviar a FormSubmit
      const response = await fetch(`https://formsubmit.co/${toEmail}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Correo enviado exitosamente');
        return true;
      } else {
        console.error('Error al enviar correo:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en emailService.sendCumplimientoConfirmation:', error);
      return false;
    }
  },

  /**
   * Construye el template HTML del correo
   */
  buildEmailTemplate({
    entidadNombre,
    compromisoId,
    compromisoNombre,
    paso1Html,
    paso2Html,
    paso3Html,
    estadoFinal
  }) {
    const fecha = new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Cumplimiento Normativo</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e5e5;
    }
    .section:last-child {
      border-bottom: none;
    }
    .section-title {
      color: #667eea;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .section-title .badge {
      background-color: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-right: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .info-item {
      background-color: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-publicado {
      background-color: #d4edda;
      color: #155724;
    }
    .status-bandeja {
      background-color: #fff3cd;
      color: #856404;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Cumplimiento Normativo Registrado</h1>
      <p>Plataforma de Cumplimiento Digital</p>
    </div>
    
    <div class="content">
      <!-- Información General -->
      <div class="section">
        <h2 class="section-title">📋 Información General</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Entidad</div>
            <div class="info-value">${entidadNombre}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Compromiso</div>
            <div class="info-value">Compromiso ${compromisoId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Fecha de Registro</div>
            <div class="info-value">${fecha}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Estado</div>
            <div class="info-value">
              <span class="status-badge status-${estadoFinal}">${estadoFinal === 'publicado' ? 'Publicado' : 'En Bandeja'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paso 1: Datos del Compromiso -->
      <div class="section">
        <h2 class="section-title">
          <span class="badge">PASO 1</span>
          ${compromisoNombre}
        </h2>
        ${paso1Html}
      </div>

      <!-- Paso 2: Normativa -->
      <div class="section">
        <h2 class="section-title">
          <span class="badge">PASO 2</span>
          Normativa y Criterios de Evaluación
        </h2>
        ${paso2Html}
      </div>

      <!-- Paso 3: Confirmación -->
      <div class="section">
        <h2 class="section-title">
          <span class="badge">PASO 3</span>
          Confirmación y Aceptaciones
        </h2>
        ${paso3Html}
      </div>
    </div>

    <div class="footer">
      <p><strong>Plataforma de Cumplimiento Digital</strong></p>
      <p>Este es un correo automático de confirmación. Por favor no responder.</p>
      <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
};

export default emailService;
