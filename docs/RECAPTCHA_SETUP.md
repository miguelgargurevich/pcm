# Configuración de Google reCAPTCHA v3

## 📋 Pasos para obtener las credenciales de reCAPTCHA v3

### 1. Acceder a Google reCAPTCHA Admin Console
Ve a: https://www.google.com/recaptcha/admin/create

### 2. Crear un nuevo sitio
- **Etiqueta**: Plataforma de Cumplimiento Digital - PCM
- **Tipo de reCAPTCHA**: Selecciona **reCAPTCHA v3**
- **Dominios**: 
  - Para desarrollo: `localhost`
  - Para producción: `tu-dominio.gob.pe`
- Acepta los términos de servicio
- Haz clic en **Enviar**

### 3. Obtener las claves
Después de crear el sitio, obtendrás dos claves:

1. **SITE KEY (Clave del sitio)** - Pública, va en el frontend
2. **SECRET KEY (Clave secreta)** - Privada, va en el backend

### 4. Configurar en el Frontend
Edita el archivo `.env` en la carpeta `/frontend`:

```env
VITE_RECAPTCHA_SITE_KEY=tu_site_key_aqui
VITE_API_URL=http://localhost:5164/api
```

#### Claves de prueba de Google (para desarrollo local)
Google proporciona claves de prueba que siempre pasan la validación:

**Site Key (pública)**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`  
**Secret Key (privada)**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

⚠️ **Importante**: Estas claves **SOLO** deben usarse en desarrollo. En producción, crea tus propias claves.

### 5. Configurar en el Backend (opcional)
Si quieres verificar el token en el backend, edita `appsettings.json` en `/backend/PCM.API`:

```json
{
  "ReCaptcha": {
    "SecretKey": "tu_secret_key_aqui",
    "VerifyUrl": "https://www.google.com/recaptcha/api/siteverify",
    "MinScore": 0.5
  }
}
```

## 🔧 Implementación actual

### Frontend
✅ **Instalado**: `react-google-recaptcha-v3`
✅ **Configurado**: Provider en `App.jsx`
✅ **Integrado**: Hook en `Login.jsx`

### Cómo funciona:
1. reCAPTCHA v3 trabaja en **segundo plano** (sin checkbox visible)
2. Al hacer submit del login, se ejecuta `executeRecaptcha('login')`
3. Retorna un **token** que puedes enviar al backend
4. El backend verifica el token con Google y obtiene un **score (0.0 a 1.0)**
5. Si score >= 0.5 → Usuario probablemente humano ✅
6. Si score < 0.5 → Usuario probablemente bot ❌

## 🚀 Verificación en el Backend (opcional)

### Endpoint de verificación de Google:
```
POST https://www.google.com/recaptcha/api/siteverify
Content-Type: application/x-www-form-urlencoded

secret=tu_secret_key&response=token_del_frontend
```

### Respuesta esperada:
```json
{
  "success": true,
  "challenge_ts": "2025-11-03T23:46:00Z",
  "hostname": "localhost",
  "score": 0.9,
  "action": "login"
}
```

## 📝 Notas importantes

1. **Sin Site Key**: La app funcionará pero reCAPTCHA no estará activo
2. **Score recomendado**: 0.5 o superior para considerar como humano
3. **Testing**: En desarrollo, Google puede dar scores bajos, es normal
4. **Producción**: Actualiza el dominio en reCAPTCHA Admin Console

## 🔗 Documentación oficial
- https://developers.google.com/recaptcha/docs/v3
- https://www.npmjs.com/package/react-google-recaptcha-v3
