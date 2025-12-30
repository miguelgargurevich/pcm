# 📧 Guía de Configuración SMTP para Pruebas

## Opción 1: Gmail (Recomendado para pruebas rápidas)

### Pasos:

1. **Activar verificación en 2 pasos**
   - Ir a: https://myaccount.google.com/security
   - Buscar "Verificación en 2 pasos"
   - Activarla si no está activa

2. **Crear contraseña de aplicación**
   - Ir a: https://myaccount.google.com/apppasswords
   - Seleccionar "Correo" y "Otro (nombre personalizado)"
   - Escribir: "PCM Plataforma"
   - Copiar la contraseña de 16 dígitos (formato: xxxx xxxx xxxx xxxx)

3. **Configurar en `appsettings.Docker.json`**
   ```json
   "Smtp": {
     "Host": "smtp.gmail.com",
     "Port": 587,
     "Username": "tu-email@gmail.com",
     "Password": "xxxx xxxx xxxx xxxx",
     "FromEmail": "tu-email@gmail.com",
     "FromName": "PCM Pruebas",
     "FrontendUrl": "http://localhost:3000",
     "EnableSsl": true
   }
   ```

### ✅ Ventajas:
- Gratis
- Fácil de configurar
- Emails reales se envían
- Límite: 500 emails/día

---

## Opción 2: Mailtrap (Recomendado para testing sin enviar emails)

### Pasos:

1. **Registro gratuito**
   - Ir a: https://mailtrap.io
   - Crear cuenta gratis

2. **Obtener credenciales**
   - En el dashboard, ir a "Email Testing" → "Inboxes"
   - Copiar credenciales SMTP

3. **Configurar**
   ```json
   "Smtp": {
     "Host": "sandbox.smtp.mailtrap.io",
     "Port": 2525,
     "Username": "tu-username",
     "Password": "tu-password",
     "FromEmail": "test@pcm.gob.pe",
     "FromName": "PCM Pruebas",
     "FrontendUrl": "http://localhost:3000",
     "EnableSsl": false
   }
   ```

### ✅ Ventajas:
- Los emails NO se envían realmente
- Ver emails en web UI de Mailtrap
- Perfecto para desarrollo
- Plan gratuito: 500 emails/mes

---

## Opción 3: Outlook/Hotmail

### Configurar:
```json
"Smtp": {
  "Host": "smtp.office365.com",
  "Port": 587,
  "Username": "tu-email@outlook.com",
  "Password": "tu-contraseña",
  "FromEmail": "tu-email@outlook.com",
  "FromName": "PCM Pruebas",
  "FrontendUrl": "http://localhost:3000",
  "EnableSsl": true
}
```

### ⚠️ Nota:
- Puede requerir habilitar "Aplicaciones menos seguras"
- Límite: 300 emails/día

---

## Opción 4: Ethereal Email (Más simple, sin registro)

### Pasos:

1. **Generar cuenta temporal**
   ```bash
   # Ir a: https://ethereal.email
   # Click en "Create Ethereal Account"
   # Te da credenciales instantáneas
   ```

2. **Configurar con credenciales generadas**
   ```json
   "Smtp": {
     "Host": "smtp.ethereal.email",
     "Port": 587,
     "Username": "usuario-generado@ethereal.email",
     "Password": "password-generado",
     "FromEmail": "test@pcm.gob.pe",
     "FromName": "PCM Pruebas",
     "FrontendUrl": "http://localhost:3000",
     "EnableSsl": true
   }
   ```

### ✅ Ventajas:
- Sin registro
- Credenciales instantáneas
- Ver emails en: https://ethereal.email
- Perfecto para demos

---

## 🧪 Probar Configuración

### 1. Levantar Docker
```bash
./start-local-docker.sh
```

### 2. Probar recuperación de contraseña
- Ir a: http://localhost:3000
- Click en "¿Olvidaste tu contraseña?"
- Ingresar email de usuario
- Verificar que llegue el correo

### 3. Ver logs del backend
```bash
docker logs pcm-backend-local -f
```

Buscar líneas como:
```
📧 SmtpEmailService inicializado
   Host: smtp.gmail.com:587
   From: PCM Pruebas <tu-email@gmail.com>
   SSL: True
📤 Enviando email via SMTP
   To: usuario@ejemplo.com
   Subject: Recuperación de Contraseña
✅ Email enviado exitosamente a usuario@ejemplo.com
```

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
- **Gmail**: Verificar contraseña de aplicación (16 dígitos)
- **Outlook**: Habilitar "Aplicaciones menos seguras"
- **Credenciales**: Revisar username/password

### Error: "Unable to connect"
- Verificar firewall
- Probar cambiar puerto (587 → 465)
- Verificar que EnableSsl esté correcto

### Error: "5.7.0 Authentication Required"
- Username debe ser email completo
- Password incorrecta

---

## 📝 Configuración Actual

El archivo `appsettings.Docker.json` está configurado con:

```json
"Smtp": {
  "Host": "smtp.gmail.com",  // 👈 CAMBIAR
  "Port": 587,
  "Username": "tu-email@gmail.com",  // 👈 CAMBIAR
  "Password": "tu-contraseña-de-aplicacion-16-digitos",  // 👈 CAMBIAR
  "FromEmail": "tu-email@gmail.com",  // 👈 CAMBIAR
  "FromName": "Plataforma de Cumplimiento Digital - Pruebas",
  "FrontendUrl": "http://localhost:3000",
  "EnableSsl": true
}
```

Solo reemplaza los valores marcados con 👈 y reinicia Docker.

---

## 🚀 Producción (PCM)

Para producción, solicitar a TI de PCM:
- Host SMTP
- Puerto (normalmente 587 o 465)
- Usuario y contraseña
- Email institucional autorizado

```json
"Smtp": {
  "Host": "smtp.pcm.gob.pe",
  "Port": 587,
  "Username": "plataforma@pcm.gob.pe",
  "Password": "SOLICITAR_A_TI",
  "FromEmail": "plataforma@pcm.gob.pe",
  "FromName": "Plataforma de Cumplimiento Digital",
  "FrontendUrl": "https://plataforma.pcm.gob.pe",
  "EnableSsl": true
}
```
