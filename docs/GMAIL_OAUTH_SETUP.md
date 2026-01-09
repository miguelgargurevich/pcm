# Configuración de Gmail OAuth2 para Envío de Correos

## 📋 Resumen

Este documento explica cómo configurar Gmail con OAuth2 para enviar correos desde la Plataforma de Cumplimiento Digital.

## 🔑 Credenciales Actuales

- **Email:** tidragon1981@gmail.com
- **Refresh Token:** Configurado en appsettings.json (no versionado en Git)

## 🚀 Pasos para Obtener Client ID y Client Secret

### 1. Acceder a Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Iniciar sesión con la cuenta `tidragon1981@gmail.com`

### 2. Crear o Seleccionar un Proyecto

1. En el menú superior, hacer clic en el selector de proyectos
2. Crear un nuevo proyecto o seleccionar uno existente
3. Nombre sugerido: "PCM Email Service"

### 3. Habilitar Gmail API

1. Ir a **APIs y servicios** > **Biblioteca**
2. Buscar "Gmail API"
3. Hacer clic en "Gmail API" y luego en **Habilitar**

### 4. Configurar Pantalla de Consentimiento OAuth

1. Ir a **APIs y servicios** > **Pantalla de consentimiento de OAuth**
2. Seleccionar **Externo** (si no es un Google Workspace)
3. Completar la información requerida:
   - Nombre de la aplicación: "Plataforma de Cumplimiento Digital"
   - Correo electrónico de asistencia: tidragon1981@gmail.com
   - Dominios autorizados: (dejar vacío para desarrollo)
   - Correo electrónico del desarrollador: tidragon1981@gmail.com
4. Hacer clic en **Guardar y continuar**

5. En **Alcances (Scopes)**:
   - Agregar el scope: `https://www.googleapis.com/auth/gmail.send`
   - Hacer clic en **Guardar y continuar**

6. En **Usuarios de prueba**:
   - Agregar: tidragon1981@gmail.com
   - Hacer clic en **Guardar y continuar**

### 5. Crear Credenciales OAuth 2.0

1. Ir a **APIs y servicios** > **Credenciales**
2. Hacer clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
3. Tipo de aplicación: **Aplicación web**
4. Nombre: "PCM Backend Service"
5. URIs de redireccionamiento autorizados:
   - Agregar: `http://localhost`
   - Agregar: `https://developers.google.com/oauthplayground`
6. Hacer clic en **Crear**
7. **Copiar el Client ID y Client Secret** que aparecen

### 6. Configurar en appsettings.json

Actualizar los valores en `backend/PCM.API/appsettings.json` y `appsettings.Docker.json`:

```json
"Gmail": {
  "ClientId": "TU_CLIENT_ID_AQUI.apps.googleusercontent.com",
  "ClientSecret": "TU_CLIENT_SECRET_AQUI",
  "RefreshToken": "TU_REFRESH_TOKEN_AQUI",
  "FromEmail": "tu-email@gmail.com",
  "FromName": "Plataforma de Cumplimiento Digital"
}
```

## 🔄 Verificar el Refresh Token (Opcional)

Si el refresh token actual no funciona, generar uno nuevo:

### Usando OAuth Playground

1. Ir a [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Hacer clic en el ⚙️ (configuración) en la esquina superior derecha
3. Marcar "Use your own OAuth credentials"
4. Ingresar tu Client ID y Client Secret
5. Cerrar la configuración
6. En "Step 1 - Select & authorize APIs":
   - Buscar: `https://www.googleapis.com/auth/gmail.send`
   - Seleccionarlo
   - Hacer clic en **Authorize APIs**
7. Iniciar sesión con `tidragon1981@gmail.com`
8. Autorizar la aplicación
9. En "Step 2 - Exchange authorization code for tokens":
   - Hacer clic en **Exchange authorization code for tokens**
   - **Copiar el Refresh token** que aparece

## 📝 Estructura del Servicio

El nuevo servicio `GmailEmailService` implementa:

- ✅ OAuth2 authentication con refresh token
- ✅ Obtención automática de access tokens
- ✅ Envío de correos vía Gmail API
- ✅ Mismo formato de templates que Resend/AWS SES
- ✅ Manejo de errores y logs

## 🔌 Endpoint Disponible

### POST /api/Email/sendMail

Envío genérico de correos:

```json
{
  "toEmail": "destinatario@example.com",
  "subject": "Asunto del correo",
  "htmlContent": "<html>...</html>"
}
```

### POST /api/Email/send-cumplimiento-notification

Envío de notificaciones de cumplimiento (endpoint existente):

```json
{
  "toEmail": "responsable@entidad.gob.pe",
  "compromisoId": 15,
  "compromisoNombre": "CSIRT Institucional",
  "entidadNombre": "Ministerio de Educación",
  "htmlContent": "<html>...</html>"
}
```

## 🧪 Prueba Manual

```bash
# Obtener token de autenticación
curl -X POST http://localhost:5164/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.test@pcm.gob.pe",
    "password": "Admin123!"
  }'

# Enviar correo de prueba
curl -X POST http://localhost:5164/api/Email/sendMail \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "toEmail": "miguel.gargurevich@gmail.com",
    "subject": "Prueba de Gmail OAuth2",
    "htmlContent": "<h1>Hola desde la Plataforma de Cumplimiento Digital</h1><p>Este es un correo de prueba usando Gmail OAuth2.</p>"
  }'
```

## 🎯 Ventajas de Gmail OAuth2

1. **No expira:** El refresh token no caduca (a diferencia de contraseñas de aplicación)
2. **Más seguro:** No requiere almacenar contraseñas
3. **Mejor entregabilidad:** Los correos de Gmail tienen mejor reputación
4. **Sin límites estrictos:** Gmail permite hasta 500 correos por día para cuentas gratuitas
5. **Sin costo:** Completamente gratuito

## 📊 Límites de Envío

- **Gmail gratuito:** 500 correos/día
- **Google Workspace:** 2000 correos/día

## 🔐 Seguridad

- El refresh token se guarda en `appsettings.json` (no versionado en Git)
- Los access tokens se obtienen dinámicamente y expiran en 1 hora
- Todos los logs incluyen información de auditoría

---

**Última actualización:** 9 de enero de 2026
