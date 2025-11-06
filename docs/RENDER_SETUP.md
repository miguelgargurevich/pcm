# Configuración de Backend en Render

## Estado actual
Tu backend está desplegado en: `https://pcm-5qst.onrender.com`

Pero está fallando porque falta la configuración de la base de datos.

## Variables de Entorno Requeridas en Render

Ve a tu servicio en Render → Environment → Environment Variables y agrega:

### 1. ConnectionStrings__DefaultConnection
**Importante:** Nota el uso de doble guion bajo `__` en lugar de `:`

**Formato:**
```
Host=<TU_HOST_SUPABASE>;Port=5432;Database=<TU_DATABASE>;Username=<TU_USER>;Password=<TU_PASSWORD>;SSL Mode=Require;Trust Server Certificate=true
```

**Ejemplo con Supabase:**
```
Host=db.xxxxxxxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=TU_PASSWORD_AQUI;SSL Mode=Require;Trust Server Certificate=true
```

### 2. JwtSettings__SecretKey
```
PCM_SecretKey_2025_MinimumLength32Characters_ForProduction
```

### 3. JwtSettings__Issuer
```
PCM.API
```

### 4. JwtSettings__Audience
```
PCM.Client
```

### 5. JwtSettings__ExpirationMinutes
```
60
```

### 6. JwtSettings__RefreshTokenExpirationDays
```
7
```

### 7. ReCaptcha__SecretKey
```
6Lc2mgEsAAAAABvNtpyQFMzwSfgCsGXgFFD8SR4Y
```

### 8. ReCaptcha__VerifyUrl
```
https://www.google.com/recaptcha/api/siteverify
```

### 9. ReCaptcha__MinScore
```
0.5
```

### 10. Cors__Origins__0
```
https://pcm-eight.vercel.app
```

### 11. Cors__Origins__1 (opcional, para desarrollo)
```
http://localhost:5173
```

## Obtener la cadena de conexión de Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Ve a Settings → Database
3. En "Connection String" selecciona el modo "URI"
4. Copia la cadena y reemplaza `[YOUR-PASSWORD]` con tu contraseña real
5. Convierte el formato URI a formato de parámetros:
   - De: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`
   - A: `Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=[YOUR-PASSWORD];SSL Mode=Require;Trust Server Certificate=true`

## Verificar la configuración

Después de agregar todas las variables:

1. **Trigger Manual Deploy** en Render
2. **Verifica los logs** para asegurarte de que no haya errores de conexión
3. **Prueba el endpoint de salud**: 
   ```
   curl https://pcm-5qst.onrender.com/health
   ```
   Debería responder:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-11-05T...",
     "database": "connected"
   }
   ```

4. **Prueba el endpoint de login**:
   ```bash
   curl -X POST https://pcm-5qst.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@pcm.gob.pe",
       "password": "Admin123!",
       "recaptchaToken": null
     }'
   ```

## Notas importantes

### CORS
Asegúrate de que el origen de Vercel esté en la configuración CORS:
- `https://pcm-eight.vercel.app` debe estar en `Cors__Origins__0`

### SSL/TLS
Render proporciona HTTPS automáticamente, no necesitas configuración adicional.

### Puerto
Render establece automáticamente la variable `PORT`. El código ya está configurado para usarla:
```csharp
var port = Environment.GetEnvironmentVariable("PORT") ?? "5164";
```

### Logs
Para ver los logs en tiempo real:
- Ve a tu servicio en Render
- Haz clic en "Logs" en el menú superior
- Verás todos los logs de la aplicación

## Solución de problemas

### Error: "Format of the initialization string does not conform to specification"
- **Causa:** La cadena de conexión está vacía o mal formateada
- **Solución:** Verifica que `ConnectionStrings__DefaultConnection` esté configurada correctamente con doble guion bajo `__`

### Error: "No connection could be made"
- **Causa:** La cadena de conexión apunta a una base de datos inaccesible
- **Solución:** Verifica que la IP de Render esté permitida en Supabase (normalmente está permitido por defecto)

### Error: "password authentication failed"
- **Causa:** Usuario o contraseña incorrectos
- **Solución:** Verifica las credenciales en Supabase → Settings → Database

### CORS Error desde frontend
- **Causa:** El origen de Vercel no está en la lista CORS
- **Solución:** Agrega `https://pcm-eight.vercel.app` a `Cors__Origins__0`
