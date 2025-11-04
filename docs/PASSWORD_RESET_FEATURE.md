# Funcionalidad de Recuperación de Contraseña

## Descripción General

Sistema completo de recuperación de contraseña ("¿Olvidaste tu contraseña?") que permite a los usuarios restablecer su contraseña mediante un enlace enviado por correo electrónico.

## Flujo de Usuario

### 1. Solicitar Recuperación
1. Usuario hace clic en "¿Olvidaste tu contraseña?" en la página de login
2. Ingresa su correo electrónico
3. Sistema genera un token único y lo guarda en la base de datos
4. Se muestra mensaje de éxito (independientemente de si el email existe)

### 2. Restablecer Contraseña
1. Usuario recibe email con enlace que contiene el token
2. Hace clic en el enlace que lo dirige a `/reset-password/:token`
3. Sistema valida el token (existencia y fecha de expiración)
4. Usuario ingresa su nueva contraseña (mínimo 8 caracteres)
5. Sistema actualiza la contraseña y limpia el token

## Arquitectura Técnica

### Frontend

#### Páginas Creadas

**`ForgotPassword.jsx`**
- Ruta: `/forgot-password`
- Formulario con campo de email
- Validación básica
- Mensaje de éxito con información sobre revisión del correo
- Botón para volver al login

**`ResetPassword.jsx`**
- Ruta: `/reset-password/:token`
- Validación automática del token al cargar
- Formulario con nueva contraseña y confirmación
- Validaciones:
  - Mínimo 8 caracteres
  - Contraseñas coinciden
- Redirección automática al login tras éxito (3 segundos)

#### Servicio de API

**`passwordService.js`**
```javascript
- requestReset(email)        // POST /api/auth/forgot-password
- resetPassword(token, pwd)  // POST /api/auth/reset-password
- validateToken(token)       // GET /api/auth/validate-reset-token/:token
```

#### Rutas Agregadas en `App.jsx`
```jsx
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
```

### Backend

#### Entidad Usuario Actualizada

**`Usuario.cs`**
```csharp
public string? ResetPasswordToken { get; set; }      // Token único
public DateTime? ResetPasswordExpiry { get; set; }    // Expira en 1 hora
```

#### DTOs Creados

**`AuthDtos.cs`**
```csharp
public class ForgotPasswordRequestDto
{
    public string Email { get; set; }
}

public class ResetPasswordRequestDto
{
    public string Token { get; set; }
    public string NewPassword { get; set; }
}
```

#### Handlers Implementados

**`ForgotPasswordHandler.cs`**
- Busca usuario por email (case-insensitive)
- Genera token seguro usando `RandomNumberGenerator` (32 bytes)
- Token es Base64 URL-safe
- Establece expiración en 1 hora
- **Seguridad**: Siempre devuelve mensaje de éxito, incluso si email no existe

**`ResetPasswordHandler.cs`**
- Valida existencia del token
- Verifica fecha de expiración
- Hashea nueva contraseña con BCrypt
- Limpia token después de uso exitoso
- Método adicional `ValidateToken()` para validación previa

#### Endpoints del AuthController

```csharp
POST   /api/auth/forgot-password              // Solicitar recuperación
POST   /api/auth/reset-password               // Restablecer contraseña
GET    /api/auth/validate-reset-token/:token  // Validar token
```

### Base de Datos

#### Migración SQL Ejecutada

**`migration_password_reset.sql`**
```sql
-- Agrega columnas a tabla usuarios
ALTER TABLE usuarios ADD COLUMN reset_password_token VARCHAR(100) NULL;
ALTER TABLE usuarios ADD COLUMN reset_password_expiry TIMESTAMP NULL;

-- Índice para optimizar búsqueda por token
CREATE INDEX idx_usuarios_reset_token ON usuarios(reset_password_token);
```

#### Esquema de Tabla `usuarios`
```
reset_password_token   VARCHAR(100)  NULL  -- Token único generado
reset_password_expiry  TIMESTAMP     NULL  -- Fecha de expiración (1 hora)
```

## Seguridad Implementada

### 1. **Token Seguro**
- Generado con `RandomNumberGenerator` (criptográficamente seguro)
- 32 bytes (256 bits) de entropía
- Codificación Base64 URL-safe
- Ejemplo: `8k3L-m9_NxQ7PzRtYv2WbA9eFhJ4KlMnO6pSrTuVwXyZ`

### 2. **Expiración de Token**
- Tiempo de vida: **1 hora**
- Tokens expirados son rechazados automáticamente
- Token se limpia después de uso exitoso o expiración

### 3. **Protección contra Enumeración**
- Mensaje genérico incluso si email no existe
- No revela si un email está registrado o no
- Previene que atacantes descubran usuarios válidos

### 4. **Hashing de Contraseña**
- Usa BCrypt para hashear nuevas contraseñas
- Factor de trabajo configurable (salt rounds)
- Contraseñas nunca se almacenan en texto plano

### 5. **Validación de Entrada**
- Email: Validación de formato
- Contraseña: Mínimo 8 caracteres
- Token: Validación de existencia y formato

## Flujo de Desarrollo (Modo Testing)

Actualmente, en desarrollo, el token se imprime en la consola del backend:

```
🔗 Reset Password Link: http://localhost:5173/reset-password/8k3L-m9_NxQ...
📧 Email: usuario@pcm.gob.pe
⏰ Expira: 2025-11-04 15:30:00
```

## Próximos Pasos (Producción)

### Integrar Servicio de Email
```csharp
// TODO en ForgotPasswordHandler.cs
// Implementar IEmailService para envío real de correos

public interface IEmailService
{
    Task SendPasswordResetEmail(string email, string resetLink);
}
```

**Opciones de implementación:**
1. **SendGrid** - Servicio cloud popular
2. **AWS SES** - Amazon Simple Email Service
3. **MailKit** - Cliente SMTP .NET
4. **Azure Communication Services**

### Plantilla de Email Sugerida
```html
<!DOCTYPE html>
<html>
<head>
    <title>Recuperación de Contraseña - PCM</title>
</head>
<body>
    <h1>Recuperación de Contraseña</h1>
    <p>Hola,</p>
    <p>Recibimos una solicitud para restablecer tu contraseña en la Plataforma de Cumplimiento Digital.</p>
    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
    <p><a href="{{resetLink}}">Restablecer Contraseña</a></p>
    <p>Este enlace expirará en <strong>1 hora</strong>.</p>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    <hr>
    <p style="font-size: 12px; color: #666;">
        PCM - Presidencia del Consejo de Ministros<br>
        Secretaría de Gobierno y Transformación Digital
    </p>
</body>
</html>
```

## Testing Manual

### 1. Probar Solicitud de Recuperación
```bash
# Endpoint
POST http://localhost:5164/api/auth/forgot-password

# Body
{
  "email": "admin@pcm.gob.pe"
}

# Respuesta esperada
{
  "isSuccess": true,
  "data": "Si el correo existe, recibirás un enlace de recuperación.",
  "message": null,
  "errors": null
}
```

### 2. Copiar Token de Consola Backend
```
🔗 Reset Password Link: http://localhost:5173/reset-password/ABC123...
```

### 3. Validar Token
```bash
GET http://localhost:5164/api/auth/validate-reset-token/ABC123...
```

### 4. Restablecer Contraseña
```bash
POST http://localhost:5164/api/auth/reset-password

{
  "token": "ABC123...",
  "newPassword": "NuevaPassword123!"
}
```

### 5. Intentar Login con Nueva Contraseña
```bash
POST http://localhost:5164/api/auth/login

{
  "email": "admin@pcm.gob.pe",
  "password": "NuevaPassword123!",
  "recaptchaToken": "..."
}
```

## Casos de Error Manejados

### Frontend
- ❌ Email inválido o vacío
- ❌ Contraseña menor a 8 caracteres
- ❌ Contraseñas no coinciden
- ❌ Token inválido o expirado
- ❌ Error de red/conexión

### Backend
- ❌ Token no encontrado en base de datos
- ❌ Token expirado (> 1 hora)
- ❌ Contraseña no cumple requisitos
- ❌ Error al guardar en base de datos

## Logs y Auditoría

El sistema registra:
- ✅ Solicitudes de recuperación (email)
- ✅ Restablecimientos exitosos
- ✅ Intentos con tokens inválidos
- ✅ Tokens expirados

Todos los logs se generan con `ILogger<AuthController>` para trazabilidad.

## Mejoras Futuras

1. **Rate Limiting**: Limitar solicitudes por IP (prevenir abuso)
2. **2FA opcional**: Factor de autenticación adicional
3. **Historial de contraseñas**: No permitir reutilización
4. **Notificación de cambio**: Email al cambiar contraseña exitosamente
5. **Geolocalización**: Detectar cambios desde ubicaciones sospechosas
6. **Dashboard de seguridad**: Panel para usuarios ver intentos de acceso

## Archivos Modificados/Creados

### Frontend
```
src/pages/ForgotPassword.jsx          [NUEVO]
src/pages/ResetPassword.jsx           [NUEVO]
src/services/passwordService.js       [NUEVO]
src/pages/Login.jsx                   [MODIFICADO]
src/App.jsx                           [MODIFICADO]
```

### Backend
```
PCM.Domain/Entities/Usuario.cs                          [MODIFICADO]
PCM.Application/DTOs/Auth/AuthDtos.cs                   [MODIFICADO]
PCM.Infrastructure/Handlers/Auth/ForgotPasswordHandler.cs [NUEVO]
PCM.Infrastructure/Handlers/Auth/ResetPasswordHandler.cs  [NUEVO]
PCM.API/Controllers/AuthController.cs                   [MODIFICADO]
PCM.API/Program.cs                                      [MODIFICADO]
```

### Base de Datos
```
db/migration_password_reset.sql       [NUEVO]
```

## Estado Final

✅ **Frontend**: 2 páginas nuevas + navegación configurada
✅ **Backend**: 3 endpoints + 2 handlers implementados
✅ **Base de Datos**: Migración ejecutada exitosamente
✅ **Seguridad**: Token seguro + expiración + BCrypt
✅ **Testing**: Listo para pruebas en desarrollo

**Pendiente para producción:**
⏳ Integrar servicio de email real (SendGrid/AWS SES)
⏳ Configurar plantilla HTML de email
⏳ Implementar rate limiting
⏳ Testing automatizado (unit + integration tests)
