# Instrucciones para verificar el deployment en Render

## 1. Ver los Logs en Render

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio: `pcm-5qst`
3. Haz clic en **Logs** (menú superior)
4. Busca errores relacionados con la base de datos

## 2. Verificar Variables de Entorno

En **Environment** → **Environment Variables**, asegúrate de tener:

### ConnectionStrings__DefaultConnection
```
Host=aws-1-us-east-1.pooler.supabase.com;Port=5432;Database=postgres;User Id=postgres.amzwfwfhllwhjffkqxhn;Password=Zl@tan2016;SSL Mode=Require;Trust Server Certificate=true
```

**IMPORTANTE:** Si no está configurada o apunta a otra base de datos, el backend podría estar usando una base de datos vieja sin la columna `activo`.

## 3. Forzar Redeploy

Si cambiaste las variables de entorno:

1. Haz clic en **Manual Deploy**
2. Selecciona **Clear build cache & deploy**
3. Espera 2-3 minutos

## 4. Verificar Health Check

Una vez desplegado, verifica:

```bash
curl https://pcm-5qst.onrender.com/health
```

Debe responder:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "...",
  "environment": "Production"
}
```

Si dice "disconnected", el problema es la cadena de conexión.

## 5. Probar el endpoint de MarcoNormativo

```bash
curl -X GET "https://pcm-5qst.onrender.com/api/MarcoNormativo" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

Si funciona, verás la lista de normas.

## 6. Posibles problemas

### Problema: Database = "disconnected"
**Causa:** Cadena de conexión incorrecta
**Solución:** Verifica `ConnectionStrings__DefaultConnection` en Environment Variables

### Problema: Error "column m.activo does not exist"
**Causa:** Está conectado a una base de datos diferente (no Supabase)
**Solución:** Verifica que la cadena de conexión apunte a `aws-1-us-east-1.pooler.supabase.com`

### Problema: Render no se actualiza después del push
**Causa:** Auto-deploy no está configurado
**Solución:** Activa "Auto-Deploy" en Settings → Build & Deploy
