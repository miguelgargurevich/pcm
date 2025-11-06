# Configuración de Variables de Entorno en Vercel

## Variables requeridas para producción

Debes configurar estas variables en el panel de Vercel:

### 1. Accede a tu proyecto en Vercel
- Ve a https://vercel.com/dashboard
- Selecciona tu proyecto `pcm-eight`
- Ve a `Settings` > `Environment Variables`

### 2. Agrega las siguientes variables:

#### VITE_API_URL
**Valor:** URL de tu API backend en producción
```
Ejemplo: https://tu-api-backend.onrender.com/api
```
**Entornos:** Production, Preview (opcional)

#### VITE_RECAPTCHA_SITE_KEY
**Valor:** Tu Site Key de Google reCAPTCHA v3
```
6Lc2mgEsAAAAAMAsjyD9M0MsqCJxpYHS0-prSm9J
```
**Entornos:** Production, Preview

### 3. Re-deploya tu aplicación

Después de agregar las variables:
1. Ve a `Deployments`
2. Busca el deployment más reciente
3. Haz clic en los tres puntos `...`
4. Selecciona `Redeploy`
5. Marca `Use existing Build Cache` (opcional)
6. Haz clic en `Redeploy`

## Verificación

Una vez que hayas re-desplegado:
1. Abre la consola del navegador en tu sitio de producción
2. Deberías ver el mensaje: "✅ Token de reCAPTCHA obtenido"
3. El login debería funcionar correctamente

## Problemas comunes

### El backend no responde
- Verifica que `VITE_API_URL` apunte a tu API en producción
- Asegúrate de que la API esté corriendo y accesible públicamente
- Verifica los CORS en el backend

### reCAPTCHA no funciona
- Verifica que el dominio de Vercel esté registrado en Google reCAPTCHA Console
- Dominios actuales registrados:
  - `localhost`
  - `pcm-eight.vercel.app`
- Si usas un dominio custom, agrégalo en Google reCAPTCHA Console

### Error 401 Unauthorized
- Verifica que el backend esté aceptando el token de reCAPTCHA
- En desarrollo local, puedes enviar `null` como token
- En producción, el token es obligatorio

## Backend Configuration

Tu backend también necesita estar configurado para:
1. Aceptar requests desde el dominio de Vercel (CORS)
2. Validar el token de reCAPTCHA con el Secret Key
3. Estar desplegado y accesible públicamente

### Variables de entorno del backend:
```bash
RecaptchaSettings__SecretKey=tu_secret_key_aqui
RecaptchaSettings__SiteKey=6Lc2mgEsAAAAAMAsjyD9M0MsqCJxpYHS0-prSm9J
AllowedOrigins__0=https://pcm-eight.vercel.app
```
