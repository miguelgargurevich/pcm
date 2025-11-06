# 🔧 FIX RÁPIDO: Login en Producción

## Problema
El login falla con "Credenciales inválidas" en producción (Supabase).

## Causa
El hash de la contraseña en Supabase no coincide con el código actual.

## Solución en 3 pasos

### 1️⃣ Abre Supabase SQL Editor
- Ve a: https://supabase.com/dashboard
- Selecciona tu proyecto: **PCM**
- Click en **SQL Editor** (menú lateral izquierdo)

### 2️⃣ Ejecuta el Script de Migración
- Copia TODO el contenido del archivo: `db/migration_supabase_complete.sql`
- Pégalo en el SQL Editor
- Click en **Run** (botón verde superior derecho)

### 3️⃣ Verifica el Resultado
Deberías ver al final:
```
✓ Migración completada exitosamente
✓ Usuario admin actualizado con nuevo hash
✓ Columnas agregadas a perfiles y usuarios
```

## Prueba el Login
- URL: https://pcm-frontend.vercel.app/login
- Email: `admin@pcm.gob.pe`
- Password: `Admin123!`

## ¿Qué hace el script?
1. ✅ Agrega columnas faltantes en tabla `perfiles` (activo, created_at)
2. ✅ Agrega columna `last_login` en tabla `usuarios`
3. ✅ **ACTUALIZA el hash de contraseña del admin** ← Esto es lo crítico
4. ✅ Crea índices para mejorar rendimiento
5. ✅ Verifica que todo esté correcto

## Hash de Contraseña Actual
```
Password: Admin123!
Hash: $2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq
```

Este hash es el que está generando el código actual y el que debe estar en Supabase.

---

**Tiempo estimado**: 2 minutos ⏱️
